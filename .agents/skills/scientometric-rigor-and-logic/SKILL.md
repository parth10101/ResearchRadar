---
name: scientometric-rigor-and-logic
description: >-
  Enforces strict academic standards, peer-reviewed mathematical formulations,
  and zero-hallucination guarantees across all 8 pipeline stages of ResearchRadar.
---

# Scientometric Rigor, Logic & Literature Grounding Skill

This skill enforces strict mathematical compliance with peer-reviewed literature across all scientometric calculations, entity extractions, and RAG narrative generation in ResearchRadar.

---

## 1. Uncontested Mathematical Formulas & Invariants

Every formula implemented in the pipeline must strictly match its peer-reviewed publication with zero arbitrary heuristics.

### ① Combinatorial Novelty $z$-Score (Stage 7 Tier 1)
* **Citation:** Uzzi, B., Mukherjee, S., Stringer, M., & Jones, B. (2013). *"Atypical Combinations and Scientific Impact."* *Science*, 342(6157), 468–472. DOI: `10.1126/science.1240474` (Eq. 1, p. 469).
* **Formula:**
  $$z_{ij} = \frac{C_{ij}^{\text{observed}} - \mu_{ij}^{\text{random}}}{\sigma_{ij}^{\text{random}}}$$
  $$\mu_{ij}^{\text{random}} = \frac{k_i \cdot k_j}{N}, \quad \sigma_{ij}^{\text{random}} = \sqrt{\frac{k_i \cdot k_j \cdot (N - k_i) \cdot (N - k_j)}{N^2 \cdot (N - 1)}}$$
  For an unexplored gap ($C_{ij}^{\text{observed}} = 0$):
  $$z_{ij} = -\frac{\mu_{ij}^{\text{random}}}{\sigma_{ij}^{\text{random}}} = -\sqrt{\frac{k_i \cdot k_j \cdot (N - 1)}{(N - k_i) \cdot (N - k_j)}}$$

### ② Main Path Analysis via Search Path Link Count (Stage 5 Spine)
* **Citation:** Batagelj, V. (2003). *"Efficient Algorithms for Citation Network Analysis."* *Social Networks*, 25(4), 361–373.
* **Formula:**
  $$SPLC(e) = \frac{N_{\text{sources}}(u) \times N_{\text{sinks}}(v)}{N_{\text{total paths}}}$$

### ③ Derek de Solla Price Index (Stage 5 Freshness)
* **Citation:** Price, D. J. de Solla (1965). *"Networks of Scientific Papers."* *Science*, 149(3683), 510–515.
* **Formula:**
  $$P_{3\text{yr}} = \frac{\sum_{i \in \text{References}} \mathbb{I}(\text{Year}_{\text{current}} - \text{Year}_i \le 3)}{\text{Total References Count}}$$

### ④ Scientific Compound Annual Growth Rate (Stage 7 Velocity)
* **Citation:** Bornmann, L., & Mutz, R. (2015). *"Growth rates of modern science."* *JASIST*, 66(11), 2215–2222.
* **Formula:**
  $$\text{CAGR} = \left( \frac{V_{t_{\text{end}}}}{V_{t_{\text{start}}}} \right)^{\frac{1}{t_{\text{end}} - t_{\text{start}}}} - 1$$

---

## 2. Scientific Discourse Entity Extraction Protocol

Follows **SciIE (Luan et al., EMNLP 2018)** and **D'Souza et al. (ACL 2024)**:
* **Method ($M$)**: Extracted via model suffixes (`Network`, `Model`, `Transformer`) and active verb dependency frames (*"we propose [X]"*, *"we develop [X]"*).
* **Dataset ($D$)**: Extracted via benchmark registries (`Sentinel-2`, `MIMIC`, `ImageNet`) and evaluation prepositional frames (*"evaluated on [Y]"*, *"tested on [Y]"*).
* **Limitation ($L$)**: Extracted via physical failure terms (`Atmospheric Correction`, `Cloud Cover`) and vulnerability frames (*"suffers from [Z]"*, *"degrades under [Z]"*).
* **Support Floor Rule**: Never promote an entity to the final gap ranking unless its independent frequency across the corpus satisfies $n \ge 2$.

---

## 3. Grounded RAG & Zero-Hallucination Protocol (Stage 8)

Follows **Lewis et al. (NeurIPS 2020)** and **Singh et al. (ACL 2024)**:
1. Every research gap must link to at least **3 real Anchor Paper IDs** in the ingested JSON corpus:
   - Anchor 1: Proven baseline paper for Method $M$.
   - Anchor 2: Target benchmark paper for Dataset $D$.
   - Anchor 3: Limitation paper proving Constraint $L$.
2. The LLM synthesis prompt must be strictly context-bound:
   - System prompt explicitly orders the model to reject any fact not supported by the retrieved abstract context.
   - Outputs must append numbered citations with real DOI URLs to ensure full reproducibility.
