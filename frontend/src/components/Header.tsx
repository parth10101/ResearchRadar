import React from 'react';
import { Database, Network, Compass, FileText, Globe } from 'lucide-react';
import { DatasetInfo } from '../types';

interface HeaderProps {
  viewMode: 'hero' | 'studio';
  activeTab: string;
  onSelectTab: (tab: string) => void;
  datasets: DatasetInfo[];
  selectedDataset: string;
  onSelectDataset: (id: string) => void;
  onReturnToHero: () => void;
  onLaunchStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  activeTab,
  onSelectTab,
  datasets,
  selectedDataset,
  onSelectDataset,
  onReturnToHero,
  onLaunchStudio,
}) => {
  const navTabs = [
    { id: 'timeline', idx: '01', label: 'Citation Lineage', icon: Network },
    { id: 'archipelago', idx: '02', label: 'Epistemic Map', icon: Compass },
    { id: 'grant', idx: '03', label: 'AI Grant Studio', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[60px] border-b border-[rgba(255,255,255,0.08)] bg-[#080b11]/85 text-[#f8fafc] backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand & Symbol */}
        <div
          className="flex items-center space-x-3 cursor-pointer group select-none"
          onClick={onReturnToHero}
          title="Return to 3D Observatory"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded border border-[rgba(255,67,0,0.35)] bg-[#ff4300]/10 shadow-[0_0_12px_rgba(255,67,0,0.15)] group-hover:border-[#ff4300] transition-colors">
            <span className="font-serif text-base font-semibold text-[#ff4300]">Ψ</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold tracking-[0.14em] uppercase text-[#f8fafc] group-hover:text-white transition-colors">
              RESEARCHRADAR
            </span>
          </div>
        </div>

        {/* Center Navigation Tabs (Consistent across all modes) */}
        <nav className="hidden md:flex items-center space-x-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = viewMode === 'studio' && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'text-[#f8fafc] bg-[rgba(255,255,255,0.06)] shadow-inner border border-[rgba(255,255,255,0.1)]'
                    : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[rgba(255,255,255,0.03)] border border-transparent'
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? 'text-[#ff4300]' : 'text-[#64748b]'}`}>
                  {tab.idx}
                </span>
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-[#ff4300] shadow-[0_0_8px_rgba(255,67,0,0.8)] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions Block */}
        <div className="flex items-center space-x-3">
          {viewMode === 'studio' ? (
            <>
              {/* Return to 3D Observatory Button */}
              <button
                onClick={onReturnToHero}
                className="flex items-center space-x-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#0f141f]/80 text-[#94a3b8] hover:text-white hover:border-[#ff4300]/40 px-3 py-1.5 text-xs font-medium transition-colors shadow-sm"
              >
                <Globe className="h-3.5 w-3.5 text-[#ff4300]" />
                <span className="font-mono text-[11px]">3D Observatory</span>
              </button>

              {/* Corpus Selector */}
              <div className="hidden sm:flex items-center space-x-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f141f]/80 text-[#f8fafc] px-2.5 py-1.5 shadow-sm">
                <Database className="h-3.5 w-3.5 text-sky-400" />
                <select
                  value={selectedDataset}
                  onChange={(e) => onSelectDataset(e.target.value)}
                  className="bg-transparent font-mono text-[11px] text-[#f8fafc] focus:outline-none cursor-pointer"
                >
                  {datasets.map((d) => (
                    <option
                      key={d.id}
                      value={d.id}
                      className="bg-[#0f141f] text-[#f8fafc]"
                    >
                      {d.name} ({d.paper_count.toLocaleString()} papers)
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}
        </div>

      </div>
    </header>
  );
};
