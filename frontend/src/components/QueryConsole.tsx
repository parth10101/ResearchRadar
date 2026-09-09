import React, { useState } from 'react';
import { Search, Play, CheckCircle, Clock, AlertTriangle, ArrowRight, Layers, Sparkles, Terminal, FileCheck } from 'lucide-react';
import { DatasetInfo, PipelineProgressEvent } from '../types';

interface QueryConsoleProps {
  datasets: DatasetInfo[];
  selectedDataset: string;
  onSelectDataset: (id: string) => void;
  onTriggerRun: (query: string, maxResults: number) => void;
  isRunning: boolean;
  progressEvents: PipelineProgressEvent[];
}

export const QueryConsole: React.FC<QueryConsoleProps> = ({
  datasets,
  selectedDataset,
  onSelectDataset,
  onTriggerRun,
  isRunning,
  progressEvents,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [maxResults, setMaxResults] = useState(300);
  const [showLogs, setShowLogs] = useState(true);

  const STAGES = [
    { num: 1, name: 'Data Ingestion', sub: 'Semantic Scholar / arXiv API' },
    { num: 2, name: 'Preprocessing', sub: 'Spacy Lemmatization & Filters' },
    { num: 3, name: 'Semantic Embedding', sub: 'Sentence-Transformers Vectorization' },
    { num: 4, name: 'Topic Modelling', sub: 'HDBSCAN & c-TF-IDF Extraction' },
    { num: 5, name: 'Citation Graph', sub: '3-Lens Lineage & SPLC Backbone' },
    { num: 6, name: 'Knowledge Graph', sub: 'Epistemic Archipelago Islands' },
    { num: 7, name: 'Gap Identification', sub: 'Uzzi et al. 2013 Novelty z-score' },
    { num: 8, name: 'AI Gap Narration', sub: 'Grounded Groq LPU Hypotheses' },
  ];

  const currentStage = progressEvents.length > 0 
    ? progressEvents[progressEvents.length - 1].stage 
    : 0;
  
  const currentPct = progressEvents.length > 0
    ? progressEvents[progressEvents.length - 1].progress_pct
    : 0;

  const handlePresetClick = (datasetId: string, defaultQuery: string) => {
    onSelectDataset(datasetId);
    setQueryInput(defaultQuery);
  };

  const handleRunSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    onTriggerRun(queryInput.trim(), maxResults);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Editorial Hero Banner */}
      <div className="border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div className="flex items-center space-x-2 text-[#38bdf8] font-mono text-xs mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SCIENTOMETRIC RADAR ENGINE — STAGES 1 & 2</span>
        </div>
        <h2 className="font-serif text-3xl font-normal tracking-tight text-[#f8fafc] sm:text-4xl">
          Automated Academic Literature Discovery & Pipeline Ingestion
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-[#94a3b8] leading-relaxed">
          Ingest peer-reviewed literature across major indexing backends, clean non-English metadata, construct dense embeddings, and execute combinatorial novelty scoring across all 8 pipeline stages.
        </p>
      </div>

      {/* Free-form Query Console */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f141f] p-6 shadow-panel">
        <form onSubmit={handleRunSubmit} className="space-y-4">
          <label className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
            Input Academic Query String
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748b]" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="e.g. satellite image processing cloud removal, federated learning healthcare, chain of thought..."
                className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#080b11] py-2.5 pl-10 pr-4 font-sans text-sm text-[#f8fafc] placeholder-[#475569] focus:border-[#38bdf8] focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#080b11] px-3 py-2">
                <span className="font-mono text-xs text-[#64748b]">N =</span>
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="bg-transparent font-mono text-xs text-[#f8fafc] focus:outline-none cursor-pointer"
                >
                  <option value={100} className="bg-[#0f141f]">100 papers</option>
                  <option value={300} className="bg-[#0f141f]">300 papers</option>
                  <option value={500} className="bg-[#0f141f]">500 papers</option>
                  <option value={1000} className="bg-[#0f141f]">1,000 papers</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isRunning || !queryInput.trim()}
                className="flex items-center space-x-2 rounded-lg bg-[#38bdf8] px-5 py-2.5 font-sans text-xs font-semibold text-[#080b11] hover:bg-[#38bdf8]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isRunning ? 'Pipeline Running...' : 'Execute Radar'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Instant Pre-Computed Presets */}
        <div className="mt-6 border-t border-[rgba(255,255,255,0.06)] pt-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#64748b]">
              Or Explore Pre-Computed Academic Benchmarks (0.00s Instant Load)
            </span>
            <span className="font-mono text-[10px] text-[#10b981]">● Ground Truth Verified</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {datasets.map((d) => {
              const isSelected = d.id === selectedDataset;
              return (
                <div
                  key={d.id}
                  onClick={() => handlePresetClick(d.id, d.query)}
                  className={`group cursor-pointer rounded-lg border p-3.5 transition-all ${
                    isSelected
                      ? 'border-[#38bdf8] bg-[#161e2e] shadow-specular'
                      : 'border-[rgba(255,255,255,0.06)] bg-[#080b11] hover:border-[rgba(255,255,255,0.14)] hover:bg-[#0f141f]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-sans text-xs font-semibold text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors">
                      {d.name}
                    </h3>
                    <span className="font-mono text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 px-1.5 py-0.5 rounded">
                      {d.paper_count}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] text-[#64748b] leading-relaxed">
                    {d.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[#475569]">
                    <span>Query: "{d.query}"</span>
                    <ArrowRight className="h-3 w-3 text-[#64748b] group-hover:text-[#38bdf8] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Pipeline Execution Stream (Stages 1-8) */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f141f] p-6 shadow-panel">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(255,255,255,0.1)] bg-[#161e2e]">
              <Layers className="h-3.5 w-3.5 text-[#38bdf8]" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#f8fafc]">
                Live Stage Execution Stream
              </h3>
              <p className="text-[11px] text-[#64748b]">
                Real-time Server-Sent Events (SSE) tracking across 8-stage pipeline
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-[#94a3b8]">
              Progress: <strong className="text-[#38bdf8] tabular-nums">{currentPct}%</strong>
            </span>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center space-x-1.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#080b11] px-2.5 py-1 font-mono text-[11px] text-[#64748b] hover:text-[#94a3b8]"
            >
              <Terminal className="h-3 w-3" />
              <span>{showLogs ? 'Hide Logs' : 'Show Logs'}</span>
            </button>
          </div>
        </div>

        {/* 8-Stage Visual Progress Bar */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {STAGES.map((s) => {
            const isDone = currentStage > s.num || (!isRunning && currentPct === 100);
            const isCurrent = isRunning && currentStage === s.num;
            return (
              <div
                key={s.num}
                className={`rounded-lg border p-2.5 transition-all ${
                  isCurrent
                    ? 'border-[#38bdf8] bg-[#38bdf8]/10 ring-1 ring-[#38bdf8]'
                    : isDone
                    ? 'border-[rgba(16,185,129,0.3)] bg-[#10b981]/5'
                    : 'border-[rgba(255,255,255,0.05)] bg-[#080b11]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#64748b]">STAGE {s.num}</span>
                  {isDone ? (
                    <CheckCircle className="h-3 w-3 text-[#10b981]" />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-ping" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#334155]" />
                  )}
                </div>
                <h4 className={`mt-1 font-sans text-xs font-semibold ${isCurrent ? 'text-[#38bdf8]' : isDone ? 'text-[#f8fafc]' : 'text-[#64748b]'}`}>
                  {s.name}
                </h4>
                <p className="mt-0.5 text-[10px] text-[#475569] truncate">
                  {s.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Terminal Log Output */}
        {showLogs && (
          <div className="mt-4 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#080b11] p-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 text-[11px] text-[#64748b]">
              <span>TERMINAL STREAM TICKER</span>
              <span>{progressEvents.length} events logged</span>
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1.5">
              {progressEvents.length === 0 ? (
                <div className="py-3 text-center text-[#475569]">
                  Select a corpus or execute a query above to start live stage streaming.
                </div>
              ) : (
                progressEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[11px]">
                    <span className="text-[#38bdf8]">[{evt.progress_pct}%]</span>
                    <span className="text-[#94a3b8] font-medium">{evt.stage_name}:</span>
                    <span className="text-[#64748b]">{evt.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
