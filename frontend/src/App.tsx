import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OmniScopeStudio } from './components/OmniScopeStudio';
import { ArchipelagoCanvas } from './components/ArchipelagoCanvas';
import { CitationTimeline } from './components/CitationTimeline';
import { GapMatrix } from './components/GapMatrix';
import { GrantStudio } from './components/GrantStudio';
import { HeroSection } from './components/HeroSection';
import { UniversalBackground } from './components/UniversalBackground';
import { DatasetInfo, ArchipelagoData, CitationData, ResearchGap, NarratedGap, PipelineProgressEvent, Points3DData } from './types';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'hero' | 'studio'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('view') === 'studio') return 'studio';
    }
    return 'hero';
  });
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('dataset')) return p.get('dataset')!;
    }
    return '';
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('tab')) return p.get('tab')!;
    }
    return 'timeline';
  });
  const [isHealthy, setIsHealthy] = useState<boolean>(true);

  // Data states for the active dataset
  const [points3dData, setPoints3dData] = useState<Points3DData | null>(null);
  const [archipelagoData, setArchipelagoData] = useState<ArchipelagoData | null>(null);
  const [citationData, setCitationData] = useState<CitationData | null>(null);
  const [detectedGaps, setDetectedGaps] = useState<ResearchGap[]>([]);
  const [narratedGaps, setNarratedGaps] = useState<NarratedGap[]>([]);

  // Pipeline execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [studioUiVisible, setStudioUiVisible] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('view') === 'studio') return true;
    }
    return false;
  });
  const [selectedClusterId, setSelectedClusterId] = useState<string>('3');
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [progressEvents, setProgressEvents] = useState<PipelineProgressEvent[]>([]);
  const [selectedGapTitle, setSelectedGapTitle] = useState<string>('');
  const [pipelineError, setPipelineError] = useState<string | null>(null);


  // 1. Initial Load: Fetch available datasets list (no auto-selection — blank until user searches)
  useEffect(() => {
    fetch('/api/datasets')
      .then(res => res.json())
      .then(data => {
        if (data.datasets && data.datasets.length > 0) {
          setDatasets(data.datasets);
          // Do NOT auto-select — let the user pick via search or presets
        }
      })
      .catch(() => {
        // Backend unreachable — keep empty datasets list, user can still search
      });

    // Check health
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setIsHealthy(true))
      .catch(() => setIsHealthy(false));
  }, []);


  // 2. Fetch dataset resources whenever selectedDataset changes
  useEffect(() => {
    if (!selectedDataset) return;

    fetch(`/api/graph/points3d?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setPoints3dData(data))
      .catch(() => setPoints3dData(null));

    fetch(`/api/graph/archipelago?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setArchipelagoData(data))
      .catch(() => setArchipelagoData(null));

    fetch(`/api/graph/citation?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setCitationData(data))
      .catch(() => setCitationData(null));

    fetch(`/api/gaps/detected?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.gaps) setDetectedGaps(data.gaps);
        else setDetectedGaps([]);
      })
      .catch(() => setDetectedGaps([]));

    fetch(`/api/gaps/narrated?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.gaps && data.gaps.length > 0) {
          setNarratedGaps(data.gaps);
          if (data.gaps[0]) setSelectedGapTitle(data.gaps[0].title);
        } else {
          setNarratedGaps([]);
        }
      })
      .catch(() => setNarratedGaps([]));

  }, [selectedDataset]);

  // 3. Trigger Pipeline Execution with Live SSE Stream
  const handleTriggerRun = async (query: string, maxResults: number) => {
    setIsRunning(true);
    setProgressEvents([]);
    setPipelineError(null);

    try {
      const response = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, max_results: maxResults }),
      });

      if (!response.ok) {
        throw new Error(`Pipeline failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '').trim();
            if (!jsonStr) continue;

            try {
              const event: PipelineProgressEvent = JSON.parse(jsonStr);
              setProgressEvents(prev => [...prev, event]);

              if (event.is_terminal) {
                setIsRunning(false);
                if (event.dataset_id) {
                  setSelectedDataset(event.dataset_id);
                  // Auto launch to Archipelago Studio on completion
                  handleLaunchWithTransition('archipelago');
                }
              }
            } catch (e) {
              console.error('Error parsing SSE event:', e);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Pipeline streaming error:', err);
      setPipelineError(err.message || 'Pipeline execution failed.');
      setIsRunning(false);
    }
  };

  const handleSelectGapForGrant = (gapTitle: string) => {
    setSelectedGapTitle(gapTitle);
    setActiveTab('grant');
    if (viewMode !== 'studio') {
      setViewMode('studio');
      setStudioUiVisible(true);
    }
  };

  // Smooth cinematic launch transition from Hero into Studio
  const handleLaunchWithTransition = (tabId: string = 'archipelago') => {
    setActiveTab(tabId);
    setIsTransitioning(true);

    setTimeout(() => {
      setViewMode('studio');
      setStudioUiVisible(true);
      setIsTransitioning(false);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-[#f8fafc] relative overflow-x-hidden selection:bg-[#ff4300]/20 selection:text-[#ff4300] flex flex-col transition-colors duration-700">
      {/* Universal Atmospheric Canvas persistent across all views */}
      <UniversalBackground
        viewMode={viewMode}
        isTransitioning={isTransitioning}
        activeTab={activeTab}
        selectedClusterId={selectedClusterId}
        onSelectCluster={setSelectedClusterId}
        activeLayer={activeLayer}
        points3dData={points3dData}
      />

      {/* Unified Master Navigation Header (Persistent across hero & studio modes) */}
      <Header
        viewMode={isTransitioning ? 'hero' : viewMode}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (viewMode !== 'studio') {
            setStudioUiVisible(true);
            setViewMode('studio');
          }
        }}
        datasets={datasets}
        selectedDataset={selectedDataset}
        onSelectDataset={setSelectedDataset}
        onReturnToHero={() => {
          setIsTransitioning(false);
          setStudioUiVisible(false);
          setViewMode('hero');
        }}
        onLaunchStudio={() => {
          handleLaunchWithTransition('archipelago');
        }}
      />

      {viewMode === 'hero' ? (
        <div className={`flex-1 flex flex-col transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 scale-105 pointer-events-none filter blur-[2px]' : 'opacity-100 scale-100'}`}>
          <HeroSection
            onLaunch={handleLaunchWithTransition}
            isRunning={isRunning}
            progressEvents={progressEvents}
            pipelineError={pipelineError}
            onSearch={(searchQuery, corpusSize, datasetId) => {
              // Clear any previous error
              setPipelineError(null);
              // PRESET CLICK: datasetId is passed — load the existing pre-computed dataset
              if (datasetId) {
                setSelectedDataset(datasetId);
                return;
              }

              // CUSTOM QUERY: always trigger the live 8-stage pipeline
              // Never silently redirect a user query to a hardcoded dataset
              handleTriggerRun(searchQuery, corpusSize || 300);
            }}
          />
        </div>
      ) : (
        <div className={`relative z-10 flex flex-col flex-1 transition-all duration-700 ease-out ${studioUiVisible ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-6 scale-[0.98] pointer-events-none'}`}>
          {/* Main Tabbed Content Area */}
          <main className={`mx-auto flex-1 w-full ${activeTab === 'timeline' || activeTab === 'grant' || activeTab === 'archipelago' ? 'p-0 max-w-full overflow-hidden' : 'max-w-[1560px] px-4 sm:px-6 py-4 pb-12'}`}>
            {activeTab === 'timeline' && (
              <CitationTimeline data={citationData} />
            )}

            {activeTab === 'archipelago' && (
              <OmniScopeStudio
                data3d={points3dData}
                datasetName={datasets.find(d => d.id === selectedDataset)?.name || 'Satellite Earth Observation & Remote Sensing'}
                onNavigateToGrant={handleSelectGapForGrant}
                selectedClusterId={selectedClusterId}
                onSelectCluster={setSelectedClusterId}
                activeLayer={activeLayer}
                onSelectLayer={setActiveLayer}
              />
            )}

            {activeTab === 'gaps' && (
              <GapMatrix
                gaps={detectedGaps}
                onSelectGapForGrant={handleSelectGapForGrant}
              />
            )}

            {activeTab === 'grant' && (
              <GrantStudio
                narratedGaps={narratedGaps}
                selectedGapTitle={selectedGapTitle}
              />
            )}
          </main>

          {/* Swiss Editorial Footer (shown on long-scroll studio tabs) */}
          {activeTab !== 'timeline' && activeTab !== 'archipelago' && activeTab !== 'grant' && (
            <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#080b11]/80 backdrop-blur-md py-6 font-mono text-[11px] text-[#64748b]">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
              <div className="flex items-center space-x-3">
                <span>RESEARCHRADAR · SWISS SCIENTOMETRIC INTELLIGENCE</span>
                <span>·</span>
                <span className="text-[#ff4300]">EPISTEMIC RADAR</span>
              </div>
              <div className="flex items-center space-x-4 text-[#475569]">
                <span>Price (1965)</span>
                <span>Uzzi et al. (Science 2013)</span>
                <span>Groq LPU Grounded RAG</span>
              </div>
            </div>
          </footer>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
