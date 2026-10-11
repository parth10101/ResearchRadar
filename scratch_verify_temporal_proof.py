import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure root in path
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from research_radar.evaluation.benchmark_runner import TemporalBenchmarkHarness

def audit_corpus(name, path, cutoff=2022):
    if not Path(path).exists():
        print(f"Skipping {name}: file {path} does not exist.")
        return
    papers = json.loads(Path(path).read_text(encoding="utf-8"))
    h = TemporalBenchmarkHarness(papers, cutoff_year=cutoff)
    print("=" * 80)
    print(f"  CORPUS AUDIT: {name}")
    print(f"  Total Papers         : {len(papers)}")
    print(f"  Cutoff Year          : T_0 = {cutoff}")
    print(f"  Historical Training  : {len(h.historical_papers)} papers (Published <= {cutoff})")
    print(f"  Future Ground Truth  : {len(h.holdout_papers)} papers (Published > {cutoff})")
    print("-" * 80)

    # 1. Evaluate detected gaps from that dataset if available
    parent_dir = Path(path).parent
    detected_gaps_file = parent_dir / "detected_gaps.json"
    if detected_gaps_file.exists():
        gaps_data = json.loads(detected_gaps_file.read_text(encoding="utf-8"))
        gaps = gaps_data.get("gaps", [])[:5]
        print(f"  Evaluating {len(gaps)} Algorithmic Gaps Discovered at T <= {cutoff}:")
        for i, g in enumerate(gaps, 1):
            realized, ver_p, sim = h.verify_gap_realization(g)
            print(f"\n  [GAP {i}] {g.get('title')}")
            print(f"    ├─ Paradigm / Type  : {g.get('gap_type')}")
            print(f"    ├─ Score / Novelty  : Score = {g.get('score', 0):.4f}, Uzzi z = {g.get('uzzi_z_score', 0):.2f}σ")
            if realized and ver_p:
                print(f"    ├─ Realization Status: [VERIFIED REALIZED IN SUBSEQUENT LITERATURE]")
                print(f"    ├─ Verifying Paper   : \"{ver_p.get('title')}\"")
                print(f"    ├─ Publication Year  : {ver_p.get('year')} (T > {cutoff})")
                print(f"    ├─ Publication DOI   : {ver_p.get('doi') or ver_p.get('externalIds', {}).get('DOI', 'N/A')}")
                print(f"    └─ Lexical Alignment : ROUGE-L = {sim:.4f}")
            else:
                print(f"    ├─ Realization Status: [EMERGING THEORETICAL VOID / UNREALIZED IN HOLDOUT]")
                print(f"    └─ Verification Note : Open frontier with zero co-occurrence in holdout partition.")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    audit_corpus("Federated Learning (1,000 Papers)", "data/output_federated_learning_and/papers.json", cutoff=2022)
    audit_corpus("GNN Drug Discovery (3,000 Papers)", "data/gnn_drug_3k_papers.json", cutoff=2022)
    audit_corpus("Satellite Remote Sensing (300 Papers)", "data/output_satellite_300/papers.json", cutoff=2022)
