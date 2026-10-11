import os

def run():
    os.makedirs('diagrams', exist_ok=True)
    
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1750 960" width="100%" height="100%" style="background-color: #ffffff; font-family: 'Times New Roman', Times, 'Computer Modern Serif', serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
    <filter id="card-shadow" x="-2%" y="-2%" width="104%" height="108%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.06"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b"/>
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1d4ed8"/>
    </marker>
    <marker id="arrow-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#047857"/>
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#6d28d9"/>
    </marker>
    <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#b45309"/>
    </marker>
    <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.8" fill="#e2e8f0"/>
    </pattern>
  </defs>

  <rect width="100%" height="100%" fill="#fafafa"/>
  <rect width="100%" height="100%" fill="url(#grid-dots)"/>
  <rect x="25" y="25" width="1700" height="910" rx="8" fill="#ffffff" stroke="#334155" stroke-width="1.8" filter="url(#shadow)"/>

  <g id="header">
    <rect x="25" y="25" width="1700" height="70" rx="8" fill="#0f172a"/>
    <text x="50" y="60" fill="#ffffff" font-size="22" font-weight="bold" font-family="'Times New Roman', serif" letter-spacing="0.5">Fig. 1. End-to-End System Architecture of Autonomous Scientometric Intelligence Engine (ResearchRadar)</text>
    <text x="50" y="82" fill="#94a3b8" font-size="13" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">Standard IEEE Transactions Double-Column Format &bull; 8-Stage Pipeline with Vector Clustering, Scientometric Trajectories, and LLM Synthesis</text>
    
    <rect x="1300" y="45" width="410" height="36" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <circle cx="1320" cy="63" r="5" fill="#2563eb"/>
    <text x="1332" y="67" fill="#f8fafc" font-size="11" font-family="sans-serif">Data Ingestion</text>
    <circle cx="1425" cy="63" r="5" fill="#7c3aed"/>
    <text x="1437" y="67" fill="#f8fafc" font-size="11" font-family="sans-serif">Semantic Engine</text>
    <circle cx="1545" cy="63" r="5" fill="#059669"/>
    <text x="1557" y="67" fill="#f8fafc" font-size="11" font-family="sans-serif">Graph Topology</text>
    <circle cx="1665" cy="63" r="5" fill="#d97706"/>
    <text x="1677" y="67" fill="#f8fafc" font-size="11" font-family="sans-serif">UI / WebGL</text>
  </g>

  <!-- STAGE 1 -->
  <g id="stage1" transform="translate(50, 115)">
    <rect x="0" y="0" width="300" height="740" rx="6" fill="#f8fafc" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="300" height="42" rx="6" fill="#2563eb"/>
    <text x="15" y="26" fill="#ffffff" font-size="14" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGE I: INGESTION &amp; CACHE</text>
    
    <g transform="translate(18, 58)">
      <rect x="0" y="0" width="264" height="110" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">1. Multi-Source Raw Ingestion</text>
      <line x1="12" y1="32" x2="252" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="52" fill="#334155" font-size="11.5">&bull; Semantic Scholar REST API (S2AG)</text>
      <text x="12" y="72" fill="#334155" font-size="11.5">&bull; OpenAlex Concepts &amp; Hierarchy</text>
      <text x="12" y="92" fill="#334155" font-size="11.5">&bull; arXiv Metadata &amp; Preprints</text>
    </g>

    <line x1="150" y1="172" x2="150" y2="198" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 200)">
      <rect x="0" y="0" width="264" height="115" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">2. Token-Bucket Rate Limiter</text>
      <line x1="12" y1="32" x2="252" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; Capacity C=100, Refill Rate r=1.0/s</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; HTTP 429 Exponential Backoff</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; Concurrency Semaphore (k=5)</text>
    </g>

    <line x1="150" y1="320" x2="150" y2="346" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 348)">
      <rect x="0" y="0" width="264" height="115" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">3. SHA-256 Corpus Caching</text>
      <line x1="12" y1="32" x2="252" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; Hash Key: H(query || N || year)</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; Persistent Local Lakehouse</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; Idempotent Corpus Retrieval</text>
    </g>

    <line x1="150" y1="468" x2="150" y2="494" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 496)">
      <rect x="0" y="0" width="264" height="220" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#1e3a8a" font-size="13" font-weight="bold">Output: Corpus D (N Papers)</text>
      <line x1="12" y1="32" x2="252" y2="32" stroke="#bfdbfe" stroke-width="1"/>
      
      <rect x="12" y="44" width="240" height="160" rx="4" fill="#ffffff" stroke="#93c5fd" stroke-width="1"/>
      <text x="22" y="66" fill="#1e293b" font-family="'Courier New', monospace" font-size="11" font-weight="bold">&#123;</text>
      <text x="32" y="86" fill="#0369a1" font-family="'Courier New', monospace" font-size="10.5">"paper_id": "s2_89f3a...",</text>
      <text x="32" y="106" fill="#0369a1" font-family="'Courier New', monospace" font-size="10.5">"title": "Quantum Neural...",</text>
      <text x="32" y="126" fill="#0369a1" font-family="'Courier New', monospace" font-size="10.5">"abstract": "We present...",</text>
      <text x="32" y="146" fill="#0369a1" font-family="'Courier New', monospace" font-size="10.5">"year": 2024, "citations": 84,</text>
      <text x="32" y="166" fill="#0369a1" font-family="'Courier New', monospace" font-size="10.5">"references": ["id1", "id2"]</text>
      <text x="22" y="186" fill="#1e293b" font-family="'Courier New', monospace" font-size="11" font-weight="bold">&#125;</text>
    </g>
  </g>

  <path d="M 350 480 L 380 480" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <text x="352" y="470" fill="#1d4ed8" font-size="11" font-weight="bold" font-family="sans-serif">Corpus D</text>

  <!-- STAGE 2 -->
  <g id="stage2" transform="translate(385, 115)">
    <rect x="0" y="0" width="310" height="740" rx="6" fill="#fcfaff" stroke="#7c3aed" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="310" height="42" rx="6" fill="#7c3aed"/>
    <text x="15" y="26" fill="#ffffff" font-size="14" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGE II: EMBED &amp; CLUSTERING</text>

    <g transform="translate(18, 58)">
      <rect x="0" y="0" width="274" height="110" rx="5" fill="#ffffff" stroke="#e9d5ff" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">1. Preprocessing &amp; Filtering</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#f3e8ff" stroke-width="1"/>
      <text x="12" y="52" fill="#334155" font-size="11.5">&bull; SciSpacy Academic Tokenizer</text>
      <text x="12" y="72" fill="#334155" font-size="11.5">&bull; Stopword &amp; Symbol Stripping</text>
      <text x="12" y="92" fill="#334155" font-size="11.5">&bull; Abstract Length Normalization</text>
    </g>

    <line x1="155" y1="172" x2="155" y2="198" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 200)">
      <rect x="0" y="0" width="274" height="120" rx="5" fill="#ffffff" stroke="#e9d5ff" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">2. Transformer Vectorization</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#f3e8ff" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; SciBERT / SPECTER2 Backbone</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; Dense Matrix: X in R^(N x 768)</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; L2-Normalized Unit Vectors</text>
      <text x="12" y="108" fill="#581c87" font-size="10.5" font-style="italic">SIMD AVX2 Cosine Batching</text>
    </g>

    <line x1="155" y1="325" x2="155" y2="350" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 352)">
      <rect x="0" y="0" width="274" height="160" rx="5" fill="#ffffff" stroke="#e9d5ff" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">3. Density Clustering &amp; Topics</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#f3e8ff" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; HDBSCAN (min_cluster_size=8)</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; c-TF-IDF Topic Term Weighting:</text>
      <text x="24" y="92" fill="#4c1d95" font-size="10.5" font-weight="bold">W_(t,c) = tf_(t,c) x log(1 + A / f_t)</text>
      <text x="12" y="116" fill="#334155" font-size="11">&bull; Epistemic Clusters C_1, ..., C_K</text>
      <text x="12" y="136" fill="#334155" font-size="11">&bull; Cluster Landmark Anchor Papers</text>
    </g>

    <line x1="155" y1="517" x2="155" y2="542" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 544)">
      <rect x="0" y="0" width="274" height="172" rx="5" fill="#faf5ff" stroke="#a855f7" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#581c87" font-size="13" font-weight="bold">Quality Gate &amp; Metrics</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#e9d5ff" stroke-width="1"/>
      <text x="12" y="52" fill="#334155" font-size="11">&bull; Silhouette Score: S &gt;= 0.42</text>
      <text x="12" y="74" fill="#334155" font-size="11">&bull; Davies-Bouldin Index: DBI &lt;= 1.35</text>
      <text x="12" y="96" fill="#334155" font-size="11">&bull; Outlier Threshold: alpha = 0.05</text>
      
      <rect x="12" y="116" width="250" height="42" rx="4" fill="#f3e8ff" stroke="#c084fc" stroke-width="1"/>
      <text x="24" y="142" fill="#6b21a8" font-size="11.5" font-weight="bold">&check; Validated Thematic Partitions</text>
    </g>
  </g>

  <path d="M 695 480 L 725 480" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrow-purple)"/>
  <text x="698" y="470" fill="#6d28d9" font-size="11" font-weight="bold" font-family="sans-serif">Vectors X</text>

  <!-- STAGE 3 -->
  <g id="stage3" transform="translate(730, 115)">
    <rect x="0" y="0" width="310" height="740" rx="6" fill="#f0fdf4" stroke="#059669" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="310" height="42" rx="6" fill="#059669"/>
    <text x="15" y="26" fill="#ffffff" font-size="14" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGE III: TOPOLOGY &amp; SPLC</text>

    <g transform="translate(18, 58)">
      <rect x="0" y="0" width="274" height="110" rx="5" fill="#ffffff" stroke="#a7f3d0" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">1. Citation Graph G=(V, E)</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#d1fae5" stroke-width="1"/>
      <text x="12" y="52" fill="#334155" font-size="11.5">&bull; Nodes: Papers v_i in V</text>
      <text x="12" y="72" fill="#334155" font-size="11.5">&bull; Edges: Citations e=(u,v) in E</text>
      <text x="12" y="92" fill="#334155" font-size="11.5">&bull; Cycle Elimination -&gt; Strict DAG</text>
    </g>

    <line x1="155" y1="172" x2="155" y2="198" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 200)">
      <rect x="0" y="0" width="274" height="150" rx="5" fill="#ffffff" stroke="#a7f3d0" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">2. SPLC Trajectory Extraction</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#d1fae5" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="10.5">Search Path Link Count Equation:</text>
      <text x="18" y="74" fill="#065f46" font-size="11" font-weight="bold">SPLC(e) = Sum_s Sum_t [N(s-&gt;e-&gt;t) / N(s-&gt;t)]</text>
      <text x="12" y="100" fill="#334155" font-size="11">&bull; Topological Main Path Identification</text>
      <text x="12" y="120" fill="#334155" font-size="11">&bull; Paradigm Shifts &amp; Milestone Epochs</text>
      <text x="12" y="140" fill="#334155" font-size="11">&bull; Milestone Landmark Paper Detection</text>
    </g>

    <line x1="155" y1="355" x2="155" y2="380" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 382)">
      <rect x="0" y="0" width="274" height="145" rx="5" fill="#ffffff" stroke="#a7f3d0" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">3. Bipartite Entity Graph B</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#d1fae5" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; Partitions: B = (V_P, V_E, E_B)</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; Entities: Methods, Tasks, Datasets</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; Adjacency Matrix: A in R^(|V_P| x |V_E|)</text>
      <text x="12" y="112" fill="#334155" font-size="11">&bull; Co-Occurrence: C = A * A^T</text>
      <text x="12" y="132" fill="#334155" font-size="11">&bull; Cross-Disciplinary Entity Filaments</text>
    </g>

    <line x1="155" y1="532" x2="155" y2="558" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 560)">
      <rect x="0" y="0" width="274" height="156" rx="5" fill="#ecfdf5" stroke="#34d399" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#065f46" font-size="13" font-weight="bold">Topological Lineage Artifacts</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#a7f3d0" stroke-width="1"/>
      <text x="12" y="52" fill="#334155" font-size="11">&bull; SPLC Main Path Backbone (P_main)</text>
      <text x="12" y="74" fill="#334155" font-size="11">&bull; Citation Connectivity Matrix</text>
      <text x="12" y="96" fill="#334155" font-size="11">&bull; Temporal Milestone Sequences</text>
      
      <rect x="12" y="110" width="250" height="34" rx="4" fill="#d1fae5" stroke="#6ee7b7" stroke-width="1"/>
      <text x="24" y="132" fill="#047857" font-size="11" font-weight="bold">&check; 100% Deterministic Lineage Graphs</text>
    </g>
  </g>

  <path d="M 1040 480 L 1070 480" stroke="#059669" stroke-width="2" marker-end="url(#arrow-emerald)"/>
  <text x="1042" y="470" fill="#047857" font-size="11" font-weight="bold" font-family="sans-serif">Graphs B, G</text>

  <!-- STAGE 4 -->
  <g id="stage4" transform="translate(1075, 115)">
    <rect x="0" y="0" width="310" height="740" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="310" height="42" rx="6" fill="#d97706"/>
    <text x="15" y="26" fill="#ffffff" font-size="14" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGE IV: GAPS &amp; LLM RAG</text>

    <g transform="translate(18, 58)">
      <rect x="0" y="0" width="274" height="150" rx="5" fill="#ffffff" stroke="#fde68a" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">1. Burt's Structural Holes</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#fef3c7" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">Topological Network Constraint:</text>
      <text x="18" y="70" fill="#92400e" font-size="11" font-weight="bold">C_i = Sum_j [p_ij + Sum_q (p_iq * p_qj)]^2</text>
      <text x="12" y="94" fill="#334155" font-size="11">&bull; Low-Constraint = Boundary Spanners</text>
      <text x="12" y="114" fill="#334155" font-size="11">&bull; Method-Application Disconnect Matrix</text>
      <text x="12" y="134" fill="#334155" font-size="11">&bull; Novelty &amp; Feasibility Frontier Scoring</text>
    </g>

    <line x1="155" y1="213" x2="155" y2="238" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 240)">
      <rect x="0" y="0" width="274" height="165" rx="5" fill="#ffffff" stroke="#fde68a" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">2. Grounded LLM RAG Narration</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#fef3c7" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; Groq LPU Inference (Llama-3-70B)</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; Strictly Evidence-Grounded Context</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; Zero-Hallucination DOI Verifier</text>
      <text x="12" y="110" fill="#334155" font-size="11">&bull; Operational Hypothesis Formulation:</text>
      <text x="24" y="130" fill="#b45309" font-size="10.5" font-weight="bold">H_m = (Method_A (x) Domain_B)</text>
      <text x="12" y="152" fill="#334155" font-size="11">&bull; Risk Matrix &amp; Verification Protocol</text>
    </g>

    <line x1="155" y1="410" x2="155" y2="435" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(18, 438)">
      <rect x="0" y="0" width="274" height="278" rx="5" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#78350f" font-size="13" font-weight="bold">Synthesized Grant Hypotheses</text>
      <line x1="12" y1="32" x2="262" y2="32" stroke="#fde68a" stroke-width="1"/>
      
      <rect x="12" y="44" width="250" height="220" rx="4" fill="#ffffff" stroke="#fcd34d" stroke-width="1"/>
      <text x="20" y="66" fill="#92400e" font-size="11" font-weight="bold">&bull; Hypothesis Title:</text>
      <text x="20" y="84" fill="#1e293b" font-size="10.5" font-style="italic">"Diffusion Policy on GNN Drug Graphs"</text>
      <text x="20" y="106" fill="#92400e" font-size="11" font-weight="bold">&bull; Bridge Score:</text>
      <text x="96" y="106" fill="#047857" font-size="10.5" font-weight="bold">0.892 (High Novelty)</text>
      <text x="20" y="128" fill="#92400e" font-size="11" font-weight="bold">&bull; Algorithmic Methodology:</text>
      <text x="20" y="146" fill="#334155" font-size="10">Cross-entropy regularized spectral diffusion</text>
      <text x="20" y="168" fill="#92400e" font-size="11" font-weight="bold">&bull; Scientific Risk &amp; Mitigation:</text>
      <text x="20" y="186" fill="#334155" font-size="10">Over-smoothing mitigated by skip-gates</text>
      <text x="20" y="208" fill="#92400e" font-size="11" font-weight="bold">&bull; Citational Grounding:</text>
      <text x="20" y="226" fill="#2563eb" font-size="10">[Vaswani'17, Kipf'16, Ho'20]</text>
      <text x="20" y="248" fill="#047857" font-size="10" font-weight="bold">&check; Ready for Grant Proposal / Review</text>
    </g>
  </g>

  <path d="M 1385 480 L 1415 480" stroke="#d97706" stroke-width="2" marker-end="url(#arrow-amber)"/>
  <text x="1386" y="470" fill="#b45309" font-size="11" font-weight="bold" font-family="sans-serif">Artifacts</text>

  <!-- STAGE 5 -->
  <g id="stage5" transform="translate(1420, 115)">
    <rect x="0" y="0" width="280" height="740" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="280" height="42" rx="6" fill="#0f172a"/>
    <text x="15" y="26" fill="#ffffff" font-size="14" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGE V: 3D WEBGL &amp; HUD</text>

    <g transform="translate(16, 58)">
      <rect x="0" y="0" width="248" height="115" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">1. 3D UMAP Projection</text>
      <line x1="12" y1="32" x2="236" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; X in R^(N x 768) -&gt; Y in R^(N x 3)</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; n_neighbors=15, min_dist=0.1</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; Local &amp; Global Manifold Topology</text>
      <text x="12" y="108" fill="#334155" font-size="11">&bull; Filament Bridge Coordinates</text>
    </g>

    <line x1="140" y1="178" x2="140" y2="202" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(16, 204)">
      <rect x="0" y="0" width="248" height="145" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">2. WebGL Particle Engine</text>
      <line x1="12" y1="32" x2="236" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; GPU Float32BufferAttribute</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; GLSL Vertex Curl Noise Shaders</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; Quintic S-Curve Morphing</text>
      <text x="12" y="110" fill="#334155" font-size="11">&bull; 60 FPS Raycasting Selection</text>
      <text x="12" y="130" fill="#334155" font-size="11">&bull; 3D Spline Camera Flight Rig</text>
    </g>

    <line x1="140" y1="354" x2="140" y2="378" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(16, 380)">
      <rect x="0" y="0" width="248" height="336" rx="5" fill="#0f172a" stroke="#334155" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#f8fafc" font-size="13" font-weight="bold">Reactive UI Observatory</text>
      <line x1="12" y1="32" x2="236" y2="32" stroke="#334155" stroke-width="1"/>

      <rect x="12" y="44" width="224" height="58" rx="4" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <text x="20" y="64" fill="#60a5fa" font-size="11" font-weight="bold">Stage 00: Search &amp; SSE Stream</text>
      <text x="20" y="82" fill="#cbd5e1" font-size="10">Corpus size, live backend events</text>

      <rect x="12" y="112" width="224" height="58" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="1"/>
      <text x="20" y="132" fill="#c084fc" font-size="11" font-weight="bold">Stage 01: Epistemic Archipelago</text>
      <text x="20" y="150" fill="#cbd5e1" font-size="10">3D cluster cloud &amp; glass inspection</text>

      <rect x="12" y="180" width="224" height="58" rx="4" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
      <text x="20" y="200" fill="#4ade80" font-size="11" font-weight="bold">Stage 02: Citation Timeline</text>
      <text x="20" y="218" fill="#cbd5e1" font-size="10">SPLC main path &amp; milestone epochs</text>

      <rect x="12" y="248" width="224" height="58" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="1"/>
      <text x="20" y="268" fill="#fcd34d" font-size="11" font-weight="bold">Stage 03: AI Grant Studio</text>
      <text x="20" y="286" fill="#cbd5e1" font-size="10">Hypotheses, risk matrix &amp; export</text>
    </g>
  </g>

  <!-- Global Footer Note -->
  <g id="footer" transform="translate(50, 875)">
    <line x1="0" y1="0" x2="1650" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <text x="0" y="25" fill="#475569" font-size="12" font-family="'Times New Roman', serif">
      <tspan font-weight="bold">Note:</tspan> All computational pipeline stages operate deterministically over raw scientometric APIs with rigorous quality gates (S &gt;= 0.42, DBI &lt;= 1.35) before heuristic LLM synthesis.
    </text>
    <text x="1170" y="25" fill="#64748b" font-size="11.5" font-family="'Helvetica Neue', sans-serif">
      Pipeline Orchestration: FastAPI + DuckDB + NetworkX + Groq LPU
    </text>
  </g>
</svg>"""

    drawio_content = """<mxfile host="app.diagrams.net" modified="2026-09-20T18:00:00.000Z" agent="ResearchRadar-DrawioSkill" version="24.7.5">
  <diagram id="ieee-sys-arch" name="IEEE System Architecture">
    <mxGraphModel dx="1600" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1750" pageHeight="960" math="1" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <mxCell id="hdr" value="&lt;b&gt;Fig. 1. End-to-End System Architecture of Autonomous Scientometric Intelligence Engine (ResearchRadar)&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size: 11px; color: #94a3b8;&quot;&gt;Standard IEEE Transactions Format • 8-Stage Pipeline with Vector Clustering, SPLC Main Path, and LLM Synthesis&lt;/font&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#334155;fontColor=#ffffff;align=left;spacingLeft=20;fontSize=14;" vertex="1" parent="1">
          <mxGeometry x="30" y="30" width="1690" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 1 CONTAINER -->
        <mxCell id="s1_box" value="&lt;b&gt;STAGE I: INGESTION &amp;amp; CACHE&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#2563eb;strokeWidth=2;dashed=1;fontColor=#2563eb;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="40" y="110" width="300" height="740" as="geometry"/>
        </mxCell>
        <mxCell id="s1_c1" value="&lt;b&gt;1. Multi-Source Raw Ingestion&lt;/b&gt;&lt;hr&gt;• Semantic Scholar REST API (S2AG)&lt;br&gt;• OpenAlex Concepts &amp;amp; Hierarchy&lt;br&gt;• arXiv Metadata &amp;amp; Preprints" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s1_box">
          <mxGeometry x="20" y="50" width="260" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="s1_c2" value="&lt;b&gt;2. Token-Bucket Rate Limiter&lt;/b&gt;&lt;hr&gt;• Capacity C=100, Refill r=1.0/s&lt;br&gt;• HTTP 429 Exponential Backoff&lt;br&gt;• Concurrency Semaphore (k=5)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s1_box">
          <mxGeometry x="20" y="180" width="260" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="s1_c3" value="&lt;b&gt;3. SHA-256 Corpus Caching&lt;/b&gt;&lt;hr&gt;• Hash Key: H(q || N || year)&lt;br&gt;• Persistent Local Lakehouse&lt;br&gt;• Idempotent Corpus Retrieval" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s1_box">
          <mxGeometry x="20" y="310" width="260" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="s1_out" value="&lt;b&gt;Output: Corpus D (N Papers)&lt;/b&gt;&lt;hr&gt;JSON Corpus Record with S2 ID, Title, Abstract, Year, Citations, and Reference Graph." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;align=left;spacingLeft=10;fontSize=11;fontColor=#1e3a8a;" vertex="1" parent="s1_box">
          <mxGeometry x="20" y="450" width="260" height="250" as="geometry"/>
        </mxCell>

        <!-- STAGE 2 CONTAINER -->
        <mxCell id="s2_box" value="&lt;b&gt;STAGE II: EMBED &amp;amp; CLUSTERING&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#fcfaff;strokeColor=#7c3aed;strokeWidth=2;dashed=1;fontColor=#7c3aed;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="380" y="110" width="310" height="740" as="geometry"/>
        </mxCell>
        <mxCell id="s2_c1" value="&lt;b&gt;1. Preprocessing &amp;amp; Filtering&lt;/b&gt;&lt;hr&gt;• SciSpacy Academic Tokenizer&lt;br&gt;• Stopword &amp;amp; Symbol Stripping&lt;br&gt;• Abstract Normalization" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#e9d5ff;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s2_box">
          <mxGeometry x="20" y="50" width="270" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="s2_c2" value="&lt;b&gt;2. Transformer Vectorization&lt;/b&gt;&lt;hr&gt;• SciBERT / SPECTER2 Backbone&lt;br&gt;• Dense Matrix: X in R^(N x 768)&lt;br&gt;• L2-Normalized Unit Vectors" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#e9d5ff;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s2_box">
          <mxGeometry x="20" y="180" width="270" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="s2_c3" value="&lt;b&gt;3. Density Clustering &amp;amp; Topics&lt;/b&gt;&lt;hr&gt;• HDBSCAN (min_cluster=8)&lt;br&gt;• c-TF-IDF Topic Term Extraction&lt;br&gt;• Epistemic Clusters C_1, ..., C_K&lt;br&gt;• Cluster Landmark Anchors" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#e9d5ff;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s2_box">
          <mxGeometry x="20" y="310" width="270" height="130" as="geometry"/>
        </mxCell>
        <mxCell id="s2_out" value="&lt;b&gt;Quality Gate &amp;amp; Validation&lt;/b&gt;&lt;hr&gt;• Silhouette Score: S &gt;= 0.42&lt;br&gt;• Davies-Bouldin: DBI &lt;= 1.35&lt;br&gt;• Outlier Rejection: alpha = 0.05&lt;br&gt;&lt;br&gt;&lt;b&gt;✓ Validated Partitions&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#faf5ff;strokeColor=#a855f7;align=left;spacingLeft=10;fontSize=11;fontColor=#581c87;" vertex="1" parent="s2_box">
          <mxGeometry x="20" y="480" width="270" height="220" as="geometry"/>
        </mxCell>

        <!-- STAGE 3 CONTAINER -->
        <mxCell id="s3_box" value="&lt;b&gt;STAGE III: TOPOLOGY &amp;amp; SPLC&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#f0fdf4;strokeColor=#059669;strokeWidth=2;dashed=1;fontColor=#059669;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="730" y="110" width="310" height="740" as="geometry"/>
        </mxCell>
        <mxCell id="s3_c1" value="&lt;b&gt;1. Citation Graph G=(V, E)&lt;/b&gt;&lt;hr&gt;• Nodes: Papers v_i in V&lt;br&gt;• Edges: Citations e in E&lt;br&gt;• Cycle Elimination -&gt; Strict DAG" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#a7f3d0;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s3_box">
          <mxGeometry x="20" y="50" width="270" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="s3_c2" value="&lt;b&gt;2. SPLC Trajectory Extraction&lt;/b&gt;&lt;hr&gt;SPLC(e) = Sum_s,t [N(s-&gt;e-&gt;t) / N(s-&gt;t)]&lt;br&gt;• Topological Main Path Extraction&lt;br&gt;• Paradigm Shifts &amp;amp; Milestone Epochs" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#a7f3d0;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s3_box">
          <mxGeometry x="20" y="180" width="270" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="s3_c3" value="&lt;b&gt;3. Bipartite Entity Graph B&lt;/b&gt;&lt;hr&gt;• B = (V_P, V_E, E_B)&lt;br&gt;• Entities: Methods, Tasks, Datasets&lt;br&gt;• Cross-Disciplinary Entity Filaments" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#a7f3d0;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s3_box">
          <mxGeometry x="20" y="330" width="270" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="s3_out" value="&lt;b&gt;Topological Lineage Artifacts&lt;/b&gt;&lt;hr&gt;• SPLC Main Path Backbone&lt;br&gt;• Citation Connectivity Matrix&lt;br&gt;• Temporal Milestone Sequences&lt;br&gt;&lt;br&gt;&lt;b&gt;✓ 100% Deterministic Lineages&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ecfdf5;strokeColor=#34d399;align=left;spacingLeft=10;fontSize=11;fontColor=#065f46;" vertex="1" parent="s3_box">
          <mxGeometry x="20" y="480" width="270" height="220" as="geometry"/>
        </mxCell>

        <!-- STAGE 4 CONTAINER -->
        <mxCell id="s4_box" value="&lt;b&gt;STAGE IV: GAPS &amp;amp; LLM RAG&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#fffbeb;strokeColor=#d97706;strokeWidth=2;dashed=1;fontColor=#d97706;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="1080" y="110" width="310" height="740" as="geometry"/>
        </mxCell>
        <mxCell id="s4_c1" value="&lt;b&gt;1. Burt's Structural Holes&lt;/b&gt;&lt;hr&gt;C_i = Sum_j [p_ij + Sum_q (p_iq * p_qj)]^2&lt;br&gt;• Low-Constraint = Boundary Spanners&lt;br&gt;• Method-Application Disconnect Matrix&lt;br&gt;• Novelty &amp;amp; Feasibility Frontier" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#fde68a;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s4_box">
          <mxGeometry x="20" y="50" width="270" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="s4_c2" value="&lt;b&gt;2. Grounded LLM RAG Narration&lt;/b&gt;&lt;hr&gt;• Groq LPU (Llama-3-70B)&lt;br&gt;• Evidence-Grounded Context&lt;br&gt;• Zero-Hallucination DOI Verifier&lt;br&gt;• H_m = (Method_A (x) Domain_B)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#fde68a;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s4_box">
          <mxGeometry x="20" y="200" width="270" height="120" as="geometry"/>
        </mxCell>
        <mxCell id="s4_out" value="&lt;b&gt;Synthesized Grant Hypotheses&lt;/b&gt;&lt;hr&gt;• Structured Operational Hypotheses&lt;br&gt;• Bridge Score: 0.892 (High Novelty)&lt;br&gt;• Algorithmic Protocol &amp;amp; Risk Mitigation&lt;br&gt;• Grounded Citations [Vaswani, Kipf]&lt;br&gt;&lt;br&gt;&lt;b&gt;✓ Grant-Ready Output Proposals&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fffbeb;strokeColor=#f59e0b;align=left;spacingLeft=10;fontSize=11;fontColor=#78350f;" vertex="1" parent="s4_box">
          <mxGeometry x="20" y="360" width="270" height="340" as="geometry"/>
        </mxCell>

        <!-- STAGE 5 CONTAINER -->
        <mxCell id="s5_box" value="&lt;b&gt;STAGE V: 3D WEBGL &amp;amp; HUD&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#0f172a;strokeWidth=2;dashed=1;fontColor=#0f172a;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="1430" y="110" width="280" height="740" as="geometry"/>
        </mxCell>
        <mxCell id="s5_c1" value="&lt;b&gt;1. 3D UMAP Projection&lt;/b&gt;&lt;hr&gt;• X in R^(N x 768) -&gt; Y in R^(N x 3)&lt;br&gt;• Local/Global Manifold Retention&lt;br&gt;• Filament Bridge Coordinates" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s5_box">
          <mxGeometry x="20" y="50" width="240" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="s5_c2" value="&lt;b&gt;2. WebGL Particle Engine&lt;/b&gt;&lt;hr&gt;• GPU Float32BufferAttribute&lt;br&gt;• GLSL Simplex/Curl Noise Shaders&lt;br&gt;• Quintic S-Curve Morphing&lt;br&gt;• 60 FPS Raycasting &amp;amp; Splines" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s5_box">
          <mxGeometry x="20" y="180" width="240" height="110" as="geometry"/>
        </mxCell>
        <mxCell id="s5_out" value="&lt;b&gt;Reactive UI Observatory&lt;/b&gt;&lt;hr&gt;• Stage 00: Search &amp;amp; SSE Stream&lt;br&gt;• Stage 01: Epistemic Archipelago&lt;br&gt;• Stage 02: Citation Timeline (SPLC)&lt;br&gt;• Stage 03: AI Grant Studio" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#334155;align=left;spacingLeft=10;fontSize=11;fontColor=#f8fafc;" vertex="1" parent="s5_box">
          <mxGeometry x="20" y="330" width="240" height="370" as="geometry"/>
        </mxCell>

        <!-- Connecting Horizontal Arrows -->
        <mxCell id="edge1" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#2563eb;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" source="s1_box" target="s2_box" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="edge2" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#7c3aed;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" source="s2_box" target="s3_box" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="edge3" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#059669;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" source="s3_box" target="s4_box" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="edge4" value="" style="endArrow=classic;html=1;strokeWidth=2;strokeColor=#d97706;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" source="s4_box" target="s5_box" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ResearchRadar — IEEE System Architecture</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0f19;
      color: #f8fafc;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }}
    header {{
      background-color: #111827;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1f2937;
      z-index: 10;
    }}
    h1 {{
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .badge {{
      background: #2563eb;
      color: #fff;
      font-size: 11px;
      padding: 3px 9px;
      border-radius: 9999px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }}
    .toolbar {{
      display: flex;
      gap: 8px;
    }}
    button {{
      background: #1f2937;
      color: #f8fafc;
      border: 1px solid #374151;
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }}
    button:hover {{
      background: #374151;
      border-color: #4b5563;
    }}
    button.primary {{
      background: #2563eb;
      border-color: #3b82f6;
    }}
    button.primary:hover {{
      background: #1d4ed8;
    }}
    #viewer-container {{
      flex: 1;
      position: relative;
      overflow: hidden;
      background: #030712;
      cursor: grab;
      display: flex;
      justify-content: center;
      align-items: center;
    }}
    #viewer-container:active {{
      cursor: grabbing;
    }}
    #svg-wrapper {{
      transform-origin: center center;
      transition: transform 0.05s linear;
      width: 95%;
      height: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
    }}
    #svg-wrapper svg {{
      max-width: 100%;
      max-height: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      border-radius: 8px;
    }}
    .controls-hint {{
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(17, 24, 39, 0.9);
      backdrop-filter: blur(10px);
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 12.5px;
      color: #94a3b8;
      border: 1px solid #374151;
      pointer-events: none;
    }}
  </style>
