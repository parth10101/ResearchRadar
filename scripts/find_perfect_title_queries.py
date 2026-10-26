import sys
import re
sys.path.insert(0, ".")
from research_radar.s2_client import SemanticScholarClient, parse_boolean_query, _build_phrase_regex

client = SemanticScholarClient()

candidate_queries = [
    # AND Candidates
    ('"Deep Learning" AND "Hyperspectral Image Classification"', ["deep learning", "hyperspectral image classification"]),
    ('"Deep Learning" AND "Object Detection"', ["deep learning", "object detection"]),
    ('"Deep Learning" AND "Image Segmentation"', ["deep learning", "image segmentation"]),
    ('"Convolutional Neural Networks" AND "Hyperspectral Image Classification"', ["convolutional neural networks", "hyperspectral image classification"]),
    
    # AND NOT Candidates
    ('"Federated Learning" AND "Differential Privacy" NOT "Blockchain"', ["federated learning", "differential privacy"], ["blockchain"]),
    ('"Graph Neural Networks" AND "Molecular Property Prediction" NOT "Survey"', ["graph neural networks", "molecular property prediction"], ["survey"]),
    ('"Deep Learning" AND "Medical Image Segmentation" NOT "Review"', ["deep learning", "medical image segmentation"], ["review"]),
    ('"Graph Neural Networks" AND "Drug Discovery" NOT "Review"', ["graph neural networks", "drug discovery"], ["review"]),

    # OR Candidates
    ('"Vision Transformer" OR "Masked Autoencoder"', ["vision transformer", "masked autoencoder"]),
    ('"Vision Transformers" OR "Diffusion Models"', ["vision transformers", "diffusion models"]),
]

print("=== CHECKING TITLE-LEVEL AVAILABILITY ON S2 ===")
for item in candidate_queries:
    q = item[0]
    must = item[1]
    must_not = item[2] if len(item) > 2 else []
    
    parsed = parse_boolean_query(q)
    # Search bulk
    raw = client.search_bulk(query=parsed['clean_s2_query'], limit=300)
    
    title_matches = 0
    must_pats = [_build_phrase_regex(m) for m in must]
    must_not_pats = [_build_phrase_regex(mn) for mn in must_not]
    
    for p in raw:
        t = p.get('title') or ''
        abs_t = p.get('abstract') or ''
        
        # Check NOT
        if any(mn_pat.search(t) or mn_pat.search(abs_t) for mn_pat in must_not_pats):
            continue
            
        if " OR " in q:
            # At least one must be in title
            if any(m_pat.search(t) for m_pat in must_pats):
                title_matches += 1
        else:
            # ALL must be in title
            if all(m_pat.search(t) for m_pat in must_pats):
                title_matches += 1
                
    print(f"Query: {q}")
    print(f"  Raw: {len(raw)} | 100% IN TITLE MATCHES: {title_matches}")
    print()
