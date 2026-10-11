"""
Domain & Physical Compatibility Guardrail
=========================================
Enforces strict physical sensor laws, data modality constraints, and algorithmic
compatibility to ensure candidate research gaps are theoretically and practically sound.

Prevents scientifically impossible combinations (e.g., radar + cloud cover occlusion,
optical imagery + microwave speckle noise, 3D point cloud methods on 1D tabular EHR).
"""

from __future__ import annotations
import re
from typing import Tuple, Dict, Set


# ---------------------------------------------------------------------------
# Modality Classification & Taxonomies
# ---------------------------------------------------------------------------

MODALITY_RADAR_SAR = "SAR_MICROWAVE"
MODALITY_OPTICAL = "OPTICAL_MULTISPECTRAL"
MODALITY_HYPERSPECTRAL = "HYPERSPECTRAL"
MODALITY_LIDAR_3D = "LIDAR_3D"
MODALITY_BIOMEDICAL_TABULAR = "BIOMEDICAL_TABULAR"
MODALITY_GENOMICS_MOLECULAR = "GENOMICS_MOLECULAR"
MODALITY_ECONOMICS_POLICY = "ECONOMICS_POLICY"
MODALITY_GRAPH_TOPOLOGY = "GRAPH_TOPOLOGY"
MODALITY_LANGUAGE_NLP = "LANGUAGE_NLP"
MODALITY_QUANTUM_PHYSICS = "QUANTUM_PHYSICS"
MODALITY_GENERAL_SCIENCE = "GENERAL_SCIENCE"
MODALITY_GENERIC_CV = "COMPUTER_VISION_2D"

DATASET_MODALITY_MAP: Dict[str, str] = {
    # Radar / SAR (Microwave: C-band, L-band, X-band)
    "sentinel-1": MODALITY_RADAR_SAR,
    "sar-ship": MODALITY_RADAR_SAR,
    "envisat": MODALITY_RADAR_SAR,
    "terrasar-x": MODALITY_RADAR_SAR,
    "alos": MODALITY_RADAR_SAR,
    "palsar": MODALITY_RADAR_SAR,
    "radarsat": MODALITY_RADAR_SAR,

    # Optical / Multispectral
    "sentinel-2": MODALITY_OPTICAL,
    "landsat": MODALITY_OPTICAL,
    "modis": MODALITY_OPTICAL,
    "naip": MODALITY_OPTICAL,
    "dior": MODALITY_OPTICAL,
    "potsdam": MODALITY_OPTICAL,
    "vaihingen": MODALITY_OPTICAL,
    "loveda": MODALITY_OPTICAL,
    "landcovernet": MODALITY_OPTICAL,
    "uc merced": MODALITY_OPTICAL,
    "aid": MODALITY_OPTICAL,
    "planetscope": MODALITY_OPTICAL,

    # LiDAR / 3D
    "kitti": MODALITY_LIDAR_3D,
    "nuscenes": MODALITY_LIDAR_3D,
    "waymo": MODALITY_LIDAR_3D,
    "argoverse": MODALITY_LIDAR_3D,
    "pandaset": MODALITY_LIDAR_3D,
    "gedi": MODALITY_LIDAR_3D,
    "icesat": MODALITY_LIDAR_3D,

    # Graph & Network Topologies
    "ppi": MODALITY_GRAPH_TOPOLOGY,
    "cora": MODALITY_GRAPH_TOPOLOGY,
    "citeseer": MODALITY_GRAPH_TOPOLOGY,
    "pubmed": MODALITY_GRAPH_TOPOLOGY,
    "ogbn": MODALITY_GRAPH_TOPOLOGY,
    "ogbl": MODALITY_GRAPH_TOPOLOGY,
    "ogbg": MODALITY_GRAPH_TOPOLOGY,
    "reddit": MODALITY_GRAPH_TOPOLOGY,
    "mutag": MODALITY_GRAPH_TOPOLOGY,
    "proteins": MODALITY_GRAPH_TOPOLOGY,

    # NLP / Linguistic Benchmarks
    "squad": MODALITY_LANGUAGE_NLP,
    "glue": MODALITY_LANGUAGE_NLP,
    "superglue": MODALITY_LANGUAGE_NLP,
    "xnli": MODALITY_LANGUAGE_NLP,
    "wmt": MODALITY_LANGUAGE_NLP,
    "flores": MODALITY_LANGUAGE_NLP,
    "bookcorpus": MODALITY_LANGUAGE_NLP,
    "common crawl": MODALITY_LANGUAGE_NLP,

    # Quantum & Physics Benchmarks
    "surface code": MODALITY_QUANTUM_PHYSICS,
    "toric code": MODALITY_QUANTUM_PHYSICS,
    "syndrome decoding": MODALITY_QUANTUM_PHYSICS,
    "color code": MODALITY_QUANTUM_PHYSICS,

    # Biomedical / Tabular / EHR
    "mimic": MODALITY_BIOMEDICAL_TABULAR,
    "uk biobank": MODALITY_BIOMEDICAL_TABULAR,
    "tcga": MODALITY_GENOMICS_MOLECULAR,
    "pima indians": MODALITY_BIOMEDICAL_TABULAR,
    "nhanes": MODALITY_BIOMEDICAL_TABULAR,

    # Genomics / Chemistry
    "pdb": MODALITY_GENOMICS_MOLECULAR,
    "zinc": MODALITY_GENOMICS_MOLECULAR,
    "chembl": MODALITY_GENOMICS_MOLECULAR,
    "uniprot": MODALITY_GENOMICS_MOLECULAR,

    # Economics & Policy
    "psid": MODALITY_ECONOMICS_POLICY,
    "nber": MODALITY_ECONOMICS_POLICY,
    "census": MODALITY_ECONOMICS_POLICY,
    "compustat": MODALITY_ECONOMICS_POLICY,
    "world bank": MODALITY_ECONOMICS_POLICY,
}