</head>
<body>
  <header>
    <h1>
      <span>ResearchRadar — IEEE System Architecture</span>
      <span class="badge">IEEE Transactions 16:9</span>
    </h1>
    <div class="toolbar">
      <button onclick="zoomIn()">🔍 Zoom In (+)</button>
      <button onclick="zoomOut()">🔍 Zoom Out (-)</button>
      <button onclick="resetZoom()">⟲ Reset</button>
      <button class="primary" onclick="downloadSVG()">⬇ Download Vector SVG (for PPT)</button>
      <button onclick="openDrawIO()">✏ Open app.diagrams.net</button>
    </div>
  </header>

  <div id="viewer-container">
    <div id="svg-wrapper">
      {svg_content}
    </div>
    <div class="controls-hint">
      💡 <b>Presentation Tip:</b> Drag SVG directly into PowerPoint (Insert &gt; Picture). Right click &gt; 'Convert to Shape' to animate individual stages!
    </div>
  </div>

  <script>
    let scale = 1;
    let pointX = 0;
    let pointY = 0;
    let startX = 0;
    let startY = 0;
    let isPanning = false;
    const wrapper = document.getElementById('svg-wrapper');
    const container = document.getElementById('viewer-container');

    function updateTransform() {{
      wrapper.style.transform = `translate(${{pointX}}px, ${{pointY}}px) scale(${{scale}})`;
    }}

    function zoomIn() {{
      scale = Math.min(scale * 1.25, 6);
      updateTransform();
    }}

    function zoomOut() {{
      scale = Math.max(scale / 1.25, 0.35);
      updateTransform();
    }}

    function resetZoom() {{
      scale = 1;
      pointX = 0;
      pointY = 0;
      updateTransform();
    }}

    container.addEventListener('wheel', (e) => {{
      e.preventDefault();
      const xs = (e.clientX - pointX) / scale;
      const ys = (e.clientY - pointY) / scale;
      const delta = -e.deltaY;
      
      if (delta > 0) {{
        scale = Math.min(scale * 1.12, 6);
      }} else {{
        scale = Math.max(scale / 1.12, 0.35);
      }}
      
      pointX = e.clientX - xs * scale;
      pointY = e.clientY - ys * scale;
      updateTransform();
    }});

    container.addEventListener('mousedown', (e) => {{
      if (e.target.tagName === 'BUTTON') return;
      isPanning = true;
      startX = e.clientX - pointX;
      startY = e.clientY - pointY;
    }});

    window.addEventListener('mousemove', (e) => {{
      if (!isPanning) return;
      pointX = e.clientX - startX;
      pointY = e.clientY - startY;
      updateTransform();
    }});

    window.addEventListener('mouseup', () => {{
      isPanning = false;
    }});

    function downloadSVG() {{
      const svgData = document.querySelector('#svg-wrapper svg').outerHTML;
      const blob = new Blob([svgData], {{ type: 'image/svg+xml;charset=utf-8' }});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ResearchRadar_System_Architecture_IEEE.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}

    function openDrawIO() {{
      window.open('https://app.diagrams.net/', '_blank');
    }}
  </script>
</body>
</html>"""

    with open('diagrams/researchradar_system_architecture.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print('Generated: diagrams/researchradar_system_architecture.svg')

    with open('diagrams/researchradar_system_architecture.drawio', 'w', encoding='utf-8') as f:
        f.write(drawio_content)
    print('Generated: diagrams/researchradar_system_architecture.drawio')

    with open('diagrams/researchradar_system_architecture.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print('Generated: diagrams/researchradar_system_architecture.html')

if __name__ == '__main__':
    run()

