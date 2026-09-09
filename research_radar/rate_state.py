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

STATE_PATH = Path.cwd() / "data" / "cache" / ".s2_rate_state.json"
LOCK_PATH = Path.cwd() / "data" / "cache" / ".s2_rate.lock"

BASE_DELAY = 2.0       # calibrated gap between S2 bulk requests
MIN_DELAY = 2.0        # safe floor for S2 /paper/search/bulk (prevents 429 cascades)
MAX_DELAY = 4.0        # hard ceiling
DECAY = 0.95           # multiplicative decrease on success
GROWTH = 1.2           # mild increase on transient 429

CIRCUIT_WINDOW = 20.0   # seconds
CIRCUIT_THRESHOLD = 10  # 429s before brief pause
CIRCUIT_COOLDOWN = 3.0  # seconds to pause if triggered


class RateState:
    def __init__(self):
        STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
        self.lock = FileLock(str(LOCK_PATH), timeout=10)
        # C2-fix: Only reset state when it is stale (>60s since last request) or structurally
        # malformed. Previously this block reset last=0.0 unconditionally on every pipeline run,
        # wiping the inter-request timestamp from the prior run. The next run's first request
        # then fired immediately with 0s gap — a guaranteed 429 on back-to-back runs without cache.
        try:
            with self.lock:
                existing = self._load()
                now = time.time()
                last_seen = existing.get("last", 0.0)
                delay = existing.get("delay", BASE_DELAY)
                # Reset if: malformed types, or state is stale (> 60s since last request)
                is_stale = (
                    not isinstance(last_seen, (int, float)) or
                    not isinstance(delay, (int, float)) or
                    (now - last_seen) > 60.0
                )
                if is_stale:
                    self._save_atomic({"delay": BASE_DELAY, "last": 0.0, "fail_times": [], "circuit_until": 0.0})
                # else: preserve fresh state — back-to-back run pacing continuity maintained
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

    def acquire(self) -> float:
        """Blocks until safe to fire, reserving time slot atomically across processes/threads."""
        with self.lock:
            state = self._load()
            now = time.time()
            circuit_until = state.get("circuit_until", 0.0)

            # 1. Check circuit breaker freeze
            wait_circuit = max(0.0, circuit_until - now)

            # 2. Compute pacing delay from last reserved time
            last_time = max(state.get("last", 0.0), now)
            scheduled_time = max(now + wait_circuit, last_time + state.get("delay", BASE_DELAY))

            # 3. Reserve slot atomically before releasing lock
            state["last"] = scheduled_time
            self._save_atomic(state)

            sleep_duration = scheduled_time - now

        if sleep_duration > 0:
            time.sleep(sleep_duration)

        return state.get("delay", BASE_DELAY)

    def report_success(self) -> None:
        with self.lock:
            state = self._load()
            state["delay"] = max(MIN_DELAY, state.get("delay", BASE_DELAY) * DECAY)
            self._save_atomic(state)

    def report_429(self) -> None:
        with self.lock:
            state = self._load()
            state["delay"] = min(MAX_DELAY, state.get("delay", BASE_DELAY) * GROWTH)
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
