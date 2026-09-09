import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QueryConsole } from './components/QueryConsole';
import { ArchipelagoCanvas } from './components/ArchipelagoCanvas';
import { CitationTimeline } from './components/CitationTimeline';
import { GapMatrix } from './components/GapMatrix';
import { GrantStudio } from './components/GrantStudio';
import { DatasetInfo, ArchipelagoData, CitationData, ResearchGap, NarratedGap, PipelineProgressEvent, Points3DData } from './types';

export const App: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('output_satellite_300');
  const [activeTab, setActiveTab] = useState<string>('query');
  const [isHealthy, setIsHealthy] = useState<boolean>(true);

  // Data states for the active dataset
  const [points3dData, setPoints3dData] = useState<Points3DData | null>(null);
  const [archipelagoData, setArchipelagoData] = useState<ArchipelagoData | null>(null);
  const [citationData, setCitationData] = useState<CitationData | null>(null);
  const [detectedGaps, setDetectedGaps] = useState<ResearchGap[]>([]);
  const [narratedGaps, setNarratedGaps] = useState<NarratedGap[]>([]);

  // Pipeline execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressEvents, setProgressEvents] = useState<PipelineProgressEvent[]>([]);
  const [selectedGapTitle, setSelectedGapTitle] = useState<string>('');

  // 1. Initial Load: Fetch available datasets
  useEffect(() => {
    fetch('/api/datasets')
      .then(res => res.json())
      .then(data => {
        if (data.datasets && data.datasets.length > 0) {
          setDatasets(data.datasets);
          // Prefer satellite or first dataset
          const initial = data.datasets.find((d: any) => d.id === 'output_satellite_300') || data.datasets[0];
          setSelectedDataset(initial.id);
        }
      })
      .catch(() => {
        // Fallback demo datasets if API offline
        setDatasets([
          {
            id: 'output_satellite_300',
            name: 'Satellite Earth Observation & Remote Sensing',
            description: '300 remote sensing papers, CNN vs Sentinel-1/2, atmospheric correction.',
            query: 'satellite image processing',
            paper_count: 300,
            has_archipelago: true,
            has_milestones: true,
            has_gaps: true,
            has_narration: true,
          },
          {
            id: 'output_autonomous_1500',
            name: 'Autonomous Driving Multi-Modal Perception',
            description: '1,500 papers, LiDAR-camera fusion, pedestrian occlusion.',
            query: 'autonomous driving 3d object detection',
            paper_count: 1500,
            has_archipelago: true,
            has_milestones: true,
            has_gaps: true,
            has_narration: true,
          },
        ]);
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

    // Fetch 3D Points Manifold
    fetch(`/api/graph/points3d?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setPoints3dData(data))
      .catch(() => setPoints3dData(null));

    // Fetch Archipelago
    fetch(`/api/graph/archipelago?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setArchipelagoData(data))
      .catch(() => setArchipelagoData(null));

    // Fetch Milestones & Citation Constellation
    fetch(`/api/graph/citation?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setCitationData(data))
      .catch(() => setCitationData(null));

    // Fetch Detected Gaps
    fetch(`/api/gaps/detected?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.gaps) setDetectedGaps(data.gaps);
        else setDetectedGaps([]);
      })
      .catch(() => setDetectedGaps([]));

    // Fetch Narrated Gaps
    fetch(`/api/gaps/narrated?dataset=${selectedDataset}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.gaps) {
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

    try {
      const res = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, max_results: maxResults }),
      });

      if (!res.ok) throw new Error('Pipeline trigger failed');
      const jobData = await res.json();
      const jobId = jobData.job_id;

      // Connect to Server-Sent Events (SSE) stream
      const evtSource = new EventSource(`/api/pipeline/stream/${jobId}`);

      evtSource.onmessage = (event) => {
        try {
          const parsed: PipelineProgressEvent = JSON.parse(event.data);
          setProgressEvents(prev => [...prev, parsed]);

          if (parsed.is_terminal || parsed.progress_pct === 100) {
            evtSource.close();
            setIsRunning(false);
          }
        } catch {
          // ignore stream parse errors
        }
      };

      evtSource.onerror = () => {
        evtSource.close();
        setIsRunning(false);
      };
    } catch {
      // Mock progress simulation for offline development if backend not running
      const stages = [
        { stage: 1, stage_name: 'Stage 1: Ingest', progress_pct: 12, message: `Ingesting papers for "${query}"` },
        { stage: 2, stage_name: 'Stage 2: Preprocessing', progress_pct: 25, message: 'Lemmatization & stopword removal' },
        { stage: 3, stage_name: 'Stage 3: Embedding', progress_pct: 42, message: 'Dense Sentence-Transformers vectorization' },
        { stage: 4, stage_name: 'Stage 4: Topic Modeling', progress_pct: 60, message: 'HDBSCAN clustering & c-TF-IDF' },
        { stage: 5, stage_name: 'Stage 5: Citation Graph', progress_pct: 78, message: '3-Lens constellation & SPLC lineage' },
        { stage: 6, stage_name: 'Stage 6: Archipelago', progress_pct: 88, message: 'Compiling macro-cluster topology' },
        { stage: 7, stage_name: 'Stage 7: Gap Matrix', progress_pct: 94, message: 'Uzzi et al. 2013 combinatorial z-scores' },
        { stage: 8, stage_name: 'Stage 8: RAG Narration', progress_pct: 100, message: 'Grounded Groq LPU hypothesis synthesis' },
      ];

      for (const s of stages) {
        await new Promise(r => setTimeout(r, 450));
        setProgressEvents(prev => [...prev, s]);
      }
      setIsRunning(false);
    }
  };

  const handleSelectGapForGrant = (gapTitle: string) => {
    setSelectedGapTitle(gapTitle);
    setActiveTab('grant');
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-[#f8fafc] flex flex-col selection:bg-[#38bdf8]/20 selection:text-[#38bdf8]">
      {/* Universal Master Header */}
      <Header
        datasets={datasets}
        selectedDataset={selectedDataset}
        onSelectDataset={setSelectedDataset}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isHealthy={isHealthy}
      />

      {/* Main Tabbed Content Area */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 pb-12">
        {activeTab === 'query' && (
          <QueryConsole
            datasets={datasets}
            selectedDataset={selectedDataset}
            onSelectDataset={setSelectedDataset}
            onTriggerRun={handleTriggerRun}
            isRunning={isRunning}
            progressEvents={progressEvents}
          />
        )}

        {activeTab === 'archipelago' && (
          <ArchipelagoCanvas
            data3d={points3dData}
            datasetName={datasets.find(d => d.id === selectedDataset)?.name || 'Corpus'}
            onNavigateToGrant={handleSelectGapForGrant}
          />
        )}

        {activeTab === 'timeline' && (
          <CitationTimeline data={citationData} />
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

      {/* Swiss Editorial Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#080b11] py-6 font-mono text-[11px] text-[#64748b]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
          <div className="flex items-center space-x-3">
            <span>RESEARCHRADAR · SWISS EDITORIAL DESIGN SYSTEM</span>
            <span>·</span>
            <span className="text-[#94a3b8]">NO NEON CREED</span>
          </div>
          <div className="flex items-center space-x-4 text-[#475569]">
            <span>Price (1965)</span>
            <span>Uzzi et al. (Science 2013)</span>
            <span>Groq LPU Grounded RAG</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
