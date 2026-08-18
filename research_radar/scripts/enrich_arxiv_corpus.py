"""
scripts/enrich_arxiv_corpus.py
===============================
Enriches an existing arXiv corpus with reference and citation data pulled
from the Semantic Scholar Academic Graph API (S2AG).

For each paper that has an arXiv ID and whose 'references' field is still
empty, the script:
  1. Calls  GET /paper/arXiv:{id}/references  to fetch outgoing references.
  2. Calls  GET /paper/arXiv:{id}/citations   (only with --citations flag).
  3. Stores the normalised reference/citation dicts back into the corpus.
  4. Checkpoints (saves) the corpus to disk every --checkpoint-every papers
     so progress is never lost if the run is interrupted.

Rate-limit compliance
---------------------
  - With an API key the limit is 1 request / second (cumulative).
  - Default inter-request delay is 1.1 s (10 % headroom).
  - On HTTP 429 the script reads the "retry-after" header and waits
    exactly that long, then doubles the back-off on each subsequent retry.
  - If --citations is enabled each paper costs 2 requests, so the delay
    is applied before *every* request individually.

Resume support
--------------
  Papers whose 'references' list is already non-empty are skipped by
  default (--skip-enriched, which is on by default).  Re-run the script
  any time after a partial run and it will only fetch the missing papers.

Usage
-----
    python scripts/enrich_arxiv_corpus.py --corpus data/papers.json
    python scripts/enrich_arxiv_corpus.py --corpus data/papers.json --citations
    python scripts/enrich_arxiv_corpus.py --corpus data/papers.json --limit 50
    python scripts/enrich_arxiv_corpus.py --corpus data/papers.json --delay 1.5

API key
-------
  Place  S2_API_KEY=<your-key>  in the .env file at the project root.
  The script loads it automatically via stage1_ingest._load_env_file().
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# Bootstrap: load .env and shared S2 helpers from the package
# ---------------------------------------------------------------------------

# Ensure the project root is on sys.path so the package is importable when
# this script is run from any working directory.
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from research_radar.stage1_ingest import (   # noqa: E402
    _load_env_file,
    _get_s2_headers,
    normalize_arxiv_id,
    S2_API,
)

_load_env_file()

try:
    import requests as _requests
except ImportError:
    print("[ERROR] 'requests' is not installed.  Run: pip install requests", file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------------------
# S2 fetch helpers
# ---------------------------------------------------------------------------

_REF_FIELDS  = "title,year,authors,externalIds,paperId"
_CIT_FIELDS  = "title,year,authors,externalIds,paperId"
_MAX_RETRIES = 4


def _s2_get(
    url: str,
    params: dict,
    headers: dict,
    delay: float,
    *,
    label: str = "",
) -> dict | None:
    """
    GET a single S2AG endpoint, honouring the rate limit.

    Sleeps *before* sending the request so the caller never has to think
    about it.  Returns the parsed JSON dict, or None on permanent failure.
    """
    time.sleep(delay)          # always sleep *before* the request

    backoff = delay
    for attempt in range(_MAX_RETRIES + 1):
        try:
            resp = _requests.get(url, params=params, headers=headers, timeout=30)
        except _requests.RequestException as exc:
            if attempt == _MAX_RETRIES:
                print(f"  [WARN] Network error{' (' + label + ')' if label else ''}: {exc}")
                return None
            time.sleep(backoff)
            backoff *= 2
            continue

        if resp.status_code == 200:
            return resp.json()

        if resp.status_code == 429:
            retry_after = float(resp.headers.get("retry-after", backoff))
            print(
                f"  [429] Rate limited{' (' + label + ')' if label else ''}. "
                f"Waiting {retry_after:.1f}s ..."
            )
            time.sleep(retry_after)
            backoff = max(backoff * 2, retry_after + delay)
            continue

        if resp.status_code == 404:
            # Paper not indexed on S2 — not an error, just skip
            return None

        # Any other HTTP error — log and give up on this paper
        print(
            f"  [WARN] HTTP {resp.status_code}{' (' + label + ')' if label else ''} "
            f"— skipping."
        )
        return None

    return None


def _normalise_ref(item: dict) -> dict:
    """Convert a raw S2 reference/citation item into the corpus schema."""
    paper = item.get("citedPaper") or item.get("citingPaper") or item
    ext   = paper.get("externalIds") or {}
    return {
        "paperId"  : paper.get("paperId"),
        "title"    : (paper.get("title") or "").strip(),
        "year"     : paper.get("year"),
        "authors"  : [a.get("name", "") for a in (paper.get("authors") or [])],
        "arxiv_id" : normalize_arxiv_id(ext.get("ArXiv")),
        "doi"      : ext.get("DOI"),
    }


def fetch_references(arxiv_id: str, headers: dict, delay: float) -> list[dict]:
    """Return a list of normalised reference dicts for the given arXiv paper."""
    url  = f"{S2_API}/paper/arXiv:{arxiv_id}/references"
    data = _s2_get(
        url,
        params={"fields": _REF_FIELDS, "limit": 500},
        headers=headers,
        delay=delay,
        label=arxiv_id,
    )
    if data is None:
        return []
    return [_normalise_ref(item) for item in data.get("data", [])]


def fetch_citations(arxiv_id: str, headers: dict, delay: float) -> list[dict]:
    """Return a list of normalised citation dicts for the given arXiv paper."""
    url  = f"{S2_API}/paper/arXiv:{arxiv_id}/citations"
    data = _s2_get(
        url,
        params={"fields": _CIT_FIELDS, "limit": 500},
        headers=headers,
        delay=delay,
        label=arxiv_id,
    )
    if data is None:
        return []
    return [_normalise_ref(item) for item in data.get("data", [])]


# ---------------------------------------------------------------------------
# Corpus I/O
# ---------------------------------------------------------------------------

def load_corpus(path: Path) -> list[dict]:
    return json.loads(path.read_text(encoding="utf-8"))


def save_corpus(papers: list[dict], path: Path) -> None:
    path.write_text(json.dumps(papers, indent=2, ensure_ascii=False), encoding="utf-8")


# ---------------------------------------------------------------------------
# Main enrichment loop
# ---------------------------------------------------------------------------

def enrich(
    corpus_path: Path,
    out_path: Path,
    *,
    fetch_cits: bool,
    skip_enriched: bool,
    limit: int | None,
    delay: float,
    checkpoint_every: int,
) -> None:
    papers  = load_corpus(corpus_path)
    headers = _get_s2_headers()

    if "x-api-key" in headers:
        print(f"  API key loaded ({headers['x-api-key'][:8]}...)")
    else:
        print("  [WARN] No S2_API_KEY found — running at anonymous rate limits (100 req/5 min).")

    # Determine which papers need enriching
    to_enrich: list[dict] = []
    for p in papers:
        if p.get("source") != "arxiv":
            continue                                     # only arXiv papers have arXiv IDs
        arxiv_id = normalize_arxiv_id(p.get("id"))
        if not arxiv_id:
            continue
        if skip_enriched and p.get("references"):
            continue                                     # already done
        p["_arxiv_id_clean"] = arxiv_id                 # stash for use in the loop
        to_enrich.append(p)

    if limit is not None:
        to_enrich = to_enrich[:limit]

    total = len(to_enrich)
    if total == 0:
        print("  Nothing to enrich — all arXiv papers already have references.")
        return

    reqs_per_paper = 2 if fetch_cits else 1
    est_mins       = (total * reqs_per_paper * delay) / 60
    print(
        f"  Papers to enrich : {total}  "
        f"({'refs + cits' if fetch_cits else 'refs only'})"
    )
    print(f"  Delay per request: {delay}s")
    print(f"  Estimated time   : ~{est_mins:.1f} minutes")
    print(f"  Checkpoint every : {checkpoint_every} papers")
    print()

    enriched_count = 0
    skipped_count  = 0
    t0             = time.time()

    for i, paper in enumerate(to_enrich, 1):
        arxiv_id = paper.pop("_arxiv_id_clean")

        # ── References ───────────────────────────────────────────────────
        refs = fetch_references(arxiv_id, headers, delay)
        if refs:
            paper["references"] = refs
            enriched_count += 1
        else:
            skipped_count += 1

        # ── Citations (optional) ──────────────────────────────────────────
        if fetch_cits:
            cits = fetch_citations(arxiv_id, headers, delay)
            paper["citations"] = cits

        # ── Progress ──────────────────────────────────────────────────────
        elapsed = time.time() - t0
        rate    = i / elapsed if elapsed > 0 else 0
        eta     = (total - i) / rate if rate > 0 else 0
        print(
            f"  [{i:>4}/{total}]  {arxiv_id:<20}  "
            f"refs={len(refs):>3}  "
            f"elapsed={elapsed:>6.0f}s  "
            f"eta={eta:>5.0f}s"
        )

        # ── Checkpoint save ───────────────────────────────────────────────
        if i % checkpoint_every == 0:
            save_corpus(papers, out_path)
            print(f"  -- checkpoint saved -> {out_path}")

    # ── Final save ────────────────────────────────────────────────────────
    save_corpus(papers, out_path)
    elapsed = time.time() - t0
    print()
    print(f"  Done.  Enriched={enriched_count}  Skipped(not on S2)={skipped_count}")
    print(f"  Total time : {elapsed:.1f}s")
    print(f"  Corpus saved -> {out_path}")

    # ── Sample output: first enriched paper ───────────────────────────────
    first_enriched = next(
        (p for p in papers if p.get("source") == "arxiv" and p.get("references")),
        None,
    )
    if first_enriched:
        refs = first_enriched.get("references", [])
        print()
        print("  -- Sample enriched paper --")
        print(f"  ID         : {first_enriched.get('id')}")
        print(f"  Title      : {first_enriched.get('title')}")
        print(f"  References : {len(refs)} stored")
        print("  First 3 references:")
        for r in refs[:3]:
            title   = (r.get("title") or "Unknown title")[:80]
            year    = r.get("year") or "?"
            authors = r.get("authors") or []
            first_a = authors[0] if authors else "?"
            print(f"    [{year}] {title}  ({first_a}{'...' if len(authors) > 1 else ''})")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="enrich_arxiv_corpus",
        description=(
            "Enrich an arXiv corpus with Semantic Scholar references "
            "(and optionally citations)."
        ),
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--corpus",
        type=Path,
        default=Path("data/papers.json"),
        help="Input corpus JSON file.",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=None,
        help="Output path. Defaults to overwriting --corpus in place.",
    )
    parser.add_argument(
        "--citations",
        action="store_true",
        default=False,
        help="Also fetch incoming citations (doubles the number of API calls).",
    )
    parser.add_argument(
        "--no-skip-enriched",
        dest="skip_enriched",
        action="store_false",
        default=True,
        help="Re-fetch references even for papers that already have them.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Only enrich the first N papers that need enriching (useful for testing).",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.1,
        help="Seconds to sleep before each API request (must stay <= 1.0 per S2 rules; "
             "default 1.1 gives 10%% headroom).",
    )
    parser.add_argument(
        "--checkpoint-every",
        type=int,
        default=10,
        help="Save corpus to disk every N enriched papers.",
    )
    return parser


def main(argv: list[str] | None = None) -> None:
    parser = build_parser()
    args   = parser.parse_args(argv)

    if not args.corpus.exists():
        print(f"[ERROR] Corpus not found: {args.corpus}", file=sys.stderr)
        sys.exit(1)

    out_path = args.out or args.corpus

    print()
    print("=" * 60)
    print("  ResearchRadar — S2 Enrichment")
    print("=" * 60)
    print(f"  Corpus  : {args.corpus}")
    print(f"  Output  : {out_path}")
    print()

    enrich(
        corpus_path      = args.corpus,
        out_path         = out_path,
        fetch_cits       = args.citations,
        skip_enriched    = args.skip_enriched,
        limit            = args.limit,
        delay            = args.delay,
        checkpoint_every = args.checkpoint_every,
    )


if __name__ == "__main__":
    main()
