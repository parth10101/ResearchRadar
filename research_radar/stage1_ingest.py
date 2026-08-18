"""
Stage 1: Data Collection
=========================
API ingestion pathway:
  - arXiv API (arxiv Python library)

All papers are normalised into a single dict schema and written to a
JSON database (data/papers.json) so Stage 2 doesn't care where a
paper came from.
"""

from __future__ import annotations

import hashlib
import json
import re
import time
from pathlib import Path



# ---------------------------------------------------------------------------
# HOW: Optional arxiv library is imported safely (no crash if not installed)
# ---------------------------------------------------------------------------

try:
    import arxiv  # pip install arxiv
except ImportError:
    arxiv = None  # If not installed, arxiv = None (we check for None before using it)


# ---------------------------------------------------------------------------
# HOW: Paper ID is generated from the title using SHA-1 hashing
# (used when a paper has no native arXiv ID)
# ---------------------------------------------------------------------------

def _stable_id(title: str) -> str:
    # SHA-1 is a one-way mathematical hash function
    # Input: any string title  →  Output: always the same 40-character hex string
    # We slice [0:12] to keep only first 12 characters as a short unique ID
    # Example: "Federated Learning..." → "d2a9f7e810cb"
    return hashlib.sha1(title.strip().lower().encode("utf-8")).hexdigest()[:12]


# ---------------------------------------------------------------------------
# HOW: Paper schema (data blueprint) is defined — this is NOT an NLP algorithm
# It is a Python dictionary defining exactly what fields every paper must have
# ---------------------------------------------------------------------------

def _empty_paper(**kwargs) -> dict:
    # This is our DATA SCHEMA — a blank Python dictionary with all required fields
    # Every paper from arXiv is converted into this exact format
    # so Stage 2 receives clean, consistent fields
    base = {
        "id": None,           # Unique paper identifier (arXiv ID or SHA-1 hash)
        "title": None,        # Full paper title string
        "authors": [],        # List of author name strings
        "year": None,         # Integer publication year (e.g. 2022)
        "abstract": "",       # Full abstract text string
        "doi": None,          # Digital Object Identifier string (if available)
        "source": "arxiv",    # Data source identifier
        "references": [],     # List of cited paper IDs within this corpus
        "processed": False,   # Flag: has Stage 2 processed this paper yet?
        "cluster_id": None,   # Filled in by Stage 4 topic clustering (not used yet)
    }
    base.update(kwargs)  # HOW: Overwrite blank fields with real data passed in
    # HOW: Auto-generate ID from title if no ID was provided
    if base["id"] is None and base["title"]:
        base["id"] = _stable_id(base["title"])
    return base


# ---------------------------------------------------------------------------
# HOW: arXiv paper ID is normalized by stripping version suffixes (v1, v2)
# Example: "2207.02337v1" → "2207.02337"
# ---------------------------------------------------------------------------

def normalize_arxiv_id(raw_id: str | None) -> str | None:
    if not raw_id:
        return None
    # HOW: re.sub() uses regex to find and remove the "arXiv:" prefix
    cleaned = re.sub(r"^(arxiv:\s*|ARXIV:\s*)", "", raw_id.strip(), flags=re.IGNORECASE)
    # HOW: Remove version suffix like "v1", "v2" from the end
    cleaned = re.sub(r"v\d+$", "", cleaned)
    return cleaned.strip() or None


# ---------------------------------------------------------------------------
# HOW: Papers are fetched from the arXiv API
# Fetches all max_results papers in ONE single bulk request to avoid rate limits
# ---------------------------------------------------------------------------

def fetch_from_arxiv(
    query: str,
    categories: list[str] | None = None,
    start_year: int | None = None,
    end_year: int | None = None,
    max_results: int = 300,
    rate_limit_seconds: float = 3.0,
) -> list[dict]:
    if arxiv is None:
        raise ImportError("pip install arxiv")

    # HOW: Category filter is built by joining category codes with OR
    # Example: categories=["cs.LG","cs.AI"] → "cat:cs.LG OR cat:cs.AI"
    full_query = query
    if categories:
        cat_filter = " OR ".join(f"cat:{c}" for c in categories)
        full_query = f"({query}) AND ({cat_filter})"

    # HOW: arxiv.Search defines WHAT to search for — no network call yet
    search = arxiv.Search(
        query=full_query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.Relevance,
    )

    # HOW: arxiv.Client sends the actual HTTP request to arXiv servers
    # delay_seconds=5.0 and num_retries=5 avoids HTTP 429 rate-limiting
    client = arxiv.Client(
        page_size=100,
        delay_seconds=max(rate_limit_seconds, 5.0),
        num_retries=5,
    )

    papers = []
    # HOW: Iterate through each result returned by arXiv with retry backoff for 429
    max_attempts = 3
    for attempt in range(max_attempts):

        try:
            for result in client.results(search):
                year = result.published.year if result.published else None
                if start_year and year and year < start_year:
                    continue
                if end_year and year and year > end_year:
                    continue
                papers.append(
                    _empty_paper(
                        id=result.get_short_id(),
                        title=result.title.strip().replace("\n", " "),
                        authors=[a.name for a in result.authors],
                        year=year,
                        abstract=result.summary.strip().replace("\n", " "),
                        doi=result.doi,
                        source="arxiv",
                    )
                )
            break  # Success! Exit retry loop
        except Exception as e:
            if "429" in str(e) or "HTTPError" in type(e).__name__:
                wait_time = (attempt + 1) * 10
                print(f"  [arXiv Rate Limit 429] Cooldown pause for {wait_time}s (Attempt {attempt + 1}/{max_attempts})...")
                time.sleep(wait_time)
            else:
                raise e

    return papers


# ---------------------------------------------------------------------------
# HOW: Papers list is saved (written) to disk as a JSON file
# Uses upsert (update + insert) logic to avoid duplicates by paper ID
# ---------------------------------------------------------------------------

def save_corpus(papers: list[dict], path: str | Path = "data/papers.json") -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)  # HOW: Create folders if they don't exist

    # HOW: Load existing papers first, then merge new ones on top
    # Using ID as dictionary key automatically deduplicates (same ID = overwrite)
    existing = {}
    if path.exists():
        existing = {p["id"]: p for p in json.loads(path.read_text())}

    for p in papers:
        existing[p["id"]] = p  # HOW: Upsert — adds new paper or updates existing one

    # HOW: Convert the merged dictionary back to a JSON-formatted string and write to disk
    path.write_text(json.dumps(list(existing.values()), indent=2))
    return path


# ---------------------------------------------------------------------------
# HOW: Papers are loaded (read) from disk into Python memory as a list
# ---------------------------------------------------------------------------

def load_corpus(path: str | Path = "data/papers.json") -> list[dict]:
    path = Path(path)
    if not path.exists():
        return []  # HOW: Return empty list if the file doesn't exist yet
    # HOW: Read the JSON file from disk and parse it into a Python list of dictionaries
    return json.loads(path.read_text())
