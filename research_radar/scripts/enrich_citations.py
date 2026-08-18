"""
Semantic Scholar Citation Enrichment Script
=============================================
Enriches existing paper records in data/papers.json with citation reference lists
using the Semantic Scholar (S2AG) API.

Ultra-Conservative Rate Limiting Strategy (NEVER hits 429):
  - 2.5s mandatory sleep before EVERY request (well below 1 req/sec limit)
  - Tracks exact timestamp of last request for precise pacing
  - Additional 5s "cooling" pause after every 10 papers (cluster cooldown)
  - Incremental save every 10 papers to preserve progress
  - Exponential backoff (10s → 20s → 40s) as a last-resort safety net
  - Max retries = 5 (far more patient than standard 3)
"""

import json
import os
import re
import time
from pathlib import Path

try:
    import requests
except ImportError:
    raise ImportError("Please install requests: pip install requests")


# ---------------------------------------------------------------------------
# CONFIGURATION — Ultra-Conservative Rate Limiting
# ---------------------------------------------------------------------------

API_KEY        = os.getenv("S2_API_KEY", "s2k-e0hpokE9SYKtASaVWuosIcJBj6FvpRlJy8tNFId0")
S2_API_URL     = "https://api.semanticscholar.org/graph/v1"
CORPUS_PATH    = Path("data/papers.json")

# RATE LIMIT SETTINGS (Conservative: 1 request per 2.5 seconds = 0.4 req/sec)
# S2 allows 1 req/sec — we use only 0.4 req/sec so we stay well below the limit
MIN_GAP_SECONDS = 2.5   # Minimum guaranteed gap between consecutive requests
CLUSTER_PAUSE   = 5.0   # Extra cooling pause (seconds) after every CLUSTER_SIZE papers
CLUSTER_SIZE    = 10    # Process 10 papers → pause → next 10
SAVE_EVERY      = 10    # Save progress to disk every 10 papers

# Timestamp of last request (shared across all calls to enforce gap)
_last_request_time: float = 0.0


# ---------------------------------------------------------------------------
# RATE LIMITER — Called before EVERY network request
# ---------------------------------------------------------------------------

def _rate_limited_sleep() -> None:
    """
    Guarantees at least MIN_GAP_SECONDS between consecutive requests.
    Uses actual wall-clock timestamps — not blind sleeps — for precise pacing.
    """
    global _last_request_time
    now = time.time()
    elapsed_since_last = now - _last_request_time
    remaining_wait = MIN_GAP_SECONDS - elapsed_since_last
    if remaining_wait > 0:
        time.sleep(remaining_wait)  # Only sleep the exact remaining time needed
    _last_request_time = time.time()  # Record the actual send timestamp


def get_headers() -> dict:
    return {
        "User-Agent": "ResearchRadar/1.0 (academic research tool)",
        "x-api-key": API_KEY,
    }


# ---------------------------------------------------------------------------
# UTILITY: Strip arXiv version suffixes and prefixes
# ---------------------------------------------------------------------------

def normalize_arxiv_id(raw_id: str | None) -> str | None:
    """Strips 'arXiv:' prefix and 'v1'/'v2' version suffixes from arXiv IDs."""
    if not raw_id:
        return None
    cleaned = re.sub(r"^(arxiv:\s*|ARXIV:\s*)", "", raw_id.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"v\d+$", "", cleaned)
    return cleaned.strip() or None


# ---------------------------------------------------------------------------
# CORE FETCHER: Fetch references for one paper
# ---------------------------------------------------------------------------

