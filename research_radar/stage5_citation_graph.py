"""
Stage 5: Citation Graph
=======================
"""
from __future__ import annotations

import argparse
import datetime
import json
import math
import os
import re
import time
import urllib.parse
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

def _normalize_arxiv_id(pid):
    if not pid:
        return ""
    pid = str(pid).strip()
    if pid.lower().startswith('arxiv:'):
        pid = pid[6:]
    match = re.search(r'(\d{4}\.\d{4,5})(v\d+)?', pid)
    if match:
        return match.group(1)
    return pid

def _is_english_text(text: str) -> bool:
    if not text:
        return False
    non_ascii_chars = [ch for ch in text if ord(ch) > 127]
    if len(non_ascii_chars) / max(1, len(text)) > 0.12:
        return False
    lower = f" {text.lower()} "
    foreign_markers = [
        " de ", " da ", " do ", " das ", " dos ", " em ", " na ", " no ",
        " para ", " com ", " um ", " uma ", " e ", " sobre ", " pela ",
        " pelo ", "ção ", "ções ", " und ", " der ", " die ", " das ",
        " des ", " les ", " une ", " pour ", " avec "
    ]
    foreign_hits = sum(1 for m in foreign_markers if m in lower)
    if foreign_hits >= 2:
        return False
    return True

def _resolve_paper_action_button(p, p_id):
    """
    Smart Action Button Resolver:
      Tier 1: Direct Open Access PDF URL -> "📄 Open Full-Text PDF"
      Tier 2: Detected Book / Monograph -> "📖 Open Book on Google Books"
      Tier 3: Official DOI / arXiv Abstract Link -> "🔗 Open Official DOI"
      Tier 4: Google Scholar Search Fallback -> "🔍 Search PDF on Google Scholar"
    """
    pdf_url = p.get('pdf_url') or (p.get('openAccessPdf', {}) or {}).get('url') or ''
    if pdf_url and (pdf_url.endswith('.pdf') or 'arxiv.org/pdf' in pdf_url or 'pdf' in pdf_url.lower()):
        return {
            'url': pdf_url,
            'label': '📄 Open Full-Text PDF',
            'btn_class': 'btn-pdf btn-pdf-direct'
        }

    title = p.get('title') or ''
    encoded_title = urllib.parse.quote(title)

    # Book / Monograph detection
    pub_types = p.get('publication_types') or p.get('publicationTypes') or []
    venue = str(p.get('venue') or '').lower()
    is_article = any(at in [str(t).lower() for t in pub_types] for at in ["journalarticle", "conference", "review", "preprint"])
    is_book = not is_article and (
        ('book' in [str(t).lower() for t in pub_types]) or
        ('oreilly' in venue) or
        any(k in title.lower() for k in [': blueprint for', 'handbook of', 'mastering bitcoin'])
    )

    if is_book:
        return {
            'url': f"https://books.google.com/books?q={encoded_title}",
            'label': '📖 Open Book on Google Books',
            'btn_class': 'btn-pdf btn-pdf-book'
        }
    
    doi = p.get('doi') or ''
    source = p.get('source') or ''
    raw_id = _normalize_arxiv_id(p_id)
    
    if doi:
        return {
            'url': f"https://doi.org/{doi}",
            'label': '🔗 Open Official DOI',
            'btn_class': 'btn-pdf btn-pdf-doi'
        }
    if source == 'arxiv' or (raw_id and raw_id.replace('.', '').isdigit()):
        return {
            'url': f"https://arxiv.org/abs/{raw_id}",
            'label': '🔗 Open arXiv Publication',
            'btn_class': 'btn-pdf btn-pdf-doi'
        }
        
    scholar_url = f"https://scholar.google.com/scholar?q={encoded_title}"
    return {
        'url': scholar_url,
        'label': '🔍 Search PDF on Google Scholar',
        'btn_class': 'btn-pdf btn-pdf-scholar'
    }

def _sanitize_paper_references(p):
    raw_refs = p.get('references') or []
    if not raw_refs:
        return []
    p_title = (p.get('title') or '').strip().lower()
    p_year = p.get('year')
    cleaned = []
    for r in raw_refs:
        if not isinstance(r, dict): continue
        r_title = (r.get('title') or '').strip().lower()
        r_year = r.get('year')
        ext = r.get('externalIds') or {} if isinstance(r, dict) else {}
        doi = r.get('doi') or ext.get('DOI')
        if p_title and r_title == p_title: continue
        if p_year and r_year and isinstance(r_year, int) and r_year > p_year: continue
        if len(r_title) < 10 and not r_year and not doi: continue
        cleaned.append(r)
    return cleaned

def _get_paper_ref_count(p):
    if p.get('reference_count') is not None and int(p.get('reference_count', 0)) > 0:
        return int(p['reference_count'])
    if p.get('official_reference_count') is not None and int(p.get('official_reference_count', 0)) > 0:
        return int(p['official_reference_count'])
    return len(p.get('references') or [])

def _get_universal_ref_status(p):
    """
    Universal Reference Evaluator:
    Calculates exact status badge + hover tooltip:
      Rule 1: RefCount > 0 -> "📚 X References"
      Rule 2: RefCount == 0 AND Year <= 2010 -> "📜 Early Foundational Literature"
      Rule 3: RefCount == 0 AND Year > 2010 AND Citations >= 250 -> "🏛️ Landmark Source Paper (Refs in PDF)"
      Rule 4: RefCount == 0 AND Year > 2010 AND Citations < 250 -> "🔒 Paywalled Journal (Refs in PDF)"
    """
    ref_count = _get_paper_ref_count(p)
    cits = p.get('citation_count') or p.get('citationCount') or 0
    year = 2024
    try:
        year = int(p.get('year', 2024))
    except Exception:
        pass
        
    if ref_count > 0:
        return {
            'label': f"📚 {ref_count} References",
            'badge_class': 'ref-status-standard',
            'tooltip': f"{ref_count} digitized reference cross-links indexed.",
            'is_zero': False
        }
        
    if year <= 2010:
        return {
            'label': "📜 Early Foundational Literature",
            'badge_class': 'ref-status-early',
            'tooltip': "This foundational work cites early historical prior art and textbooks from the pre-digital indexing era.",
            'is_zero': True
        }
        
    if cits >= 250:
        return {
            'label': "🏛️ Landmark Source Paper (Refs in PDF)",
            'badge_class': 'ref-status-landmark',
            'tooltip': f"Over {cits:,} papers build directly on this landmark work. Full reference list is available inside the paper PDF.",
            'is_zero': True
        }
        
    return {
        'label': "🔒 Paywalled Journal (Refs in PDF)",
        'badge_class': 'ref-status-paywall',
        'tooltip': "This paper is from a subscription/paywalled journal. The publisher retains reference metadata behind their portal, but the full bibliography is available inside the paper PDF.",
        'is_zero': True
    }

def _clean_title_key(title):
    if not title: return ""
    return re.sub(r'[^a-z0-9]', '', str(title).lower())


def _build_paper_ref_fingerprint(paper):
    """Extract reference fingerprint with rich metadata, venue, citations, and reliable URLs."""
    paper_year = 0
    try:
        paper_year = int(paper.get('year', 0) or 0)
    except (ValueError, TypeError):
        paper_year = 0

    refs = paper.get('references', [])
    fingerprint = {}
    for r in refs:
        if not isinstance(r, dict):
            continue
        title = (r.get('title') or "").strip()
        t_key = _clean_title_key(title)
        pid = (r.get('paperId') or "").strip().lower()
        doi = (r.get('doi') or (r.get('externalIds') or {}).get('DOI') or "").strip().lower()
        arx = _normalize_arxiv_id(r.get('arxiv_id') or (r.get('externalIds') or {}).get('ArXiv'))

        primary_key = t_key if (t_key and len(t_key) >= 8) else (f"pid:{pid}" if pid else (f"doi:{doi}" if doi else (f"arx:{arx}" if arx else None)))
        if not primary_key:
            continue

        ref_year = 0
        try:
            ref_year = int(r.get('year', 0))
        except (ValueError, TypeError):
            ref_year = 0

        # Temporal causality constraint: A paper cannot cite works from its own future
        if paper_year > 0 and ref_year > 0 and ref_year > paper_year:
            continue

        pdf_url = f"https://arxiv.org/pdf/{arx}.pdf" if arx else ""
        doi_url = f"https://doi.org/{doi}" if doi else ""
        s2_url = f"https://www.semanticscholar.org/paper/{pid}" if (pid and len(pid) > 10) else ""
        enc_t = urllib.parse.quote(title or "paper")
        scholar_url = f"https://scholar.google.com/scholar?q={enc_t}"

        # Primary link
        primary_url = pdf_url or doi_url or s2_url or scholar_url

        # Authors
        a_list = r.get('authors', [])
        if isinstance(a_list, list) and a_list:
            if isinstance(a_list[0], dict):
                author_names = [a.get('name', '') for a in a_list[:2]]
            else:
                author_names = [str(a) for a in a_list[:2]]
            authors = ", ".join(author_names)
            if len(a_list) > 2:
                authors += " et al."
        else:
            authors = ""

        cits = r.get('citationCount') or r.get('citation_count') or 0
        venue = str(r.get('venue') or r.get('publicationVenue') or '').strip()
        intents = [i for i in (r.get('intents') or []) if i]
        is_influential = bool(r.get('isInfluential') or r.get('is_influential'))

        ref_info = {
            'title': title or f"Work ({primary_key})",
            'year': ref_year,
            'venue': venue,
            'citationCount': cits,
            'authors': authors,
            'intents': intents,
            'isInfluential': is_influential,
            'url': primary_url,
            'pdf_url': pdf_url,
            'doi_url': doi_url,
            's2_url': s2_url,
            'scholar_url': scholar_url,
        }

        # Index under primary key and all available persistent identifier aliases
        fingerprint[primary_key] = ref_info
        if pid:
            fingerprint[f"pid:{pid}"] = ref_info
        if doi:
            fingerprint[f"doi:{doi}"] = ref_info
        if arx:
            fingerprint[f"arx:{arx}"] = ref_info
    return fingerprint