# ---------------------------------------------------------------------------
# Physical & Domain Constraint Compatibility Rules
# ---------------------------------------------------------------------------

SAR_INCOMPATIBLE_CONSTRAINTS = {
    "cloud cover", "cloud cover occlusion", "cloud cover interference",
    "haze occlusion", "aerosol scattering", "cirrus contamination",
    "rgb shadow occlusion", "solar illumination variations",
}

OPTICAL_INCOMPATIBLE_CONSTRAINTS = {
    "speckle noise", "phase decorrelation", "tropospheric phase delay",
    "ionospheric scintillation", "geometric layover", "geometric foreshortening",
}

LIDAR_INCOMPATIBLE_CONSTRAINTS = {
    "cloud shadow occlusion", "spectral unmixing", "color constancy",
}

BIOMEDICAL_INCOMPATIBLE_CONSTRAINTS = {
    "cloud cover", "atmospheric correction", "sensor angle distortion",
    "topographic relief displacement", "spectral mixing", "speckle noise",
}

ECONOMICS_INCOMPATIBLE_CONSTRAINTS = {
    "cloud cover", "atmospheric correction", "speckle noise", "sensor drift",
    "topographic relief", "phase unwrapping", "laser attenuation",
}


def infer_dataset_modality(dataset_name: str) -> str:
    """Infers the scientific modality of a given benchmark or dataset."""
    dl = dataset_name.lower()
    for key, modality in DATASET_MODALITY_MAP.items():
        if key in dl:
            return modality
    if any(term in dl for term in ["sar", "radar", "interferom", "insar"]):
        return MODALITY_RADAR_SAR
    if any(term in dl for term in ["multispectral", "hyperspectral", "rgb", "optical", "satellite image", "landsat"]):
        return MODALITY_OPTICAL
    if any(term in dl for term in ["point cloud", "lidar", "3d box", "voxel"]):
        return MODALITY_LIDAR_3D
    if any(term in dl for term in ["graph", "network topology", "citation network", "ppi", "molecule", "cora"]):
        return MODALITY_GRAPH_TOPOLOGY
    if any(term in dl for term in ["quantum", "qubit", "surface code", "toric", "syndrome"]):
        return MODALITY_QUANTUM_PHYSICS
    if any(term in dl for term in ["nlp", "text", "corpus", "translation", "language", "cross-lingual", "sentence"]):
        return MODALITY_LANGUAGE_NLP
    if any(term in dl for term in ["protein", "rna", "dna", "crispr", "molecular", "gene", "genome"]):
        return MODALITY_GENOMICS_MOLECULAR
    if any(term in dl for term in ["clinical", "ehr", "patient", "hospital", "mortality", "icu"]):
        return MODALITY_BIOMEDICAL_TABULAR
    if any(term in dl for term in ["gdp", "firm", "labor", "inflation", "stock", "market", "policy", "trade", "tax"]):
        return MODALITY_ECONOMICS_POLICY
    return MODALITY_GENERAL_SCIENCE


