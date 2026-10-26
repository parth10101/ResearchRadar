import sys
sys.path.insert(0, ".")
from research_radar.s2_client import SemanticScholarClient, parse_boolean_query, _build_phrase_regex
from research_radar.stage1_ingest import _s2_paper_to_schema

client = SemanticScholarClient()

for q, must in [
    ('"Convolutional Neural Networks" AND "Hyperspectral Image Classification"', ["convolutional neural networks", "hyperspectral image classification"]),
    ('"Deep Learning" AND "Object Detection"', ["deep learning", "object detection"])
]:
    parsed = parse_boolean_query(q)
    raw = client.search_bulk(query=parsed['clean_s2_query'], limit=300)
    must_pats = [_build_phrase_regex(m) for m in must]
    
    valid = []
    for r in raw:
        p = _s2_paper_to_schema(r)
        if not p: continue
        t = (p.get('title') or '').strip()
        if all(mp.search(t) for mp in must_pats):
            valid.append(p)
    print(f"Query {q} -> Verified Full Schema Papers with 100% Title Match: {len(valid)}")