def _detect_paper_paradigm(paper):
    """
    Dynamically extracts the primary research focus/topic of a paper without hardcoded domain lists.
    Refined 3-Tier Universal Hierarchy (<0.001s Execution Time):
      1. Pre-computed Stage 4 KeyBERT Cluster Topic (Embedding-Grounded)
      2. Title-Case Multi-Word Grammatical Noun Phrase Pattern Extractor (Fast 0.001s Regex POS)
      3. Native S2 / OpenAlex Fields of Study Taxonomy Fallback
    """
    if not isinstance(paper, dict):
        return "General Research Topic"

    # --- TIER 1: Stage 4 KeyBERT Dynamic Cluster Topic (Primary - Instant 0.000s) ---
    topic_name = paper.get('topic_name') or paper.get('cluster_title') or paper.get('topic_title')
    if topic_name and str(topic_name).strip() and str(topic_name).lower() not in ("general topic cluster", "uncategorized"):
        raw_t = str(topic_name).strip()
        # Skip outlier / unclustered labels — fall through to Tier 2 for a real paradigm
        if any(skip in raw_t.lower() for skip in ("outlier", "unclustered", "cross-disciplinary", "uncategorized", "noise")):
            pass  # fall through to Tier 2
        else:
            parts = [p.strip() for p in raw_t.split(',') if p.strip()]
            first_part = parts[0]
            words = first_part.split()
            if len(words) > 6:
                candidate = " ".join(words[:6])
                # Safety: don't leave unclosed parentheses/brackets
                if candidate.count('(') > candidate.count(')'):
                    candidate += ')'
                if candidate.count('[') > candidate.count(']'):
                    candidate += ']'
                return candidate
            return first_part

    # --- TIER 2: Grammatical Title-Case Noun Pattern Extractor (Fast 0.001s) ---
    t_raw = (paper.get('title') or '').strip()
    tldr_raw = paper.get('tldr') or ''
    tldr_str = (tldr_raw.get('text', '') if isinstance(tldr_raw, dict) else str(tldr_raw or '')).strip()

    full_text = f"{t_raw}. {tldr_str}".strip()

    # 2a. Extract Title-Case Multi-Word Noun Phrases (e.g., "Federated Optimization", "Differential Privacy", "Gene Expression")
    title_phrases = re.findall(r'\b([A-Z][a-zA-Z0-9\-]*(?:\s+[A-Z][a-zA-Z0-9\-]+){1,3})\b', t_raw)
    academic_meta = {
        "paper", "study", "work", "propose", "present", "method", "model", "approach",
        "result", "framework", "system", "data", "using", "based", "novel", "new",
        "show", "demonstrate", "evaluate", "investigate", "performance", "analysis",
        "advances", "open", "problem", "problems", "challenge", "challenges", "future",
        "direction", "directions", "survey", "review", "overview", "taxonomy", "perspective"
    }

    for phrase in title_phrases:
        p_clean = phrase.strip()
        p_lower = p_clean.lower()
        if p_lower not in academic_meta and not any(meta in p_lower for meta in ["advances and", "open problems", "challenges and"]):
            if len(p_clean.split()) in (2, 3):
                return p_clean

    # 2b. High-Precision N-Gram Frequency Ranker across Title + TLDR
    words = re.findall(r'\b[a-zA-Z]{3,}\b', full_text)
    stopwords = set(ENGLISH_STOP_WORDS).union(academic_meta)
    filtered = [w for w in words if w.lower() not in stopwords]

    if len(filtered) >= 2:
        bigram_counts = Counter()
        for i in range(len(filtered) - 1):
            w1, w2 = filtered[i].lower(), filtered[i+1].lower()
            if w1 != w2:
                if w1 == "learning" and w2 == "deep":
                    bigram = "Deep Learning"
                elif w1 == "networks" and w2 == "neural":
                    bigram = "Neural Networks"
                elif w1 == "computing" and w2 == "edge":
                    bigram = "Edge Computing"
                else:
                    bigram = f"{w1.title()} {w2.title()}"
                bigram_counts[bigram] += 1

        if bigram_counts:
            return bigram_counts.most_common(1)[0][0]

    # --- TIER 3: S2 / OpenAlex Native Fields of Study Fallback (Instant 0.000s) ---
    fos = paper.get('s2_fields_of_study') or paper.get('s2FieldsOfStudy') or []
    if fos and isinstance(fos, list) and fos[0]:
        return str(fos[0]).title()

    venue = paper.get('venue') or ''
    if venue and len(venue) <= 45:
        return str(venue).strip()

    return "Foundational Methodology & Application"


def _categorize_shared_anchors(shared_refs_list):
    """
    Categorizes shared references into Methodological Lineage, Empirical Evidence & Data Resources,
    Literature Syntheses, and Seminal Prior Art.
    Designed for universal cross-disciplinary validity across Science, Technology, Law, Economics,
    Medicine, and Humanities.
    """
    empirical_resources, methodologies, syntheses, foundational = [], [], [], []

    # Universal Empirical Evidence & Data Resources (valid across Law, Econ, Bio, CS, Phys, Humanities)
    data_indicators = {
        "dataset", "database", "repository", "data set", "corpus", "biobank",
        "registry", "archive", "cohort", "benchmark", "compendium", "panel data"
    }

    # Universal Literature Syntheses & Systematic Reviews
    synthesis_indicators = {
        "systematic review", "meta-analysis", "literature review", "scoping review",
        "survey", "taxonomy", "treatise", "handbook", "comprehensive review", "perspective"
    }

    # High-Precision Methodological / Analytical Formulations
    # Strict exclusion of ambiguous polysemous words: 'model', 'network', 'system', 'approach', 'pipeline'
    methodology_indicators = {
        "methodology", "formulation", "estimation technique", "empirical framework",
        "experimental protocol", "analytical derivation", "optimization algorithm",
        "deep learning", "neural network", "transformer", "statistical framework",
        "econometric", "identification strategy", "diagnostic criteria"
    }

    for r in shared_refs_list:
        if not isinstance(r, dict): continue
        t = (r.get('title') or '').lower()
        name = (r.get('title') or 'Foundational Work').strip()
        year = r.get('year') or ''
        yr_str = f" ({year})" if year else ""
        item_str = f"'{name}'{yr_str}"

        cits = r.get('citationCount') or r.get('citation_count') or 0
        intents = [str(i).lower() for i in (r.get('intents') or [])]
        is_inf = bool(r.get('isInfluential'))

        # Rule 1: Neural 'methodology' intent OR explicit methodological formulation
        if "methodology" in intents or any(m in t for m in methodology_indicators):
            methodologies.append(item_str)
        # Rule 2: Empirical Data Resources, Benchmarks, Biobanks, Registries, Corpora
        elif any(d in t for d in data_indicators):
            empirical_resources.append(item_str)
        # Rule 3: Comprehensive Literature Syntheses, Systematic Reviews, Surveys
        elif any(s in t for s in synthesis_indicators):
            syntheses.append(item_str)
        # Rule 4: Seminal Prior Art (High citations / influential status)
        elif cits >= 250 or is_inf:
            foundational.append(item_str)
        else:
            foundational.append(item_str)

    return empirical_resources, methodologies, syntheses, foundational


