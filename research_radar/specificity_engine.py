"""
Specificity Engine
==================
Calculates the operational epistemic depth of research gap candidates to prevent
Category Collapse and False Novelty from broad combinatorial buzzwords.

Enforces:
    S(G) = w_T * S(T) + w_M * S(M) + w_D * S(D) + w_C * S(C) >= 0.70
"""

from __future__ import annotations

import re
from typing import Dict, Any, Tuple


class SpecificityEngine:
    """
    Evaluates the specificity and scientific operationalization of research gap candidates.
    Distinguishes between broad umbrella categories (e.g., 'Object Detection', 'Landsat', 'Cloud Cover')
    and concrete, testable experimental hypotheses.
    """

    # -----------------------------------------------------------------------
    # 1. Tier 0 / Tier 1 Buzzword & Umbrella Terms (Vagueness Penalty)
    # -----------------------------------------------------------------------
    BROAD_TASK_PATTERNS = re.compile(
        r'^(?:object detection|classification|segmentation|prediction|deep learning|'
        r'machine learning|detection|analysis|computer vision|recognition|processing|'
        r'identification|monitoring|modeling)$',
        re.IGNORECASE
    )

    BROAD_METHOD_PATTERNS = re.compile(
        r'^(?:cnn|cnns|svm|random forest|mlp|neural network|neural networks|deep model|'
        r'deep learning|machine learning|algorithm|model|framework|approach|system|'
        r'transformer|transformers|baseline|proposed method|vit|yolo)$',
        re.IGNORECASE
    )

    BROAD_DATASET_PATTERNS = re.compile(
        r'^(?:landsat|sentinel|satellite|remote sensing|satellite data|imagery|'
        r'dataset|benchmark|corpus|data|images|point cloud|tabular data)$',
        re.IGNORECASE
    )

    BROAD_CONSTRAINT_PATTERNS = re.compile(
        r'^(?:cloud cover|clouds|atmospheric correction|weather|noise|lighting|'
        r'occlusion|missing data|low resolution|scale|efficiency|speed|latency|limitation)$',
        re.IGNORECASE
    )

    # -----------------------------------------------------------------------
    # 2. Operational Precision Markers (Increases Specificity)
    # -----------------------------------------------------------------------
    OPERATIONAL_TASK_QUALIFIERS = [
        "rotated", "oriented", "small-target", "sub-pixel", "maritime", "vessel",
        "building footprint", "canopy height", "biophysical", "land surface temperature",
        "surface reflectance", "super-resolution", "change detection", "damage assessment",
        "panchromatic sharpening", "thermal anomaly", "wildfire boundary",
        "quantum", "qubit", "decoherence", "mitigation", "error correction",
        "estimator", "panel data", "staggered", "treatment effect", "heterogeneity",
        "cleavage", "editing", "expression", "sequencing", "genomic", "proteomic",
        "perovskite", "photovoltaic", "bandgap", "synthesis", "molecular", "spectroscopy"
    ]

    OPERATIONAL_METHOD_QUALIFIERS = [
        "feature pyramid", "fpn", "roi-transformer", "oriented reppoints", "anchor-free",
        "swin", "deformable detr", "cross-attention", "masked autoencoder", "dual-stream",
        "spatio-temporal", "contrastive learning", "siamese", "residual attention",
        "graph convolutional", "physics-informed", "kalman filter", "synthetic aperture",
        "surface code", "virtual purification", "zero-noise", "dynamical decoupling",
        "difference-in-differences", "two-way fixed effects", "instrumental variable",
        "base editor", "prime editor", "crispr-cas", "guide rna", "density functional",
        "sparse autoencoder", "mechanistic interpretability", "reinforcement learning"
    ]

    OPERATIONAL_DATASET_QUALIFIERS = [
        "oli-2", "oli", "tirs", "tirs-2", "level-1c", "level-2a", "boa", "toa",
        "surface reflectance", "top-of-atmosphere", "band 9", "cirrus band", "10m", "15m", "30m",
        "slc", "grd", "insar", "interferogram", "pol-sar", "alos-2", "palsar", "modis mod11",
        "ibm falcon", "sycamore", "rigetti", "quantum processor",
        "cps", "current population survey", "nber", "panel study", "compustat",
        "human cells", "cd34+", "hemic", "tcga", "clinvar", "genbank", "pdb",
        "isos-d", "perovskite database", "materials project", "oqmd", "cifar", "imagenet"
    ]

    OPERATIONAL_CONSTRAINT_QUALIFIERS = [
        "without cloud masking", "direct inference through", "unmasked cirrus",
        "10-35% cloud contamination", "aerosol optical depth", "tropospheric phase delay",
        "atmospheric phase screen", "aps mitigation", "speckle decorrelation",
        "temporal baseline decorrelation", "sensor saturation", "shadow compensation",
        "phase jitter", "crosstalk", "non-markovian", "decoherence drift",
        "parallel trends violation", "unobserved confounder", "endogeneity",
        "off-target cleavage", "dna double-strand breaks", "cytotoxicity",
        "phase segregation", "thermal degradation", "moisture ingress", "lattice strain"
    ]

    def __init__(self, min_specificity_threshold: float = 0.55):
        self.min_specificity_threshold = min_specificity_threshold

    def score_dimension(
        self,
        text: str,
        broad_pattern: re.Pattern,
        operational_qualifiers: list[str]
    ) -> Tuple[float, str]:
        """
        Scores a single dimension of the hypothesis from 0.0 (generic buzzword) to 1.0 (operationalized).
        """
        clean = text.strip()
        lower = clean.lower()

        # 1. Immediate penalty for bare broad umbrella terms
        if broad_pattern.match(lower):
            return (0.20, "Broad umbrella category without operational qualifiers (Tier 0)")

        # 2. Check length and structure
        word_count = len(clean.split())
        score = 0.55 if word_count >= 3 else 0.40  # baseline for multi-word academic concepts

        # 3. Reward operational qualifiers
        matched_qualifiers = [q for q in operational_qualifiers if q in lower]
        qualifier_boost = min(0.35, len(matched_qualifiers) * 0.15)
        score += qualifier_boost

        # 4. Reward concrete specifications (hyphenated terms, versions, sensors, numbers)
        if any(char.isdigit() for char in clean):
            score += 0.10
        if "-" in clean or "/" in clean or ":" in clean:
            score += 0.08
        if word_count >= 4:
            score += 0.10

        score = min(1.0, round(score, 2))

        if score >= 0.75:
            tier_desc = "Fully operational scientific entity (Tier 3)"
        elif score >= 0.50:
            tier_desc = "Concrete entity with context (Tier 2)"
        else:
            tier_desc = "Partially specified concept (Tier 1)"

        return (score, tier_desc)

    def evaluate_candidate(
        self,
        task: str,
        method: str,
        dataset: str,
        constraint: str
    ) -> Dict[str, Any]:
        """
        Evaluates the candidate gap and computes the comprehensive Specificity Score S(G).
        """
        score_t, desc_t = self.score_dimension(task, self.BROAD_TASK_PATTERNS, self.OPERATIONAL_TASK_QUALIFIERS)
        score_m, desc_m = self.score_dimension(method, self.BROAD_METHOD_PATTERNS, self.OPERATIONAL_METHOD_QUALIFIERS)
        score_d, desc_d = self.score_dimension(dataset, self.BROAD_DATASET_PATTERNS, self.OPERATIONAL_DATASET_QUALIFIERS)
        score_c, desc_c = self.score_dimension(constraint, self.BROAD_CONSTRAINT_PATTERNS, self.OPERATIONAL_CONSTRAINT_QUALIFIERS)

        # Weighted harmonic aggregation
        weights = {"task": 0.25, "method": 0.25, "dataset": 0.25, "constraint": 0.25}
        total_score = round(
            weights["task"] * score_t +
            weights["method"] * score_m +
            weights["dataset"] * score_d +
            weights["constraint"] * score_c,
            2
        )

        is_admissible = total_score >= self.min_specificity_threshold

        if not is_admissible:
            diagnostic = (
                f"REJECTED_AS_UNDERSPECIFIED: Specificity score {int(total_score * 100)}% "
                f"is below academic threshold {int(self.min_specificity_threshold * 100)}%. "
                f"Broad combinatorial buzzwords cannot support an unexplored research claim."
            )
        else:
            diagnostic = (
                f"ADMISSIBLE_SCIENTIFIC_HYPOTHESIS: Specificity score {int(total_score * 100)}% "
                f"meets high-rigor peer-reviewed standard."
            )

        return {
            "specificity_score": total_score,
            "percentage": int(total_score * 100),
            "is_admissible": is_admissible,
            "threshold": self.min_specificity_threshold,
            "diagnostic": diagnostic,
            "sub_scores": {
                "task": {"score": score_t, "tier": desc_t},
                "method": {"score": score_m, "tier": desc_m},
                "dataset": {"score": score_d, "tier": desc_d},
                "constraint": {"score": score_c, "tier": desc_c},
            }
        }
