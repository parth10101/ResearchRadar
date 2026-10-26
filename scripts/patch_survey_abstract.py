import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from research_radar.stage5_citations import run_stage5

p_file = ROOT / "data" / "output_fed_diffpriv_40" / "papers.json"
with open(p_file, "r", encoding="utf-8") as f:
    papers = json.load(f)

real_abstract = (
    "Federated learning is a distributed machine learning technique that trains a global model by exchanging model "
    "parameters or intermediate results among multiple data sources. Although federated learning achieves physical isolation "
    "of data, the local data of federated learning clients are still at risk of leakage under the attack of malicious individuals. "
    "For this reason, combining data protection techniques (e.g., differential privacy techniques) with federated learning is a sure "
    "way to further improve the data security of federated learning models. In this survey, we review recent advances in the research "
    "of differentially-private federated learning models. First, we introduce the workflow of federated learning and the theoretical "
    "basis of differential privacy. Then, we review three differentially-private federated learning paradigms: central differential "
    "privacy, local differential privacy, and distributed differential privacy. After this, we review the algorithmic optimization "
    "and communication cost optimization of federated learning models with differential privacy. Finally, we review the applications "
    "of federated learning models with differential privacy in various domains. By systematically summarizing the existing research, "
    "we propose future research opportunities."
)

real_tldr = (
    "Systematically reviews central, local, and distributed differential privacy paradigms in federated learning, "
    "analyzing algorithmic optimization, communication cost trade-offs, and data security guarantees."
)

patched = 0
for paper in papers:
    if "Systematic Survey" in paper.get("title", ""):
        paper["abstract"] = real_abstract
        paper["tldr"] = real_tldr
        patched += 1
        print("Patched Systematic Survey paper with full real abstract and TLDR!")

with open(p_file, "w", encoding="utf-8") as f:
    json.dump(papers, f, indent=2, ensure_ascii=False)

print(f"Saved {len(papers)} papers. Patched count: {patched}")

# Re-run Stage 5 for output_fed_diffpriv_40
out_dir = ROOT / "data" / "output_fed_diffpriv_40"
run_stage5(papers, out_dir=out_dir)
print("Re-ran Stage 5 citations for output_fed_diffpriv_40!")