def _synthesize_pair_relationship(selected_paper, companion_paper, shared_refs_list):
    """
    Synthesizes concise, high-insight scientific relationship points comparing
    domain paradigms and shared intellectual foundations across any field of research.
    """
    sel_para = _detect_paper_paradigm(selected_paper)
    comp_para = _detect_paper_paradigm(companion_paper)
    empirical_resources, methodologies, syntheses, foundational = _categorize_shared_anchors(shared_refs_list)

    points = []

    # 1. Research Scope & Paradigm Contrast / Convergence
    if sel_para != comp_para:
        points.append(
            f"&bull; <strong>Domain Divergence</strong>: The selected work focuses on <em>{sel_para}</em>, "
            f"whereas this companion investigation addresses <em>{comp_para}</em>."
        )
    else:
        points.append(
            f"&bull; <strong>Shared Focus Area</strong>: Both works contribute to <em>{sel_para}</em>, "
            f"addressing interrelated questions within this domain."
        )

    # 2. Shared Intellectual Heritage (Universal Cross-Disciplinary Phrasing)
    if methodologies:
        points.append(
            f"&bull; <strong>Shared Methodological Lineage</strong>: Both works build upon foundational methodology established in {', '.join(methodologies[:2])}."
        )
    if empirical_resources:
        points.append(
            f"&bull; <strong>Shared Empirical Foundation</strong>: Both investigations validate findings or evaluate on the {', '.join(empirical_resources[:2])} resource."
        )
    if syntheses:
        points.append(
            f"&bull; <strong>Comprehensive Literature Synthesis</strong>: Both works contextualize their scope within the overarching framework established by {', '.join(syntheses[:2])}."
        )
    if not (methodologies or empirical_resources or syntheses) and foundational:
        points.append(
            f"&bull; <strong>Seminal Prior Art</strong>: Both investigations branch from foundational prior art in {', '.join(foundational[:2])}."
        )

    relationship_html = "<br>".join(points)

    # 3. Why References Matter (Universal, Authoritative, Zero Backend Jargon)
    ref_count = len(shared_refs_list)
    if methodologies or empirical_resources:
        role_desc = "foundational methodology and standardized empirical resources"
    elif syntheses:
        role_desc = "established literature syntheses and taxonomic frameworks"
    else:
        role_desc = "seminal prior art cited across both investigations"

    why_key = (
        f"These {ref_count} reference(s) represent common prior art cited in the bibliographies of both works, "
        f"establishing shared grounding in {role_desc}."
    )

    return {
        'why_key': why_key,
        'relationship_text': relationship_html
    }

def _clean_leading_transition(sentence: str) -> str:
    """Strips awkward leading discourse transitions like 'Then,', 'Therefore,', 'Furthermore,'."""
    cleaned = re.sub(r'^(then|therefore|furthermore|moreover|however|thus|in addition|finally|next|subsequently),\s*', '', sentence.strip(), flags=re.IGNORECASE)
    if cleaned:
        cleaned = cleaned[0].upper() + cleaned[1:]
    return cleaned


def _is_background_opener(text: str) -> bool:
    """Detects if a sentence is a generic background/trend observation without specific paper contributions."""
    t_lower = text.lower()
    opener_patterns = [
        "in recent years", "recently,", "over the past", "with the rapid", "with the emergence",
        "is rapidly shifting", "has become", "has achieved", "plays a crucial role", "plays an important role",
        "has attracted", "has received significant attention", "due to the", "driven by the",
        "redefining how", "has emerged as", "is increasingly", "has gained"
    ]
    return any(p in t_lower for p in opener_patterns)


def _format_smart_paper_summary(paper: dict) -> str:
    """
    Global Abstract De-Fluffing & Action-Pairing Paper Summarizer:
    Guarantees that every paper card displays both the context AND the paper's actual action/scope/findings.
    Rejects vague background-only summaries.
    """
    if not isinstance(paper, dict):
        return "Paper summary unavailable."

    title = (paper.get('title') or '').strip()
    abstract = (paper.get('abstract') or '').strip()
    tldr_raw = paper.get('tldr') or ''
    tldr_text = (tldr_raw.get('text', '') if isinstance(tldr_raw, dict) else str(tldr_raw or '')).strip()

    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", abstract) if s.strip() and len(s.split()) >= 4]

    contrib_keywords = [
        "this narrative review", "this review", "we propose", "we introduce", "this paper presents",
        "this work presents", "we develop", "this work proposes", "in this paper", "we design",
        "we present", "this paper introduces", "our approach", "we demonstrate",
        "this paper considers", "we evaluate", "we explore", "integrates insights",
        "the purpose of this study", "the proposed", "proposed system", "proposed framework",
        "proposed approach", "this study aims", "we achieve", "achieves", "results show"
    ]

    contrib_sentence = None
    for s in sentences:
        s_lower = s.lower()
        if any(kw in s_lower for kw in contrib_keywords) and len(s.split()) >= 6:
            contrib_sentence = _clean_leading_transition(s.rstrip(".") + ".")
            break

    # Clean leading transitions
    if tldr_text:
        tldr_text = _clean_leading_transition(tldr_text)
    first_s = _clean_leading_transition(sentences[0].rstrip(".") + ".") if sentences else ""

    # Check if primary candidate (TLDR or sentence 1) is a generic background opener
    is_tldr_fluff = _is_background_opener(tldr_text) if tldr_text else False
    is_first_fluff = _is_background_opener(first_s) if first_s else False

    candidate_text = ""

    # Case 1: S2 TLDR is available and NOT a background opener
    if tldr_text and len(tldr_text.split()) >= 12 and not is_tldr_fluff:
        candidate_text = tldr_text.rstrip(".") + "."
        if contrib_sentence and contrib_sentence.lower() not in tldr_text.lower() and len(candidate_text.split()) <= 20:
            candidate_text = f"{candidate_text} {contrib_sentence}"

    # Case 2: Background Opener detected -> MUST pair with Action/Contribution sentence
    elif (is_tldr_fluff or is_first_fluff) and contrib_sentence:
        base_s = tldr_text if (tldr_text and len(tldr_text.split()) >= 10) else first_s
        if base_s and contrib_sentence.lower() not in base_s.lower():
            combined = f"{base_s.rstrip('.')} {contrib_sentence}"
            if len(combined.split()) <= 42:
                candidate_text = combined
            else:
                base_clean = base_s[:110].rstrip(',;:.')
                candidate_text = f"{base_clean}... {contrib_sentence}"
        else:
            candidate_text = contrib_sentence

    # Case 3: Standard Sentence Extraction
    elif first_s:
        if contrib_sentence and contrib_sentence.lower() != first_s.lower():
            combined = f"{first_s} {contrib_sentence}"
            candidate_text = combined if len(combined.split()) <= 40 else contrib_sentence
        elif len(sentences) >= 2:
            s2_clean = _clean_leading_transition(sentences[1].rstrip('.') + '.')
            combined = f"{first_s} {s2_clean}"
            candidate_text = combined if len(combined.split()) <= 40 else first_s
        else:
            candidate_text = first_s
    else:
        candidate_text = tldr_text or (f"This paper presents research on {title.lower().rstrip('.')}." if title else "Paper summary unavailable.")

    # Word Budgeting: Ensure summary has substance (at least 20 words)
    words = candidate_text.split()
    if len(words) < 20 and sentences:
        for s in sentences:
            s_clean = _clean_leading_transition(s.rstrip(".") + ".")
            if s_clean.lower() not in candidate_text.lower():
                proposed = f"{candidate_text} {s_clean}"
                if len(proposed.split()) <= 42:
                    candidate_text = proposed
                    words = candidate_text.split()
                if len(words) >= 22:
                    break

    # Hard cap at 42 words for visual balance
    words = candidate_text.split()
    if len(words) > 42:
        candidate_text = " ".join(words[:38]).rstrip(",;:") + "."

    return candidate_text






def _is_book_or_nonpaper(p):
    """
    Metadata-Driven Purifier Filter:
    Rejects actual books, textbooks, monographs, and non-paper press items.
    Scientometrically sound: does NOT reject peer-reviewed journals published by Wiley or Cambridge,
    and does NOT reject foundational tutorial papers (e.g. Hinton's Guide to RBMs, Kingma's Intro to VAE).
    """
    pub_types = [str(t).lower() for t in (p.get("publication_types") or p.get("publicationTypes") or [])]
    is_article = any(at in pub_types for at in ["journalarticle", "conference", "review", "preprint"])
    if is_article:
        return False

    venue = str(p.get("venue") or "").lower()
    title = str(p.get("title") or "").lower()
    abstract = str(p.get("abstract") or "").lower()
    tldr_val = p.get("tldr") or ""
    tldr = (tldr_val.get("text", "") if isinstance(tldr_val, dict) else str(tldr_val)).lower()

    if any(bt in pub_types for bt in ["book", "bookchapter", "editorial", "other", "collection"]):
        return True
    if any(bp in venue for bp in ["oreilly", "o'reilly", "springer book series", "crc press handbook"]):
        return True

    book_title_keywords = [
        "mastering bitcoin", "blueprint for", "handbook of", "monograph series",
        "textbook on", "series on volume", "edition volume"
    ]
    if any(kw in title for kw in book_title_keywords):
        return True

    book_text_keywords = [
        "this book ", "the book ", "this volume ", "this handbook ", "this monograph "
    ]
    if any(kw in abstract or kw in tldr for kw in book_text_keywords):
        return True

    return False

