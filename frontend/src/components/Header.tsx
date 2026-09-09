import React from 'react';
import { Database, Sparkles, Network, Compass, Grid3X3, FileText } from 'lucide-react';
import { DatasetInfo } from '../types';

interface HeaderProps {
  datasets: DatasetInfo[];
  selectedDataset: string;
  onSelectDataset: (id: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isHealthy: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  datasets,
  selectedDataset,
  onSelectDataset,
  activeTab,
  onSelectTab,
  isHealthy,
}) => {
  const tabs = [
    { id: 'query', label: 'Query Console', icon: Sparkles, desc: 'Stages 1-2' },
    { id: 'archipelago', label: 'Epistemic Archipelago', icon: Compass, desc: 'Stage 6' },
    { id: 'timeline', label: 'Citation Constellation', icon: Network, desc: 'Stage 5' },
    { id: 'gaps', label: 'Algorithmic Gap Matrix', icon: Grid3X3, desc: 'Stage 7' },
    { id: 'grant', label: 'AI Grant Studio', icon: FileText, desc: 'Stage 8' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#080b11]/94 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        
        {/* Brand & Editorial Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[rgba(255,255,255,0.12)] bg-[#0f141f] shadow-specular">
            <span className="font-serif text-lg font-medium text-[#38bdf8]">Ψ</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-mono text-xs font-semibold tracking-[0.14em] text-[#f8fafc] uppercase">
                RESEARCHRADAR
              </h1>
              <span className="rounded border border-[rgba(56,189,248,0.3)] bg-[#38bdf8]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#38bdf8]">
                v3.0 SOTA
              </span>
            </div>
            <p className="text-[11px] text-[#64748b]">
              Swiss Scientometric Intelligence & Grounded Gap Discovery
            </p>
          </div>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f141f] px-2.5 py-1.5">
            <Database className="h-3.5 w-3.5 text-[#38bdf8]" />
            <span className="font-mono text-[11px] text-[#64748b]">Corpus:</span>
            <select
              value={selectedDataset}
              onChange={(e) => onSelectDataset(e.target.value)}
              className="bg-transparent font-sans text-xs font-medium text-[#f8fafc] focus:outline-none cursor-pointer max-w-[280px] truncate"
            >
              {datasets.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#0f141f] text-[#f8fafc]">
                  {d.name} ({d.paper_count} papers)
                </option>
              ))}
            </select>
          </div>

          {/* System Health Badge */}
          <div className="flex items-center space-x-1.5 rounded-full border border-[rgba(255,255,255,0.06)] bg-[#0f141f] px-2.5 py-1 font-mono text-[11px]">
            <span className={`h-1.5 w-1.5 rounded-full ${isHealthy ? 'bg-[#10b981] animate-pulse' : 'bg-[#ea580c]'}`} />
            <span className="text-[#94a3b8]">{isHealthy ? 'Groq LPU Ready' : 'Connecting'}</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="mx-auto flex max-w-7xl items-center space-x-1 px-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center space-x-2 border-b-2 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'border-[#38bdf8] text-[#f8fafc]'
                  : 'border-transparent text-[#64748b] hover:border-[rgba(255,255,255,0.12)] hover:text-[#94a3b8]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#38bdf8]' : 'text-[#64748b] group-hover:text-[#94a3b8]'}`} />
              <span>{tab.label}</span>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-[#38bdf8]/15 text-[#38bdf8]' : 'bg-[#161e2e] text-[#475569]'}`}>
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
