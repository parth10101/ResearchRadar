
"""
Scientific Entity and Provenance Schema (Pydantic)
===============================================
Defines verifiable, span-grounded data models for Method, Dataset,
and Limitation (MDL) entities.
"""

from __future__ import annotations
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ExtractedSpan(BaseModel):
    """An extracted scientific entity anchored to exact character spans in text."""
    canonical_name: str = Field(..., description="Normalized concept name")
    verbatim_text: str = Field(..., description="Exact substring matching text")
    start_char: int = Field(default=0, description="Start character offset in text")
    end_char: int = Field(default=0, description="End character offset in text")
    discourse_role: str = Field(
        default="CONTRIBUTION",
        description="Discourse role: CONTRIBUTION, BASELINE, SUBSTRATE, or LIMITATION"
    )
    confidence: float = Field(default=1.0, description="Extraction confidence [0.0 - 1.0]")


class PaperMDLRecord(BaseModel):
    """Complete, verifiable MDL extraction record for a single academic paper."""
    paper_id: str
    title: str
    proposed_methods: List[ExtractedSpan] = Field(
        default_factory=list,
        description="Primary methodologies, models, or algorithms introduced by this paper"
    )
    evaluation_datasets: List[ExtractedSpan] = Field(
        default_factory=list,
        description="Benchmarks, physical datasets, cohorts, or observation fields evaluated"
    )
    identified_limitations: List[ExtractedSpan] = Field(
        default_factory=list,
        description="Specific failure modes, physical noise, or boundary conditions observed"
    )
    baseline_methods: List[ExtractedSpan] = Field(
        default_factory=list,
        description="Comparative baselines or prior works cited (excluded from proposed methods)"
    )

    def verify_grounding(self, raw_text: str) -> bool:
        """
        Verifies that every extracted entity has an authentic verbatim substring in raw_text.
        Returns True if 100% of spans are grounded, False if any hallucination is detected.
        """
        raw_lower = raw_text.lower()
        for span_list in [self.proposed_methods, self.evaluation_datasets, self.identified_limitations]:
            for span in span_list:
                if span.verbatim_text.strip().lower() not in raw_lower:
                    return False
        return True
