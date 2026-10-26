import sys
sys.path.insert(0, ".")
from research_radar.s2_client import SemanticScholarClient, parse_boolean_query, matches_boolean_criteria

client = SemanticScholarClient()
query = '"Deep Learning" AND "Hyperspectral Image Processing"'
bool_spec = parse_boolean_query(query)

raw_papers = client.search_bulk(query=bool_spec['clean_s2_query'], limit=200)
print(f"Retrieved {len(raw_papers)} raw papers from S2.")

title_matches = []
for p in raw_papers:
    title = p.get('title') or ''
    t_lower = title.lower()
    matches, score = matches_boolean_criteria(p, bool_spec)
    if matches:
        has_both_in_title = ("deep learning" in t_lower and ("hyperspectral" in t_lower))
        title_matches.append({
            "title": title,
            "year": p.get("year"),
            "cits": p.get("citationCount", 0),
            "score": score,
            "both_in_title": has_both_in_title
        })

print(f"Total matching boolean criteria: {len(title_matches)}")
title_matches.sort(key=lambda x: (x['both_in_title'], x['score'], x['cits']), reverse=True)
for i, m in enumerate(title_matches[:20]):
    print(f"#{i+1} [{m['year']}] BothInTitle: {m['both_in_title']} | Score: {m['score']} | Cits: {m['cits']} | {m['title']}")
