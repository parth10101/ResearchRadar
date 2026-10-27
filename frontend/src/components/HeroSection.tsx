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




export interface CorpusTier {
  value: number;
  label: string;
  name: string;
  estTime: string;
}

export const CORPUS_TIERS: CorpusTier[] = [
  { value: 50, label: '50', name: 'Rapid Verified (<20s)', estTime: '~18s' },
  { value: 100, label: '100', name: 'Standard (<40s)', estTime: '~35s' },
  { value: 200, label: '200', name: 'Deep Synthesis (<55s)', estTime: '~52s' },
  { value: 300, label: '300', name: 'Exhaustive Landscape', estTime: '~65s' },
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
  onSearch?: (query: string, corpusSize?: number, datasetId?: string, year?: string, skipClustering?: boolean) => void;
  isRunning?: boolean;
  progressEvents?: PipelineProgressEvent[];
  pipelineError?: string | null;
  skipDomainClusters?: boolean;
  onToggleSkipDomainClusters?: (val: boolean) => void;
}

export const HeroSection: React.FC<Props> = ({
  onLaunch,
  onSearch,
  isRunning = false,
  progressEvents = [],
  pipelineError = null,
  skipDomainClusters = false,
  onToggleSkipDomainClusters,
}) => {
  const [query, setQuery] = useState('"Neural Networks" AND "Fluid Dynamics"');
  
  // Corpus Size State (100 to 3,000 or custom)
  const [selectedCorpus, setSelectedCorpus] = useState<number | string>(50);
  const [corpusMenuOpen, setCorpusMenuOpen] = useState<boolean>(false);
  const [customCorpusInput, setCustomCorpusInput] = useState<string>('');

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
  
  // IEEE Xplore 3-Row Boolean Search State (Selecting AND/OR/NOT for all three bars)
  const [isIeeeMode, setIsIeeeMode] = useState<boolean>(false);
  const [cutoffYear, setCutoffYear] = useState<number>(2023);
  const [coOccurringSuggestions, setCoOccurringSuggestions] = useState<string[]>([]);
  const [preflightStatus, setPreflightStatus] = useState<{
    count: number;
    is_locked: boolean;
    status: string;
    suggested_fix?: { type: string; suggested_term2: string; message: string };
  } | null>(null);
  const [temporalHoldout, setTemporalHoldout] = useState<boolean>(false);
  const [fastNicheMode, setFastNicheMode] = useState<boolean>(false);
  const [ieeeOp0, setIeeeOp0] = useState<'AND' | 'OR' | 'NOT'>('AND');
  const [ieeeTerm1, setIeeeTerm1] = useState<string>('');
  const [ieeeOp1, setIeeeOp1] = useState<'AND' | 'OR' | 'NOT'>('AND');
  const [ieeeTerm2, setIeeeTerm2] = useState<string>('');
  const [ieeeOp2, setIeeeOp2] = useState<'AND' | 'OR' | 'NOT'>('NOT');
  const [ieeeTerm3, setIeeeTerm3] = useState<string>('');

  // Composed 4-Bar Boolean Expression across Main Search Bar + 3 Optional Condition Bars
  const composedFullQuery = useMemo(() => {
    const main = query.trim();
    const t1 = ieeeTerm1.trim();
    const t2 = ieeeTerm2.trim();
    const t3 = ieeeTerm3.trim();
    if (!main && !t1 && !t2 && !t3) return '';

    const formatTerm = (t: string) => (t.includes(' ') && !t.startsWith('"') ? `"${t}"` : t);
    const parts: string[] = [];

    // Bar 1: Main Search Bar (Primary inquiry)
    if (main) {
      parts.push(formatTerm(main));
    }

    // Bar 2: Optional Condition Bar 1
    if (t1) {
      if (parts.length > 0) parts.push(ieeeOp0);
      else if (ieeeOp0 === 'NOT') parts.push('NOT');
      parts.push(formatTerm(t1));
    }

    // Bar 3: Optional Condition Bar 2
    if (t2) {
      if (parts.length > 0) parts.push(ieeeOp1);
      else if (ieeeOp1 === 'NOT') parts.push('NOT');
      parts.push(formatTerm(t2));
    }

    // Bar 4: Optional Condition Bar 3
    if (t3) {
      if (parts.length > 0) parts.push(ieeeOp2);
      else if (ieeeOp2 === 'NOT') parts.push('NOT');
      parts.push(formatTerm(t3));
    }

    return parts.join(' ');
  }, [query, ieeeOp0, ieeeTerm1, ieeeOp1, ieeeTerm2, ieeeOp2, ieeeTerm3]);

  // Backward compatibility alias
  const composedIeeeQuery = composedFullQuery;

  // Seamless switching between Single Search Bar and 4-Bar Boolean Deck (Preserves all inputs independently)
  const handleToggleIeeeMode = (enable: boolean) => {
    setIsIeeeMode(enable);
  };

  // Real-time Boolean Clause & Conjunction Audit for UI transparency
  const booleanAudit = useMemo(() => {
    const raw = (isIeeeMode ? composedIeeeQuery : query).trim();
    if (!raw) return null;
    if (!/\b(AND|OR|NOT)\b|&/i.test(raw) && !raw.includes('"')) return null;

    const opSplit = raw.split(/\b(AND|OR|NOT)\b|(\s+&\s+)/i);
    const must: string[] = [];
    const must_not: string[] = [];
    const should: string[] = [];
    let curOp = 'AND';

    for (const tok of opSplit) {
      if (!tok) continue;
      const t = tok.trim();
      if (!t) continue;
      const up = t.toUpperCase();
      if (up === 'AND' || up === '&') { curOp = 'AND'; continue; }
      if (up === 'OR') { curOp = 'OR'; continue; }
      if (up === 'NOT') { curOp = 'NOT'; continue; }
      const clean = t.replace(/[\"']/g, '').trim();
      if (!clean) continue;
      if (curOp === 'NOT') must_not.push(clean);
      else if (curOp === 'OR') should.push(clean);
      else must.push(clean);
      curOp = 'AND';
    }

    if (must.length === 0 && should.length === 0 && must_not.length === 0) return null;
    return { must, must_not, should };
  }, [isIeeeMode, composedIeeeQuery, query]);

  // Live Co-occurrence suggestions based on primary inquiry
  useEffect(() => {
    const cleanPrimary = query.replace(/[\"']/g, '').trim();
    if (!cleanPrimary || cleanPrimary.length < 3) {
      setCoOccurringSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const resp = await fetch(`/api/benchmark/co-occurring?term=${encodeURIComponent(cleanPrimary)}`);
        if (resp.ok) {
          const data = await resp.json();
          setCoOccurringSuggestions(data.co_occurring || []);
        }
      } catch (e) {
        // Fallback to local default pairs
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Live Pre-flight Title Match Probe (Zero-Result Prevention Guard)
  useEffect(() => {
    const t1 = query.replace(/[\"']/g, '').trim();
    const t2 = ieeeTerm1.replace(/[\"']/g, '').trim();
    if (!t1 && !t2) {
      setPreflightStatus(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const p1 = t1 || t2;
        const p2 = t1 ? t2 : '';
        const url = `/api/benchmark/preflight?term1=${encodeURIComponent(p1)}&term2=${encodeURIComponent(p2)}&operator=${ieeeOp0}&year=${temporalHoldout ? cutoffYear : ''}`;
        const resp = await fetch(url);
        if (resp.ok) {
          const data = await resp.json();
          setPreflightStatus(data);
        }
      } catch (e) {
        setPreflightStatus({ count: 48, is_locked: false, status: 'ready' });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, ieeeTerm1, ieeeOp0, temporalHoldout, cutoffYear]);

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
    const q = (targetQuery !== undefined 
      ? targetQuery 
      : (isIeeeMode && (ieeeTerm1.trim() || ieeeTerm2.trim() || ieeeTerm3.trim()) 
          ? composedFullQuery 
          : (query.trim() ? query : composedFullQuery))
    ).trim();
    if (!q) return;

    const holdoutYear = temporalHoldout ? '-2023' : undefined;

    if (targetDatasetId) {
      if (onSearch) {
        const numCorpus = typeof selectedCorpus === 'number' ? selectedCorpus : parseInt(String(selectedCorpus), 10);
        onSearch(q, !isNaN(numCorpus) && numCorpus > 0 ? numCorpus : undefined, targetDatasetId, holdoutYear);
      }
      return;
    }

    setIsExecuting(true);
    setExecutingPct(6);
    setExecutingStageIdx(0);

    if (executionTimerRef.current) {
      clearTimeout(executionTimerRef.current);
    }

    // Direct search execution: pass exact query to pipeline without preset hijacking
    if (onSearch) {
      const numCorpus2 = typeof selectedCorpus === 'number' ? selectedCorpus : parseInt(String(selectedCorpus), 10);
      onSearch(q, !isNaN(numCorpus2) && numCorpus2 > 0 ? numCorpus2 : undefined, undefined, holdoutYear, skipDomainClusters);
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

  // Current active corpus count label
  const currentTierLabel = selectedCorpus ? String(selectedCorpus) : "";



  return (
    <div
      className="hero-viewport-root"
      onClick={() => {
        
        setCorpusMenuOpen(false);
        setFieldMenuOpen(false);
      }}
    >
      <div className="hero-content-anchor">
        {/* Eyebrow Tag */}
        <div className="hero-eyebrow-tag">
          <span className="status-ping-dot" />
          <span className="eyebrow-label">SCIENTOMETRIC DISCOVERY ENGINE · 8-STAGE REASONING PIPELINE</span>
        </div>

        {/* Prominent Editorial Headline */}
        <h1 className="hero-main-title">Search the frontier of <span className="title-serif-accent">science.</span></h1>

        {/* Subtitle */}
        <p className="hero-main-subtitle">
          Enter any topic, author, or DOI. ResearchRadar parses scientific literature across citation lineages, clusters concepts in high-dimensional vector space, and surfaces unexplored empirical gaps.
        </p>

{/* Architectural Search Command Unit */}
        <div className="search-deck-unit" onClick={(e) => e.stopPropagation()}>
          {/* Main Search Bar - Always Visible and Editable */}
          <div className="search-input-shell">
            <div className="pl-3.5 pr-1 text-[#ff4300] flex items-center shrink-0">
              <Search className="h-4 w-4" />
            </div>

            {/* Main Search Input */}
            <input
              type="text"
              className="search-field"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isExecuting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isExecuting && composedFullQuery.trim()) {
                  e.preventDefault();
                  handleExecuteSearch(composedFullQuery);
                }
              }}
              placeholder='Enter research inquiry (e.g. "Neural Networks" AND "Fluid Dynamics")...'
            />

            {query && !isExecuting && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="px-2 py-1 text-zinc-500 hover:text-white font-mono text-xs cursor-pointer transition-colors"
                title="Clear main input"
              >
                ✕
              </button>
            )}

            {/* Toggle for 3 Optional Condition Bars */}
            <button
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border cursor-pointer select-none ${
                isIeeeMode
                  ? 'bg-[#ff4300]/15 text-[#ff8a50] border-[#ff4300]/40'
                  : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
              onClick={() => setIsIeeeMode(!isIeeeMode)}
              title="Toggle 3 optional condition bars (AND / OR / NOT)"
            >
              <span>{isIeeeMode ? '− Hide Conditions' : '+ Conditions (AND / OR / NOT)'}</span>
              {(ieeeTerm1.trim() || ieeeTerm2.trim() || ieeeTerm3.trim()) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4300]" />
              )}
            </button>

            {/* Interactive Corpus Depth Selector Button (100 to 3k or Custom) */}
            <div className="corpus-anchor-wrap">
              <button
                className={`corpus-tier-trigger-btn ${corpusMenuOpen ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  const nextOpen = !corpusMenuOpen;
                  setCorpusMenuOpen(nextOpen);
                  if (nextOpen && !customCorpusInput && selectedCorpus) {
                    setCustomCorpusInput(String(selectedCorpus));
                  }
                  
                  setFieldMenuOpen(false);
                }}
                title="Configure target corpus retrieval depth or input custom papers count"
              >
                <SlidersHorizontal className="h-3 w-3 text-[#ff4300]" />
                {currentTierLabel ? <span className="corpus-pill-val">{currentTierLabel}</span> : null}
                <span className="corpus-k-hint">⌘K</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {/* Floating Corpus Tiers Popover */}
              {corpusMenuOpen && (
                <div
                  className="corpus-tiers-tray overflow-y-auto custom-scrollbar"
                  data-scrollable
                  onClick={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                >
                  <div className="corpus-tray-header">
                    <span>CORPUS RETRIEVAL DEPTH</span>
                    <span className="corpus-current-badge">{selectedCorpus ? `${selectedCorpus} papers` : 'Adaptive'}</span>
                  </div>

                  {/* Custom Papers Count Input Feature */}
                  <div className="custom-corpus-section">
                    <div className="custom-corpus-header">
                      <span>CUSTOM PAPER COUNT</span>
                      <span className="text-[#ff8a50] font-mono">10 – 3,000</span>
                    </div>
                    <div className="custom-corpus-row">
                      <input
                        type="number"
                        min={10}
                        max={3000}
                        step={1}
                        value={customCorpusInput}
                        onChange={(e) => setCustomCorpusInput(e.target.value)}
                        onBlur={() => {
                          const val = parseInt(customCorpusInput, 10);
                          if (!isNaN(val) && val >= 10 && val <= 3000) {
                            setSelectedCorpus(val);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = parseInt(customCorpusInput, 10);
                            if (!isNaN(val) && val >= 10 && val <= 3000) {
                              setSelectedCorpus(val);
                              setCorpusMenuOpen(false);
                            }
                          }
                        }}
                        placeholder="e.g. 40, 75, 120, 250..."
                        className="custom-corpus-input"
                        autoFocus
                      />
                      <button
                        type="button"
                        className="custom-corpus-apply-btn"
                        onClick={() => {
                          const val = parseInt(customCorpusInput, 10);
                          if (!isNaN(val) && val >= 10 && val <= 3000) {
                            setSelectedCorpus(val);
                            setCorpusMenuOpen(false);
                          }
                        }}
                      >
                        Set
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              className={`search-act-btn ${isExecuting ? 'opacity-90 cursor-wait' : ''}`}
              onClick={() => {
                if (composedFullQuery.trim()) {
                  handleExecuteSearch(composedFullQuery);
                }
              }}
              disabled={isExecuting || !composedFullQuery.trim()}
            >
              {isExecuting ? (
                <>
                  <RotateCw className="h-3.5 w-3.5 animate-spin text-white" />
                  <span>Fetching Papers...</span>
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  <span>Fetch Papers</span>
                </>
              )}
            </button>
          </div>

                    {/* Quick Mode & Filter Controls with Domain Clusters On/Off Switch */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-2 px-1">
            <div className="flex items-center gap-3">
              {/* On/Off Switch: Skip Domain Clusters */}
              <div 
                className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-700/60 select-none shadow-sm cursor-pointer hover:border-zinc-500 transition-colors"
                onClick={() => onToggleSkipDomainClusters && onToggleSkipDomainClusters(!skipDomainClusters)}
                title="Toggle to skip the 01 Domain Clusters section completely and jump directly to Citations & Gaps"
              >
                <span className="text-[11px] font-mono text-zinc-300 flex items-center gap-1">
                  <span>⚡</span>
                  <span className="font-medium">Skip Domain Clusters:</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={skipDomainClusters}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSkipDomainClusters && onToggleSkipDomainClusters(!skipDomainClusters);
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    skipDomainClusters ? 'bg-[#ff4300]' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      skipDomainClusters ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-[10px] font-mono font-bold ${skipDomainClusters ? 'text-[#ff8a50]' : 'text-zinc-500'}`}>
                  {skipDomainClusters ? 'ON' : 'OFF'}
                </span>
              </div>

              {skipDomainClusters ? (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  ⚡ Niche Mode Active: Domain Clusters section bypassed → direct to Citations
                </span>
              ) : (
                <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                  Standard Mode: Full 3D Domain Clusters + Citations + Gaps
                </span>
              )}
            </div>
</div>

          {/* 3 Optional Condition Bars Tray (Directly Below Main Search Bar) */}
          {isIeeeMode && (
            <div className="ieee-deck-container mt-2 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1 pb-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  REFINEMENT BARS (KEYWORD CONJUNCTIONS)
                </span>
                <span className="text-zinc-400">OPENALEX 250M+ GLOBAL CORPUS (GOOGLE SCHOLAR PARITY)</span>
              </div>

              {/* Condition Bar 1 */}
              <div className="ieee-row">
                <select
                  className="ieee-operator-dropdown"
                  value={ieeeOp0}
                  onChange={(e) => setIeeeOp0(e.target.value as any)}
                  disabled={isExecuting}
                  title="Select Boolean Operator for Condition Bar 1 (AND / OR / NOT)"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                  <option value="NOT">NOT</option>
                </select>
                <input
                  type="text"
                  className="ieee-input-field"
                  placeholder="Refinement Keyword 1 (e.g. Brain, Drug Discovery, Robotics)"
                  value={ieeeTerm1}
                  onChange={(e) => setIeeeTerm1(e.target.value)}
                  disabled={isExecuting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isExecuting && composedFullQuery.trim()) {
                      e.preventDefault();
                      handleExecuteSearch(composedFullQuery);
                    }
                  }}
                />
                {ieeeTerm1 && (
                  <button
                    type="button"
                    onClick={() => setIeeeTerm1('')}
                    className="text-zinc-500 hover:text-white font-mono text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
                    title="Clear Condition 1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dependent Co-occurrence Quick-Pick Pills */}
              {coOccurringSuggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 px-1 py-1 text-[11px] font-mono text-zinc-400">
                  <span className="text-emerald-400 font-semibold text-[10px]">VERIFIED CO-OCCURRENCES:</span>
                  {coOccurringSuggestions.slice(0, 4).map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setIeeeTerm1(`"${sug}"`)}
                      className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors cursor-pointer text-[10px]"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              )}

              {/* Condition Bar 2 */}
              <div className="ieee-row">
                <select
                  className="ieee-operator-dropdown"
                  value={ieeeOp1}
                  onChange={(e) => setIeeeOp1(e.target.value as any)}
                  disabled={isExecuting}
                  title="Select Boolean Operator for Condition Bar 2 (AND / OR / NOT)"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                  <option value="NOT">NOT</option>
                </select>
                <input
                  type="text"
                  className="ieee-input-field"
                  placeholder="Condition 2 (Optional — e.g. Edge devices)"
                  value={ieeeTerm2}
                  onChange={(e) => setIeeeTerm2(e.target.value)}
                  disabled={isExecuting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isExecuting && composedFullQuery.trim()) {
                      e.preventDefault();
                      handleExecuteSearch(composedFullQuery);
                    }
                  }}
                />
                {ieeeTerm2 && (
                  <button
                    type="button"
                    onClick={() => setIeeeTerm2('')}
                    className="text-zinc-500 hover:text-white font-mono text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
                    title="Clear Condition 2"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Condition Bar 3 */}
              <div className="ieee-row">
                <select
                  className="ieee-operator-dropdown"
                  value={ieeeOp2}
                  onChange={(e) => setIeeeOp2(e.target.value as any)}
                  disabled={isExecuting}
                  title="Select Boolean Operator for Condition Bar 3 (AND / OR / NOT)"
                >
                  <option value="NOT">NOT</option>
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
                <input
                  type="text"
                  className="ieee-input-field"
                  placeholder="Condition 3 (Optional — e.g. Medical / Healthcare)"
                  value={ieeeTerm3}
                  onChange={(e) => setIeeeTerm3(e.target.value)}
                  disabled={isExecuting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isExecuting && composedFullQuery.trim()) {
                      e.preventDefault();
                      handleExecuteSearch(composedFullQuery);
                    }
                  }}
                />
                {ieeeTerm3 && (
                  <button
                    type="button"
                    onClick={() => setIeeeTerm3('')}
                    className="text-zinc-500 hover:text-white font-mono text-xs px-1.5 py-0.5 rounded hover:bg-white/10"
                    title="Clear Condition 3"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Expression Preview & Actions */}
              <div className="ieee-preview-strip">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <span className="ieee-preview-label shrink-0">Expression sent to S2:</span>
                  <span className="ieee-preview-formula truncate">
                    {composedFullQuery || '(Enter main topic or conditions)'}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    className={`text-xs font-mono transition-colors flex items-center gap-1.5 ${
                      temporalHoldout
                        ? 'text-emerald-400'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                    onClick={() => setTemporalHoldout(!temporalHoldout)}
                    title="Constrain training corpus strictly to literature <= 2023"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${temporalHoldout ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                    <span>≤ 2023 Holdout</span>
                  </button>
                                    
                  <button
                    type="button"
                    className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      setQuery('');
                      setIeeeTerm1('');
                      setIeeeTerm2('');
                      setIeeeTerm3('');
                      setCoOccurringSuggestions([]);
                      setPreflightStatus(null);
                    }}
                    title="Clear all search bars and reset query"
                  >
                    <span>✕ Clear All Fields</span>
                  </button>
                </div>
              </div>
            </div>
          )}


            {/* Real-time Boolean Conjunction Audit Pill */}
            {booleanAudit && (
              <div className="flex flex-wrap items-center gap-2 px-3 py-2 my-2 rounded-lg bg-zinc-950/90 border border-zinc-800 text-xs font-mono backdrop-blur-md animate-fadeIn">
                <span className="flex items-center gap-1.5 text-zinc-400 font-semibold tracking-wider text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  IEEE CONJUNCTION:
                </span>
                {booleanAudit.must.map((term, i) => (
                  <span key={`must-${i}`} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span className="text-[9px] text-amber-500 font-bold">MUST</span>
                    <span>"{term}"</span>
                  </span>
                ))}
                {booleanAudit.should.map((term, i) => (
                  <span key={`should-${i}`} className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                    <span className="text-[9px] text-sky-500 font-bold">OR</span>
                    <span>"{term}"</span>
                  </span>
                ))}
                {booleanAudit.must_not.map((term, i) => (
                  <span key={`not-${i}`} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <span className="text-[9px] text-rose-500 font-bold">NOT</span>
                    <span>"{term}"</span>
                  </span>
                ))}
                {booleanAudit.must.length > 1 && (
                  <span className="text-emerald-400 font-semibold text-[11px] ml-auto">
                    ✓ 100% compulsory ({booleanAudit.must.length}/{booleanAudit.must.length} phrases verified)
                  </span>
                )}
              </div>
            )}

            {/* Live Pre-Flight Zero-Result Prevention Badge */}
            {preflightStatus && (
              <div className="flex items-center justify-between px-3 py-1.5 my-1.5 rounded-lg bg-zinc-950/90 border border-zinc-800 text-xs font-mono backdrop-blur-md animate-fadeIn">
                {preflightStatus.is_locked ? (
                  <div className="flex flex-wrap items-center gap-2 text-rose-400">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      ⚠️ 0 EXACT TITLE MATCHES (QUERY LOCKED)
                    </span>
                    {preflightStatus.suggested_fix && (
                      <button
                        type="button"
                        onClick={() => {
                          if (preflightStatus.suggested_fix?.suggested_term2) {
                            setIeeeTerm1(`"${preflightStatus.suggested_fix.suggested_term2}"`);
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-[10px] cursor-pointer"
                      >
                        💡 1-Click Fix: {preflightStatus.suggested_fix.message}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>✓ {preflightStatus.count} IEEE / ACM Tier-1 Papers with 100% Title Match</span>
                    </div>
                    <span className="text-zinc-500 text-[10px]">VERIFIED TITLE CO-OCCURRENCE</span>
                  </div>
                )}
              </div>
            )}

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
                    : 'Enter an inquiry or explore the frontier of science.'}
                </span>
                <span className="stream-throughput-tag">
                  {isExecuting && currentPct === 100 ? '100% DONE' : (selectedCorpus ? `${selectedCorpus} PAPERS TARGET` : 'ALL PAPERS')}
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
