import sys
sys.path.insert(0, ".")
from research_radar.s2_client import SemanticScholarClient, parse_boolean_query, matches_boolean_criteria

client = SemanticScholarClient()

queries_to_test = [
    '"Deep Learning" AND "Hyperspectral Image Classification"',
    '"Deep Learning" AND "Hyperspectral Imagery"',
    '"Federated Learning" AND "Differential Privacy" NOT "Blockchain"',
    '"Vision Transformer" OR "Masked Autoencoder"',
    '"Graph Neural Networks" AND "Molecular Property Prediction" NOT "Survey"',
    '"Graph Neural Networks" AND "Drug Discovery" NOT "Survey"'
]

for q in queries_to_test:
    parsed = parse_boolean_query(q)
    raw = client.search_bulk(query=parsed['clean_s2_query'], limit=150)
    
    both_in_title = 0
    passed_bool = 0
    for p in raw:
        m, s = matches_boolean_criteria(p, parsed)
        if m:
            passed_bool += 1
            t = (p.get('title') or '').lower()
            # check if must terms in title
            if all(must_t in t for must_t in parsed['must']):
                both_in_title += 1
            elif parsed['should'] and any(sh in t for sh in parsed['should']):
                both_in_title += 1
                
    print(f"Query: {q}")
    print(f"  Raw: {len(raw)} | Passed Bool: {passed_bool} | Exact Must/Should In Title: {both_in_title}")
    print()
