"""
Atomic, adaptive rate controller for Semantic Scholar (single API key).
Guarantees no two requests fire less than `delay` seconds apart, even across
threads/processes, using OS-level file locking (not a plain read/write race).
"""

from __future__ import annotations
import json
import os
import time
from pathlib import Path
from filelock import FileLock

ROOT_DIR = Path(__file__).resolve().parent.parent
STATE_PATH = ROOT_DIR / "data" / "cache" / ".s2_rate_state.json"
LOCK_PATH = ROOT_DIR / "data" / "cache" / ".s2_rate.lock"

BASE_DELAY = 1.25       # calibrated gap between S2 requests (safely within S2 key rate)
MIN_DELAY = 1.20         # safe floor
MAX_DELAY = 3.50         # hard ceiling
DECAY = 0.95            # multiplicative decrease on success
GROWTH = 1.25           # mild increase on transient 429

CIRCUIT_WINDOW = 30.0   # seconds
CIRCUIT_THRESHOLD = 2   # 429s before tripping circuit
CIRCUIT_COOLDOWN = 180.0  # seconds to pause if triggered (3 minutes)


class RateState:
    def __init__(self):
        STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
        self.lock = FileLock(str(LOCK_PATH), timeout=10)
        try:
            with self.lock:
                existing = self._load()
                now = time.time()
                last_seen = existing.get("last", 0.0)
                delay = existing.get("delay", BASE_DELAY)
                circuit_until = existing.get("circuit_until", 0.0)
                # Reset if: malformed types, or state is stale (> 60s since last request) AND circuit is not active
                is_stale = (
                    not isinstance(last_seen, (int, float)) or
                    not isinstance(delay, (int, float)) or
                    ((now - last_seen) > 60.0 and now >= circuit_until)
                )
                if is_stale:
                    self._save_atomic({"delay": BASE_DELAY, "last": 0.0, "fail_times": [], "circuit_until": 0.0})
        except Exception:
            pass

    def _load(self) -> dict:
        if STATE_PATH.exists():
            try:
                return json.loads(STATE_PATH.read_text(encoding="utf-8"))
            except Exception:
                pass
        return {"delay": BASE_DELAY, "last": 0.0, "fail_times": [], "circuit_until": 0.0}

    def _save_atomic(self, state: dict) -> None:
        tmp = STATE_PATH.with_suffix(".tmp")
        tmp.write_text(json.dumps(state), encoding="utf-8")
        os.replace(tmp, STATE_PATH)  # atomic on POSIX and Windows

    def is_circuit_open(self) -> bool:
        """Returns True if the circuit breaker is active (S2 is throttled/rate-limited)."""
        try:
            with self.lock:
                state = self._load()
                return time.time() < state.get("circuit_until", 0.0)
        except Exception:
            return False

    def trip_circuit(self, cooldown: float = CIRCUIT_COOLDOWN) -> None:
        """Immediately trip the circuit breaker to stop hitting throttled S2."""
        with self.lock:
            state = self._load()
            now = time.time()
            state["circuit_until"] = now + cooldown
            state["delay"] = MAX_DELAY
            state["fail_times"] = []
            self._save_atomic(state)
            print(f"  [Circuit Breaker] Trip activated — routing all requests away from S2 for {cooldown:.0f}s")

    def reset_circuit(self) -> None:
        """Reset the circuit breaker manually."""
        with self.lock:
            state = self._load()
            state["circuit_until"] = 0.0
            state["fail_times"] = []
            state["delay"] = BASE_DELAY
            self._save_atomic(state)

    def acquire(self) -> float:
        """Blocks until safe to fire, reserving time slot atomically across processes/threads."""
        with self.lock:
            state = self._load()
            now = time.time()
            circuit_until = state.get("circuit_until", 0.0)
            delay = state.get("delay", BASE_DELAY)
            last_time = state.get("last", 0.0)

            # Earliest safe slot is either after circuit cooldown or after last request + delay
            earliest_safe_time = max(last_time + delay, circuit_until)
            scheduled_time = max(now, earliest_safe_time)

            state["last"] = scheduled_time
            self._save_atomic(state)

            sleep_duration = scheduled_time - now

        if sleep_duration > 0:
            time.sleep(sleep_duration)

        return delay

    def report_success(self) -> None:
        with self.lock:
            state = self._load()
            state["delay"] = max(MIN_DELAY, state.get("delay", BASE_DELAY) * DECAY)
            # Ensure next request is spaced from the COMPLETION of this request
            state["last"] = max(state.get("last", 0.0), time.time())
            self._save_atomic(state)

    def report_429(self) -> None:
        with self.lock:
            state = self._load()
            state["delay"] = min(MAX_DELAY, state.get("delay", BASE_DELAY) * GROWTH)
            state["last"] = max(state.get("last", 0.0), time.time())
            now = time.time()
            fails = [t for t in state.get("fail_times", []) if now - t < CIRCUIT_WINDOW]
            fails.append(now)
            state["fail_times"] = fails
            if len(fails) >= CIRCUIT_THRESHOLD:
                state["circuit_until"] = now + CIRCUIT_COOLDOWN
                state["fail_times"] = []
                print(f"  [Circuit Breaker] {CIRCUIT_THRESHOLD}+ 429s in {CIRCUIT_WINDOW:.0f}s — "
                      f"freezing all S2 requests for {CIRCUIT_COOLDOWN:.0f}s")
            self._save_atomic(state)
