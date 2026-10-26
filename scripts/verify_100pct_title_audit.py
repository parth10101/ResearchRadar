import json
import sys
sys.path.insert(0, ".")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
from research_radar.s2_client import _build_phrase_regex

DATASETS = [
    {
        "id": "output_cnn_hyperspectral_40",
        "name": "Hyperspectral CNN Classification [AND]",
        "query": '"Convolutional Neural Networks" AND "Hyperspectral Image Classification"',
        "bool_type": "AND",
        "must": ["convolutional neural networks", "hyperspectral image classification"],
        "must_not": [],
        "should": []
    },
    {
        "id": "output_fed_diffpriv_40",
        "name": "Private Federated Learning [AND NOT]",
        "query": '("Federated Learning" AND "Differential Privacy") NOT "Blockchain"',
        "bool_type": "AND + NOT",
        "must": ["federated learning", "differential privacy"],
        "must_not": ["blockchain"],
        "should": []
    },
    {
        "id": "output_vit_mae_40",
        "name": "Vision Transformers & MAE [OR]",
        "query": '"Vision Transformer" OR "Masked Autoencoder"',
        "bool_type": "OR",
        "must": [],
        "must_not": [],
        "should": ["vision transformer", "masked autoencoder"]
    },
    {
        "id": "output_gnn_kg_40",
        "name": "Knowledge Graph GNNs [AND NOT]",
        "query": '("Graph Neural Networks" AND "Knowledge Graphs") NOT "Survey"',
        "bool_type": "AND + NOT (Survey Purge)",
        "must": ["graph neural networks", "knowledge graphs"],
        "must_not": ["survey"],
        "should": []
    }
]

total_all = 0
passed_all = 0
audit_report = {}

print("================================================================================")
print("             100% TITLE-MATCH VERIFICATION AUDIT (ALL 160 PAPERS)               ")
print("================================================================================")

for cfg in DATASETS:
    ds_id = cfg["id"]
    name = cfg["name"]
    path = f"data/{ds_id}/papers.json"
    with open(path, "r", encoding="utf-8") as f:
        papers = json.load(f)

    must_pats = [(m, _build_phrase_regex(m)) for m in cfg["must"]]
    must_not_pats = [(mn, _build_phrase_regex(mn)) for mn in cfg["must_not"]]
    should_pats = [(s, _build_phrase_regex(s)) for s in cfg["should"]]

    ds_passed = 0
    papers_audit = []

    print(f"\n--- {name} ({ds_id}) ---")
    for idx, p in enumerate(papers):
        title = (p.get("title") or "").strip()
        abstract = (p.get("abstract") or "").strip()
        tldr = (p.get("tldr") or "").strip()
        full_text = f"{title} {abstract} {tldr}".lower()

        reasons = []

        # 1. Verify strict 100% TITLE match
        for term, pat in must_pats:
            if not pat.search(title):
                reasons.append(f"Title missing mandatory phrase: '{term}'")

        if should_pats:
            if not any(pat.search(title) for _, pat in should_pats):
                reasons.append(f"Title missing OR/SHOULD target phrases")

        # 2. Verify strict NOT exclusion across paper
        for term, pat in must_not_pats:
            if pat.search(full_text):
                reasons.append(f"Forbidden phrase found: '{term}'")

        # 3. Year metadata check
        if p.get("year") is None:
            reasons.append("Missing publication year")

        passed = (len(reasons) == 0)
        if passed:
            ds_passed += 1

        papers_audit.append({
            "index": idx + 1,
            "title": title,
            "year": p.get("year"),
            "citations": p.get("citation_count", 0),
            "title_matched": passed,
            "reasons": reasons
        })
        print(f"#{idx+1:02d} [{p.get('year')}] (cites:{p.get('citation_count', 0):>3}) {'[PASS]' if passed else '[FAIL]'} {title}")

    audit_report[ds_id] = {
        "name": name,
        "query": cfg["query"],
        "total": len(papers),
        "passed": ds_passed,
        "pass_rate": f"{ds_passed / len(papers) * 100:.1f}%",
        "papers": papers_audit
    }
    total_all += len(papers)
    passed_all += ds_passed

print("\n================================================================================")
print(f"FINAL AUDIT RESULT: {passed_all} / {total_all} papers passed 100% TITLE MATCH ({passed_all/total_all*100:.1f}%)")
print("================================================================================")
for ds_id, r in audit_report.items():
    print(f"  • {r['name']}: {r['passed']}/{r['total']} ({r['pass_rate']}) 100% TITLE MATCH")

with open("data/audit_160_papers_report.json", "w", encoding="utf-8") as f:
    json.dump({
        "grand_total": total_all,
        "grand_passed": passed_all,
        "grand_pass_rate": f"{passed_all/total_all*100:.1f}%",
        "datasets": audit_report
    }, f, indent=2)
