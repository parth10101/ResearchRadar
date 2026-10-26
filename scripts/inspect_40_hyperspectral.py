import json

with open('data/output_hyperspectral_40/papers.json', 'r', encoding='utf-8') as f:
    papers = json.load(f)

for i, p in enumerate(papers):
    t = p.get('title') or ''
    t_l = t.lower()
    has_dl = "deep learning" in t_l
    has_hs = "hyperspectral" in t_l
    has_proc = "processing" in t_l
    print(f"#{i+1} [{p.get('year')}] DL:{has_dl} HS:{has_hs} Proc:{has_proc} | {t}")
