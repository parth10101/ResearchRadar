"""
Stage 1: Data Ingestion
=======================
Primary ingestion pathway:
  - Semantic Scholar API (S2AG) via fetch_from_semanticscholar()

All papers are normalised into a unified schema and written to a
JSON database (data/papers.json) for downstream processing.

Fields populated by Semantic Scholar ingestion:
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
# HOW: Paper ID is generated from the title using SHA-1 hashing
# (used when a paper has no native arXiv ID)
# ---------------------------------------------------------------------------

def _stable_id(title: str) -> str:
    # SHA-1 is a one-way mathematical hash function
    # Input: any string title  →  Output: always the same 40-character hex string
    # We slice [0:12] to keep only first 12 characters as a short unique ID
    return hashlib.sha1(title.strip().lower().encode("utf-8")).hexdigest()[:12]


def is_english_paper(title: str | None, abstract: str | None = None) -> bool:
    """
    Scientometrically rigorous, zero-dependency academic language validator:
    1. Math-Aware: Strips LaTeX formulas ($...$, \alpha, etc.) and Unicode mathematical
       notation before evaluating character distributions, preventing the accidental
       rejection of theoretical/mathematical literature.
    2. Global-Scholar Tolerant: Normalizes accented Latin characters (e.g. Poincaré, Schrödinger,
       Universidade de São Paulo, van der Waals) so international citations and affiliations
       are not penalized.
    3. English Function Word Ratio: Measures the presence of foundational English function
       words rather than relying on brittle foreign-word exclusion counts.
    """
    raw_text = f"{title or ''} {abstract or ''}".strip()
    if not raw_text:
        return True

    # 1. Strip LaTeX formulas ($...$ or $$...$$) and LaTeX commands (\command{...})
    text = re.sub(r"\$\$[^\$]+\$\$", " ", raw_text)
    text = re.sub(r"\$[^\$]+\$", " ", text)
    text = re.sub(r"\\[a-zA-Z]+(?:\{[^\}]*\})*", " ", text)

    # 2. Strip Unicode mathematical operators, Greek letters, and technical symbols
    # Greek & Coptic (\u0370-\u03FF), Letterlike (\u2100-\u214F), Arrows (\u2190-\u21FF),
    # Mathematical Operators (\u2200-\u22FF, \u2A00-\u2AFF), Misc Math (\u27C0-\u27EF, \u2980-\u29FF)
    math_pattern = r"[\u0370-\u03FF\u2070-\u209F\u2100-\u214F\u2190-\u21FF\u2200-\u22FF\u27C0-\u27EF\u2980-\u29FF\u2A00-\u2AFF]"
    text = re.sub(math_pattern, " ", text)

    # 3. Check for non-Latin scripts (CJK, Cyrillic, Arabic, Devanagari)
    non_latin_chars = re.findall(r"[\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]", text)
    if len(non_latin_chars) / max(1, len(text.replace(" ", ""))) > 0.25:
        return False

    # 4. Extract words for lexical analysis
    words = re.findall(r"\b[a-zA-Z]{2,}\b", text.lower())
    if len(words) < 6:
        # Short titles/abstracts in Latin script pass safely
        return True

    english_stopwords = {
        "the", "of", "and", "in", "to", "a", "is", "that", "for", "it", "as", "was",
        "with", "on", "by", "at", "from", "this", "be", "are", "an", "we", "which",
        "or", "have", "can", "has", "not", "its", "our", "their", "paper", "propose",
        "presents", "study", "results", "using", "method", "approach", "model", "analysis",
        "based", "between", "each", "both", "such", "through", "more", "also", "into"
    }
    foreign_markers = {
        "und", "der", "die", "das", "des", "dem", "den", "nicht", "eine", "einer", "einem",
        "para", "com", "uma", "sobre", "pela", "pelo", "sao", "artigo", "este", "esta",
        "pour", "avec", "dans", "cette", "sur", "une", "des", "les", "du", "qui"
    }

    en_hits = sum(1 for w in words if w in english_stopwords)
    foreign_hits = sum(1 for w in foreign_markers if w in words)

    # If the text has substantial length but ZERO English function words, it is non-English
    if len(words) >= 12 and en_hits == 0:
        return False

    # If foreign grammatical markers strongly outnumber English function words
    if foreign_hits >= 3 and foreign_hits > en_hits:
        return False

    return True


def _generate_fallback_tldr(abstract: str, title: str = "") -> str:
    """
    Generate an extractive 1-sentence TLDR summary when an AI-generated TLDR is unavailable.
    Guarantees that no synthetic boilerplate is injected to avoid contaminating downstream
    SPECTER/SciBERT embedding manifolds.
    """
    if not abstract:
        return title.strip() if title else ""

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

    return (sentences[0].rstrip(".") + ".") if sentences else (title or "")


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
        "source":                    "semanticscholar",# Data source: "semanticscholar"

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
    headers = {
        "User-Agent": "ResearchRadar-Academic/3.0 (S2-Ingest)",
        "Accept": "application/json",
    }
    if key:
        headers["x-api-key"] = key
    return headers




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

    # Canonical ID: prefer arXiv format for interoperability, fall back to full S2 ID, then DOI, then stable hash
    canonical_id = arx_id if arx_id else (s2_id if s2_id else (doi if doi else (_stable_id(title_str) if title_str else None)))

    # Purifier Check: Reject Books, Textbooks, Monographs, Handbooks
    # Scientometric Principle: Do not filter by publisher name (e.g. Wiley and Cambridge publish premier journals).
    # Filter strictly on S2 publicationTypes and non-paper keywords.
    pub_types = [str(t).lower() for t in (raw.get("publicationTypes") or [])]
    is_article = any(at in pub_types for at in ["journalarticle", "conference", "review", "preprint"])
    if not is_article and any(bt in pub_types for bt in ["book", "bookchapter", "editorial", "other", "collection"]):
        return {}
    if not is_article and venue_name:
        venue_lower = venue_name.lower()
        if any(bp in venue_lower for bp in ["oreilly", "o'reilly", "springer book series", "crc press handbook"]):
            return {}
    title_lower = (title_str or "").lower()
    if not is_article:
        book_title_keywords = [
            "mastering bitcoin", "blueprint for", "handbook of", "monograph series",
            "textbook on", "series on volume", "edition volume"
        ]
        if any(kw in title_lower for kw in book_title_keywords):
            return {}

    # English Language Gate: Reject non-English papers from contaminating academic pipelines
    if not is_english_paper(title_str, raw.get("abstract")):
        return {}

    # TLDR: extract text with automatic extractive fallback (zero synthetic boilerplate)
    tldr_obj  = raw.get("tldr") or {}
    tldr_text = (tldr_obj.get("text") or "").strip() if isinstance(tldr_obj, dict) else ""

    # Abstract: preserve authentic abstract; never inject synthetic filler that smears vector spaces
    raw_abs = (raw.get("abstract") or "").strip().replace("\n", " ")
    abstract_text = raw_abs if raw_abs else (tldr_text if tldr_text else "")

    # If TLDR text was missing, synthesize extractively from abstract or title
    final_tldr = tldr_text if tldr_text else _generate_fallback_tldr(raw_abs, title_str or "")

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

