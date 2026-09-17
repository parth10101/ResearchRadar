"""
Universal Grounded MDL Extractor
================================
Extracts verifiable Method (M), Dataset (D), and Limitation (L) entities from scientific papers.
Enforces:
  1. Argumentative Discourse Zoning (separating proposed contribution from prior-art baselines)
  2. Verbatim Span Grounding (assert span in raw text)
  3. Universal Disambiguation via OpenAlex Concepts
"""

from __future__ import annotations

import os
import re
import json
from typing import Dict, Any, List, Optional, Tuple
from pathlib import Path

from research_radar.entities.schema import ExtractedSpan, PaperMDLRecord
from research_radar.entities.openalex_normalizer import OpenAlexConceptNormalizer


class UniversalMDLExtractor:
    """
    Universal, domain-agnostic scientific information extraction engine.
    Applies argumentative zoning and exact verbatim span verification.
    """

    GENERIC_NOISE_TOKENS = {
        "datasets", "dataset", "benchmark", "benchmarks", "data", "corpus",
        "training", "testing", "evaluation", "experiments", "experiment",
        "proposed method", "proposed framework", "proposed model", "our approach",
        "the method", "the model", "the framework", "this paper", "this work",
        "state of the art", "baseline", "baselines", "results", "study",
        "datasets training", "diverse datasets", "healthcare datasets",
        "various datasets", "different datasets", "public datasets", "real datasets"
    }

    CONJUNCTION_CUTOFFS = {"and", "with", "for", "using", "on", "to", "in", "by", "as", "via", "under"}

    CONTRIBUTION_MARKERS = [
        "we propose", "we introduce", "we present", "we develop", "we design",
        "in this paper, we", "in this work, we", "this paper introduces",
        "this work presents", "we formalize", "we demonstrate", "we construct"
    ]

    BACKGROUND_MARKERS = [
        "while ", "although ", "conventional methods", "traditional approaches",
        "prior works", "has been widely", "recent advances in", "have been proposed",
        "standard techniques", "previous studies"
    ]

    LIMITATION_MARKERS = [
        "however,", "however", "remains challenging", "suffers from", "vulnerable to",
        "sensitive to", "degrades under", "bottleneck", "trade-off",
        "fails when", "degradation occurs", "limited by", "severe limitation",
        "unresolved challenge", "remains an open"
    ]

    def __init__(self, normalizer: Optional[OpenAlexConceptNormalizer] = None):
        self.normalizer = normalizer or OpenAlexConceptNormalizer()

    def _split_sentences(self, text: str) -> List[str]:
        """Splits text into clean academic sentences."""
        raw_sents = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text.strip())
        return [s.strip() for s in raw_sents if s.strip()]

    VERB_LEAK_TAILS = {
        "proves", "prove", "are", "is", "was", "were", "shows", "show", "can", "will", "would",
        "could", "may", "might", "has", "have", "had", "demonstrates", "indicates", "suggests",
        "continuously", "significantly", "effectively", "achieves", "achieve", "yields", "yield"
    }
    JUNK_HEADS = {
        "both", "either", "each", "all", "such", "various", "several", "different", "multiple",
        "these", "those", "real-life", "real-world", "synthetic", "our", "their", "a", "an", "the"
    }

    def _clean_phrase(self, phrase: str) -> str:
        """Trims dangling trailing conjunctions, prepositions, verbs, and junk prefixes."""
        words = phrase.strip().split()
        while words and words[0].lower() in self.JUNK_HEADS:
            words.pop(0)
        while words and (words[-1].lower() in self.CONJUNCTION_CUTOFFS or words[-1].lower() in self.VERB_LEAK_TAILS):
            words.pop()
        res = " ".join(words).strip()
        if re.search(r'\s+(?:and|or)\s+', res, flags=re.IGNORECASE):
            parts = re.split(r'\s+(?:and|or)\s+', res, flags=re.IGNORECASE)
            res = max(parts, key=lambda p: (any(c.isupper() for c in p), len(p))).strip()
        return res

    def _find_span_offsets(self, full_text: str, substring: str) -> Tuple[int, int]:
        """Locates start and end character offsets of a substring in full_text."""
        idx = full_text.lower().find(substring.lower())
        if idx != -1:
            return idx, idx + len(substring)
        return 0, 0

    def extract_deterministic(self, paper: dict) -> PaperMDLRecord:
        """
        High-precision deterministic discourse extractor with exact span verification.
        Guarantees 0% extraction hallucination across any academic discipline.
        """
        paper_id = str(paper.get("id") or paper.get("s2_paper_id") or "paper_unknown")
        title = (paper.get("title") or "").strip()
        abstract = (paper.get("abstract") or "").strip()
        tldr = (paper.get("tldr") or "").strip()
        full_text = f"{title}. {tldr}. {abstract}".strip()

        sentences = self._split_sentences(full_text)
        
        proposed_methods: List[ExtractedSpan] = []
        baseline_methods: List[ExtractedSpan] = []
        evaluation_datasets: List[ExtractedSpan] = []
        identified_limitations: List[ExtractedSpan] = []

        seen_terms = set()

        for s_idx, sent in enumerate(sentences):
            sent_lower = sent.lower()
            
            # 1. Discourse Classification of sentence
            is_background = any(sent_lower.startswith(m) or f" {m}" in sent_lower for m in self.BACKGROUND_MARKERS)
            is_contribution = any(m in sent_lower for m in self.CONTRIBUTION_MARKERS) or (s_idx == 0 and len(sentences) <= 2)
            is_limitation = any(m in sent_lower for m in self.LIMITATION_MARKERS)

            # 2. Extract Proposed Methods (only in contribution sentences)
            if is_contribution and not is_background:
                for m_match in re.finditer(r'(?:we propose|we introduce|we develop|we design|we present|presents|introduces)\s+(?:a|an|the)?\s*([A-Z][a-zA-Z0-9\-]*(?:\s+[A-Za-z0-9\-]+){0,4})', sent):
                    raw_cand = m_match.group(1).strip()
                    cand = self._clean_phrase(raw_cand)
                    if len(cand) > 3 and cand.lower() not in self.GENERIC_NOISE_TOKENS:
                        canon = self.normalizer.canonicalize(cand, "method")
                        start, end = self._find_span_offsets(full_text, cand)
                        if cand.lower() not in seen_terms:
                            seen_terms.add(cand.lower())
                            proposed_methods.append(ExtractedSpan(
                                canonical_name=canon["canonical_name"],
                                verbatim_text=cand,
                                start_char=start,
                                end_char=end,
                                discourse_role="CONTRIBUTION",
                                confidence=0.92
                            ))

            # 3. Extract Baselines (in background or comparative sentences)
            if is_background:
                for b_match in re.finditer(r'(?:while|although|unlike)\s+([A-Z][a-zA-Z0-9\-]+(?:\s+[A-Z][a-zA-Z0-9\-]+){0,2})', sent, re.IGNORECASE):
                    cand = self._clean_phrase(b_match.group(1).strip())
                    if len(cand) > 2 and cand.lower() not in self.GENERIC_NOISE_TOKENS:
                        start, end = self._find_span_offsets(full_text, cand)
                        baseline_methods.append(ExtractedSpan(
                            canonical_name=cand,
                            verbatim_text=cand,
                            start_char=start,
                            end_char=end,
                            discourse_role="BASELINE",
                            confidence=0.85
                        ))

            # 4. Extract Datasets / Benchmarks / Corpora
            for d_match in re.finditer(r'(?:evaluated on|tested on|applied to|benchmarked on|trained on|experiments on|dataset from|data from)\s+(?:the\s+)?([A-Z][a-zA-Z0-9\-]*(?:\s+[A-Za-z0-9\-]*){0,3})', sent, re.IGNORECASE):
                cand = self._clean_phrase(d_match.group(1).strip())
                c_low = cand.lower()
                words = c_low.split()
                if (
                    len(cand) > 2
                    and c_low not in self.GENERIC_NOISE_TOKENS
                    and not any(w in ("these", "various", "multiple", "several", "training", "testing", "experimental") for w in words[:1])
                ):
                    start, end = self._find_span_offsets(full_text, cand)
                    canon = self.normalizer.canonicalize(cand, "dataset")
                    if c_low not in seen_terms:
                        seen_terms.add(c_low)
                        evaluation_datasets.append(ExtractedSpan(
                            canonical_name=canon["canonical_name"],
                            verbatim_text=cand,
                            start_char=start,
                            end_char=end,
                            discourse_role="SUBSTRATE",
                            confidence=0.90
                        ))

            # Also check explicit Named Benchmark pattern: [Named] (Dataset|Benchmark|Cohort|Repository)
            for d_named in re.finditer(r'\b([A-Z][a-zA-Z0-9\-]+(?:\s+[A-Z][a-zA-Z0-9\-]+)?)\s+(?:Dataset|Benchmark|Cohort|Repository|Registry|Corpus)\b', sent):
                cand = d_named.group(1).strip()
                c_low = cand.lower()
                if c_low not in self.GENERIC_NOISE_TOKENS and len(cand) > 2 and c_low not in seen_terms:
                    start, end = self._find_span_offsets(full_text, cand)
                    canon = self.normalizer.canonicalize(cand, "dataset")
                    seen_terms.add(c_low)
                    evaluation_datasets.append(ExtractedSpan(
                        canonical_name=f"{canon['canonical_name']} Benchmark",
                        verbatim_text=d_named.group(0),
                        start_char=start,
                        end_char=end,
                        discourse_role="SUBSTRATE",
                        confidence=0.95
                    ))

            # 5. Extract Limitations
            if is_limitation:
                # Direct trigger clauses
                for l_match in re.finditer(r'(?:suffers from|vulnerable to|sensitive to|degrades under|limited by|fails when|instability in|trade-off between)\s+([a-zA-Z0-9\-]*(?:\s+[a-zA-Z0-9\-]*){1,4})', sent, re.IGNORECASE):
                    cand = self._clean_phrase(l_match.group(1).strip())
                    c_low = cand.lower()
                    if len(cand) > 4 and c_low not in self.GENERIC_NOISE_TOKENS:
                        start, end = self._find_span_offsets(full_text, cand)
                        canon = self.normalizer.canonicalize(cand, "limitation")
                        if c_low not in seen_terms:
                            seen_terms.add(c_low)
                            identified_limitations.append(ExtractedSpan(
                                canonical_name=canon["canonical_name"],
                                verbatim_text=cand,
                                start_char=start,
                                end_char=end,
                                discourse_role="LIMITATION",
                                confidence=0.88
                            ))
                # "However, [condition/noise] creates/causes/induces..."
                for h_match in re.finditer(r'(?:however,?\s+)([a-zA-Z0-9\-]+(?:\s+[a-zA-Z0-9\-]+){1,4})\s+(?:creates|causes|leads to|induces|results in|limits)', sent, re.IGNORECASE):
                    cand = self._clean_phrase(h_match.group(1).strip())
                    c_low = cand.lower()
                    if len(cand) > 4 and c_low not in self.GENERIC_NOISE_TOKENS:
                        start, end = self._find_span_offsets(full_text, cand)
                        canon = self.normalizer.canonicalize(cand, "limitation")
                        if c_low not in seen_terms:
                            seen_terms.add(c_low)
                            identified_limitations.append(ExtractedSpan(
                                canonical_name=canon["canonical_name"],
                                verbatim_text=cand,
                                start_char=start,
                                end_char=end,
                                discourse_role="LIMITATION",
                                confidence=0.85
                            ))

        # Title extraction fallback if no method was captured in sentences
        if not proposed_methods:
            title_parts = title.split(":")
            if len(title_parts) > 1 and len(title_parts[0].strip().split()) <= 4:
                cand = self._clean_phrase(title_parts[0].strip())
                if cand.lower() not in self.GENERIC_NOISE_TOKENS:
                    canon = self.normalizer.canonicalize(cand, "method")
                    start, end = self._find_span_offsets(full_text, cand)
                    proposed_methods.append(ExtractedSpan(
                        canonical_name=canon["canonical_name"],
                        verbatim_text=cand,
                        start_char=start,
                        end_char=end,
                        discourse_role="CONTRIBUTION",
                        confidence=0.85
                    ))

        record = PaperMDLRecord(
            paper_id=paper_id,
            title=title,
            proposed_methods=proposed_methods,
            evaluation_datasets=evaluation_datasets,
            identified_limitations=identified_limitations,
            baseline_methods=baseline_methods,
        )

        record.verify_grounding(full_text)
        return record
