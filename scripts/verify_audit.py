import json
import sys
sys.path.insert(0, ".")

from research_radar.s2_client import matches_boolean_criteria, parse_boolean_query

CORPORA = [
    {
        "id": "output_hyperspectral_40",
        "name": "Hyperspectral Deep Learning",
        "query": "\"Deep Learning\" AND \"Hyperspectral Image Processing\"",
        "bool_type": "AND"
    },
    {
        "id": "output_fed_diffpriv_40",
        "name": "Federated Learning without Blockchain",
        "query": "(\"Federated Learning\" AND \"Differential Privacy\") NOT \"Blockchain\"",
        "bool_type": "AND + NOT"
    },
    {
        "id": "output_vit_mae_40",
        "name": "Vision Transformer OR Masked Autoencoder",
        "query": "\"Vision Transformer\" OR \"Masked Autoencoders\"",
        "bool_type": "OR"
    },
    {
        "id": "output_gnn_mol_40",
        "name": "GNN Molecular Property without Surveys",
        "query": "(\"Graph Neural Networks\" AND \"Molecular Property Prediction\") NOT \"Survey\"",
        "bool_type": "AND + NOT (Niche Deep-Dive)"
    }
]

full_report = {}
total_all = 0
passed_all = 0

for corpus in CORPORA:
    cid = corpus["id"]
    papers_path = f"data/{cid}/papers.json"
    with open(papers_path, "r", encoding="utf-8") as f:
        papers = json.load(f)
    
    parsed = parse_boolean_query(corpus["query"])
    audit_results = []
    c_passed = 0
    
    for idx, p in enumerate(papers):
        # 1. Match against strict production Boolean criteria engine
        bool_match, score = matches_boolean_criteria(p, parsed)
        
        reasons = []
        if not bool_match:
            reasons.append("Failed boolean criteria match")
            
        if p.get('year') is None:
            reasons.append("Missing publication year")
            
        passed = (len(reasons) == 0)
        if passed:
            c_passed += 1
            
        audit_results.append({
            "index": idx + 1,
            "title": p.get("title"),
            "year": p.get("year"),
            "citations": p.get("citation_count", 0),
            "refs_count": len(p.get("references", [])),
            "relevance_score": score,
            "tldr": (p.get("tldr") or "")[:100] + "..." if p.get("tldr") else "N/A",
            "passed": passed,
            "reasons": reasons
        })
        
    full_report[cid] = {
        "config": corpus,
        "total_papers": len(papers),
        "passed_papers": c_passed,
        "pass_rate": f"{(c_passed / len(papers)) * 100:.1f}%",
        "papers_audit": audit_results
    }
    total_all += len(papers)
    passed_all += c_passed

summary = {
    "grand_total": total_all,
    "grand_passed": passed_all,
    "grand_pass_rate": f"{(passed_all / total_all) * 100:.1f}%",
    "corpora": full_report
}

with open("data/audit_160_papers_report.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print(f"============================================================")
print(f"VERIFICATION AUDIT COMPLETE (Using s2_client engine):")
print(f"Total evaluated: {total_all}")
print(f"Passed: {passed_all} / {total_all} ({passed_all / total_all * 100:.1f}%)")
print(f"============================================================")
for cid, rep in full_report.items():
    print(f" - {rep['config']['name']} ({cid}): {rep['passed_papers']}/{rep['total_papers']} ({rep['pass_rate']})")