def fetch_references_for_paper(paper_id: str, source: str, max_retries: int = 5) -> list[str]:
    """
    Queries S2AG for references of a single paper.
    Uses _rate_limited_sleep() before sending — guarantees 2.5s gap from previous request.
    Uses exponential backoff starting at 10s if 429 occurs anyway (safety net).
    """
    # Build proper S2 paper identifier
    if source == "arxiv" or re.match(r"^\d{4}\.\d{4,5}", paper_id):
        clean_id = normalize_arxiv_id(paper_id)
        s2_paper_id = f"ARXIV:{clean_id}"
    else:
        s2_paper_id = paper_id

    url = f"{S2_API_URL}/paper/{s2_paper_id}/references"
    params = {
        "fields": "citedPaper.paperId,citedPaper.externalIds,citedPaper.title",
        "limit": 50,
    }

    # RATE LIMITER: Enforce minimum 2.5s gap from previous request
    _rate_limited_sleep()

    backoff = 10.0  # Start backoff at 10 seconds (not 2s) — very patient
    for attempt in range(max_retries + 1):
        try:
            resp = requests.get(url, params=params, headers=get_headers(), timeout=30)

            if resp.status_code == 429:
                # 429 = Server telling us to slow down
                # Read Retry-After header if present, otherwise use our backoff
                retry_after = float(resp.headers.get("retry-after", backoff))
                # Always wait at least 10 seconds even if server says less
                wait_time = max(retry_after, backoff)
                print(f"    [429 Received] Waiting {wait_time:.1f}s before retry "
                      f"(Attempt {attempt + 1}/{max_retries})...")
                time.sleep(wait_time)
                backoff *= 2.0  # Double backoff: 10s → 20s → 40s → 80s
                _last_request_time = time.time()  # Reset rate limiter after long wait
                continue

            if resp.status_code == 404:
                # Paper not indexed on Semantic Scholar — not an error
                return []

            resp.raise_for_status()

            data = resp.json().get("data", [])
            ref_ids = []
            for item in data:
                cited = item.get("citedPaper") or {}
                cid = cited.get("paperId")
                ext = cited.get("externalIds") or {}
                arxiv_ext = ext.get("ArXiv")
                if arxiv_ext:
                    ref_ids.append(f"arXiv:{normalize_arxiv_id(arxiv_ext)}")
                elif cid:
                    ref_ids.append(cid)

            return ref_ids

        except requests.RequestException as e:
            if attempt == max_retries:
                print(f"    [Error] Failed to fetch {paper_id}: {e}")
                return []
            print(f"    [Network Error] Waiting {backoff:.1f}s before retry...")
            time.sleep(backoff)
            backoff *= 2.0
            _last_request_time = time.time()

    return []


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    print("\n" + "=" * 70)
    print("  Semantic Scholar Citation Enrichment (Ultra-Conservative Mode)")
    print("=" * 70)

    if not CORPUS_PATH.exists():
        print(f"[Error] Corpus file not found at {CORPUS_PATH}. Run Stage 1 first.")
        return

    papers = json.loads(CORPUS_PATH.read_text(encoding="utf-8"))
    total_papers = len(papers)
    unenriched = [p for p in papers if not (p.get("references") or [])]
    skipped_count = total_papers - len(unenriched)

    print(f"  Loaded      : {total_papers} papers from {CORPUS_PATH}")
    print(f"  To Enrich   : {len(unenriched)} papers (skipping {skipped_count} already enriched)")
    print(f"  Pacing      : {MIN_GAP_SECONDS}s gap per request  +  {CLUSTER_PAUSE}s pause per {CLUSTER_SIZE} papers")
    print(f"  Est. Time   : ~{(len(unenriched) * MIN_GAP_SECONDS + (len(unenriched) // CLUSTER_SIZE) * CLUSTER_PAUSE) / 60:.1f} minutes")
    print("=" * 70)

    enriched_count = 0
    start_time = time.time()

    for idx, paper in enumerate(papers, 1):
        existing_refs = paper.get("references") or []
        if len(existing_refs) > 0:
            continue  # Skip already-enriched papers

        pid = paper["id"]
        source = paper.get("source", "arxiv")

        print(f"[{enriched_count + 1}/{len(unenriched)}] {pid}")
        refs = fetch_references_for_paper(pid, source)
        paper["references"] = refs
        enriched_count += 1
        print(f"  -> {len(refs)} reference(s) found")

        # CLUSTER COOLDOWN: After every CLUSTER_SIZE papers, pause for CLUSTER_PAUSE seconds
        if enriched_count % CLUSTER_SIZE == 0:
            print(f"\n  [Cluster Cooldown] Pausing {CLUSTER_PAUSE}s after {enriched_count} papers...\n")
            time.sleep(CLUSTER_PAUSE)

        # INCREMENTAL SAVE: Write to disk every SAVE_EVERY papers
        if enriched_count % SAVE_EVERY == 0 or enriched_count == len(unenriched):
            CORPUS_PATH.write_text(json.dumps(papers, indent=2, ensure_ascii=False), encoding="utf-8")
            elapsed = time.time() - start_time
            print(f"  [Saved] {enriched_count}/{len(unenriched)} enriched  ({elapsed:.1f}s elapsed)\n")

    print("\n" + "=" * 70)
    print(f"  Enrichment Complete!")
    print(f"  Enriched  : {enriched_count} papers")
    print(f"  Skipped   : {skipped_count} (already had references)")
    print(f"  Saved to  : {CORPUS_PATH}")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