def compute_related_papers_intelligence(papers):
    # Pure Research Paper Purifier: Filter out non-paper items
    papers = [p for p in papers if not _is_book_or_nonpaper(p)]
    if not papers: return {'cards': [], 'milestones': []}

    # Use 'id' field (our format), fallback to 's2_paper_id'
    def _pid(p):
        return p.get('id') or p.get('s2_paper_id') or p.get('paperId') or ""

    fingerprints = {}
    fp_keys = {}
    for p in papers:
        pid = _pid(p)
        fp = _build_paper_ref_fingerprint(p)
        fingerprints[pid] = fp
        fp_keys[pid] = set(fp.keys())

    ref_to_pids = defaultdict(set)
    for p_id, fp in fingerprints.items():
        for t_key in fp.keys():
            ref_to_pids[t_key].add(p_id)

    topic_freq_map = {k: len(pids) for k, pids in ref_to_pids.items()}
    max_topic_freq = max(topic_freq_map.values()) if topic_freq_map else 1

    corpus_inflow_map = {}
    for p_id, fp in fingerprints.items():
        inflow = set()
        for t_key in fp.keys():
            inflow.update(ref_to_pids[t_key])
        inflow.discard(p_id)
        corpus_inflow_map[p_id] = len(inflow)

    import numpy as np
    cits_arr = np.array([p.get('citation_count') or p.get('citationCount') or 0 for p in papers], dtype=np.float32)
    inflow_arr = np.array([corpus_inflow_map.get(_pid(p), 0) for p in papers], dtype=np.float32)
    heritage_arr = np.array([len(fp_keys.get(_pid(p), set())) for p in papers], dtype=np.float32)

    log_cits = np.log10(cits_arr + 1.0)
    max_log_cits = float(np.max(log_cits)) if len(log_cits) and np.max(log_cits) > 0 else 1.0
    max_inflow = float(np.max(inflow_arr)) if len(inflow_arr) and np.max(inflow_arr) > 0 else 1.0
    max_heritage = float(np.max(heritage_arr)) if len(heritage_arr) and np.max(heritage_arr) > 0 else 1.0

    auth_arr = (0.40 * (log_cits / max_log_cits)) + (0.35 * (inflow_arr / max_inflow)) + (0.25 * (heritage_arr / max_heritage))
    for i, p in enumerate(papers):
        p['authority_score'] = float(auth_arr[i])

    sorted_by_auth = sorted(papers, key=lambda x: x.get('authority_score', 0), reverse=True)
    roadmap_papers = sorted_by_auth[:12]
    roadmap_papers = sorted(roadmap_papers, key=lambda x: (x.get('year') or 0, -x.get('authority_score', 0)))

    roadmap_ids = set()
    for i, p in enumerate(roadmap_papers):
        p['roadmap_order'] = i + 1
        roadmap_ids.add(_pid(p))

    paper_by_id = {_pid(p): p for p in papers}

    current_year = datetime.datetime.now().year

    cards = []
    for p in papers:
        p_id = _pid(p)
        cits = p.get('citation_count') or p.get('citationCount') or 0
        influential_cits = p.get('influential_citation_count') or p.get('influentialCitationCount') or 0
        year = p.get('year') or 0
        paper_age = max(1, current_year - year) if year > 0 else 1
        citation_velocity = cits / paper_age
        authority = p.get('authority_score', 0)
        inflow_count = corpus_inflow_map.get(p_id, 0)
        inflow_ratio = inflow_count / max(1, len(papers))

        # --- GATE 0: Hard Disqualifier ---
        # Low citation count or dormant velocity strictly disallows Foundation badge
        passes_hard_floor = (cits >= 25) and (citation_velocity >= 1.2 or cits >= 100)

        # --- ROUTE A: Global Pillar (Broad breakthrough) ---
        is_global_pillar = (cits >= 250 and (influential_cits >= 5 or cits >= 500))

        # --- ROUTE B: Domain Anchor (Core building block in this specific corpus) ---
        is_domain_anchor = (inflow_ratio >= 0.15 and authority >= 0.60 and cits >= 40)

        # --- ROUTE C: Proven Historic Classic (Stood test of time) ---
        is_historic_classic = (
            paper_age >= 8 and 
            cits >= 80 and 
            (influential_cits >= 5 or inflow_count >= 2 or authority >= 0.50)
        )

        is_foundation = passes_hard_floor and (is_global_pillar or is_domain_anchor or is_historic_classic)
        is_frontier = (year >= current_year - 2) and not is_foundation

        # Authors: list of plain strings in our format
        auth_list = p.get('authors') or []
        if auth_list and isinstance(auth_list[0], dict):
            author_str = ", ".join([a.get('name', '') for a in auth_list[:3]])
        else:
            author_str = ", ".join([str(a) for a in auth_list[:3]])
        if len(auth_list) > 3:
            author_str += " et al."

        # TLDR: Smart 2-Sentence Structured Paper Summary (Sentence-Complete)
        tldr_val = _format_smart_paper_summary(p)

        # Smart Action Button Resolution
        action_btn = _resolve_paper_action_button(p, p_id)
        # Universal Reference Status Evaluation
        ref_status = _get_universal_ref_status(p)

        card = {
            'id': p_id,
            'title': p.get('title', ''),
            'year': year,
            'authors': author_str,
            'venue': p.get('venue', '') or 'arXiv',
            'global_cits': cits,
            'ref_count': _get_paper_ref_count(p),
            'tldr': tldr_val,
            'arxiv_url': action_btn['url'],
            'action_label': action_btn['label'],
            'action_class': action_btn['btn_class'],
            'ref_status_label': ref_status['label'],
            'ref_status_class': ref_status['badge_class'],
            'ref_status_tooltip': ref_status['tooltip'],
            'ref_is_zero': ref_status['is_zero'],
            'authority_score': authority,
            'journey_foundation': is_foundation,
            'journey_frontier': is_frontier,
        }
        
        if card['journey_foundation']:
            card['badge_label'] = "🏛️ Foundation"
            card['badge_class'] = "foundation"
        elif card['journey_frontier']:
            card['badge_label'] = "🚀 Frontier"
            card['badge_class'] = "frontier"
        else:
            card['badge_label'] = "📄 Paper"
            card['badge_class'] = "standard"
            
        related = []
        p_fp = fingerprints.get(p_id, {})
        candidate_o_ids = set()
        for k in p_fp.keys():
            candidate_o_ids.update(ref_to_pids[k])
        candidate_o_ids.discard(p_id)

        # Top-K Candidate Pruning: Sort candidate companion papers by shared ref count first
        # Only evaluate the top 8 strongest connections instead of hundreds of weak pairs
        candidate_shared_counts = []
        p_keys_set = fp_keys.get(p_id, set())
        for other_id in candidate_o_ids:
            shared_keys = p_keys_set & fp_keys.get(other_id, set())
            if shared_keys:
                candidate_shared_counts.append((other_id, shared_keys, len(shared_keys)))

        # Keep only top 8 companions per card
        candidate_shared_counts.sort(key=lambda x: x[2], reverse=True)
        top_candidates = candidate_shared_counts[:8]

        for other_id, shared_keys, _ in top_candidates:
            other = paper_by_id.get(other_id)
            if not other:
                continue

            shared_refs_list = []
            for k in shared_keys:
                ref = p_fp[k]
                r_cits = ref['citationCount']
                r_year = ref['year']

                primacy = 1.0 if r_year <= 2018 else (0.5 if r_year <= 2021 else 0.2)
                score = (0.50 * (topic_freq_map[k] / max_topic_freq)) + \
                        (0.35 * (math.log10(r_cits + 1) / max_log_cits if max_log_cits else 0)) + \
                        (0.15 * primacy)

                shared_refs_list.append({
                    'title': ref['title'],
                    'year': r_year,
                    'venue': ref.get('venue', ''),
                    'citationCount': r_cits,
                    'url': ref['url'],
                    'pdf_url': ref.get('pdf_url', ''),
                    'doi_url': ref.get('doi_url', ''),
                    's2_url': ref.get('s2_url', ''),
                    'scholar_url': ref.get('scholar_url', ''),
                    'authors': ref['authors'],
                    'score': score
                })

            shared_refs_list.sort(key=lambda x: x['score'], reverse=True)

            # Authors for related paper
            o_auth_list = other.get('authors') or []
            if o_auth_list and isinstance(o_auth_list[0], dict):
                o_author_str = ", ".join([a.get('name', '') for a in o_auth_list[:2]])
            else:
                o_author_str = ", ".join([str(a) for a in o_auth_list[:2]])

            pair_rel = _synthesize_pair_relationship(p, other, shared_refs_list)

            related.append({
                'id': other_id,
                'title': other.get('title', ''),
                'authors': o_author_str,
                'venue': other.get('venue', '') or 'arXiv',
                'year': other.get('year', 0) or 0,
                'global_cits': other.get('citation_count') or other.get('citationCount') or 0,
                'shared_count': len(shared_refs_list),
                'shared_refs_list': shared_refs_list,
                'relationship': pair_rel['relationship_text'],
                'why_key': pair_rel['why_key'],
            })
            
        related.sort(key=lambda x: x['shared_count'], reverse=True)
        card['related_papers'] = related[:6]
        cards.append(card)
        
    milestones = []
    by_year = defaultdict(list)
    for c in cards:
        if c.get('year') and _is_english_text(c.get('title', '')):
            by_year[c['year']].append(c)
            
    for y in range(1997, 2027):
        if y in by_year:
            best = max(by_year[y], key=lambda x: x['global_cits'])
            milestones.append({
                'year': y,
                'paper': best
            })
            
    return {'cards': cards, 'milestones': milestones}


HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ResearchRadar | Citation Graph</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        :root {
            --bg: #07090e;
            --panel: #0d1117;
            --panel-elevated: #161b22;
            --text-main: #e6edf3;
            --text-muted: #8b949e;
            --border: #30363d;
            --accent: #58a6ff;
            --roadmap: #f0883e;
            --foundation: #8957e5;
            --frontier: #238636;
            --standard: #388bfd;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        body {
            background-color: var(--bg);
            color: var(--text-main);
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--bg);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--border);
            border-radius: 4px;
        }

        /* HEADER */
        header {
            height: 60px;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            padding: 0 24px;
            background-color: var(--panel);
            justify-content: space-between;
        }
        .brand {
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .tabs {
            display: flex;
            gap: 16px;
        }
        .tab-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 0.95rem;
            font-weight: 600;
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s;
        }
        .tab-btn:hover {
            color: var(--text-main);
            background: var(--panel-elevated);
        }
        .tab-btn.active {
            color: var(--accent);
            background: rgba(88, 166, 255, 0.1);
        }

        /* LAYOUT */
        .main-container {
            display: flex;
            flex: 1;
            height: calc(100vh - 60px);
        }

        .view-section {
            display: none;
            width: 100%;
            height: 100%;
        }
        .view-section.active {
            display: flex;
        }

        /* TIMELINE VIEW */
        #timeline-view {
            overflow-y: auto;
            padding: 40px;
            justify-content: center;
        }
        .timeline-container {
            max-width: 800px;
            width: 100%;
            position: relative;
        }
        .timeline-container::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--border);
        }
        .milestone-item {
            display: flex;
            margin-bottom: 30px;
            position: relative;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .milestone-item:hover {
            transform: translateX(5px);
        }
        .milestone-year-dot {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: var(--panel-elevated);
            border: 2px solid var(--accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.8rem;
            color: var(--accent);
            z-index: 2;
            flex-shrink: 0;
        }
        .milestone-card {
            margin-left: 20px;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            flex: 1;
        }
        .milestone-card h3 {
            font-size: 1.1rem;
            margin-bottom: 8px;
        }

        /* CONSTELLATION VIEW */
        /* Left Sidebar */
        .sidebar {
            width: 320px;
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            background: var(--panel);
        }
        .filters {
            padding: 16px;
            border-bottom: 1px solid var(--border);
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .filter-btn {
            background: var(--panel-elevated);
            border: 1px solid var(--border);
            color: var(--text-muted);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .filter-btn:hover {
            color: var(--text-main);
            border-color: var(--text-muted);
        }
        .filter-btn.active {
            background: var(--accent);
            color: #fff;
            border-color: var(--accent);
        }
        
        .paper-list {
            flex: 1;
            overflow-y: auto;
        }
        .list-item {
            padding: 16px;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            transition: background 0.2s;
        }
        .list-item:hover {
            background: var(--panel-elevated);
        }
        .list-item.active {
            border-left: 4px solid var(--accent);
            background: var(--panel-elevated);
        }
        .list-item-title {
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 6px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .list-item-meta {
            font-size: 0.8rem;
            color: var(--text-muted);
            display: flex;
            justify-content: space-between;
        }

        /* Center Canvas */
        .canvas-container {
            flex: 1;
            position: relative;
            background: var(--bg);
        }
        #webgl-canvas {
            width: 100%;
            height: 100%;
            display: block;
        }
        .scene-overlay {
            position: absolute;
            top: 20px;
            left: 20px;
            pointer-events: none;
            color: var(--text-muted);
            font-size: 0.85rem;
        }
        .node-label {
            position: absolute;
            background: rgba(13, 17, 23, 0.85);
            border: 1px solid var(--border);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            pointer-events: none;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            z-index: 10;
            display: none;
        }
        .node-label.visible {
            display: block;
        }
        .node-label.top-shared {
            border-color: rgba(63, 185, 80, 0.6);
            background: rgba(13, 25, 18, 0.95);
            box-shadow: 0 0 10px rgba(63, 185, 80, 0.25);
        }
        .rank-chip {
            display: inline-block;
            background: rgba(35, 134, 54, 0.35);
            color: #3fb950;
            border: 1px solid rgba(63, 185, 80, 0.5);
            font-size: 0.68rem;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 3px;
            margin-right: 5px;
        }

        /* Right Panel */
        .right-panel {
            width: 480px;
            min-width: 360px;
            max-width: 800px;
            border-left: 1px solid var(--border);
            background: var(--panel);
            display: flex;
            flex-direction: column;
            position: relative;
            user-select: text;
        }
        .panel-resizer-left {
            position: absolute;
            left: -4px;
            top: 0;
            bottom: 0;
            width: 8px;
            cursor: ew-resize;
            z-index: 50;
        }
        .panel-resizer-left:hover, .panel-resizer-left.dragging {
            background: rgba(88, 166, 255, 0.4);
        }
        .focus-section {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border);
            overflow-y: auto;
            flex-shrink: 0;
            max-height: 48%;
        }
        .vertical-splitter {
            height: 8px;
            background: var(--panel-elevated);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            cursor: ns-resize;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background 0.2s;
        }
        .vertical-splitter:hover, .vertical-splitter.dragging {
            background: rgba(88, 166, 255, 0.3);
        }
        .splitter-handle {
            width: 36px;
            height: 3px;
            background: var(--text-muted);
            border-radius: 2px;
            opacity: 0.6;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .badge.roadmap { background: rgba(240,136,62,0.15); color: var(--roadmap); }
        .badge.foundation { background: rgba(137,87,229,0.15); color: var(--foundation); }
        .badge.frontier { background: rgba(35,134,54,0.15); color: var(--frontier); }
        .badge.standard { background: rgba(56,139,253,0.15); color: var(--standard); }

        .focus-title {
            font-size: 1.3rem;
            line-height: 1.3;
            margin-bottom: 10px;
        }
        .focus-meta {
            font-size: 0.82rem;
            color: var(--text-muted);
            margin-bottom: 14px;
        }
        .focus-summary {
            background: var(--bg);
            border-left: 3px solid var(--accent);
            padding: 10px 12px;
            font-size: 0.85rem;
            line-height: 1.45;
            color: var(--text-muted);
            margin-bottom: 14px;
            border-radius: 0 4px 4px 0;
            max-height: 140px;
            overflow-y: auto;
        }
        .focus-stats {
            display: flex;
            gap: 16px;
            font-size: 0.82rem;
            margin-bottom: 14px;
        }
        .btn-pdf {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            color: #fff;
            text-decoration: none;
            padding: 9px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.88rem;
            transition: all 0.2s;
        }
        .btn-pdf-direct { background: #238636; }
        .btn-pdf-direct:hover { background: #2ea043; }
        .btn-pdf-doi { background: #1f6beb; }
        .btn-pdf-doi:hover { background: #388bfd; }
        .btn-pdf-scholar { background: #8957e5; }
        .btn-pdf-scholar:hover { background: #9e6aef; }
        .btn-pdf-book { background: #d29922; color: #0d1117; }
        .btn-pdf-book:hover { background: #e3b341; }
        .btn-pdf.disabled { background: var(--border); color: var(--text-muted); pointer-events: none; }

        .ref-status-badge {
            position: relative;
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            border-radius: 4px;
            padding: 2px 6px;
        }
        .ref-status-badge .tooltip-text {
            visibility: hidden;
            width: 260px;
            background-color: #161b22;
            color: #f0f6fc;
            text-align: left;
            border-radius: 6px;
            padding: 8px 12px;
            position: absolute;
            z-index: 100;
            bottom: 130%;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0 4px 16px rgba(0,0,0,0.6);
            border: 1px solid #30363d;
            font-size: 0.75rem;
            line-height: 1.4;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            white-space: normal;
            font-weight: 400;
        }
        .ref-status-badge:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
        .ref-status-early { background: rgba(137,87,229,0.15); color: #a5d6ff; border: 1px solid rgba(137,87,229,0.4); }
        .ref-status-landmark { background: rgba(240,136,62,0.15); color: #ffa657; border: 1px solid rgba(240,136,62,0.4); }
        .ref-status-paywall { background: rgba(210,153,34,0.15); color: #d29922; border: 1px solid rgba(210,153,34,0.4); }
        .ref-status-standard { background: rgba(56,139,253,0.1); color: var(--text-main); }

        .related-section {
            flex: 1;
            overflow-y: auto;
            padding: 20px 24px;
            background: var(--bg);
        }
        .related-header {
            font-size: 0.98rem;
            font-weight: 700;
            margin-bottom: 14px;
            display: flex;
            flex-direction: column;
        }
        .related-header span {
            font-size: 0.78rem;
            color: var(--text-muted);
            font-weight: 400;
            margin-top: 3px;
        }
        .related-card {
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            transition: border-color 0.2s;
        }
        .related-card:hover {
            border-color: rgba(88, 166, 255, 0.4);
        }
        .rel-title {
            font-size: 0.95rem;
            font-weight: 600;
            margin-bottom: 6px;
            cursor: pointer;
            color: var(--text-main);
            line-height: 1.35;
        }
        .rel-title:hover {
            color: var(--accent);
            text-decoration: underline;
        }
        .rel-meta {
            font-size: 0.78rem;
            color: var(--text-muted);
            margin-bottom: 8px;
        }
        .relationship-box {
            background: rgba(56, 139, 253, 0.07);
            border: 1px solid rgba(56, 139, 253, 0.25);
            border-radius: 6px;
            padding: 10px 12px;
            margin: 10px 0;
            font-size: 0.8rem;
            line-height: 1.5;
            color: #d0d7de;
        }
        .relationship-box strong {
            color: #58a6ff;
            font-weight: 600;
        }
        .relationship-box em {
            color: #7ee787;
            font-style: normal;
            font-weight: 600;
        }
        .relationship-header {
            font-weight: 700;
            font-size: 0.74rem;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .shared-badge {
            display: inline-flex;
            background: rgba(35,134,54,0.15);
            color: #3fb950;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 600;
            margin: 6px 0;
            cursor: pointer;
            align-items: center;
            gap: 6px;
            border: 1px solid rgba(63,185,80,0.4);
            transition: all 0.2s ease;
        }
        .shared-badge:hover {
            background: rgba(35,134,54,0.3);
            border-color: #3fb950;
        }
        
        .shared-refs-dropdown {
            display: none;
            margin-top: 10px;
            padding: 12px;
            background: var(--panel-elevated);
            border-radius: 6px;
            border: 1px solid var(--border);
        }
        .shared-refs-dropdown.open {
            display: block;
        }
        .why-key-box {
            background: rgba(46, 160, 67, 0.1);
            border: 1px solid rgba(46, 160, 67, 0.3);
            border-radius: 6px;
            padding: 10px 12px;
            margin-bottom: 12px;
            font-size: 0.78rem;
            line-height: 1.45;
            color: #7ee787;
        }
        .ref-item {
            font-size: 0.8rem;
            margin-bottom: 14px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ref-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .ref-title {
            color: var(--text-main);
            font-weight: 600;
            margin-bottom: 4px;
            line-height: 1.3;
        }
        .ref-meta {
            color: var(--text-muted);
            font-size: 0.75rem;
            margin-bottom: 6px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .ref-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 6px;
        }
        .ref-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.74rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.2s ease;
        }
        .ref-btn-pdf {
            background: rgba(35, 134, 54, 0.15);
            color: #3fb950;
            border: 1px solid rgba(63, 185, 80, 0.4);
        }
        .ref-btn-pdf:hover {
            background: rgba(35, 134, 54, 0.3);
        }
        .ref-btn-doi {
            background: rgba(88, 166, 255, 0.15);
            color: var(--accent);
            border: 1px solid rgba(88, 166, 255, 0.4);
        }
        .ref-btn-doi:hover {
            background: rgba(88, 166, 255, 0.3);
        }
        .ref-btn-s2 {
            background: rgba(56, 139, 253, 0.1);
            color: #a5d6ff;
            border: 1px solid rgba(56, 139, 253, 0.3);
        }
        .ref-btn-s2:hover {
            background: rgba(56, 139, 253, 0.25);
        }
        .ref-btn-scholar {
            background: rgba(137, 87, 229, 0.15);
            color: #d2a8ff;
            border: 1px solid rgba(137, 87, 229, 0.4);
        }
        .ref-btn-scholar:hover {
            background: rgba(137, 87, 229, 0.3);
        }

    </style>
</head>
<body>

    <header>
        <div class="brand">ResearchRadar | Citation Graph</div>
        <div class="tabs">
            <button class="tab-btn active" onclick="switchView('constellation')">3D Graph</button>
            <button class="tab-btn" onclick="switchView('timeline')">Timeline</button>
        </div>
    </header>

    <div class="main-container">
        <!-- TIMELINE VIEW -->
        <div id="timeline-view" class="view-section">
            <div class="timeline-container" id="timeline-container">
                <!-- Injected via JS -->
            </div>
        </div>

        <!-- CONSTELLATION VIEW -->
        <div id="constellation-view" class="view-section active">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="filters">
                    <button class="filter-btn active" onclick="setJourney('foundation', this)">🏛️ Foundations</button>
                    <button class="filter-btn" onclick="setJourney('frontier', this)">🚀 Frontier</button>
                    <button class="filter-btn" onclick="setJourney('all', this)">🔥 Top Cited</button>
                </div>
                <div class="paper-list" id="paper-list">
                    <!-- Injected via JS -->
                </div>
            </div>

            <!-- Canvas -->
            <div class="canvas-container" id="canvas-container">
                <div class="scene-overlay">
                    <p>Drag to rotate · Scroll to zoom · Click node to focus</p>
                </div>
                <div id="labels-container"></div>
                <canvas id="webgl-canvas"></canvas>
            </div>

            <!-- Right Panel -->
            <div class="right-panel" id="right-panel">
                <div class="panel-resizer-left" id="panel-resizer-left" title="Drag to resize panel width"></div>
                <div class="focus-section" id="focus-section">
                    <!-- Injected via JS -->
                </div>
                <div class="vertical-splitter" id="v-splitter" title="Drag to adjust top/bottom view height">
                    <div class="splitter-handle"></div>
                </div>
                <div class="related-section" id="related-section">
                    <div class="related-header">
                        🔗 Related Papers (Shared References)
                        <span>Connected via common foundations</span>
                    </div>
                    <div id="related-list">
                        <!-- Injected via JS -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const DATA = __DATA_JSON__;
        
        let currentFilter = 'foundation';
        let currentFocusId = null;
        let filteredPapers = [];
        
        // Three.js variables
        let scene, camera, renderer, raycaster, mouse;
        let nodes = [];
        let edges = [];
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let targetRotation = { x: 0, y: 0 };
        let currentRotation = { x: 0, y: 0 };
        
        // Colors mapping
        const COLORS = {
            foundation: 0x8957e5,
            frontier: 0x238636,
            standard: 0x388bfd
        };

        function init() {
            try {
                initThreeScene();
            } catch(e) {
                console.warn("WebGL initialization note:", e);
            }
            initSplitters();
            renderTimeline();
            renderSidebar('foundation');
            if (filteredPapers.length > 0) {
                selectPaper(filteredPapers[0].id);
            }
        }

        function initSplitters() {
            // Horizontal panel width resizer
            const panel = document.getElementById('right-panel');
            const resizerH = document.getElementById('panel-resizer-left');
            let isResizingH = false;

            if (resizerH && panel) {
                resizerH.addEventListener('mousedown', (e) => {
                    isResizingH = true;
                    resizerH.classList.add('dragging');
                    document.body.style.cursor = 'ew-resize';
                    e.preventDefault();
                });
            }

            // Vertical splitter between focus and related papers
            const focusSec = document.getElementById('focus-section');
            const resizerV = document.getElementById('v-splitter');
            let isResizingV = false;

            if (resizerV && focusSec && panel) {
                resizerV.addEventListener('mousedown', (e) => {
                    isResizingV = true;
                    resizerV.classList.add('dragging');
                    document.body.style.cursor = 'ns-resize';
                    e.preventDefault();
                });
            }

            window.addEventListener('mousemove', (e) => {
                if (isResizingH && panel) {
                    const newW = window.innerWidth - e.clientX;
                    if (newW >= 360 && newW <= window.innerWidth * 0.65) {
                        panel.style.width = newW + 'px';
                        onWindowResize();
                    }
                }
                if (isResizingV && focusSec && panel) {
                    const panelRect = panel.getBoundingClientRect();
                    const newH = e.clientY - panelRect.top;
                    if (newH >= 100 && newH <= panelRect.height - 120) {
                        focusSec.style.maxHeight = newH + 'px';
                        focusSec.style.height = newH + 'px';
                    }
                }
            });

            window.addEventListener('mouseup', () => {
                if (isResizingH) {
                    isResizingH = false;
                    if (resizerH) resizerH.classList.remove('dragging');
                    document.body.style.cursor = 'default';
                }
                if (isResizingV) {
                    isResizingV = false;
                    if (resizerV) resizerV.classList.remove('dragging');
                    document.body.style.cursor = 'default';
                }
            });
        }

        function switchView(view) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
            
            if (view === 'constellation') {
                document.querySelectorAll('.tab-btn')[0].classList.add('active');
                document.getElementById('constellation-view').classList.add('active');
                if (renderer) {
                    const container = document.getElementById('canvas-container');
                    renderer.setSize(container.clientWidth, container.clientHeight);
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                }
            } else {
                document.querySelectorAll('.tab-btn')[1].classList.add('active');
                document.getElementById('timeline-view').classList.add('active');
            }
        }

        function setJourney(type, btn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSidebar(type);
            if (filteredPapers.length > 0) {
                selectPaper(filteredPapers[0].id);
            }
        }

        function renderSidebar(type) {
            currentFilter = type;
            let list = DATA.cards;
            
            if (type === 'foundation') {
                list = list.filter(p => p.journey_foundation).sort((a, b) => (b.authority_score - a.authority_score) || (b.global_cits - a.global_cits) || (a.year - b.year));
            } else if (type === 'frontier') {
                list = list.filter(p => p.journey_frontier).sort((a, b) => (b.year - a.year) || (b.global_cits - a.global_cits));
            } else {
                list = [...list].sort((a, b) => b.global_cits - a.global_cits);
            }

            // Fallback: If filter returns 0 papers for this specific corpus, fallback to Top Cited so list is never empty
            if (!list || list.length === 0) {
                list = [...DATA.cards].sort((a, b) => b.global_cits - a.global_cits);
            }
            
            filteredPapers = list;
            
            const container = document.getElementById('paper-list');
            container.innerHTML = list.map(p => `
                <div class="list-item ${p.id === currentFocusId ? 'active' : ''}" onclick="selectPaper('${p.id}')" id="list-item-${p.id}">
                    <div class="list-item-title">${p.title}</div>
                    <div class="list-item-meta">
                        <span>${p.year} · ${p.venue}</span>
                        <span>🌐 ${p.global_cits.toLocaleString()}</span>
                    </div>
                </div>
            `).join('');
        }

        function selectPaper(pid) {
            currentFocusId = pid;
            
            // Update sidebar highlight
            document.querySelectorAll('.list-item').forEach(el => el.classList.remove('active'));
            const el = document.getElementById(`list-item-${pid}`);
            if (el) el.classList.add('active');
            
            const paper = DATA.cards.find(p => p.id === pid);
            if (!paper) return;
            
            let refHtml = paper.ref_is_zero
                ? `<span class="ref-status-badge ${paper.ref_status_class}">${paper.ref_status_label}<span class="tooltip-text">${paper.ref_status_tooltip}</span></span>`
                : `<span>${paper.ref_status_label}</span>`;
            
            // Render Right Panel
            document.getElementById('focus-section').innerHTML = `
                <div class="badge ${paper.badge_class}">${paper.badge_label}</div>
                <div class="focus-title">${paper.title}</div>
                <div class="focus-meta">${paper.authors} · ${paper.year} · ${paper.venue}</div>
                <div class="focus-summary">💡 ${paper.tldr || 'No summary available.'}</div>
                <div class="focus-stats">
                    <span>🌐 ${paper.global_cits.toLocaleString()} Citations</span>
                    ${refHtml}
                </div>
                <a href="${paper.arxiv_url}" target="_blank" class="${paper.action_class}">${paper.action_label}</a>
            `;
            
            const relContainer = document.getElementById('related-list');
            relContainer.innerHTML = paper.related_papers.map((r, i) => {
                let refsHtml = r.shared_refs_list.map(ref => {
                    let venueStr = ref.venue ? ` · 🏛️ ${ref.venue}` : '';
                    let citsStr = ref.citationCount ? ` · 🌐 ${ref.citationCount.toLocaleString()} Citations` : '';
                    
                    let actionBtns = [];
                    if (ref.pdf_url) actionBtns.push(`<a href="${ref.pdf_url}" target="_blank" class="ref-btn ref-btn-pdf">📄 Direct PDF</a>`);
                    if (ref.doi_url) actionBtns.push(`<a href="${ref.doi_url}" target="_blank" class="ref-btn ref-btn-doi">🔗 Official DOI</a>`);
                    if (ref.s2_url) actionBtns.push(`<a href="${ref.s2_url}" target="_blank" class="ref-btn ref-btn-s2">🌐 S2 Page</a>`);
                    if (ref.scholar_url) actionBtns.push(`<a href="${ref.scholar_url}" target="_blank" class="ref-btn ref-btn-scholar">🔍 Google Scholar</a>`);

                    return `
                    <div class="ref-item">
                        <div class="ref-title">${ref.title}</div>
                        <div class="ref-meta">
                            <span>${ref.authors ? ref.authors : 'Unknown Authors'} (${ref.year || 'N/A'})</span>
                            <span>${venueStr}${citsStr}</span>
                        </div>
                        <div class="ref-actions">
                            ${actionBtns.join('')}
                        </div>
                    </div>
                    `;
                }).join('');
                
                return `
                <div class="related-card">
                    <div class="rel-title" onclick="selectPaper('${r.id}')">${r.title}</div>
                    <div class="rel-meta">${r.authors} · ${r.venue} · ${r.year} · 🌐 ${r.global_cits.toLocaleString()} Citations</div>
                    
                    <div class="relationship-box">
                        <div class="relationship-header">🤝 Relationship with Selected Paper</div>
                        <div>${r.relationship}</div>
                    </div>

                    <div class="shared-badge" onclick="toggleSharedRefs(${i})">
                        🔗 Shares ${r.shared_count} References <span>▼</span>
                    </div>

                    <div class="shared-refs-dropdown" id="shared-refs-${i}">
                        <div class="why-key-box">
                            <div style="font-weight:700; margin-bottom:4px; display:flex; align-items:center; gap:4px;">
                                💡 Why These References Matter
                            </div>
                            <div>${r.why_key}</div>
                        </div>
                        ${refsHtml}
                    </div>
                </div>
                `;
            }).join('');
            
            // Update 3D Constellation
            if (scene) {
                updateConstellation(paper);
            }
            
            switchView('constellation');
        }

        function toggleSharedRefs(idx) {
            const el = document.getElementById(`shared-refs-${idx}`);
            if (el) el.classList.toggle('open');
        }

        function renderTimeline() {
            const container = document.getElementById('timeline-container');
            container.innerHTML = DATA.milestones.map(m => `
                <div class="milestone-item" onclick="selectPaper('${m.paper.id}')">
                    <div class="milestone-year-dot">${m.year}</div>
                    <div class="milestone-card">
                        <h3>${m.paper.title}</h3>
                        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:8px;">${m.paper.authors} · ${m.paper.venue} · 🌐 ${m.paper.global_cits}</div>
                        <div style="font-size:0.9rem;">${m.paper.tldr || ''}</div>
                    </div>
                </div>
            `).join('');
        }

        // --- Three.js Implementation ---

        function initThreeScene() {
            const container = document.getElementById('canvas-container');
            const canvas = document.getElementById('webgl-canvas');
            
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 25;
            
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();
            
            // Lights
            const ambient = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambient);
            const point = new THREE.PointLight(0xffffff, 1);
            point.position.set(10, 10, 10);
            scene.add(point);
            
            // Events
            canvas.addEventListener('mousedown', onMouseDown);
            canvas.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            canvas.addEventListener('wheel', onMouseWheel);
            window.addEventListener('resize', onWindowResize);
            canvas.addEventListener('click', onMouseClick);
            
            animate();
        }
        
        function onMouseDown(e) {
            isDragging = true;
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        }
        
        function onMouseMove(e) {
            // Raycasting for hover
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh));
            
            if (intersects.length > 0) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
            
            if (!isDragging) return;
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };
            
            targetRotation.y += deltaMove.x * 0.01;
            targetRotation.x += deltaMove.y * 0.01;
            
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        }
        
        function onMouseUp() {
            isDragging = false;
        }
        
        function onMouseWheel(e) {
            e.preventDefault();
            camera.position.z += e.deltaY * 0.01;
            camera.position.z = Math.max(10, Math.min(50, camera.position.z));
        }
        
        function onMouseClick(e) {
            if (isDragging && (Math.abs(targetRotation.y - currentRotation.y) > 0.05)) return;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh));
            if (intersects.length > 0) {
                const mesh = intersects[0].object;
                const node = nodes.find(n => n.mesh === mesh);
                if (node && node.id && node.id !== currentFocusId) {
                    selectPaper(node.id);
                }
            }
        }
        
        function onWindowResize() {
            const container = document.getElementById('canvas-container');
            if (!renderer) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        function createNode(size, colorHex, pos, id, title, isCenter=false, rankTag="", sharedCount=0) {
            const geom = new THREE.SphereGeometry(size, 32, 32);
            const mat = new THREE.MeshPhongMaterial({
                color: colorHex,
                emissive: colorHex,
                emissiveIntensity: isCenter ? 0.5 : (rankTag ? 0.35 : 0.2),
                transparent: true,
                opacity: 0
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.copy(pos);
            scene.add(mesh);
            
            // Add aura for center
            if (isCenter) {
                const auraGeom = new THREE.SphereGeometry(size * 1.5, 32, 32);
                const auraMat = new THREE.MeshBasicMaterial({
                    color: colorHex,
                    transparent: true,
                    opacity: 0
                });
                const aura = new THREE.Mesh(auraGeom, auraMat);
                mesh.add(aura);
            }
            
            // Subtle 1px accent outline ring for top-3 nodes sharing >3 key references
            let ring = null;
            if (rankTag) {
                const ringGeom = new THREE.RingGeometry(size * 1.35, size * 1.45, 48);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: 0x3fb950,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.85
                });
                ring = new THREE.Mesh(ringGeom, ringMat);
                mesh.add(ring);
            }
            
            nodes.push({ mesh, id, title, targetOpacity: 1, isCenter, rankTag, sharedCount, ring });
        }
        
        function createEdge(startPos, endPos, weight) {
            const points = [startPos, endPos];
            const geom = new THREE.BufferGeometry().setFromPoints(points);
            const mat = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0,
                linewidth: weight
            });
            const line = new THREE.Line(geom, mat);
            scene.add(line);
            edges.push({ line, targetOpacity: Math.min(0.8, weight * 0.15) });
        }

        function updateConstellation(paper) {
            if (!scene) return;
            
            // Clear previous scene elements
            nodes.forEach(n => scene.remove(n.mesh));
            edges.forEach(e => scene.remove(e.line));
            nodes = [];
            edges = [];
            
            // Reset rotation
            targetRotation = {x: 0, y: 0};
            currentRotation = {x: 0, y: 0};
            scene.rotation.set(0,0,0);
            
            // Create center
            const centerColor = COLORS[paper.badge_class] || COLORS.standard;
            createNode(1.5, centerColor, new THREE.Vector3(0,0,0), paper.id, paper.title, true);
            
            // Create satellites using fibonacci sphere
            const nSat = paper.related_papers ? paper.related_papers.length : 0;
            const radius = 8;
            
            // Identify Top 3 papers that strictly have > 3 key references
            const highShared = (paper.related_papers || []).filter(r => r.shared_count > 3);
            const rankMap = {};
            highShared.slice(0, 3).forEach((r, idx) => {
                rankMap[r.id] = `#${idx + 1} Shared`;
            });

            (paper.related_papers || []).forEach((rel, i) => {
                const phi = Math.acos(1 - 2 * (i + 0.5) / (nSat || 1));
                const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
                
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                const pos = new THREE.Vector3(x, y, z);
                const rankTag = rankMap[rel.id] || "";
                const relColor = rankTag ? 0x2ea043 : COLORS.standard;
                createNode(0.8, relColor, pos, rel.id, rel.title, false, rankTag, rel.shared_count);
                createEdge(new THREE.Vector3(0,0,0), pos, rel.shared_count);
            });
        }

        function updateLabels() {
            const container = document.getElementById('labels-container');
            container.innerHTML = '';
            
            const canvasRect = renderer.domElement.getBoundingClientRect();
            
            nodes.forEach(node => {
                if (node.mesh.material.opacity < 0.1) return;
                
                // Project 3D position to 2D
                const pos = node.mesh.position.clone();
                // apply scene rotation
                pos.applyEuler(scene.rotation);
                pos.project(camera);
                
                if (pos.z > 1) return; // behind camera
                
                const x = (pos.x * .5 + .5) * canvasRect.width;
                const y = (pos.y * -.5 + .5) * canvasRect.height;
                
                const label = document.createElement('div');
                label.className = `node-label visible ${node.rankTag ? 'top-shared' : ''}`;
                label.style.left = `${x}px`;
                label.style.top = `${y + (node.isCenter ? 30 : 20)}px`;
                
                let truncTitle = node.title.length > 30 ? node.title.substring(0, 30) + '...' : node.title;
                if (node.rankTag) {
                    label.innerHTML = `<span class="rank-chip">${node.rankTag} (${node.sharedCount} refs)</span><strong>${truncTitle}</strong>`;
                } else {
                    label.innerHTML = `<strong>${truncTitle}</strong>`;
                }
                container.appendChild(label);
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            
            // Lerp rotation
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
            
            scene.rotation.x = currentRotation.x;
            scene.rotation.y = currentRotation.y;
            
            // Lerp opacity and orient rings
            nodes.forEach(n => {
                n.mesh.material.opacity += (n.targetOpacity - n.mesh.material.opacity) * 0.1;
                if (n.isCenter && n.mesh.children[0]) {
                    n.mesh.children[0].material.opacity = n.mesh.material.opacity * 0.3;
                }
                if (n.ring) {
                    n.ring.quaternion.copy(camera.quaternion);
                }
            });
            edges.forEach(e => {
                e.line.material.opacity += (e.targetOpacity - e.line.material.opacity) * 0.1;
            });
            
            renderer.render(scene, camera);
            updateLabels();
        }

        window.onload = init;
    </script>
</body>
</html>"""

def render_related_papers_app(data: dict, out_path: Path) -> Path:
    """Render the standalone HTML application."""
    data_json = json.dumps(data, ensure_ascii=False)
    html = HTML_TEMPLATE.replace("__DATA_JSON__", data_json)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding="utf-8")
    return out_path


def run_stage5(
    papers: list[dict],
    out_dir: str | Path = "data/output",
    corpus_path: str | Path | None = None,
) -> dict:
    """
    Executes Stage 5: 3D Constellation Graph & Guided Research Pathway Engine.
    """
    t0 = time.time()
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print("\n" + "=" * 70)
    print("  STAGE 5: 3D CONSTELLATION GRAPH & CITATION INTELLIGENCE")
    print("=" * 70)

    # Automatically load Stage 4 Topic Results if present in out_dir
    topics_file = out_dir / "topic_results.json"
    if topics_file.exists():
        try:
            topics_data = json.loads(topics_file.read_text(encoding="utf-8"))
            # FIX: topic_results.json uses "paper_to_topic" ({paper_id: topic_int})
            # and "human_readable_names" ({topic_int: label}).
            # The old code read topics_data.get("topics", []) — that key does NOT exist.
            p2t = topics_data.get("paper_to_topic") or {}
            hrn = topics_data.get("human_readable_names") or {}
            for p in papers:
                pid = p.get("id") or p.get("s2_paper_id") or p.get("paperId")
                if pid and pid in p2t:
                    topic_id = p2t[pid]
                    p["topic_name"] = hrn.get(str(topic_id)) or hrn.get(topic_id) or f"Topic {topic_id}"
        except Exception:
            pass

    intel_data = compute_related_papers_intelligence(papers)

    # Save structured JSON stats
    stats_path = out_dir / "related_papers_stats.json"
    summary = {
        "total_papers": len(papers),
        "total_cards": len(intel_data.get("cards", [])),
        "total_milestones": len(intel_data.get("milestones", [])),
    }
    stats_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")

    citation_data_path = out_dir / "citation_data.json"
    citation_data_path.write_text(json.dumps(intel_data, indent=2, ensure_ascii=False), encoding="utf-8")

    # Render HTML application
    html_path = out_dir / "citation_graph.html"
    render_related_papers_app(intel_data, html_path)

    elapsed = time.time() - t0
    print(f"  Total Papers Analyzed     : {len(papers)}")
    print(f"  Connection Engine         : 3D Constellation + Shared Foundation Scoring")
    print(f"  Citation Graph Application : {html_path} ({elapsed:.2f}s)\n")

    return intel_data


def main():
    parser = argparse.ArgumentParser(description="ResearchRadar Stage 5: 3D Constellation Graph")
    parser.add_argument("--papers", default="data/papers.json", help="Path to papers.json")
    parser.add_argument("--topics", default="data/output/topic_results.json", help="Path to topic_results.json")
    parser.add_argument("--out", default="data/output", help="Output directory")
    args = parser.parse_args()

    papers_path = Path(args.papers)
    if not papers_path.exists():
        print(f"Error: {papers_path} not found.")
        return

    papers = json.loads(papers_path.read_text(encoding="utf-8"))
    run_stage5(papers, out_dir=args.out)


if __name__ == "__main__":
    main()

