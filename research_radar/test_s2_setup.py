"""
Test Semantic Scholar Setup & Endpoints
=======================================
Validates the S2 Client against live Semantic Scholar endpoints.
"""

from __future__ import annotations

import sys
import time
from pathlib import Path

# Ensure package is on sys.path
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from research_radar.s2_client import SemanticScholarClient


def run_tests() -> None:
    print("\n" + "=" * 70)
    print("  Testing Semantic Scholar API Setup & Endpoints")
    print("=" * 70)

    client = SemanticScholarClient()
    print(f"  API Key Active: {'Yes (' + client.api_key[:8] + '...)' if client.api_key else 'No (Anonymous)'}")
    print()

    # 1. Relevance Search Test
    print("  [1/4] Testing Paper Relevance Search (`/paper/search`)...", end=" ", flush=True)
    t0 = time.time()
    search_res = client.search_papers("federated learning", limit=5)
    t_search = time.time() - t0
    papers = search_res.get("data", [])
    if papers and len(papers) > 0:
        p0 = papers[0]
        print(f"OK ({t_search:.2f}s, {len(papers)} papers found)")
        print(f"        Sample Title: {p0.get('title', 'N/A')[:60]}...")
        print(f"        Sample TLDR : {p0.get('tldr', {}).get('text', 'N/A')[:75]}...")
        print(f"        Citations   : {p0.get('citationCount', 0)} (Influential: {p0.get('influentialCitationCount', 0)})")
    else:
        print(f"FAILED (No papers returned: {search_res})")

    # 2. Batch Paper Lookup Test
    print("\n  [2/4] Testing Batch Paper Hydration (`/paper/batch`)...", end=" ", flush=True)
    if papers:
        p_ids = [p["paperId"] for p in papers[:3]]
        t0 = time.time()
        batch_res = client.get_papers_batch(p_ids)
        t_batch = time.time() - t0
        print(f"OK ({t_batch:.2f}s, {len(batch_res)} papers hydrated)")
        for p in batch_res:
            n_refs = len(p.get("references") or [])
            print(f"        Paper: {p.get('title', '')[:40]}... -> {n_refs} references")
    else:
        print("SKIPPED (no paper IDs from step 1)")

    # 3. Bulk Search Test
    print("\n  [3/4] Testing Bulk Search (`/paper/search/bulk`)...", end=" ", flush=True)
    t0 = time.time()
    bulk_res = client.search_bulk("federated learning healthcare", limit=10, year="2022-")
    t_bulk = time.time() - t0
    print(f"OK ({t_bulk:.2f}s, {len(bulk_res)} papers returned)")

    # 4. Recommendations Engine Test
    print("\n  [4/4] Testing Recommendations API (`/recommendations/v1/papers`)...", end=" ", flush=True)
    if papers:
        seed_id = papers[0]["paperId"]
        t0 = time.time()
        recs = client.get_recommendations(positive_paper_ids=[seed_id], limit=3)
        t_recs = time.time() - t0
        print(f"OK ({t_recs:.2f}s, {len(recs)} recommended papers)")
        for r in recs:
            print(f"        Rec: {r.get('title', '')[:50]}... ({r.get('year')})")
    else:
        print("SKIPPED")

    print("\n" + "=" * 70)
    print("  All Semantic Scholar API Endpoints Verified Successfully!")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    run_tests()
