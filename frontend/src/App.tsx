import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { OmniScopeStudio } from './components/OmniScopeStudio';
import { CitationTimeline } from './components/CitationTimeline';
import { GrantStudio } from './components/GrantStudio';
import { HeroSection } from './components/HeroSection';
import { UniversalBackground } from './components/UniversalBackground';
import { BenchmarkModal } from './components/BenchmarkModal';
import { DatasetInfo, ArchipelagoData, CitationData, ResearchGap, NarratedGap, PipelineProgressEvent, Points3DData } from './types';
import { spatialJourneyController } from './particles/SpatialJourneyController';

// Stages definition
const STAGES = ['hero', 'archipelago', 'timeline', 'grant'] as const;
type StageId = typeof STAGES[number];

const STAGE_LABELS: Record<StageId, string> = {
  hero: '00 Hero Observatory',
  archipelago: '01 Domain Clusters',
  timeline: '02 Citations',
  grant: '03 Gap Analysis',
};

const STAGE_PROGRESS: Record<StageId, number> = {
  hero: 0.00,
  archipelago: 0.33,
  timeline: 0.66,
  grant: 1.00,
};

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'hero' | 'studio'>('hero');
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [activeTab, setActiveTab] = useState<StageId>('hero');
  const [points3dData, setPoints3dData] = useState<Points3DData | null>(null);
  const [archipelagoData, setArchipelagoData] = useState<ArchipelagoData | null>(null);
  const [citationData, setCitationData] = useState<CitationData | null>(null);
  const [detectedGaps, setDetectedGaps] = useState<ResearchGap[]>([]);
  const [narratedGaps, setNarratedGaps] = useState<NarratedGap[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [progressEvents, setProgressEvents] = useState<PipelineProgressEvent[]>([]);
  const [selectedGapTitle, setSelectedGapTitle] = useState('');
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState<string>('Federated Learning Privacy & Non-IID Drift in Clinical LLMs');
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  // Discrete Stage Engine
  const [stageIndex, setStageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Visibilities of each stage (0: hero, 1: archipelago, 2: timeline, 3: grant)
  // 'active': fully visible & interactive
  // 'exiting': fading out
  // 'entering': fading in
  // 'hidden': display none
  type StageDisplayState = 'active' | 'exiting' | 'entering' | 'hidden';
  const [stageStates, setStageStates] = useState<StageDisplayState[]>(['active', 'hidden', 'hidden', 'hidden']);

  const [targetPaperId, setTargetPaperId] = useState<string>('');

  const stageIndexRef = useRef(0);
  useEffect(() => { stageIndexRef.current = stageIndex; }, [stageIndex]);

  // Synchronize Home lock and selection context with SpatialJourneyController
  useEffect(() => {
    spatialJourneyController.setHomeLocked(stageIndex === 0 || isTransitioning);
  }, [stageIndex, isTransitioning]);

  useEffect(() => {
    return spatialJourneyController.subscribe((state) => {
      setSelectedClusterId(state.context.clusterId || '');
    });
  }, []);

  const isAnimatingRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const deltaResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const transitionTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTransitionTimers = () => {
    transitionTimersRef.current.forEach(t => clearTimeout(t));
    transitionTimersRef.current = [];
  };

  // Coordinated Stage Navigation
  const goToStage = useCallback((targetIndex: number) => {
    if (isAnimatingRef.current) return;
    const currentIndex = stageIndexRef.current;
    if (targetIndex === currentIndex) return;
    if (targetIndex < 0 || targetIndex >= STAGES.length) return;

    isAnimatingRef.current = true;
    setIsTransitioning(true);
    accumulatedDeltaRef.current = 0;
    clearTransitionTimers();

    const fromStage = STAGES[currentIndex];
    const toStage = STAGES[targetIndex];

    // SCENARIO 1: Hero -> Epistemic Map (Snappy, Fluid Particle Formation)
    if (currentIndex === 0 && targetIndex === 1) {
      // 1. Hero fades out
      setStageStates(['exiting', 'hidden', 'hidden', 'hidden']);
      setViewMode('studio');
      setActiveTab('archipelago');

      // 2. At t = 120ms: Mount OmniScopeStudio with smooth entering fade
      const t1 = setTimeout(() => {
        setStageIndex(1);
        setStageStates(['hidden', 'entering', 'hidden', 'hidden']);
      }, 120);

      // 3. At t = 450ms: Fully settled and interactive
      const t2 = setTimeout(() => {
        setStageStates(['hidden', 'active', 'hidden', 'hidden']);
        isAnimatingRef.current = false;
        setIsTransitioning(false);
      }, 450);

      transitionTimersRef.current = [t1, t2];
      return;
    }

    // SCENARIO 2: Return to Hero
    if (targetIndex === 0) {
      setStageStates(prev => {
        const next = prev.map(() => 'hidden') as StageDisplayState[];
        next[currentIndex] = 'exiting';
        return next;
      });
      setViewMode('hero');
      setActiveTab('hero');

      const t1 = setTimeout(() => {
        setStageIndex(0);
        setStageStates(['entering', 'hidden', 'hidden', 'hidden']);
      }, 120);

      const t2 = setTimeout(() => {
        setStageStates(['active', 'hidden', 'hidden', 'hidden']);
        isAnimatingRef.current = false;
        setIsTransitioning(false);
      }, 450);

      transitionTimersRef.current = [t1, t2];
      return;
    }

    // SCENARIO 3: Standard Fast Clean Cross-Fades (Epistemic <-> Timeline <-> Grant)
    setStageStates(prev => {
      const next = [...prev] as StageDisplayState[];
      next[currentIndex] = 'exiting';
      return next;
    });

    setActiveTab(toStage);
    setViewMode(targetIndex === 0 ? 'hero' : 'studio');

    const t1 = setTimeout(() => {
      setStageIndex(targetIndex);
      setStageStates(prev => {
        const next = [...prev] as StageDisplayState[];
        next[currentIndex] = 'hidden';
        next[targetIndex] = 'entering';
        return next;
      });
    }, 120);

    const t2 = setTimeout(() => {
      setStageStates(prev => {
        const next = prev.map(() => 'hidden') as StageDisplayState[];
        next[targetIndex] = 'active';
        return next;
      });
      isAnimatingRef.current = false;
      setIsTransitioning(false);
    }, 380);

    transitionTimersRef.current = [t1, t2];
  }, []);

  // Wheel Handler: Discrete Gestural Staging with Boundary Detection
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isAnimatingRef.current) {
      e.preventDefault();
      return;
    }

    // When Ctrl or Meta is held, user is zooming 3D canvas (do not trigger stage navigation)
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Check if user is scrolling inside an internal scrollable panel (like paper list or grant text)
    const target = e.target as HTMLElement | null;
    const scrollableParent = target?.closest('.overflow-y-auto, .custom-scrollbar, .research-instrument-panel, [data-scrollable]');
    if (scrollableParent) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableParent;
      const isAtTop = scrollTop <= 2;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 2;

      // If scrolling down and can scroll further inside panel, don't hijack
      if (e.deltaY > 0 && !isAtBottom) return;
      // If scrolling up and can scroll further inside panel, don't hijack
      if (e.deltaY < 0 && !isAtTop) return;
    }

    e.preventDefault();

    // Accumulate scroll delta with automatic decay
    accumulatedDeltaRef.current += e.deltaY;

    if (deltaResetTimeoutRef.current) clearTimeout(deltaResetTimeoutRef.current);
    deltaResetTimeoutRef.current = setTimeout(() => {
      accumulatedDeltaRef.current = 0;
    }, 300);

    const THRESHOLD = 220;
    if (accumulatedDeltaRef.current >= THRESHOLD) {
      accumulatedDeltaRef.current = 0;
      goToStage(stageIndexRef.current + 1);
    } else if (accumulatedDeltaRef.current <= -THRESHOLD) {
      accumulatedDeltaRef.current = 0;
      goToStage(stageIndexRef.current - 1);
    }
  }, [goToStage]);

  // Touch Handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartYRef.current === null || isAnimatingRef.current) return;
    const delta = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartYRef.current = null;
    if (delta > 60) goToStage(stageIndexRef.current + 1);
    if (delta < -60) goToStage(stageIndexRef.current - 1);
  }, [goToStage]);

  // Keyboard Handlers (Arrow navigation)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isAnimatingRef.current) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goToStage(stageIndexRef.current + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToStage(stageIndexRef.current - 1);
    }
  }, [goToStage]);

  const stageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageContainerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const scrollToSection = useCallback((sectionId: string) => {
    const idx = STAGES.indexOf(sectionId as StageId);
    if (idx !== -1) goToStage(idx);
  }, [goToStage]);

  // Initial datasets list query (NO auto-selection: selectedDataset stays empty until user acts)
  useEffect(() => {
    fetch('/api/datasets')
      .then(r => r.json())
      .then(data => {
        if (data.datasets?.length > 0) {
          setDatasets(data.datasets);
        }
      }).catch(() => {});
  }, []);

  // Fetch dataset artifacts when selectedDataset is set
  useEffect(() => {
    if (!selectedDataset) {
      setPoints3dData(null);
      setArchipelagoData(null);
      setCitationData(null);
      setDetectedGaps([]);
      setNarratedGaps([]);
      setSelectedGapTitle('');
      return;
    }
    // 1. High-priority immediate fetch for Stage 1 visual rendering & particles
    fetch(`/api/graph/points3d?dataset=${selectedDataset}`).then(r => r.ok ? r.json() : null).then(setPoints3dData).catch(() => setPoints3dData(null));
    fetch(`/api/graph/archipelago?dataset=${selectedDataset}`).then(r => r.ok ? r.json() : null).then(setArchipelagoData).catch(() => setArchipelagoData(null));
    fetch(`/api/gaps/detected?dataset=${selectedDataset}`).then(r => r.ok ? r.json() : null).then(d => setDetectedGaps(d?.gaps ?? [])).catch(() => setDetectedGaps([]));
    fetch(`/api/gaps/narrated?dataset=${selectedDataset}`).then(r => r.ok ? r.json() : null).then(d => {
      if (d?.gaps?.length > 0) { setNarratedGaps(d.gaps); setSelectedGapTitle(d.gaps[0].title); }
      else setNarratedGaps([]);
    }).catch(() => setNarratedGaps([]));

    // 2. Defer heavy citation dataset fetch slightly so WebGL particle transition stays locked at 60 FPS
    const timer = setTimeout(() => {
      fetch(`/api/graph/citation?dataset=${selectedDataset}`)
        .then(r => r.ok ? r.json() : null)
        .then(setCitationData)
        .catch(() => setCitationData(null));
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedDataset]);

  const handleTriggerRun = async (query: string, maxResults: number, year?: string) => {
    setIsRunning(true);
    setProgressEvents([]);
    setPipelineError(null);
    try {
      const payload: Record<string, any> = { query, max_results: maxResults };
      if (year) payload.year = year;
      const response = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Pipeline initialization failed: ${response.statusText}`);
      const statusData = await response.json();
      const jobId = statusData.job_id;
      if (!jobId) throw new Error('No tracking job ID returned.');

      const eventSource = new EventSource(`/api/pipeline/stream/${jobId}`);
      eventSource.onmessage = (e) => {
        try {
          const event: PipelineProgressEvent = JSON.parse(e.data);
          setProgressEvents(prev => [...prev, event]);
          if (event.is_terminal) {
            eventSource.close();
            setIsRunning(false);
            if (event.dataset_id) {
              setSelectedDataset(event.dataset_id);
              goToStage(1);
            }
          }
        } catch { }
      };
      eventSource.onerror = () => {
        eventSource.close();
        setIsRunning(false);
      };
    } catch (err: any) {
      setPipelineError(err.message || 'Pipeline failed.');
      setIsRunning(false);
    }
  };

  const handleSelectGapForGrant = (gapTitle: string) => {
    setSelectedGapTitle(gapTitle);
    scrollToSection('grant');
  };

  const handleSelectPaper = (paperId: string) => {
    setTargetPaperId(paperId);
    scrollToSection('timeline');
  };

  // Inline Style Generator for Zero-Collision Staging
  const getStageStyle = (state: StageDisplayState): React.CSSProperties => {
    if (state === 'hidden') {
      return {
        display: 'none',
      };
    }
    const base: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      willChange: 'opacity',
    };
    if (state === 'active') {
      return { ...base, opacity: 1, pointerEvents: 'auto', zIndex: 10 };
    }
    if (state === 'entering') {
      return { ...base, opacity: 1, pointerEvents: 'none', zIndex: 10 };
    }
    if (state === 'exiting') {
      return { ...base, opacity: 0, pointerEvents: 'none', zIndex: 5 };
    }
    return base;
  };

  return (
    <>
      {/* Universal Atmospheric WebGL Canvas */}
      <UniversalBackground
        viewMode={viewMode}
        isTransitioning={isTransitioning}
        activeTab={activeTab}
        selectedClusterId={selectedClusterId}
        onSelectCluster={setSelectedClusterId}
        activeLayer={activeLayer}
        points3dData={points3dData}
        scrollProgress={STAGE_PROGRESS[activeTab]}
      />

      {/* Master Navigation Header */}
      <Header
        viewMode={viewMode}
        activeTab={activeTab}
        onSelectTab={scrollToSection}
        onReturnToHero={() => scrollToSection('hero')}
        onLaunchStudio={() => scrollToSection('archipelago')}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
      />

      {/* Main Viewport Stage Container */}
      <div
        ref={stageContainerRef}
        style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* 00 — Hero Observatory & Search Deck */}
        {stageStates[0] !== 'hidden' && (
          <div style={getStageStyle(stageStates[0])}>
            <HeroSection
              onLaunch={(tab) => scrollToSection(tab || 'archipelago')}
              isRunning={isRunning}
              progressEvents={progressEvents}
              pipelineError={pipelineError}
              onSearch={(searchQuery, corpusSize, datasetId, year) => {
                setPipelineError(null);
                setActiveQuery(searchQuery);
                if (datasetId) {
                  setSelectedDataset(datasetId);
                  scrollToSection('archipelago');
                  return;
                }
                // Check if query directly matches any precomputed dataset
                const qClean = searchQuery.toLowerCase().trim();
                const matched = datasets.find(d => 
                  d.id === searchQuery || 
                  d.id === `output_${qClean.replace(/[^a-z0-9]+/g, '_').slice(0, 24).replace(/_+$/, '')}` ||
                  (d.query && d.query.toLowerCase() === qClean) ||
                  d.name.toLowerCase() === qClean
                );
                if (matched) {
                  setSelectedDataset(matched.id);
                  scrollToSection('archipelago');
                  return;
                }
                handleTriggerRun(searchQuery, corpusSize || 300, year);
              }}
            />
          </div>
        )}

        {/* 01 — Epistemic Archipelago & Algorithmic Gap Matrix */}
        {stageStates[1] !== 'hidden' && (
          <div style={getStageStyle(stageStates[1])}>
            <OmniScopeStudio
              data3d={points3dData}
              activeQuery={activeQuery}
              onNavigateToGrant={handleSelectGapForGrant}
              onNavigateToHero={() => scrollToSection('hero')}
              onSelectPaper={handleSelectPaper}
              selectedClusterId={selectedClusterId}
              onSelectCluster={setSelectedClusterId}
              activeLayer={activeLayer}
              gaps={detectedGaps}
              hasDataset={Boolean(selectedDataset)}
              onOpenBenchmark={() => setIsBenchmarkOpen(true)}
            />
          </div>
        )}

        {/* 02 — SPLC Citation Lineage & Epistemic Journey */}
        {stageStates[2] !== 'hidden' && (
          <div style={{ ...getStageStyle(stageStates[2]), overflowY: 'auto' }}>
            <CitationTimeline
              data={citationData}
              searchQuery={activeQuery}
              onNavigateToHero={() => scrollToSection('hero')}
              targetPaperId={targetPaperId}
            />
          </div>
        )}

        {/* 03 — AI Grant Studio & Operational Hypotheses */}
        {stageStates[3] !== 'hidden' && (
          <div style={{ ...getStageStyle(stageStates[3]), overflowY: 'auto' }}>
            <GrantStudio
              narratedGaps={narratedGaps}
              selectedGapTitle={selectedGapTitle}
              searchQuery={activeQuery}
              onNavigateToHero={() => scrollToSection('hero')}
            />
          </div>
        )}

        {/* Vertical Stage Navigation Indicator (Right Edge) */}
        <nav
          aria-label="Platform Stage Navigation"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 40,
          }}
        >
          {STAGES.map((stageId, i) => {
            const isActive = i === stageIndex;
            return (
              <button
                key={stageId}
                onClick={() => goToStage(i)}
                title={STAGE_LABELS[stageId]}
                className="group relative flex items-center justify-center p-1 focus:outline-none"
              >
                <div
                  style={{
                    width: isActive ? '6px' : '4px',
                    height: isActive ? '26px' : '6px',
                    borderRadius: '3px',
                    backgroundColor: isActive ? '#ff4300' : 'rgba(255, 255, 255, 0.28)',
                    boxShadow: isActive ? '0 0 12px rgba(255, 67, 0, 0.6)' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="group-hover:bg-[#ff4300] transition-colors"
                />
                {/* Floating Tooltip */}
                <span className="absolute right-6 px-2 py-1 rounded bg-[#080b11]/90 border border-white/10 text-[10px] font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                  {STAGE_LABELS[stageId]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* SOTA Ground Truth Empirical Verification Benchmark Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />
    </>
  );
};

export default App;