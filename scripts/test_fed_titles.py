import sys
sys.path.insert(0, ".")
from research_radar.s2_client import SemanticScholarClient, parse_boolean_query, matches_boolean_criteria

client = SemanticScholarClient()
query = '("Federated Learning" AND "Differential Privacy") NOT "Blockchain"'
bool_spec = parse_boolean_query(query)

raw_papers = client.search_bulk(query=bool_spec['clean_s2_query'], limit=200)

matching_papers = []
for p in raw_papers:
    matches, score = matches_boolean_criteria(p, bool_spec)
    if not matches:
        continue
    t = (p.get('title') or '').lower()
    has_fl = "federated learning" in t
    has_dp = "differential privacy" in t
    matching_papers.append({
        "title": p.get('title'),
        "year": p.get('year'),
        "cits": p.get('citationCount', 0),
        "both_in_title": (has_fl and has_dp),
        "score": score
    })

print(f"Total matching boolean criteria: {len(matching_papers)}")
matching_papers.sort(key=lambda x: (x['both_in_title'], x['score'], x['cits']), reverse=True)
for i, m in enumerate(matching_papers[:30]):
    print(f"#{i+1} [{m['year']}] BothInTitle: {m['both_in_title']} | Cits: {m['cits']} | {m['title']}")
