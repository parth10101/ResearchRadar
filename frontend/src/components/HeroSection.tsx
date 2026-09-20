import React, { useEffect, useMemo, useRef, useState } from 'react';
import './HeroSection.css';
import { PipelineProgressEvent } from '../types';
import {
  Search,
  Database,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  CircleDashed,
  RotateCw,
  Zap,
  SlidersHorizontal,
  Check,
  Compass,
} from 'lucide-react';

interface StageStep {
  num: string;
  badge: string;
  actionText: string;
  summary: string;
}

const REASONING_STAGES: StageStep[] = [
  {
    num: '01',
    badge: 'GATHERING',
    actionText: 'Collecting relevant papers...',
    summary: 'Searching global academic archives for top publications',
  },
  {
    num: '02',
    badge: 'READING',
    actionText: 'Reading methods & results...',
    summary: 'Examining how researchers tested their experiments',
  },
  {
    num: '03',
    badge: 'ALIGNING',
    actionText: 'Comparing ideas across studies...',
    summary: 'Measuring how closely related different papers are',
  },
  {
    num: '04',
    badge: 'CLUSTERING',
    actionText: 'Sorting into clear topics...',
    summary: 'Grouping papers into distinct subject areas and themes',
  },
  {
    num: '05',
    badge: 'TRACING',
    actionText: 'Tracing breakthrough history...',
    summary: 'Following citation trails from early origins to today',
  },
  {
    num: '06',
    badge: 'MAPPING',
    actionText: 'Building your interactive map...',
    summary: 'Arranging topics into visual islands and territories',
  },
  {
    num: '07',
    badge: 'AUDITING',
    actionText: 'Finding unanswered questions...',
    summary: 'Locating promising areas where research is missing',
  },
  {
    num: '08',
    badge: 'SYNTHESIZING',
    actionText: 'Drafting research proposals...',
    summary: 'Creating evidence-backed project hypotheses',
  },
];


export interface PresetOption {
  label: string;
  count: string;
  value: string;
  datasetId?: string;
}

const PRESETS: PresetOption[] = [
  { label: 'Federated Learning Privacy', count: '300', value: 'Federated Learning Privacy & Non-IID Drift in Clinical LLMs', datasetId: 'output_fl' },
  { label: 'Satellite Remote Sensing', count: '300', value: 'Satellite Remote Sensing & Atmospheric Cloud Correction', datasetId: 'output_satellite_300' },
  { label: 'Transformer Medical Segmentation', count: '1k', value: 'Transformer models for medical image segmentation', datasetId: 'output_transformer_models_for_m' },
  { label: 'Autonomous 3D Perception', count: '1.5k', value: 'Autonomous Driving LiDAR Camera Multi-Modal Perception', datasetId: 'output_autonomous_1500' },
  { label: 'GNN Drug Discovery', count: '3k', value: 'Graph Neural Networks in Molecular Drug Discovery', datasetId: 'output_gnn_drug_3k' },
  { label: 'LLM Hallucination Mitigation', count: '3k', value: 'Large Language Model Hallucination & Factuality Grounding', datasetId: 'output_llm_hallucination_3k' },
];


export interface CorpusTier {
  value: number;
  label: string;
  name: string;
  estTime: string;
}

export const CORPUS_TIERS: CorpusTier[] = [
  { value: 100, label: '100', name: 'Rapid Probe', estTime: '~1.2s' },
  { value: 300, label: '300', name: 'Targeted Scan', estTime: '~3.0s' },
  { value: 500, label: '500', name: 'Standard Synthesis', estTime: '~5.8s' },
  { value: 1000, label: '1k', name: 'Deep Topology', estTime: '~12.4s' },
  { value: 1500, label: '1.5k', name: 'Exhaustive Landscape', estTime: '~18.5s' },
  { value: 2000, label: '2k', name: 'Macro Graph', estTime: '~24.0s' },
  { value: 3000, label: '3k', name: 'Maximum Frontier', estTime: '~34.2s' },
];

interface TopicItem {
  label: string;
  color: string;
  query: string;
}

interface ResearchField {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  topics: TopicItem[];
}

