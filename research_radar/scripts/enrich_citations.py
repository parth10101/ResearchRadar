"""
Semantic Scholar Citation Enrichment  (v2 — 429-proof)
=======================================================
Fetches reference lists for every paper in papers.json via the
Semantic Scholar Academic Graph API and writes them back in-place.

Key design decisions vs. the previous version:
  · API key passed as --api-key CLI arg (or S2_API_KEY env var) — never hardcoded
  · Pre-flight validation: tests the key with one known paper before starting
  · With valid API key  → 0.5 s gap (safe for 10 req/s limit)
  · Without API key     → 3.5 s gap (safe for 1 req/s limit)
  · On ANY 429          → wait max(Retry-After header, 180 s) — no questions asked
  · Maximum 2 retries per paper; if both fail, skip and continue (never stalls)
  · Saves progress after EVERY single paper (nothing lost on Ctrl-C)
  · --limit N           → enrich only N papers (safe for smoke-testing the key)
  · --dry-run           → print what would be fetched, write nothing

Usage:
    python research_radar/scripts/enrich_citations.py --api-key YOUR_KEY
    python research_radar/scripts/enrich_citations.py --api-key YOUR_KEY --limit 20
    python research_radar/scripts/enrich_citations.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    raise ImportError("Install requests first:  pip install requests")


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

S2_API_BASE = "https://api.semanticscholar.org/graph/v1"

# A well-known arXiv paper (Attention Is All You Need) — used for key validation
_VALIDATION_PAPER = "ARXIV:1706.03762"

DEFAULT_CORPUS = Path("research_radar/data/output/papers.json")


# ---------------------------------------------------------------------------
# ID normalisation (same logic as stage1_ingest.py)
# ---------------------------------------------------------------------------

def _normalize_arxiv_id(raw: str | None) -> str | None:
    if not raw:
        return None
    cleaned = re.sub(r"^(arxiv:\s*|arXiv:\s*|ARXIV:\s*)", "", raw.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"v\d+$", "", cleaned)
    return cleaned.strip() or None


def _s2_paper_id(paper_id: str, source: str) -> str:
    """Convert a corpus paper ID to the S2 identifier format."""
    if source == "arxiv" or re.match(r"^\d{4}\.\d{4,5}", paper_id):
        norm = _normalize_arxiv_id(paper_id)
        return f"ARXIV:{norm}"
    return paper_id


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def _headers(api_key: str | None) -> dict[str, str]:
    h = {"User-Agent": "ResearchRadar/2.0 (academic research tool; 429-safe)"}
    if api_key:
        h["x-api-key"] = api_key
    return h


def _validate_api_key(api_key: str | None) -> bool:
    """
    Send one test request.
    Returns True if the key is accepted (2xx), False otherwise.
    Raises on network error.
    """
    if not api_key:
        return False

    url = f"{S2_API_BASE}/paper/{_VALIDATION_PAPER}"
    params = {"fields": "paperId,title"}
    try:
        r = requests.get(url, params=params, headers=_headers(api_key), timeout=20)
        if r.status_code == 200:
            data = r.json()
            title = data.get("title", "")[:50]
            print(f"  [API Key OK]  Test paper: '{title}'")
            return True
        if r.status_code == 401:
            print(f"  [API Key INVALID]  HTTP 401 — key rejected by S2.")
            return False
        if r.status_code == 403:
            print(f"  [API Key FORBIDDEN]  HTTP 403 — key may be expired or wrong tier.")
            return False
        # Any other 2xx/3xx: treat as working
        return r.status_code < 400
    except requests.RequestException as e:
        print(f"  [Network error during key validation]  {e}")
        raise


# ---------------------------------------------------------------------------
# Core fetcher
# ---------------------------------------------------------------------------

def fetch_references(
    paper_id: str,
    source: str,
    api_key: str | None,
    gap_seconds: float,
    last_request_time: list[float],   # single-element list used as mutable ref
) -> list[str]:
    """
    Fetch reference IDs for one paper from S2AG /paper/{id}/references.

    Rate-limiting:
      · Sleeps exactly (gap_seconds - elapsed) before each request.
      · On 429: reads Retry-After header, waits max(header, 180 s).
      · Max 2 retries total — if both fail, returns [] and moves on.

    Returns a list of arXiv IDs ("arXiv:XXXX.XXXXX") or S2 paper IDs.
    """
    s2_id  = _s2_paper_id(paper_id, source)
    url    = f"{S2_API_BASE}/paper/{s2_id}/references"
    params = {"fields": "citedPaper.paperId,citedPaper.externalIds,citedPaper.title", "limit": 100}

    for attempt in range(1, 3):   # max 2 attempts
        # --- Enforce minimum gap between requests ---
        elapsed = time.time() - last_request_time[0]
        wait    = gap_seconds - elapsed
        if wait > 0:
            time.sleep(wait)
        last_request_time[0] = time.time()

        try:
            resp = requests.get(url, params=params, headers=_headers(api_key), timeout=30)
        except requests.RequestException as e:
            print(f"    [Network error] {e}  (attempt {attempt}/2)")
            if attempt == 2:
                return []
            time.sleep(10)
            continue

        # ---- 429: rate limited ----
        if resp.status_code == 429:
            retry_after = float(resp.headers.get("Retry-After", 180))
            wait_429    = max(retry_after, 180.0)   # ALWAYS at least 3 minutes
            print(
                f"    [429 Rate Limited]  Waiting {wait_429:.0f}s before retry "
                f"(attempt {attempt}/2) …"
            )
            time.sleep(wait_429)
            last_request_time[0] = time.time()
            continue   # retry same attempt number

        # ---- 404: paper not indexed in S2 ----
        if resp.status_code == 404:
            return []

        # ---- Other non-OK ----
        if not resp.ok:
            print(f"    [HTTP {resp.status_code}]  {resp.text[:120]}  (attempt {attempt}/2)")
            if attempt == 2:
                return []
            time.sleep(5)
            continue

        # ---- Parse response ----
        ref_ids: list[str] = []
        for item in resp.json().get("data", []):
            cited   = item.get("citedPaper") or {}
            ext     = cited.get("externalIds") or {}
            arxiv_e = ext.get("ArXiv")
            if arxiv_e:
                ref_ids.append(f"arXiv:{_normalize_arxiv_id(arxiv_e)}")
            elif cited.get("paperId"):
                ref_ids.append(cited["paperId"])
        return ref_ids

    return []   # exhausted retries


# ---------------------------------------------------------------------------
# Main enrichment loop
# ---------------------------------------------------------------------------

def enrich(
    corpus_path: Path,
    api_key: str | None,
    key_valid: bool,
    limit: int | None,
    dry_run: bool,
) -> None:
    papers = json.loads(corpus_path.read_text(encoding="utf-8"))
    total  = len(papers)

    unenriched = [p for p in papers if not (p.get("references") or [])]
    if limit:
        unenriched = unenriched[:limit]

    skipped = total - len([p for p in papers if not (p.get("references") or [])])

    # Gap between requests
    if key_valid:
        gap = 0.5    # 10 req/s limit → 0.5 s = very safe margin
    else:
        gap = 3.5    # 1 req/s limit → 3.5 s = safe margin

    est_minutes = (len(unenriched) * gap) / 60

    print(f"\n  Corpus          : {corpus_path}")
    print(f"  Total papers    : {total}")
    print(f"  Already enriched: {skipped}")
    print(f"  To enrich       : {len(unenriched)}"
          + (f"  (limited to {limit})" if limit else ""))
    print(f"  API key         : {'✓ Valid (0.5 s gap)' if key_valid else '✗ None/Invalid (3.5 s gap)'}")
    print(f"  Est. time       : ~{est_minutes:.1f} min")
    if dry_run:
        print(f"\n  [DRY RUN]  No requests will be made, nothing written.")
        for i, p in enumerate(unenriched[:10], 1):
            print(f"    {i}. {p.get('id')}  ({p.get('source','arxiv')})")
        if len(unenriched) > 10:
            print(f"    … and {len(unenriched)-10} more")
        return

    print(f"{'=' * 70}\n")

    last_t: list[float] = [0.0]   # mutable reference for rate limiter
    start  = time.time()
    done   = 0

    for paper in unenriched:
        pid    = paper.get("id", "")
        source = paper.get("source", "arxiv")

        print(f"[{done + 1}/{len(unenriched)}]  {pid}", end="  ", flush=True)
        refs = fetch_references(pid, source, api_key if key_valid else None, gap, last_t)
        paper["references"] = refs
        done += 1
        print(f"→ {len(refs)} refs")

        # Save after EVERY paper — progress is never lost
        corpus_path.write_text(json.dumps(papers, indent=2, ensure_ascii=False), encoding="utf-8")

        if done % 25 == 0:
            elapsed = time.time() - start
            remaining = (len(unenriched) - done) * gap
            print(f"\n  Progress: {done}/{len(unenriched)} enriched  "
                  f"({elapsed:.0f}s elapsed, ~{remaining/60:.1f} min remaining)\n")

    elapsed = time.time() - start
    print(f"\n{'=' * 70}")
    print(f"  Enrichment complete!")
    print(f"  Enriched   : {done} papers")
    print(f"  Skipped    : {skipped} (already had references)")
    print(f"  Total time : {elapsed:.1f}s")
    print(f"  Saved to   : {corpus_path}")
    print(f"{'=' * 70}\n")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="python research_radar/scripts/enrich_citations.py",
        description="Enrich papers.json with Semantic Scholar citation reference lists.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    p.add_argument(
        "--api-key",
        type=str,
        default=None,
        help="Semantic Scholar API key (overrides S2_API_KEY env var). "
             "Get one free at https://www.semanticscholar.org/product/api",
    )
    p.add_argument(
        "--corpus",
        type=Path,
        default=DEFAULT_CORPUS,
        help="Path to papers.json to enrich in-place.",
    )
    p.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Only enrich this many papers (useful for testing the API key).",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be fetched without making any network calls.",
    )
    p.add_argument(
        "--skip-validation",
        action="store_true",
        help="Skip the API key pre-flight check (saves 1 request).",
    )
    return p


def main(argv: list[str] | None = None) -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    args = _build_parser().parse_args(argv)

    # Resolve API key: CLI arg > env var > None
    api_key: str | None = args.api_key or os.getenv("S2_API_KEY") or None

    print(f"\n{'=' * 70}")
    print(f"  Semantic Scholar Citation Enrichment  (v2 — 429-proof)")
    print(f"{'=' * 70}")

    if not args.corpus.exists():
        print(f"[ERROR] Corpus not found: {args.corpus}", file=sys.stderr)
        sys.exit(1)

    # Pre-flight API key validation
    key_valid = False
    if args.dry_run:
        key_valid = bool(api_key)   # no actual call in dry-run
    elif api_key and not args.skip_validation:
        print(f"  Validating API key …")
        try:
            key_valid = _validate_api_key(api_key)
        except requests.RequestException:
            print("  [WARNING] Could not validate key (network error). Proceeding with 3.5 s gap.")
            key_valid = False
    elif api_key:
        key_valid = True   # --skip-validation: trust the user
        print(f"  API key provided (validation skipped).")
    else:
        print(f"  No API key provided — using unauthenticated mode (3.5 s gap).")
        print(f"  Tip: --api-key YOUR_KEY speeds this up 7×.")

    enrich(
        corpus_path = args.corpus,
        api_key     = api_key,
        key_valid   = key_valid,
        limit       = args.limit,
        dry_run     = args.dry_run,
    )


if __name__ == "__main__":
    main()
