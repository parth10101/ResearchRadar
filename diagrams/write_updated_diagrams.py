import os

def generate():
    os.makedirs("diagrams", exist_ok=True)

    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1850 1000" width="100%" height="100%" style="background-color: #ffffff; font-family: 'Times New Roman', Times, 'Computer Modern Serif', serif;">
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
  <rect x="25" y="25" width="1800" height="950" rx="8" fill="#ffffff" stroke="#334155" stroke-width="1.8" filter="url(#shadow)"/>

  <!-- Main IEEE Title Header -->
  <g id="header">
    <rect x="25" y="25" width="1800" height="72" rx="8" fill="#0f172a"/>
    <text x="48" y="58" fill="#ffffff" font-size="21" font-weight="bold" font-family="'Times New Roman', serif" letter-spacing="0.3">Fig. 1. End-to-End System Architecture of Autonomous Scientometric Intelligence Engine (ResearchRadar)</text>
    <text x="48" y="80" fill="#94a3b8" font-size="12.5" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">IEEE Double-Column Blueprint: Ingestion &bull; SPECTER/BM25 &bull; HDBSCAN/c-TF-IDF &bull; Citation DAG &amp; SPLC Main Path &bull; Heterogeneous KG &bull; 4-Tier Gap Engine &bull; Groq RAG</text>
    
    <rect x="1360" y="45" width="445" height="36" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <circle cx="1380" cy="63" r="5" fill="#2563eb"/>
    <text x="1392" y="67" fill="#f8fafc" font-size="11" font-family="sans-serif">Ingestion</text>
    <circle cx="1465" cy="63" r="5" fill="#7c3aed"/>
    <text x="1477" y="67" fill="#f8fafc" font-size="11" font-family="sans-serif">Representation</text>
    <circle cx="1580" cy="63" r="5" fill="#059669"/>
    <text x="1592" y="67" fill="#f8fafc" font-size="11" font-family="sans-serif">Graph &amp; SPLC</text>
    <circle cx="1695" cy="63" r="5" fill="#d97706"/>
    <text x="1707" y="67" fill="#f8fafc" font-size="11" font-family="sans-serif">Gaps &amp; UI</text>
  </g>

  <!-- ======================================================== -->
  <!-- COLUMN 1: STAGE I - DATA INGESTION & SCIENTOMETRIC CORPUS -->
  <!-- ======================================================== -->
  <g id="stage1" transform="translate(45, 115)">
    <rect x="0" y="0" width="320" height="780" rx="6" fill="#f8fafc" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="320" height="42" rx="6" fill="#2563eb"/>
    <text x="14" y="26" fill="#ffffff" font-size="13.5" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGE 1: INGESTION &amp; CACHE</text>
    
    <g transform="translate(16, 54)">
      <rect x="0" y="0" width="288" height="125" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">1. Multi-Source Scientometric Ingestion</text>
      <line x1="12" y1="32" x2="276" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="52" fill="#334155" font-size="11">&bull; Semantic Scholar API (S2AG Graph REST)</text>
      <text x="12" y="72" fill="#334155" font-size="11">&bull; OpenAlex Concepts &amp; Hierarchical Taxonomy</text>
      <text x="12" y="92" fill="#334155" font-size="11">&bull; arXiv Metadata, Category Preprints &amp; DOIs</text>
      <text x="12" y="112" fill="#334155" font-size="11">&bull; Corpus Query Budget: N in [300, 3000] Papers</text>
    </g>

    <line x1="160" y1="184" x2="160" y2="206" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(16, 208)">
      <rect x="0" y="0" width="288" height="115" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">2. Token-Bucket Rate Limiter</text>
      <line x1="12" y1="32" x2="276" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; Bucket Capacity C=100, Refill Rate r=1.0/s</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; HTTP 429 Exponential Backoff + Jitter</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; Concurrency Semaphore (k=5 parallel)</text>
      <text x="12" y="108" fill="#1e40af" font-size="10.5" font-style="italic">Persistent Rate State Tracking in S2 Client</text>
    </g>

    <line x1="160" y1="328" x2="160" y2="350" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(16, 352)">
      <rect x="0" y="0" width="288" height="115" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#0f172a" font-size="13" font-weight="bold">3. SHA-256 Corpus Caching</text>
      <line x1="12" y1="32" x2="276" y2="32" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="50" fill="#334155" font-size="11">&bull; Cache Hash: H(query || N || year_filter)</text>
      <text x="12" y="70" fill="#334155" font-size="11">&bull; Local Persistent JSON Lakehouse (data/cache/)</text>
      <text x="12" y="90" fill="#334155" font-size="11">&bull; Idempotent Instant Sub-Millisecond Replay</text>
      <text x="12" y="108" fill="#1e40af" font-size="10.5" font-style="italic">DuckDB Parquet / JSON Mirror Storage</text>
    </g>

    <line x1="160" y1="472" x2="160" y2="494" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <g transform="translate(16, 496)">
      <rect x="0" y="0" width="288" height="265" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#1e3a8a" font-size="13" font-weight="bold">Output: Corpus D (N Paper Records)</text>
      <line x1="12" y1="32" x2="276" y2="32" stroke="#bfdbfe" stroke-width="1"/>
      
      <rect x="12" y="42" width="264" height="208" rx="4" fill="#ffffff" stroke="#93c5fd" stroke-width="1"/>
      <text x="20" y="64" fill="#1e293b" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold">{</text>
      <text x="28" y="84" fill="#0369a1" font-family="'Courier New', monospace" font-size="10">"paper_id": "s2_64a9f...",</text>
      <text x="28" y="104" fill="#0369a1" font-family="'Courier New', monospace" font-size="10">"title": "GNN Drug Discovery...",</text>
      <text x="28" y="124" fill="#0369a1" font-family="'Courier New', monospace" font-size="10">"abstract": "We propose...",</text>
      <text x="28" y="144" fill="#0369a1" font-family="'Courier New', monospace" font-size="10">"year": 2024, "citations": 142,</text>
      <text x="28" y="164" fill="#0369a1" font-family="'Courier New', monospace" font-size="10">"venue": "NeurIPS 2024",</text>
      <text x="28" y="184" fill="#0369a1" font-family="'Courier New', monospace" font-size="10">"references": ["s2_ref1", ...],</text>
      <text x="28" y="204" fill="#0369a1" font-family="'Courier New', monospace" font-size="10">"concepts": ["Molecular Graph", ...]</text>
      <text x="20" y="224" fill="#1e293b" font-family="'Courier New', monospace" font-size="10.5" font-weight="bold">}</text>
      <text x="20" y="242" fill="#047857" font-size="10" font-weight="bold">&check; Strict Scientometric Normalization</text>
    </g>
  </g>

  <!-- Connect Stage 1 -> Stage 2 -->
  <path d="M 365 500 L 395 500" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <text x="366" y="490" fill="#1d4ed8" font-size="11" font-weight="bold" font-family="sans-serif">Corpus D</text>

  <!-- ======================================================== -->
  <!-- COLUMN 2: STAGES 2, 3 & 4 - SEMANTIC REPRESENTATION & TOPICS -->
  <!-- ======================================================== -->
  <g id="stage2" transform="translate(400, 115)">
    <rect x="0" y="0" width="330" height="780" rx="6" fill="#fcfaff" stroke="#7c3aed" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="330" height="42" rx="6" fill="#7c3aed"/>
    <text x="14" y="26" fill="#ffffff" font-size="13.5" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGES 2-4: EMBED &amp; CLUSTERING</text>

    <!-- Stage 2: Lexical Ranking & Tokenizer -->
    <g transform="translate(16, 54)">
      <rect x="0" y="0" width="298" height="125" rx="5" fill="#ffffff" stroke="#e9d5ff" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Stage 2: Okapi BM25 &amp; Preprocessing</text>
      <line x1="12" y1="30" x2="286" y2="30" stroke="#f3e8ff" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">&bull; SciSpacy Academic Tokenizer &amp; Stopwords</text>
      <text x="12" y="66" fill="#334155" font-size="10.5">&bull; Robertson et al. (TREC-3) BM25 Formulation:</text>
      <text x="20" y="86" fill="#581c87" font-size="10.5" font-weight="bold">Score(D, Q) = Sum_i [IDF(q_i) &bull; f(q_i,D)(k_1+1) / (f + k_1(1-b+b|D|/avgdl))]</text>
      <text x="12" y="106" fill="#334155" font-size="10.5">&bull; Parameters: k_1 = 1.5, b = 0.75, English Filter</text>
    </g>

    <line x1="165" y1="184" x2="165" y2="204" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Stage 3: SPECTER Embeddings -->
    <g transform="translate(16, 206)">
      <rect x="0" y="0" width="298" height="140" rx="5" fill="#ffffff" stroke="#e9d5ff" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Stage 3: SPECTER Transformer Embedding</text>
      <line x1="12" y1="30" x2="286" y2="30" stroke="#f3e8ff" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">&bull; Cohan et al. (ACL 2020) Citation-Informed Model</text>
      <text x="12" y="66" fill="#334155" font-size="10.5">&bull; Triplet Margin Loss on Citation Pairs (d_i, d_j, d_k):</text>
      <text x="20" y="86" fill="#581c87" font-size="10.5" font-weight="bold">L = max(0, ||e_i - e_j||_2^2 - ||e_i - e_k||_2^2 + m)</text>
      <text x="12" y="106" fill="#334155" font-size="10.5">&bull; Dense Embedding Matrix: X in R^(N x 768)</text>
      <text x="12" y="124" fill="#334155" font-size="10.5">&bull; L_2 Normalized + AVX2 Accelerated Cosine Math</text>
    </g>

    <line x1="165" y1="351" x2="165" y2="370" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Stage 4: HDBSCAN & c-TF-IDF -->
    <g transform="translate(16, 372)">
      <rect x="0" y="0" width="298" height="185" rx="5" fill="#ffffff" stroke="#e9d5ff" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Stage 4: HDBSCAN &amp; c-TF-IDF Topics</text>
      <line x1="12" y1="30" x2="286" y2="30" stroke="#f3e8ff" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">&bull; McInnes et al. (JOSS 2017) HDBSCAN Hierarchy</text>
      <text x="12" y="66" fill="#334155" font-size="10.5">&bull; min_cluster_size = 8, lambda-persistence</text>
      <text x="12" y="86" fill="#334155" font-size="10.5">&bull; Grootendorst (2022) Class-based TF-IDF:</text>
      <text x="20" y="108" fill="#581c87" font-size="10.5" font-weight="bold">W_(t,c) = ||tf_(t,c)|| &bull; log(1 + A / Sum_c' ||tf_(t,c')||)</text>
      <text x="12" y="130" fill="#334155" font-size="10.5">&bull; Discovers Thematic Clusters C_1, ..., C_K</text>
      <text x="12" y="148" fill="#334155" font-size="10.5">&bull; Cluster Landmark Anchor Papers (Highest Centrality)</text>
      <text x="12" y="168" fill="#334155" font-size="10.5">&bull; Semantic Filaments connecting proximal clusters</text>
    </g>

    <line x1="165" y1="562" x2="165" y2="582" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Quality Gate Evaluation -->
    <g transform="translate(16, 584)">
      <rect x="0" y="0" width="298" height="178" rx="5" fill="#faf5ff" stroke="#a855f7" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#581c87" font-size="13" font-weight="bold">Scientometric Quality Gate</text>
      <line x1="12" y1="32" x2="286" y2="32" stroke="#e9d5ff" stroke-width="1"/>
      <text x="12" y="52" fill="#334155" font-size="11">&bull; Silhouette Score Gate: S &gt;= 0.42</text>
      <text x="12" y="74" fill="#334155" font-size="11">&bull; Davies-Bouldin Index Gate: DBI &lt;= 1.35</text>
      <text x="12" y="96" fill="#334155" font-size="11">&bull; Statistical Outlier Rejection Threshold alpha = 0.05</text>
      
      <rect x="12" y="116" width="274" height="44" rx="4" fill="#f3e8ff" stroke="#c084fc" stroke-width="1"/>
      <text x="20" y="144" fill="#6b21a8" font-size="11" font-weight="bold">&check; Rigorous Cluster Partitions &amp; Metrics</text>
    </g>
  </g>

  <!-- Connect Stage 2 -> Stage 3 -->
  <path d="M 730 500 L 760 500" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrow-purple)"/>
  <text x="732" y="490" fill="#6d28d9" font-size="11" font-weight="bold" font-family="sans-serif">Clusters</text>

  <!-- ======================================================== -->
  <!-- COLUMN 3: STAGES 5A & 5B - CITATION DAG, SPLC & KNOWLEDGE GRAPH -->
  <!-- ======================================================== -->
  <g id="stage3" transform="translate(765, 115)">
    <rect x="0" y="0" width="345" height="780" rx="6" fill="#f0fdf4" stroke="#059669" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="345" height="42" rx="6" fill="#059669"/>
    <text x="14" y="26" fill="#ffffff" font-size="13.5" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGE 5: CITATION DAG &amp; HETERO KG</text>

    <!-- Stage 5A: Citation DAG & SPLC Main Path -->
    <g transform="translate(16, 54)">
      <rect x="0" y="0" width="313" height="185" rx="5" fill="#ffffff" stroke="#a7f3d0" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Stage 5A: SPLC Main Path Analysis</text>
      <line x1="12" y1="30" x2="301" y2="30" stroke="#d1fae5" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">&bull; Citation Directed Acyclic Graph G = (V, E)</text>
      <text x="12" y="66" fill="#334155" font-size="10.5">&bull; Batagelj (2003) Search Path Link Count (SPLC):</text>
      <text x="20" y="88" fill="#065f46" font-size="10.5" font-weight="bold">SPLC(e) = [N_sources(u) &bull; N_sinks(v)] / N_total_paths</text>
      <text x="12" y="108" fill="#334155" font-size="10.5">&bull; Traversal Lineage: P_main = argmax Sum SPLC(e)</text>
      <text x="12" y="128" fill="#334155" font-size="10.5">&bull; Price Index (Price 1965): P_k = Ref_recent / Ref_total</text>
      <text x="12" y="148" fill="#334155" font-size="10.5">&bull; Kleinberg (2002) Burst Detection Automaton (sigma)</text>
      <text x="12" y="168" fill="#047857" font-size="10.5" font-weight="bold">&bull; Detects Paradigm Shift Milestones &amp; Epochs</text>
    </g>

    <line x1="172" y1="244" x2="172" y2="265" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Stage 5B: Multi-Entity Heterogeneous KG -->
    <g transform="translate(16, 268)">
      <rect x="0" y="0" width="313" height="200" rx="5" fill="#ffffff" stroke="#a7f3d0" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Stage 5B: Heterogeneous Knowledge Graph</text>
      <line x1="12" y1="30" x2="301" y2="30" stroke="#d1fae5" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">&bull; Multi-Entity Node Partitions V_KG = V_P U V_T U V_M U V_D U V_A:</text>
      
      <!-- Entity Legend Pills -->
      <g transform="translate(14, 58)">
        <rect x="0" y="0" width="52" height="20" rx="3" fill="#388bfd"/>
        <text x="6" y="14" fill="#fff" font-size="9.5" font-family="sans-serif">📄 Paper</text>
        
        <rect x="58" y="0" width="52" height="20" rx="3" fill="#a371f7"/>
        <text x="64" y="14" fill="#fff" font-size="9.5" font-family="sans-serif">🏷 Topic</text>

        <rect x="116" y="0" width="58" height="20" rx="3" fill="#3fb950"/>
        <text x="122" y="14" fill="#fff" font-size="9.5" font-family="sans-serif">⚙️ Method</text>

        <rect x="180" y="0" width="58" height="20" rx="3" fill="#f0883e"/>
        <text x="186" y="14" fill="#fff" font-size="9.5" font-family="sans-serif">💾 Dataset</text>

        <rect x="244" y="0" width="44" height="20" rx="3" fill="#db6d28"/>
        <text x="248" y="14" fill="#fff" font-size="9.5" font-family="sans-serif">👤 Author</text>
      </g>
      
      <text x="12" y="102" fill="#334155" font-size="10.5">&bull; Bipartite Incidence Matrix: A in R^(|V_Paper| x |V_Entity|)</text>
      <text x="12" y="122" fill="#334155" font-size="10.5">&bull; Projected Co-Occurrence Matrix: C = A &bull; A^T</text>
      <text x="12" y="142" fill="#334155" font-size="10.5">&bull; Unexplored (Method x Dataset) Cross-Domain Matrix</text>
      <text x="12" y="162" fill="#334155" font-size="10.5">&bull; Author-Discipline Community Modularity Scoring</text>
      <text x="12" y="182" fill="#047857" font-size="10.5" font-weight="bold">&check; Produces data/output/knowledge_graph_stats.json</text>
    </g>

    <line x1="172" y1="473" x2="172" y2="494" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Graph Artifacts Output Box -->
    <g transform="translate(16, 496)">
      <rect x="0" y="0" width="313" height="265" rx="5" fill="#ecfdf5" stroke="#34d399" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#065f46" font-size="13" font-weight="bold">Topological &amp; Lineage Artifacts</text>
      <line x1="12" y1="32" x2="301" y2="32" stroke="#a7f3d0" stroke-width="1"/>
      
      <rect x="12" y="42" width="289" height="208" rx="4" fill="#ffffff" stroke="#6ee7b7" stroke-width="1"/>
      <text x="20" y="64" fill="#065f46" font-size="11" font-weight="bold">&bull; Main Path SPLC Backbone:</text>
      <text x="20" y="82" fill="#1e293b" font-size="10.5" font-style="italic">Root S2 Paper -&gt; Milestone 1 -&gt; Frontier 2024</text>
      <text x="20" y="106" fill="#065f46" font-size="11" font-weight="bold">&bull; Price Literature Immediacy:</text>
      <text x="20" y="124" fill="#334155" font-size="10.5">P_(3yr) = 0.684 (High-Velocity Field Velocity)</text>
      <text x="20" y="148" fill="#065f46" font-size="11" font-weight="bold">&bull; Citation Burst Intensity:</text>
      <text x="20" y="166" fill="#334155" font-size="10.5">sigma = 14.82 (Active Kleinberg Surge Phase)</text>
      <text x="20" y="190" fill="#065f46" font-size="11" font-weight="bold">&bull; Co-Citation Conductance Deficit:</text>
      <text x="20" y="208" fill="#334155" font-size="10.5">0.842 Disconnect between GNN &amp; Clinical Data</text>
      <text x="20" y="232" fill="#047857" font-size="10.5" font-weight="bold">&check; 100% Deterministic Mathematical Grounding</text>
    </g>
  </g>

  <!-- Connect Stage 3 -> Stage 4 -->
  <path d="M 1110 500 L 1140 500" stroke="#059669" stroke-width="2" marker-end="url(#arrow-emerald)"/>
  <text x="1112" y="490" fill="#047857" font-size="11" font-weight="bold" font-family="sans-serif">Graphs</text>

  <!-- ======================================================== -->
  <!-- COLUMN 4: STAGES 6, 7 & 8 - 4-TIER GAP ENGINE & GROQ RAG -->
  <!-- ======================================================== -->
  <g id="stage4" transform="translate(1145, 115)">
    <rect x="0" y="0" width="345" height="780" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="345" height="42" rx="6" fill="#d97706"/>
    <text x="14" y="26" fill="#ffffff" font-size="13.5" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGES 6-8: 4-TIER GAPS &amp; LLM RAG</text>

    <!-- Stage 7: 4-Tier Scientific Gap Discovery Engine -->
    <g transform="translate(16, 54)">
      <rect x="0" y="0" width="313" height="205" rx="5" fill="#ffffff" stroke="#fde68a" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Stage 7: 4-Tier Scientific Gap Discovery</text>
      <line x1="12" y1="30" x2="301" y2="30" stroke="#fef3c7" stroke-width="1"/>
      
      <text x="12" y="48" fill="#92400e" font-size="10.5" font-weight="bold">1. G_combo (Uzzi Science 2013 Atypical z-Score):</text>
      <text x="20" y="66" fill="#334155" font-size="10">z_ij = - sqrt([k_i &bull; k_j &bull; (N-1)] / [(N - k_i)(N - k_j)])</text>
      
      <text x="12" y="88" fill="#92400e" font-size="10.5" font-weight="bold">2. G_bridge (Boyack JASIST 2010 Conductance Deficit):</text>
      <text x="20" y="106" fill="#334155" font-size="10">Deficit(T_1,T_2) = 1 - [C(T_1,T_2) / sqrt(deg(T_1)&bull;deg(T_2))]</text>

      <text x="12" y="128" fill="#92400e" font-size="10.5" font-weight="bold">3. G_sparse (Campello TKDD 2015 GLOSH Outlier):</text>
      <text x="20" y="146" fill="#334155" font-size="10">GLOSH(p) = 1 - [lambda(p) / lambda_max(C_p)]</text>

      <text x="12" y="168" fill="#92400e" font-size="10.5" font-weight="bold">4. G_temporal (Bornmann JASIST 2015 CAGR Velocity):</text>
      <text x="20" y="186" fill="#334155" font-size="10">CAGR = (V_end / V_start)^(1 / delta_t) - 1</text>
    </g>

    <line x1="172" y1="264" x2="172" y2="284" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Stage 8: Groq / Llama-3 Grounded Hypothesis Synthesis -->
    <g transform="translate(16, 286)">
      <rect x="0" y="0" width="313" height="165" rx="5" fill="#ffffff" stroke="#fde68a" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Stage 8: Groq LLM Grounded Hypothesis</text>
      <line x1="12" y1="30" x2="301" y2="30" stroke="#fef3c7" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">&bull; Groq LPU Inference (Llama-3-70B RAG Pipeline)</text>
      <text x="12" y="68" fill="#334155" font-size="10.5">&bull; Grounded Operational Hypothesis Formulation:</text>
      <text x="20" y="90" fill="#b45309" font-size="11" font-weight="bold">H_m = (Method_A (x) Domain_B) with Formal Protocol</text>
      <text x="12" y="110" fill="#334155" font-size="10.5">&bull; Real-time Literature DOI &amp; S2 Verifier</text>
      <text x="12" y="130" fill="#334155" font-size="10.5">&bull; Zero-Hallucination Claim Validation Loop</text>
      <text x="12" y="150" fill="#334155" font-size="10.5">&bull; Experimental Methodology &amp; Risk Mitigation Matrix</text>
    </g>

    <line x1="172" y1="456" x2="172" y2="476" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Grant Proposal Output Artifacts -->
    <g transform="translate(16, 478)">
      <rect x="0" y="0" width="313" height="283" rx="5" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#78350f" font-size="13" font-weight="bold">Synthesized Grant Proposals (Grant Studio)</text>
      <line x1="12" y1="32" x2="301" y2="32" stroke="#fde68a" stroke-width="1"/>
      
      <rect x="12" y="42" width="289" height="226" rx="4" fill="#ffffff" stroke="#fcd34d" stroke-width="1"/>
      <text x="20" y="64" fill="#92400e" font-size="10.5" font-weight="bold">&bull; Operational Hypothesis Title:</text>
      <text x="20" y="82" fill="#1e293b" font-size="10" font-style="italic">"Equivariant Flow Matching on Sparse Binding Pockets"</text>
      
      <text x="20" y="104" fill="#92400e" font-size="10.5" font-weight="bold">&bull; Composite Gap Novelty Score:</text>
      <text x="20" y="122" fill="#047857" font-size="10" font-weight="bold">0.914 (Uzzi |z|=3.84, Conductance Deficit=0.89)</text>

      <text x="20" y="144" fill="#92400e" font-size="10.5" font-weight="bold">&bull; Algorithmic Experimental Methodology:</text>
      <text x="20" y="162" fill="#334155" font-size="9.5">SE(3)-equivariant continuous vector field regression on PDBbind</text>

      <text x="20" y="184" fill="#92400e" font-size="10.5" font-weight="bold">&bull; Technical Risk &amp; Fallback Strategy:</text>
      <text x="20" y="202" fill="#334155" font-size="9.5">Rotational instability addressed via Lie algebra regularization</text>

      <text x="20" y="224" fill="#92400e" font-size="10.5" font-weight="bold">&bull; Grounded Citations:</text>
      <text x="130" y="224" fill="#2563eb" font-size="9.5">[Lipman'23, Corso'22, Satorras'21]</text>
      
      <text x="20" y="250" fill="#047857" font-size="10" font-weight="bold">&check; Direct Export to NSF / NIH / NSFC Format</text>
    </g>
  </g>

  <!-- Connect Stage 4 -> Stage 5 -->
  <path d="M 1490 500 L 1515 500" stroke="#d97706" stroke-width="2" marker-end="url(#arrow-amber)"/>
  <text x="1490" y="490" fill="#b45309" font-size="11" font-weight="bold" font-family="sans-serif">Visual</text>

  <!-- ======================================================== -->
  <!-- COLUMN 5: STAGE 6 & FRONTEND - 3D WEBGL & OBSERVATORY HUD -->
  <!-- ======================================================== -->
  <g id="stage5" transform="translate(1520, 115)">
    <rect x="0" y="0" width="295" height="780" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="1.8" stroke-dasharray="6,4"/>
    <rect x="0" y="0" width="295" height="42" rx="6" fill="#0f172a"/>
    <text x="14" y="26" fill="#ffffff" font-size="13.5" font-weight="bold" font-family="'Helvetica Neue', sans-serif">STAGE 6 &amp; WEBGL UI OBSERVATORY</text>

    <!-- Stage 6: 3D UMAP Manifold Projection -->
    <g transform="translate(16, 54)">
      <rect x="0" y="0" width="263" height="125" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Stage 6: 3D UMAP Manifold</text>
      <line x1="12" y1="30" x2="251" y2="30" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">&bull; X in R^(N x 768) -&gt; Y in R^(N x 3)</text>
      <text x="12" y="68" fill="#334155" font-size="10.5">&bull; n_neighbors = 15, min_dist = 0.1</text>
      <text x="12" y="88" fill="#334155" font-size="10.5">&bull; Preserves Geodesic &amp; Local Topology</text>
      <text x="12" y="108" fill="#334155" font-size="10.5">&bull; GPU Float32BufferAttribute Gen</text>
    </g>

    <line x1="147" y1="184" x2="147" y2="204" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Persistent AstraParticleWorld WebGL Engine -->
    <g transform="translate(16, 206)">
      <rect x="0" y="0" width="263" height="140" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#card-shadow)"/>
      <text x="12" y="22" fill="#0f172a" font-size="12.5" font-weight="bold">Three.js WebGL Particle Engine</text>
      <line x1="12" y1="30" x2="251" y2="30" stroke="#e2e8f0" stroke-width="1"/>
      <text x="12" y="48" fill="#334155" font-size="10.5">&bull; Single Persistent Canvas (AstraWorld)</text>
      <text x="12" y="68" fill="#334155" font-size="10.5">&bull; GLSL Simplex/Curl Noise GPU Shaders</text>
      <text x="12" y="88" fill="#334155" font-size="10.5">&bull; Quintic S-Curve Morphing Rig</text>
      <text x="12" y="108" fill="#334155" font-size="10.5">&bull; 60 FPS GPU Raycasting Selection</text>
      <text x="12" y="128" fill="#334155" font-size="10.5">&bull; 3D Spline Camera Flight Controller</text>
    </g>

    <line x1="147" y1="351" x2="147" y2="370" stroke="#1e293b" stroke-width="1.5" marker-end="url(#arrow)"/>

    <!-- Reactive HUD Stages 00 to 03 -->
    <g transform="translate(16, 372)">
      <rect x="0" y="0" width="263" height="390" rx="5" fill="#0f172a" stroke="#334155" stroke-width="1.4" filter="url(#card-shadow)"/>
      <text x="12" y="24" fill="#f8fafc" font-size="13" font-weight="bold">4 Reactive UI Observatory Views</text>
      <line x1="12" y1="32" x2="251" y2="32" stroke="#334155" stroke-width="1"/>

      <rect x="12" y="42" width="239" height="72" rx="4" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <text x="18" y="62" fill="#60a5fa" font-size="11" font-weight="bold">Stage 00: Search &amp; SSE Stream</text>
      <text x="18" y="80" fill="#cbd5e1" font-size="10">Corpus budget [300, 3k], presets,</text>
      <text x="18" y="98" fill="#93c5fd" font-size="9.5">live 8-stage backend SSE reasoning stream</text>

      <rect x="12" y="122" width="239" height="72" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="1"/>
      <text x="18" y="142" fill="#c084fc" font-size="11" font-weight="bold">Stage 01: Epistemic Archipelago</text>
      <text x="18" y="160" fill="#cbd5e1" font-size="10">54% 3D WebGL stage + 46% glass directory,</text>
      <text x="18" y="178" fill="#d8b4fe" font-size="9.5">deep-dive landmark inspection panel</text>

      <rect x="12" y="202" width="239" height="72" rx="4" fill="#1e293b" stroke="#34d399" stroke-width="1"/>
      <text x="18" y="222" fill="#4ade80" font-size="11" font-weight="bold">Stage 02: Citation Timeline (SPLC)</text>
      <text x="18" y="240" fill="#cbd5e1" font-size="10">Batagelj SPLC main path, milestone epochs,</text>
      <text x="18" y="258" fill="#86efac" font-size="9.5">Price index &amp; Kleinberg burst sparks</text>

      <rect x="12" y="282" width="239" height="72" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="1"/>
      <text x="18" y="302" fill="#fcd34d" font-size="11" font-weight="bold">Stage 03: AI Grant Studio</text>
      <text x="18" y="320" fill="#cbd5e1" font-size="10">Grounded hypotheses, risk matrices,</text>
      <text x="18" y="338" fill="#fef08a" font-size="9.5">NSF/NIH grant proposal markdown export</text>

      <text x="18" y="372" fill="#94a3b8" font-size="10" font-style="italic">Single-Page Architecture with persistent WebGL</text>
    </g>
  </g>

  <!-- Global Footer Note -->
  <g id="footer" transform="translate(45, 915)">
    <line x1="0" y1="0" x2="1770" y2="0" stroke="#cbd5e1" stroke-width="1"/>
    <text x="0" y="24" fill="#475569" font-size="12" font-family="'Times New Roman', serif">
      <tspan font-weight="bold">Theoretical Rigor &amp; Reproducibility:</tspan> All graph topologies and statistical matrices (Okapi BM25, SPECTER triplet loss, Batagelj SPLC, Price Index, Kleinberg Burst, Uzzi z-score, Boyack Conductance, Campello GLOSH) operate with deterministic mathematical guarantees before heuristic Groq LLM synthesis.
    </text>
    <text x="1360" y="24" fill="#64748b" font-size="11.5" font-family="'Helvetica Neue', sans-serif">
      Backend: FastAPI + DuckDB + NetworkX | Frontend: Three.js + React 18
    </text>
  </g>
</svg>"""

    drawio_content = """<mxfile host="app.diagrams.net" modified="2026-09-20T18:00:00.000Z" agent="ResearchRadar-DrawioSkill" version="24.7.5">
  <diagram id="ieee-sys-arch" name="IEEE System Architecture">
    <mxGraphModel dx="1800" dy="950" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1850" pageHeight="1000" math="1" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <mxCell id="hdr" value="&lt;b&gt;Fig. 1. End-to-End System Architecture of Autonomous Scientometric Intelligence Engine (ResearchRadar)&lt;/b&gt;&lt;br&gt;&lt;font style=&quot;font-size: 11px; color: #94a3b8;&quot;&gt;IEEE Format • Ingestion • SPECTER/BM25 • HDBSCAN/c-TF-IDF • Citation DAG &amp;amp; SPLC Main Path • Hetero KG • 4-Tier Gap Engine • Groq RAG&lt;/font&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#334155;fontColor=#ffffff;align=left;spacingLeft=20;fontSize=14;" vertex="1" parent="1">
          <mxGeometry x="30" y="30" width="1790" height="60" as="geometry"/>
        </mxCell>

        <!-- STAGE 1 CONTAINER -->
        <mxCell id="s1_box" value="&lt;b&gt;STAGE 1: INGESTION &amp;amp; CACHE&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#2563eb;strokeWidth=2;dashed=1;fontColor=#2563eb;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="40" y="110" width="320" height="780" as="geometry"/>
        </mxCell>
        <mxCell id="s1_c1" value="&lt;b&gt;1. Multi-Source Scientometric Ingestion&lt;/b&gt;&lt;hr&gt;• Semantic Scholar REST API (S2AG Graph)&lt;br&gt;• OpenAlex Concept Hierarchy Taxonomy&lt;br&gt;• arXiv Preprints, Categories &amp;amp; DOIs&lt;br&gt;• Corpus Size N in [300, 3000]" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s1_box">
          <mxGeometry x="15" y="45" width="290" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="s1_c2" value="&lt;b&gt;2. Token-Bucket Rate Limiter&lt;/b&gt;&lt;hr&gt;• Bucket Capacity C=100, Refill r=1.0/s&lt;br&gt;• HTTP 429 Exponential Backoff + Jitter&lt;br&gt;• Concurrency Semaphore (k=5 parallel)&lt;br&gt;• Persistent S2 Client Rate State" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s1_box">
          <mxGeometry x="15" y="165" width="290" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="s1_c3" value="&lt;b&gt;3. SHA-256 Corpus Caching&lt;/b&gt;&lt;hr&gt;• Hash Key: H(q || N || year_filter)&lt;br&gt;• Local Persistent JSON Lakehouse&lt;br&gt;• Idempotent Instant Sub-MS Retrieval&lt;br&gt;• DuckDB Parquet Storage Mirror" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s1_box">
          <mxGeometry x="15" y="280" width="290" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="s1_out" value="&lt;b&gt;Output: Corpus D (N Paper Records)&lt;/b&gt;&lt;hr&gt;Structured JSON Schema with paper_id, title, abstract, year, citations, venue, references DAG, concepts.&lt;br&gt;&lt;br&gt;&lt;b&gt;✓ Strict Scientometric Normalization&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;align=left;spacingLeft=10;fontSize=11;fontColor=#1e3a8a;" vertex="1" parent="s1_box">
          <mxGeometry x="15" y="400" width="290" height="360" as="geometry"/>
        </mxCell>

        <!-- STAGE 2 CONTAINER -->
        <mxCell id="s2_box" value="&lt;b&gt;STAGES 2-4: EMBED &amp;amp; CLUSTERING&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#fcfaff;strokeColor=#7c3aed;strokeWidth=2;dashed=1;fontColor=#7c3aed;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="395" y="110" width="330" height="780" as="geometry"/>
        </mxCell>
        <mxCell id="s2_c1" value="&lt;b&gt;Stage 2: Okapi BM25 &amp;amp; Preprocessing&lt;/b&gt;&lt;hr&gt;• SciSpacy Academic Tokenizer &amp;amp; Stopwords&lt;br&gt;• Robertson (TREC-3) BM25 Formulation&lt;br&gt;• Parameters: k_1=1.5, b=0.75, English Filter" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#e9d5ff;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s2_box">
          <mxGeometry x="15" y="45" width="300" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="s2_c2" value="&lt;b&gt;Stage 3: SPECTER Transformer Vectorizer&lt;/b&gt;&lt;hr&gt;• Cohan (ACL 2020) Citation-Informed Model&lt;br&gt;• Triplet Loss: L = max(0, ||e_i-e_j||^2 - ||e_i-e_k||^2 + m)&lt;br&gt;• Dense Matrix: X in R^(N x 768)&lt;br&gt;• L2 Normalized + AVX2 Accelerated Math" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#e9d5ff;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s2_box">
          <mxGeometry x="15" y="160" width="300" height="115" as="geometry"/>
        </mxCell>
        <mxCell id="s2_c3" value="&lt;b&gt;Stage 4: HDBSCAN &amp;amp; c-TF-IDF Topics&lt;/b&gt;&lt;hr&gt;• McInnes (JOSS 2017) HDBSCAN (min_size=8)&lt;br&gt;• Grootendorst (2022) Class-based TF-IDF:&lt;br&gt;  W_(t,c) = ||tf_(t,c)|| x log(1 + A / Sum ||tf||)&lt;br&gt;• Thematic Clusters C_1, ..., C_K + Anchors&lt;br&gt;• Cross-Cluster Semantic Filaments" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#e9d5ff;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s2_box">
          <mxGeometry x="15" y="295" width="300" height="155" as="geometry"/>
        </mxCell>
        <mxCell id="s2_out" value="&lt;b&gt;Scientometric Quality Gate&lt;/b&gt;&lt;hr&gt;• Silhouette Score Gate: S &gt;= 0.42&lt;br&gt;• Davies-Bouldin Index: DBI &lt;= 1.35&lt;br&gt;• Outlier Rejection Threshold alpha = 0.05&lt;br&gt;&lt;br&gt;&lt;b&gt;✓ Validated Epistemic Clusters&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#faf5ff;strokeColor=#a855f7;align=left;spacingLeft=10;fontSize=11;fontColor=#581c87;" vertex="1" parent="s2_box">
          <mxGeometry x="15" y="470" width="300" height="290" as="geometry"/>
        </mxCell>

        <!-- STAGE 3 CONTAINER -->
        <mxCell id="s3_box" value="&lt;b&gt;STAGE 5: CITATION DAG &amp;amp; HETERO KG&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#f0fdf4;strokeColor=#059669;strokeWidth=2;dashed=1;fontColor=#059669;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="760" y="110" width="345" height="780" as="geometry"/>
        </mxCell>
        <mxCell id="s3_c1" value="&lt;b&gt;Stage 5A: SPLC Main Path Lineage&lt;/b&gt;&lt;hr&gt;• Citation DAG G = (V, E) with Topological Sort&lt;br&gt;• Batagelj (2003) SPLC Equation:&lt;br&gt;  SPLC(e) = [N_sources(u) x N_sinks(v)] / N_total_paths&lt;br&gt;• Main Path Backbone P_main = argmax Sum SPLC&lt;br&gt;• Price Index (Price 1965) Literature Freshness&lt;br&gt;• Kleinberg (2002) Burst Automaton (sigma)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#a7f3d0;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s3_box">
          <mxGeometry x="15" y="45" width="315" height="160" as="geometry"/>
        </mxCell>
        <mxCell id="s3_c2" value="&lt;b&gt;Stage 5B: Heterogeneous Knowledge Graph&lt;/b&gt;&lt;hr&gt;• Node Partitions: Paper, Topic, Method, Dataset, Author&lt;br&gt;• Bipartite Incidence Matrix: A in R^(|V_Paper| x |V_Entity|)&lt;br&gt;• Co-Occurrence Projection: C = A x A^T&lt;br&gt;• Unexplored (Method x Dataset) Combinations&lt;br&gt;• Cross-Disciplinary Entity Filaments" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#a7f3d0;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s3_box">
          <mxGeometry x="15" y="225" width="315" height="155" as="geometry"/>
        </mxCell>
        <mxCell id="s3_out" value="&lt;b&gt;Topological Lineage &amp;amp; Graph Artifacts&lt;/b&gt;&lt;hr&gt;• SPLC Main Path Developmental Lineage&lt;br&gt;• Price Index: P_(3yr) = 0.684 (High-Velocity)&lt;br&gt;• Kleinberg Burst Intensity: sigma = 14.82&lt;br&gt;• Boyack Co-Citation Conductance Deficit: 0.842&lt;br&gt;&lt;br&gt;&lt;b&gt;✓ 100% Deterministic Lineages&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ecfdf5;strokeColor=#34d399;align=left;spacingLeft=10;fontSize=11;fontColor=#065f46;" vertex="1" parent="s3_box">
          <mxGeometry x="15" y="400" width="315" height="360" as="geometry"/>
        </mxCell>

        <!-- STAGE 4 CONTAINER -->
        <mxCell id="s4_box" value="&lt;b&gt;STAGES 6-8: 4-TIER GAPS &amp;amp; LLM RAG&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#fffbeb;strokeColor=#d97706;strokeWidth=2;dashed=1;fontColor=#d97706;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="1140" y="110" width="345" height="780" as="geometry"/>
        </mxCell>
        <mxCell id="s4_c1" value="&lt;b&gt;Stage 7: 4-Tier Gap Discovery Engine&lt;/b&gt;&lt;hr&gt;• Tier 1: Uzzi (Science 2013) Atypical z-Score (G_combo)&lt;br&gt;• Tier 2: Boyack (2010) Citation Conductance Deficit (G_bridge)&lt;br&gt;• Tier 3: Campello (2015) GLOSH Density Outliers (G_sparse)&lt;br&gt;• Tier 4: Bornmann (2015) CAGR Output Momentum (G_temporal)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#fde68a;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s4_box">
          <mxGeometry x="15" y="45" width="315" height="150" as="geometry"/>
        </mxCell>
        <mxCell id="s4_c2" value="&lt;b&gt;Stage 8: Groq Grounded LLM RAG&lt;/b&gt;&lt;hr&gt;• Groq LPU Inference (Llama-3-70B Pipeline)&lt;br&gt;• Grounded Hypothesis: H_m = Method_A (x) Domain_B&lt;br&gt;• Real-Time DOI &amp;amp; Semantic Scholar Verifier Loop&lt;br&gt;• Algorithmic Protocol &amp;amp; Scientific Risk Matrix" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#fde68a;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s4_box">
          <mxGeometry x="15" y="215" width="315" height="145" as="geometry"/>
        </mxCell>
        <mxCell id="s4_out" value="&lt;b&gt;Synthesized Grant Hypotheses (Grant Studio)&lt;/b&gt;&lt;hr&gt;• Operational Hypothesis with Formal Methodology&lt;br&gt;• Composite Novelty: 0.914 (|z|=3.84, Deficit=0.89)&lt;br&gt;• Technical Risk Mitigation &amp;amp; Grounded Citations&lt;br&gt;&lt;br&gt;&lt;b&gt;✓ Direct Export to NSF / NIH Proposal Format&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fffbeb;strokeColor=#f59e0b;align=left;spacingLeft=10;fontSize=11;fontColor=#78350f;" vertex="1" parent="s4_box">
          <mxGeometry x="15" y="380" width="315" height="380" as="geometry"/>
        </mxCell>

        <!-- STAGE 5 CONTAINER -->
        <mxCell id="s5_box" value="&lt;b&gt;STAGE 6 &amp;amp; WEBGL UI OBSERVATORY&lt;/b&gt;" style="swimlane;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#0f172a;strokeWidth=2;dashed=1;fontColor=#0f172a;fontSize=12;startSize=30;" vertex="1" parent="1">
          <mxGeometry x="1515" y="110" width="295" height="780" as="geometry"/>
        </mxCell>
        <mxCell id="s5_c1" value="&lt;b&gt;Stage 6: 3D UMAP Manifold&lt;/b&gt;&lt;hr&gt;• X in R^(N x 768) -&gt; Y in R^(N x 3)&lt;br&gt;• n_neighbors=15, min_dist=0.1&lt;br&gt;• Retains Geodesic Manifold Geometry&lt;br&gt;• GPU Float32BufferAttribute Gen" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s5_box">
          <mxGeometry x="15" y="45" width="265" height="105" as="geometry"/>
        </mxCell>
        <mxCell id="s5_c2" value="&lt;b&gt;Three.js WebGL Particle Engine&lt;/b&gt;&lt;hr&gt;• Persistent AstraParticleWorld Canvas&lt;br&gt;• GLSL Simplex/Curl Noise GPU Shaders&lt;br&gt;• Quintic S-Curve Morphing Rig&lt;br&gt;• 60 FPS Raycasting &amp;amp; Spline Flight" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;align=left;spacingLeft=10;fontSize=11;" vertex="1" parent="s5_box">
          <mxGeometry x="15" y="170" width="265" height="115" as="geometry"/>
        </mxCell>
        <mxCell id="s5_out" value="&lt;b&gt;4 Reactive UI Observatory Views&lt;/b&gt;&lt;hr&gt;• Stage 00: Search Deck &amp;amp; SSE Stream&lt;br&gt;• Stage 01: Epistemic Archipelago (54%/46%)&lt;br&gt;• Stage 02: Citation Timeline (SPLC Lineage)&lt;br&gt;• Stage 03: AI Grant Studio (Hypothesis RAG)&lt;br&gt;&lt;br&gt;&lt;b&gt;✓ Single-Page Reactive SPA&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#0f172a;strokeColor=#334155;align=left;spacingLeft=10;fontSize=11;fontColor=#f8fafc;" vertex="1" parent="s5_box">
          <mxGeometry x="15" y="305" width="265" height="455" as="geometry"/>
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
  <title>ResearchRadar — IEEE System Architecture (Accurate Scientometric Engine)</title>
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
      width: 96%;
      height: 92%;
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
      <span class="badge">Rigorous Scientometric Engine</span>
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

    with open("diagrams/researchradar_system_architecture.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated: diagrams/researchradar_system_architecture.svg")

    with open("diagrams/researchradar_system_architecture.drawio", "w", encoding="utf-8") as f:
        f.write(drawio_content)
    print("Generated: diagrams/researchradar_system_architecture.drawio")

    with open("diagrams/researchradar_system_architecture.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Generated: diagrams/researchradar_system_architecture.html")

if __name__ == "__main__":
    generate()

