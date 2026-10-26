import sys
sys.path.insert(0, ".")
from research_radar.s2_client import SemanticScholarClient, parse_boolean_query, _build_phrase_regex

client = SemanticScholarClient()

gnn_candidates = [
    ('"Graph Neural Networks" AND "Link Prediction" NOT "Survey"', ["graph neural networks", "link prediction"], ["survey"]),
    ('"Graph Neural Networks" AND "Node Classification" NOT "Survey"', ["graph neural networks", "node classification"], ["survey"]),
    ('"Graph Neural Networks" AND "Knowledge Graphs" NOT "Survey"', ["graph neural networks", "knowledge graphs"], ["survey"]),
    ('"Graph Neural Networks" AND "Drug Discovery" NOT "Survey"', ["graph neural networks", "drug discovery"], ["survey"]),
    ('"Graph Neural Networks" AND "Molecular Graphs" NOT "Survey"', ["graph neural networks", "molecular graphs"], ["survey"]),
]

for q, must, must_not in gnn_candidates:
    parsed = parse_boolean_query(q)
    raw = client.search_bulk(query=parsed['clean_s2_query'], limit=300)
    must_pats = [_build_phrase_regex(m) for m in must]
    must_not_pats = [_build_phrase_regex(mn) for mn in must_not]
    
    title_matches = 0
    for p in raw:
        t = p.get('title') or ''
        abs_t = p.get('abstract') or ''
        if any(mn_pat.search(t) or mn_pat.search(abs_t) for mn_pat in must_not_pats):
            continue
        if all(m_pat.search(t) for m_pat in must_pats):
            title_matches += 1
    print(f"Query: {q} -> 100% IN TITLE MATCHES: {title_matches}")
