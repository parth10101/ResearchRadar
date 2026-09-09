"""
Stage 1: Data Ingestion
=======================
Dual ingestion pathway:
  - arXiv API (arxiv Python library)   — via fetch_from_arxiv()
  - Semantic Scholar API (S2AG)        — via fetch_from_semanticscholar()

All papers are normalised into a single dict schema and written to a
JSON database (data/papers.json) so Stage 2 doesn't care where a
paper came from.

New fields added by Semantic Scholar ingestion:
  · s2_paper_id            — S2's canonical paper ID
  · tldr                   — AI-generated 1-sentence summary (method + main result)
  · citation_count         — total raw citation count
  · influential_citation_count — S2-filtered influential citation count
  · s2_fields_of_study     — list of academic fields e.g. ["Computer Science", "Medicine"]
  · venue                  — publication venue/conference name
  · publication_types      — list e.g. ["JournalArticle", "Conference"]
  · references             — list of reference dicts with intents + isInfluential flag
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import time
from pathlib import Path
from typing import Any


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
    return hashlib.sha1(title.strip().lower().encode("utf-8")).hexdigest()[:12]


def is_english_paper(title: str | None, abstract: str | None = None) -> bool:
    """Zero-dependency language validator to ensure clean academic processing."""
    text = f"{title or ''} {abstract or ''}".strip()
    if not text:
        return True
    non_ascii = [ch for ch in text if ord(ch) > 127]
    if len(non_ascii) / max(1, len(text)) > 0.12:
        return False
    lower = f" {text.lower()} "
    foreign_markers = [
        " de ", " da ", " do ", " das ", " dos ", " em ", " na ", " no ",
        " para ", " com ", " um ", " uma ", " sobre ", " pela ",
        " pelo ", "ção ", "ções ", " und ", " der ", " die ",
        " des ", " les ", " une ", " pour ", " avec "
    ]
    foreign_hits = sum(1 for m in foreign_markers if m in lower)
    return foreign_hits < 3


def _generate_fallback_tldr(abstract: str, title: str = "") -> str:
    """
    Generate an extractive 1-sentence TLDR summary when an AI-generated TLDR is unavailable.
    Guarantees that every ingested paper has a meaningful, non-null summary.
    """
    if not abstract:
        return f"This paper investigates {title.strip().lower().rstrip('.')}." if title else "Paper summary unavailable."

    # Clean and split into sentences
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", abstract.strip()) if s.strip()]

    # Try finding sentences containing active contribution / method keywords
    contribution_keywords = [
        "we propose", "we introduce", "this paper presents", "this work presents",
        "we develop", "this work proposes", "in this paper", "we design",
        "we present", "this paper introduces"
    ]
    for s in sentences:
        s_lower = s.lower()
        if any(kw in s_lower for kw in contribution_keywords) and len(s.split()) >= 6:
            return s.rstrip(".") + "."

    # Otherwise use the first substantial sentence
    for s in sentences:
        if len(s.split()) >= 6:
            return s.rstrip(".") + "."

    return (sentences[0].rstrip(".") + ".") if sentences else (title or "Paper summary.")


def _extract_year(raw: dict) -> int | None:
    """
    Extract a 4-digit integer publication year from S2 metadata.
    Falls back to parsing 'publicationDate' (e.g. '2023-05-12' -> 2023).
    """
    year = raw.get("year")
    if year is not None:
        try:
            y = int(year)
            if 1900 <= y <= 2100:
                return y
        except (ValueError, TypeError):
            pass

    pub_date = str(raw.get("publicationDate") or "")
    match = re.search(r"\b(19\d{2}|20\d{2})\b", pub_date)
    if match:
        return int(match.group(1))

    return None


# ---------------------------------------------------------------------------
# HOW: Paper schema (data blueprint) — every paper must have these fields.
#      Semantic Scholar adds tldr, citation metrics, reference intents etc.
# ---------------------------------------------------------------------------

def _empty_paper(**kwargs) -> dict:
    """
    Unified paper schema for the ResearchRadar corpus.
    Both arXiv and Semantic Scholar records are normalised into this format
    so all downstream stages (2 – 5) operate without modification.
    """
    base = {
        # --- Core identity ---
        "id":                        None,   # Canonical paper identifier (arXiv ID or SHA-1 hash)
        "s2_paper_id":               None,   # Semantic Scholar paperId (S2 canonical)
        "title":                     None,   # Full paper title string
        "authors":                   [],     # List of author name strings
        "year":                      None,   # Integer publication year (e.g. 2022)
        "doi":                       None,   # Digital Object Identifier string
        "source":                    "arxiv",# Data source: "arxiv" | "semanticscholar"

        # --- Text content ---
        "abstract":                  "",     # Full abstract text string
        "tldr":                      "",     # 1-sentence summary (S2 AI or extractive fallback)

        # --- Citation & Impact Metrics ---
        "citation_count":            0,      # Raw total citation count (guaranteed int >= 0)
        "influential_citation_count":0,      # S2 influential citation count (guaranteed int >= 0)

        # --- Venue & Publication Metadata ---
        "venue":                     None,   # Publication venue / conference name
        "publication_types":         [],     # e.g. ["JournalArticle"], ["Conference"]
        "s2_fields_of_study":        [],     # e.g. ["Computer Science", "Medicine"]

        # --- Citation Graph ---
        "references":                [],     # List of reference dicts:
                                             #   { paperId, externalIds, title, year,
                                             #     intents: ["methodology"|"result"|"background"],
                                             #     isInfluential: bool }

        # --- Pipeline Metadata ---
        "processed":                 False,  # Has Stage 2 processed this paper yet?
        "cluster_id":                None,   # Filled in by Stage 4 topic clustering
    }
    base.update(kwargs)
    # Auto-generate ID from title if no ID provided
    if base["id"] is None and base["title"]:
        base["id"] = _stable_id(base["title"])
    return base


# ---------------------------------------------------------------------------
# HOW: arXiv paper ID is normalized by stripping version suffixes (v1, v2)
# ---------------------------------------------------------------------------

def normalize_arxiv_id(raw_id: str | None) -> str | None:
    if not raw_id:
        return None
    cleaned = re.sub(r"^(arxiv:\s*|ARXIV:\s*)", "", raw_id.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"v\d+$", "", cleaned)
    return cleaned.strip() or None


# ---------------------------------------------------------------------------
# HOW: Load .env file to populate environment variables (e.g. S2_API_KEY)
# ---------------------------------------------------------------------------

def _load_env_file(env_path: Path | str | None = None) -> None:
    """Load key=value pairs from a .env file into os.environ."""
    if env_path is None:
        candidates = [
            Path.cwd() / ".env",
            Path(__file__).resolve().parent.parent / ".env",
            Path(__file__).resolve().parent / ".env",
        ]
        for c in candidates:
            if c.exists():
                env_path = c
                break
    if env_path and Path(env_path).exists():
        for line in Path(env_path).read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip().strip("'\"")
            if k and not os.environ.get(k):
                os.environ[k] = v


# ---------------------------------------------------------------------------
# HOW: S2 API headers builder — loads API key from env or .env file
# ---------------------------------------------------------------------------

S2_API = "https://api.semanticscholar.org/graph/v1"
DEFAULT_S2_API_KEY = None


def _get_s2_headers() -> dict[str, str]:
    _load_env_file()
    key = os.environ.get("S2_API_KEY")
    if not key:
        raise RuntimeError("S2_API_KEY not set. Add it to .env — never hardcode it.")
    return {
        "User-Agent": "ResearchRadar-Academic/3.0 (S2-Ingest)",
        "Accept": "application/json",
        "x-api-key": key,
    }


# ---------------------------------------------------------------------------
# HOW: arXiv ingestion — unchanged from original
# ---------------------------------------------------------------------------

def fetch_from_arxiv(
    query: str,
    categories: list[str] | None = None,
    start_year: int | None = None,
    end_year: int | None = None,
    max_results: int = 300,
    rate_limit_seconds: float = 4.0,
) -> list[dict]:
    if arxiv is None:
        raise ImportError("pip install arxiv")

    full_query = query
    if categories:
        cat_filter = " OR ".join(f"cat:{c}" for c in categories)
        full_query = f"({query}) AND ({cat_filter})"

    search = arxiv.Search(
        query=full_query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.Relevance,
    )
    client = arxiv.Client(
        page_size=min(max_results, 100),
        delay_seconds=max(rate_limit_seconds, 4.0),
        num_retries=5,
    )

    papers = []
    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            papers = []  # Reset to prevent duplicate accumulation on retry
            for result in client.results(search):
                year = result.published.year if result.published else None
                if not year:
                    continue
                if start_year and year < start_year:
                    continue
                if end_year and year > end_year:
                    continue
                title_clean = result.title.strip().replace("\n", " ")
                abstract_clean = result.summary.strip().replace("\n", " ")
                tldr_gen = _generate_fallback_tldr(abstract_clean, title_clean)
                papers.append(
                    _empty_paper(
                        id=result.get_short_id(),
                        title=title_clean,
                        authors=[a.name for a in result.authors],
                        year=year,
                        abstract=abstract_clean,
                        tldr=tldr_gen,
                        citation_count=0,
                        influential_citation_count=0,
                        doi=result.doi,
                        source="arxiv",
                    )
                )
            break
        except Exception as e:
            if "429" in str(e) or "HTTPError" in type(e).__name__:
                wait_time = (attempt + 1) * 15
                print(f"  [arXiv Rate Limit 429] Cooldown pause for {wait_time}s (Attempt {attempt + 1}/{max_attempts})...")
                time.sleep(wait_time)
            else:
                raise e

    return papers


# ---------------------------------------------------------------------------
# HOW: Semantic Scholar ingestion — batch-first, zero-risk to rate limits
# ---------------------------------------------------------------------------

def _normalize_s2_reference(ref_item: dict) -> dict:
    """
    Normalise a single reference item into a clean, compact dictionary.
    Omits empty/null fields to keep data/papers.json clean and noise-free.
    """
    if not ref_item or not isinstance(ref_item, dict):
        return {}
    ext = ref_item.get("externalIds") or {}
    arx = ext.get("ArXiv")
    doi = ext.get("DOI")
    pid = ref_item.get("paperId")
    title = (ref_item.get("title") or "").strip().replace("\n", " ")
    year = ref_item.get("year")

    ref: dict[str, Any] = {}
    if pid:
        ref["paperId"] = pid
    norm_arx = normalize_arxiv_id(arx)
    if norm_arx:
        ref["arxiv_id"] = norm_arx
    if doi:
        ref["doi"] = doi
    if title:
        ref["title"] = title
    if year:
        try:
            ref["year"] = int(year)
        except (ValueError, TypeError):
            ref["year"] = year

    # Only include authors, intents, and influence if non-empty
    authors = [a.get("name", "") for a in (ref_item.get("authors") or []) if a.get("name")]
    if authors:
        ref["authors"] = authors
    intents = [i for i in (ref_item.get("intents") or []) if i]
    if intents:
        ref["intents"] = intents
    if ref_item.get("isInfluential"):
        ref["isInfluential"] = True

    return ref


def sanitize_references(references: list[dict], paper_title: str | None = None, paper_year: int | None = None) -> list[dict]:
    """
    Sanitize reference list to remove PDF parsing artifacts from S2 / OCR:
      1. Exclude self-references (reference title == paper title)
      2. Exclude future publication dates (ref year > paper pub year)
      3. Exclude short OCR text/URL fragments (< 10 chars with no year and no DOI)
    """
    if not references:
        return []
    clean_title = (paper_title or "").strip().lower()
    cleaned = []
    for r in references:
        if not isinstance(r, dict):
            continue
        rt = (r.get("title") or "").strip().lower()
        ry = r.get("year")
        doi = r.get("doi")
        if clean_title and rt == clean_title:
            continue
        if paper_year and ry and isinstance(ry, int) and ry > paper_year:
            continue
        if len(rt) < 10 and not ry and not doi:
            continue
        cleaned.append(r)
    return cleaned


def _s2_paper_to_schema(raw: dict) -> dict:
    """
    Convert a raw Semantic Scholar paper dict into ResearchRadar's unified paper schema.
    Applies automatic TLDR generation, publication date parsing, and metric normalization.
    """
    if not raw:
        return {}

    ext        = raw.get("externalIds") or {}
    arx_id     = normalize_arxiv_id(ext.get("ArXiv"))
    doi        = ext.get("DOI")
    s2_id      = raw.get("paperId") or ""
    venue_obj  = raw.get("publicationVenue") or {}
    venue_name = (raw.get("venue") or venue_obj.get("name") or "").strip() or None
    title_str  = (raw.get("title") or "").strip().replace("\n", " ") or None

    # Canonical ID: prefer arXiv format for interoperability, fall back to S2 ID
    canonical_id = arx_id if arx_id else (s2_id[:12] if s2_id else None)

    # Purifier Check: Reject Books, Textbooks, Monographs, Handbooks
    pub_types = [str(t).lower() for t in (raw.get("publicationTypes") or [])]
    if any(bt in pub_types for bt in ["book", "bookchapter", "editorial", "other", "collection"]):
        return {}
    if venue_name and any(bp in venue_name.lower() for bp in ["oreilly", "o'reilly", "springer book", "mit press", "cambridge", "crc press", "routledge", "wiley", "academic press"]):
        return {}
    title_lower = (title_str or "").lower()
    book_title_keywords = [
        "mastering ", "blueprint for", "handbook", "monograph", "guide to", 
        "textbook", "introduction to", "companion to", "edition", "series on", "volume "
    ]
    if any(kw in title_lower for kw in book_title_keywords):
        return {}

    # English Language Gate: Reject non-English papers from contaminating academic pipelines
    if not is_english_paper(title_str, raw.get("abstract")):
        return {}

    # TLDR: extract text with automatic extractive fallback
    tldr_obj  = raw.get("tldr") or {}
    tldr_text = (tldr_obj.get("text") or "").strip() if isinstance(tldr_obj, dict) else ""

    # Abstract with TLDR fallback if publisher restricted abstract
    raw_abs = (raw.get("abstract") or "").strip().replace("\n", " ")
    abstract_text = raw_abs if raw_abs else tldr_text

    # If TLDR text was missing, synthesize from abstract + title
    final_tldr = tldr_text if tldr_text else _generate_fallback_tldr(abstract_text, title_str or "")

    # Publication Year (with publicationDate fallback)
    pub_year = _extract_year(raw)

    # Citation Counts (guaranteed int >= 0)
    raw_cit = raw.get("citationCount")
    try:
        cit_count = int(raw_cit) if raw_cit is not None else 0
    except (ValueError, TypeError):
        cit_count = 0

    raw_inf = raw.get("influentialCitationCount")
    try:
        inf_count = int(raw_inf) if raw_inf is not None else 0
    except (ValueError, TypeError):
        inf_count = 0

    # Authors: extract clean non-empty name strings
    authors = [a.get("name", "").strip() for a in (raw.get("authors") or []) if a.get("name")]

    # S2 Fields of Study: deduplicate while preserving order
    raw_fos = [
        f.get("category", "").strip() for f in (raw.get("s2FieldsOfStudy") or [])
        if f.get("category")
    ]
    s2_fos = list(dict.fromkeys(raw_fos))

    # Publication types: deduplicated list
    pub_types = list(dict.fromkeys([t for t in (raw.get("publicationTypes") or []) if t]))

    # References: normalise, sanitize, and filter valid references
    references = [
        _normalize_s2_reference(r)
        for r in (raw.get("references") or [])
        if r and (r.get("paperId") or r.get("title"))
    ]
    references = sanitize_references(references, title_str, pub_year)

    # Open Access PDF link
    oa_pdf = raw.get("openAccessPdf") or {}
    pdf_url = oa_pdf.get("url") if isinstance(oa_pdf, dict) else None

    return _empty_paper(
        id                        = canonical_id,
        s2_paper_id               = s2_id,
        title                     = title_str,
        authors                   = authors,
        year                      = pub_year,
        doi                       = doi,
        pdf_url                   = pdf_url,
        abstract                  = abstract_text,
        source                    = "semanticscholar",
        tldr                      = final_tldr,
        citation_count            = cit_count,
        influential_citation_count= inf_count,
        venue                     = venue_name,
        publication_types         = pub_types,
        s2_fields_of_study        = s2_fos,
        references                = references,
    )


def _parse_retry_after(header_val: Any, fallback: float = 3.0) -> float:
    """Safely parse Retry-After header as float seconds or fallback."""
    if not header_val:
        return fallback
    try:
        val = float(header_val)
        return max(val, 1.5)
    except (ValueError, TypeError):
        return fallback


def fetch_from_semanticscholar(
    query: str,
    max_results: int = 300,
    year: str | None = None,
    fields_of_study: list[str] | None = None,
    sort: str | None = None,
    bypass_cache: bool = False,
) -> list[dict]:
    """
    Fetch papers from Semantic Scholar using the centralized, hardened,
    rate-limit-proof SemanticScholarClient:
      - 100% 429-proof with cross-process clock synchronization (1.15s pacing)
      - Query disk caching for instant 0.00s loads on repeated testing
      - Seamless scaling to 500, 1,000+ papers using cursor-based bulk & 500-POST batching
    """
    from research_radar.s2_client import SemanticScholarClient
    client = SemanticScholarClient()
    return client.fetch_papers_scalable(
        query=query,
        max_results=max_results,
        year=year,
        fields_of_study=fields_of_study,
        sort=sort,
        bypass_cache=bypass_cache,
    )


# ---------------------------------------------------------------------------
# HOW: Papers list is saved (written) to disk as a JSON file
# Uses upsert (update + insert) logic to avoid duplicates by paper ID
# ---------------------------------------------------------------------------

def save_corpus(papers: list[dict], path: str | Path = "data/papers.json", append: bool = False) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = {}
    if append and path.exists():
        try:
            raw_content = path.read_text(encoding="utf-8").strip()
            if raw_content:
                existing = {p["id"]: p for p in json.loads(raw_content) if p.get("id")}
        except Exception:
            existing = {}
    for p in papers:
        if p.get("id"):
            existing[p["id"]] = p
    path.write_text(json.dumps(list(existing.values()), indent=2, ensure_ascii=False), encoding="utf-8")
    return path


# ---------------------------------------------------------------------------
# HOW: Papers are loaded (read) from disk into Python memory as a list
# ---------------------------------------------------------------------------

def load_corpus(path: str | Path = "data/papers.json") -> list[dict]:
    path = Path(path)
    if not path.exists():
        return []
    try:
        raw_content = path.read_text(encoding="utf-8").strip()
        if not raw_content:
            return []
        return json.loads(raw_content)
    except Exception:
        return []