const RESEARCH_FIELDS: ResearchField[] = [
  {
    id: 'ai_ml',
    name: 'AI & Machine Learning',
    shortName: 'AI & ML',
    icon: '🧠',
    topics: [
      { label: 'CoT Drift', color: '#ff4300', query: 'Chain-of-Thought Reasoning Drift in Large Language Models' },
      { label: 'DPO vs RLHF', color: '#34d399', query: 'Direct Preference Optimization vs RLHF in Mixture-of-Experts Transformers' },
      { label: 'Cross-Attention', color: '#a855f7', query: 'Sub-quadratic Cross-Attention Latency Optimization in Vision Transformers' },
      { label: 'Mamba SSM', color: '#38bdf8', query: 'Selective State-Space Duality vs Multi-Head Attention Scaling Laws' },
      { label: 'Autoencoders', color: '#fbbf24', query: 'Superposition and Monosemanticity in Sparse Autoencoders' },
      { label: 'Test-Time Scaling', color: '#f43f5e', query: 'Inference-Time Search vs Pre-Training Compute Scaling Frontiers' },
    ],
  },
  {
    id: 'biomed',
    name: 'Biomedicine & Genomics',
    shortName: 'Biomedicine',
    icon: '🧬',
    topics: [
      { label: 'CRISPR Off-Target', color: '#38bdf8', query: 'Epigenetic Modifiers and Off-Target Cleavage Prediction in CRISPR-Cas9' },
      { label: 'AlphaFold 3D', color: '#34d399', query: 'Protein Dynamic Conformational Ensembles via Diffusion Generative Models' },
      { label: 'Single-Cell RNA', color: '#a855f7', query: 'Single-Cell Transcriptomic Trajectory Inference under Genetic Perturbation' },
      { label: 'Macrocyclic Drugs', color: '#ff4300', query: 'Geometric Deep Learning for Macrocyclic Drug Pocket Affinity' },
    ],
  },
  {
    id: 'quantum',
    name: 'Quantum Physics & High Energy',
    shortName: 'Quantum',
    icon: '⚛️',
    topics: [
      { label: 'Surface Codes', color: '#a855f7', query: 'Topological Surface Code Thresholds under Correlated Non-Markovian Noise' },
      { label: 'Majorana Modes', color: '#38bdf8', query: 'Non-Abelian Anyon Braiding in Superconductor-Semiconductor Nanowires' },
      { label: 'Quantum Radar', color: '#ff4300', query: 'Entangled Microwave Photon Illumination for Sub-Noise Target Detection' },
      { label: 'AdS/CFT Duals', color: '#34d399', query: 'AdS/CFT Quantum Error Correcting Code Spacetime Reconstruction' },
    ],
  },
  {
    id: 'astro',
    name: 'Astrophysics & Space',
    shortName: 'Astrophysics',
    icon: '🌌',
    topics: [
      { label: 'JWST Galaxies', color: '#fbbf24', query: 'High-Redshift Massive Galaxy Formation Rates Challenging LCDM Cosmology' },
      { label: 'Fast Radio Bursts', color: '#ff4300', query: 'Magnetar Crust Fractures and Synchrotron Masers in Repeating FRBs' },
      { label: 'Gravity Echoes', color: '#38bdf8', query: 'Post-Merger Ringdown Horizon Microstates in Exotic Compact Objects' },
      { label: 'Exoplanet Methane', color: '#34d399', query: 'Transmission Spectroscopy for M-Dwarf Exoplanet Methane Discontinuities' },
    ],
  },
  {
    id: 'systems',
    name: 'Robotics & Hardware Systems',
    shortName: 'Robotics',
    icon: '⚙️',
    topics: [
      { label: 'FlashAttention-3', color: '#34d399', query: 'Asynchronous Tensor Core Warpgroup Overlap in Hopper GPU Architecture' },
      { label: 'Dexterous Hands', color: '#ff4300', query: 'Visuomotor Diffusion Policies for Bimanual Dexterous Manipulation' },
      { label: 'Silicon Photonics', color: '#38bdf8', query: 'Wavelength-Division Multiplexed Silicon Photonics for Wafer-Scale AI' },
      { label: 'Spiking Chips', color: '#a855f7', query: 'Event-Driven Spiking Neural Networks on Sub-Milliwatt Edge Accelerators' },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics & Cryptography',
    shortName: 'Mathematics',
    icon: '📐',
    topics: [
      { label: 'Post-Quantum Kyber', color: '#a855f7', query: 'Module-LWE Decryption Failure Rates and Side-Channel Resilience' },
      { label: 'Geometric Langlands', color: '#38bdf8', query: 'Geometric Langlands Duality for Reductive Groups over Curve Moduli' },
      { label: '3D Navier-Stokes', color: '#ff4300', query: 'Finite-Time Singularity Criteria in 3D Incompressible Euler Equations' },
      { label: 'Recursive SNARKs', color: '#34d399', query: 'Cycle of Elliptic Curves for Constant-Size Zero-Knowledge Proof Composition' },
    ],
  },
  {
    id: 'climate',
    name: 'Climate Science & Clean Energy',
    shortName: 'Climate',
    icon: '🌱',
    topics: [
      { label: 'Solid Electrolytes', color: '#34d399', query: 'Lithium Dendrite Suppression in Garnet LLZO Solid-State Batteries' },
      { label: 'Basalt Mineralization', color: '#38bdf8', query: 'Ultramafic Basalt Enhanced Weathering Kinetics in Agricultural Soils' },
      { label: 'AMOC Tipping', color: '#ff4300', query: 'Atlantic Meridional Overturning Circulation Freshwater Forcing Transitions' },
      { label: 'Perovskite Solar', color: '#fbbf24', query: 'Halide Phase Segregation Mitigation in 33% Tandem Solar Photovoltaics' },
    ],
  },
  {
    id: 'materials',
    name: 'Materials Science & Nano',
    shortName: 'Materials',
    icon: '🔬',
    topics: [
      { label: 'Magic-Angle Moiré', color: '#a855f7', query: 'Magic-Angle Twisted Bilayer Graphene Correlated Insulator Corridors' },
      { label: 'Superhydrides', color: '#ff4300', query: 'High-Pressure Lanthanum Hydride Clathrate Lattice Dynamics' },
      { label: 'MXene Storage', color: '#38bdf8', query: '2D Titanium Carbide MXene Ion-Intercalation Kinetics at Scale' },
    ],
  },
  {
    id: 'economics',
    name: 'Economics & Game Theory',
    shortName: 'Economics',
    icon: '📈',
    topics: [
      { label: 'AMM MEV Arbitrage', color: '#34d399', query: 'Constant Product Market Maker Arbitrage & Maximal Extractable Value' },
      { label: 'Supply Cascades', color: '#fbbf24', query: 'Input-Output Production Network Cascades under Geopolitical Shocks' },
      { label: 'Pricing Collusion', color: '#ff4300', query: 'Q-Learning Multi-Agent Pricing Convergence in Repeated Oligopolies' },
    ],
  },
  {
    id: 'cross',
    name: 'Interdisciplinary & Cross-Domain',
    shortName: 'Cross-Domain',
    icon: '🌐',
    topics: [
      { label: 'Bio-Neuromorphic', color: '#ff4300', query: 'Biological Brain Organoids Interfaced with Silicon Neuromorphic Chips' },
      { label: 'Quantum Diffusion', color: '#38bdf8', query: 'Equivariant Diffusion Models for Transition State Force Fields' },
      { label: 'Synthetic Biology', color: '#a855f7', query: 'Epistemic Uncertainty and Gene Drive Governance Frameworks' },
    ],
  },
];

interface Props {
  onLaunch: (tab?: string) => void;
  onSearch?: (query: string, corpusSize?: number, datasetId?: string) => void;
  isRunning?: boolean;
  progressEvents?: PipelineProgressEvent[];
  pipelineError?: string | null;
}

export const HeroSection: React.FC<Props> = ({
  onLaunch,
  onSearch,
  isRunning = false,
  progressEvents = [],
  pipelineError = null,
}) => {
  const [query, setQuery] = useState('');
  const [dropOpen, setDropOpen] = useState(false);

  // Corpus Size State (100 to 3,000)
  const [selectedCorpus, setSelectedCorpus] = useState<number>(1000);
  const [corpusMenuOpen, setCorpusMenuOpen] = useState<boolean>(false);

  // Research Field & Topic Recommendations State
  const [activeFieldId, setActiveFieldId] = useState<string>('ai_ml');
  const [fieldMenuOpen, setFieldMenuOpen] = useState<boolean>(false);
  const [shuffleIndex, setShuffleIndex] = useState<number>(0);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  // Dynamic Scientometric Pipeline Execution State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executingStageIdx, setExecutingStageIdx] = useState<number>(0);
  const [executingPct, setExecutingPct] = useState<number>(0);
  const executionTimerRef = useRef<any>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (executionTimerRef.current) {
        clearTimeout(executionTimerRef.current);
      }
    };
  }, []);

  // Global ⌘K / Ctrl+K shortcut to open Corpus Tier popover
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCorpusMenuOpen((prev) => !prev);
        setDropOpen(false);
        setFieldMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleLaunch = (targetTab = 'archipelago') => {
    onLaunch(targetTab);
  };

  // Synchronize live backend execution — update progress bar UI only.
  // Navigation to studio is owned by App.tsx (it calls handleLaunchWithTransition after dataset_id arrives).
  useEffect(() => {
    if (progressEvents && progressEvents.length > 0) {
      const latest = progressEvents[progressEvents.length - 1];
      setIsExecuting(true);
      setExecutingPct(latest.progress_pct);
      const sIdx = Math.max(0, Math.min(7, (latest.stage ? latest.stage - 1 : 0)));
      setExecutingStageIdx(sIdx);

      if (latest.is_terminal) {
        // Pipeline finished (success or fail) — stop executing indicator
        if (executionTimerRef.current) clearTimeout(executionTimerRef.current);
        executionTimerRef.current = setTimeout(() => {
          setIsExecuting(false);
        }, 350);
      }
    }
  }, [progressEvents]);

  // Query-Aware Intelligent Corpus Recommendation Logic
  const recommendedCorpusValue = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return 1000;

    // Direct DOI / ArXiv / Specific Link
    if (raw.includes('10.') || raw.includes('arxiv') || raw.includes('/abs/') || raw.startsWith('doi:')) {
      return 300; // Hyper-niche / Single target intersection
    }

    const words = raw.split(/\s+/).filter(Boolean);

    // Highly specific phrases or long descriptions
    if (
      words.length >= 6 ||
      raw.includes('non-iid') ||
      raw.includes('drift') ||
      raw.includes('latency optimization') ||
      raw.includes('ablation') ||
      raw.includes('benchmarks')
    ) {
      return 500; // Targeted intersection
    }

    // Broad macro topics
    if (
      words.length <= 2 &&
      (raw.includes('transformer') ||
        raw.includes('llm') ||
        raw.includes('quantum') ||
        raw.includes('cancer') ||
        raw.includes('crispr') ||
        raw.includes('biology') ||
        raw.includes('physics') ||
        raw.includes('deep learning') ||
        raw.includes('graph') ||
        raw.includes('attention'))
    ) {
      return 3000; // Broad macro-landscape needs maximum sample depth
    }

    if (words.length <= 3) {
      return 2000; // Wide landscape
    }

    return 1000; // Balanced default
  }, [query]);

  // Current active field object
  const activeField = useMemo(() => {
    return RESEARCH_FIELDS.find((f) => f.id === activeFieldId) || RESEARCH_FIELDS[0];
  }, [activeFieldId]);



  // Sliced recommendations based on shuffle
  const visibleTopics = useMemo(() => {
    const list = activeField.topics;
    const start = (shuffleIndex * 3) % list.length;
    const items = [];
    for (let i = 0; i < Math.min(3, list.length); i++) {
      items.push(list[(start + i) % list.length]);
    }
    return items;
  }, [activeField, shuffleIndex]);

  const handleShuffle = () => {
    setIsShuffling(true);
    setShuffleIndex((prev) => prev + 1);
    setTimeout(() => setIsShuffling(false), 300);
  };

  const handleExecuteSearch = (targetQuery?: string, targetDatasetId?: string) => {
    if (isExecuting || isRunning) return;
    const q = (targetQuery !== undefined ? targetQuery : query).trim();
    if (!q) return;

    if (targetQuery) {
      setQuery(targetQuery);
    }

    setIsExecuting(true);
    setExecutingPct(6);
    setExecutingStageIdx(0);

    if (executionTimerRef.current) {
      clearTimeout(executionTimerRef.current);
    }

    // Immediately notify parent
    if (onSearch) {
      onSearch(q, selectedCorpus, targetDatasetId);
    }

    // If precomputed dataset or preset is selected, run fast smooth 8-stage sequence
    if (targetDatasetId) {
      const stageTargets = [
        { stage: 0, targetPct: 14, duration: 240 },  // 01: Gathering
        { stage: 1, targetPct: 28, duration: 240 },  // 02: Reading
        { stage: 2, targetPct: 44, duration: 250 },  // 03: Aligning
        { stage: 3, targetPct: 62, duration: 250 },  // 04: Clustering
        { stage: 4, targetPct: 76, duration: 240 },  // 05: Tracing
        { stage: 5, targetPct: 88, duration: 240 },  // 06: Mapping
        { stage: 6, targetPct: 96, duration: 230 },  // 07: Auditing
        { stage: 7, targetPct: 100, duration: 260 }, // 08: Synthesizing
      ];

      let currentStep = 0;
      const runNext = () => {
        if (currentStep < stageTargets.length) {
          const item = stageTargets[currentStep];
          setExecutingStageIdx(item.stage);
          setExecutingPct(item.targetPct);
          currentStep++;
          executionTimerRef.current = setTimeout(runNext, item.duration);
        } else {
          setExecutingPct(100);
          setExecutingStageIdx(7);
          executionTimerRef.current = setTimeout(() => {
            setIsExecuting(false);
            handleLaunch('archipelago');
          }, 350);
        }
      };

      executionTimerRef.current = setTimeout(runNext, 60);
    }
  };


  const liveMessage = useMemo(() => {
    if (progressEvents && progressEvents.length > 0) {
      return progressEvents[progressEvents.length - 1].message;
    }
    return '';
  }, [progressEvents]);

  const currentStage = REASONING_STAGES[executingStageIdx] || REASONING_STAGES[0];
  const currentPct = isExecuting ? executingPct : 0;

  // Current active tier info
  const currentTier = CORPUS_TIERS.find((t) => t.value === selectedCorpus) || CORPUS_TIERS[3];



  return (
    <div
      className="hero-viewport-root"
      onClick={() => {
        setDropOpen(false);
        setCorpusMenuOpen(false);
        setFieldMenuOpen(false);
      }}
    >
      <div className="hero-content-anchor">
        {/* Eyebrow Tag */}
        <div className="hero-eyebrow-tag">
          <span className="status-ping-dot" />
          <span className="eyebrow-label">200M+ RESEARCH PAPERS · 8-STAGE SCIENTOMETRIC REASONING</span>
        </div>

        {/* Prominent Editorial Headline */}
        <h1 className="hero-main-title">
          Search the frontier of <span className="title-serif-accent">science.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-main-subtitle">
          Enter any topic, author, or DOI. ResearchRadar parses 200M+ papers across citation lineages, clusters concepts in high-dimensional vector space, and surfaces unexplored empirical gaps.
        </p>

        {/* Architectural Search Command Unit */}
        <div className="search-deck-unit" onClick={(e) => e.stopPropagation()}>
          <div className="search-input-shell">
            {/* Presets Trigger */}
            <div className="presets-select-anchor">
              <button
                className={`presets-anchor-btn ${dropOpen ? 'open' : ''}`}
                onClick={() => {
                  setDropOpen(!dropOpen);
                  setCorpusMenuOpen(false);
                  setFieldMenuOpen(false);
                }}
                title="Select curated topic presets"
              >
                <Database className="h-3.5 w-3.5 text-[#ff4300]" />
                <span>Presets</span>
                <span className="caret">▾</span>
              </button>

                {dropOpen && (
                  <div
                    className="presets-floating-tray overflow-y-auto custom-scrollbar"
                    data-scrollable
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="tray-hdr">CURATED SOTA CORPORA</div>
                    {PRESETS.map((p) => (
                      <div
                        key={p.value}
                        className="tray-row"
                        onClick={() => {
                          setQuery(p.value);
                          setDropOpen(false);
                          handleExecuteSearch(p.value, p.datasetId);
                        }}
                      >
                        <span className="row-label">{p.label}</span>
                        <span className="row-meta">{p.count} papers</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bar-v-sep" />

              {/* Input */}
              <input
                type="text"
                className="search-field"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isExecuting}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isExecuting && query.trim()) {
                    e.preventDefault();
                    handleExecuteSearch();
                  }
                }}
                placeholder="Search topic, paper title, author, or DOI..."
              />

              {query && !isExecuting && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="px-2 py-1 text-zinc-500 hover:text-white font-mono text-xs cursor-pointer transition-colors"
                  title="Clear input"
                >
                  ✕
                </button>
              )}

              {/* Interactive Corpus Depth Selector Button (100 to 3k) */}
              <div className="corpus-anchor-wrap">
                <button
                  className={`corpus-tier-trigger-btn ${corpusMenuOpen ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCorpusMenuOpen(!corpusMenuOpen);
                    setDropOpen(false);
                    setFieldMenuOpen(false);
                  }}
                  title="Configure target corpus retrieval depth"
                >
                  <SlidersHorizontal className="h-3 w-3 text-[#ff4300]" />
                  <span className="corpus-pill-val">{currentTier.label}</span>
                  <span className="corpus-k-hint">⌘K</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>

                {/* Floating Corpus Tiers Popover */}
                {corpusMenuOpen && (
                  <div
                    className="corpus-tiers-tray overflow-y-auto custom-scrollbar"
                    data-scrollable
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="corpus-tray-header">
                      <span>CORPUS RETRIEVAL DEPTH</span>
                      <span className="corpus-current-badge">{selectedCorpus} papers</span>
                    </div>

                    <div className="corpus-tiers-list">
                      {CORPUS_TIERS.map((tier) => {
                        const isSelected = selectedCorpus === tier.value;
                        const isRecommended = recommendedCorpusValue === tier.value;

                        return (
                          <div
                            key={tier.value}
                            className={`corpus-tier-row ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
                            onClick={() => {
                              setSelectedCorpus(tier.value);
                              setCorpusMenuOpen(false);
                            }}
                          >
                            <div className="tier-left">
                              <span className="tier-number">{tier.label}</span>
                              <div className="tier-meta">
                                <span className="tier-name">{tier.name}</span>
                                <span className="tier-time">{tier.estTime}</span>
                              </div>
                            </div>

                            <div className="tier-right">
                              {isRecommended && (
                                <span className="recommended-flag">
                                  <Zap className="h-2.5 w-2.5" />
                                  <span>Recommended</span>
                                </span>
                              )}
                              {isSelected && <Check className="h-3.5 w-3.5 text-[#ff4300]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                className={`search-act-btn ${isExecuting ? 'opacity-90 cursor-wait' : ''}`}
                onClick={() => handleExecuteSearch()}
                disabled={isExecuting || !query.trim()}
              >
                {isExecuting ? (
                  <>
                    <RotateCw className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Dynamic Scientometric Pipeline Reasoning Dock */}
            <div className={`dynamic-reasoning-dock transition-all duration-300 ${isExecuting ? 'border-[#ff4300]/50 shadow-[0_0_24px_rgba(255,67,0,0.2)]' : 'border-[rgba(255,255,255,0.08)]'}`}>
              <div className="reasoning-status-bar">
                <div className="reasoning-indicator-left">
                  <div className="shimmer-spark-wrap">
                    <span className="spark-spin-ring" />
                    <Zap className="h-3 w-3 text-[#ff4300]" />
                  </div>
                  <div className="reasoning-text-group">
                    <span className="reasoning-verb">
                      {isExecuting ? `STAGE ${currentStage.num} · ${currentStage.badge}:` : 'RESEARCH RADAR:'}
                    </span>
                    <span
                      key={`action-${executingStageIdx}-${isExecuting}-${currentPct === 100}`}
                      className="reasoning-action-preview reasoning-text-animating"
                    >
                      {isExecuting
                        ? (currentPct === 100 ? 'All 8 stages finished' : currentStage.actionText)
                        : 'Ready to explore literature and discover open research questions'}
                    </span>
                  </div>
                </div>

                <div className="reasoning-indicator-right">
                  <span className="stage-step-pill">
                    {isExecuting ? `STAGE ${executingStageIdx + 1} OF 8` : '8 STAGES'}
                  </span>
                  <span className="stage-pct-counter font-mono font-bold text-[#ff4300]">
                    {currentPct}%
                  </span>
                </div>
              </div>

              {/* Progress Hairline Track */}
              <div className="reasoning-hairline-track">
                <div
                  className="reasoning-hairline-fill"
                  style={{
                    width: `${currentPct}%`,
                    transition: isExecuting ? 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  }}
                />
              </div>

              {/* Live Literature Feed Ticker */}
              <div className="reasoning-ticker-line">
                <div className="live-stream-badge">
                  <span className={`green-ping-dot ${isExecuting ? 'animate-ping' : ''}`} />
                  <span className="stream-lead-txt">
                    {isExecuting ? (currentPct === 100 ? 'STAGE 08 COMPLETE' : 'LIVE REASONING') : 'STREAM STANDBY'}
                  </span>
                </div>
                <span
                  key={`ticker-${executingStageIdx}-${isExecuting}-${currentPct === 100}`}
                  className="stream-paper-title reasoning-text-animating"
                >
                  {isExecuting
                    ? (currentPct === 100 ? 'Opening your interactive research space...' : currentStage.summary)
                    : 'Enter an inquiry or select a preset below to begin exploration.'}
                </span>
                <span className="stream-throughput-tag">
                  {isExecuting && currentPct === 100 ? '100% DONE' : `${selectedCorpus} PAPERS TARGET`}
                </span>
              </div>
            </div>


            {/* Dynamic All-Domain Research Recommendations & Shuffle Bar (NO "FRONTIER:" LABEL) */}
            <div className="domain-recommendations-bar" onClick={(e) => e.stopPropagation()}>
              {/* Field Selector Dropdown Anchor */}
              <div className="field-select-anchor">
                <button
                  className={`field-select-btn ${fieldMenuOpen ? 'open' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFieldMenuOpen(!fieldMenuOpen);
                    setCorpusMenuOpen(false);
                    setDropOpen(false);
                  }}
                  title="Switch research domain"
                >
                  <span className="field-icon">{activeField.icon}</span>
                  <span className="field-name-label">{activeField.shortName || activeField.name}</span>
                  <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                </button>

                {fieldMenuOpen && (
                  <div
                    className="fields-dropdown-tray overflow-y-auto custom-scrollbar"
                    data-scrollable
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="fields-tray-hdr">ALL RESEARCH DISCIPLINES</div>
                    <div className="fields-grid-options">
                      {RESEARCH_FIELDS.map((f) => (
                        <div
                          key={f.id}
                          className={`field-option-row ${f.id === activeFieldId ? 'active' : ''}`}
                          onClick={() => {
                            setActiveFieldId(f.id);
                            setShuffleIndex(0);
                            setFieldMenuOpen(false);
                          }}
                        >
                          <span className="field-opt-icon">{f.icon}</span>
                          <span className="field-opt-name">{f.name}</span>
                          {f.id === activeFieldId && <Check className="h-3 w-3 text-[#ff4300]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="domain-v-sep" />

              {/* Recommendation Topic Pills */}
              <div className="domain-topic-pills-wrap">
                {visibleTopics.map((c) => (
                  <button
                    key={c.label}
                    className="domain-topic-pill"
                    onClick={() => {
                      setQuery(c.query);
                      handleExecuteSearch(c.query);
                    }}
                    disabled={isExecuting}
                    title={`Search: ${c.query}`}
                  >
                    <span className="pill-dot" style={{ backgroundColor: c.color }} />
                    <span className="pill-text">{c.label}</span>
                  </button>
                ))}
              </div>

              {/* 1-Click Shuffle Button */}
              <button
                className={`domain-shuffle-trigger ${isShuffling ? 'shuffling' : ''}`}
                onClick={handleShuffle}
                title="Shuffle topic recommendations (Press to cycle)"
              >
                <RotateCw className="h-3 w-3" />
                <span>Shuffle</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