def validate_triad_compatibility(method: str, dataset: str, limitation: str) -> Tuple[bool, str]:
    """
    Validates physical, mathematical, and practical compatibility of a Method + Dataset + Limitation triad.
    
    Returns:
        (is_compatible, rationale)
    """
    m_lower = method.lower()
    d_lower = dataset.lower()
    l_lower = limitation.lower()

    modality = infer_dataset_modality(dataset)

    # 1. Physics Rule: SAR Radar vs Optical Limitations
    if modality == MODALITY_RADAR_SAR:
        for inc in SAR_INCOMPATIBLE_CONSTRAINTS:
            if inc in l_lower:
                return False, (
                    f"Physical incompatibility: Synthetic Aperture Radar ({dataset}) utilizes microwave "
                    f"wavelengths that penetrate clouds, haze, and operate day/night. Constraint '{limitation}' "
                    "is an optical artifact and cannot physically affect SAR."
                )

    # 2. Physics Rule: Optical vs Radar Limitations
    if modality == MODALITY_OPTICAL:
        for inc in OPTICAL_INCOMPATIBLE_CONSTRAINTS:
            if inc in l_lower:
                return False, (
                    f"Physical incompatibility: Optical multispectral sensors ({dataset}) measure solar reflectance, "
                    f"not coherent electromagnetic phase. Constraint '{limitation}' is a radar-specific artifact."
                )

    # 3. Physics Rule: Biomedical Tabular vs Remote Sensing Limitations
    if modality == MODALITY_BIOMEDICAL_TABULAR:
        for inc in BIOMEDICAL_INCOMPATIBLE_CONSTRAINTS:
            if inc in l_lower:
                return False, (
                    f"Domain incompatibility: Tabular clinical data ({dataset}) cannot experience atmospheric "
                    f"or optical sensor distortions ('{limitation}')."
                )

    # 4. Method Architecture vs Data Modality Compatibility
    # Point-cloud only methods on 2D images
    if any(p in m_lower for p in ["pointnet", "voxelnet", "pointpillars", "second 3d"]):
        if modality not in (MODALITY_LIDAR_3D, MODALITY_GENERIC_CV):
            return False, (
                f"Representation incompatibility: 3D point cloud architecture '{method}' cannot natively operate "
                f"on {dataset} without explicit 3D mesh or LiDAR points."
            )

    # InSAR Phase unwrapping methods on Optical
    if "phase unwrapping" in m_lower or "interferometric" in m_lower:
        if modality != MODALITY_RADAR_SAR:
            return False, (
                f"Modality incompatibility: InSAR phase algorithms ('{method}') require complex-valued radar "
                f"interferograms and cannot be applied to optical dataset '{dataset}'."
            )

    # 5. Passed all physical and domain guardrails
    rationale = (
        f"Valid physical alignment: {dataset} ({modality}) naturally encounters {limitation}, "
        f"and {method} provides an inductive bias suitable for this operational constraint."
    )
    return True, rationale
