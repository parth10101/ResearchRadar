import React from 'react';
import { Compass, Network, FileText, Globe } from 'lucide-react';

interface HeaderProps {
  viewMode?: 'hero' | 'studio';
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onReturnToHero: () => void;
  onLaunchStudio?: () => void;
  onOpenBenchmark?: () => void;
  skipDomainClusters?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onReturnToHero,
  onOpenBenchmark,
  skipDomainClusters = false,
}) => {
  const navTabs = skipDomainClusters
    ? [
        { id: 'timeline', idx: '01', label: 'Citations' },
        { id: 'grant', idx: '02', label: 'Gap Analysis' },
      ]
    : [
        { id: 'archipelago', idx: '01', label: 'Domain Clusters' },
        { id: 'timeline', idx: '02', label: 'Citations' },
        { id: 'grant', idx: '03', label: 'Gap Analysis' },
      ];

  const isHome = activeTab === 'hero';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-[60px] bg-transparent pointer-events-none">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8 relative">
        
        {/* Brand & Symbol (Left) */}
        <div
          className="flex items-center space-x-3 cursor-pointer group select-none pointer-events-auto"
          onClick={onReturnToHero}
          title="Return to Home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#ff4300]/10 shadow-[0_0_12px_rgba(255,67,0,0.18)] group-hover:bg-[#ff4300]/20 transition-all">
            <span className="font-serif text-base font-semibold text-[#ff4300]">Ψ</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold tracking-[0.18em] uppercase text-[#f8fafc] group-hover:text-white transition-colors">
              RESEARCHRADAR
            </span>
          </div>
        </div>

        {/* Center Floating Navigation Tabs (Visible only when not on home page) */}
        {!isHome && (
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-7 lg:gap-9 pointer-events-auto">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`group relative flex items-center space-x-2 py-1.5 text-xs tracking-wider transition-all duration-200 cursor-pointer select-none bg-transparent whitespace-nowrap ${
                    isActive
                      ? 'text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] transition-colors shrink-0 ${
                      isActive ? 'text-[#ff4300] font-bold' : 'text-zinc-600 group-hover:text-zinc-400'
                    }`}
                  >
                    {tab.idx}
                  </span>
                  <span className="font-sans text-[12px] whitespace-nowrap">{tab.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#ff4300] shadow-[0_0_8px_rgba(255,67,0,0.8)] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right SOTA Benchmark Verification Trigger */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          {onOpenBenchmark && (
            <button
              onClick={onOpenBenchmark}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all font-mono text-[11px] font-semibold cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              title="Open SOTA Benchmark & Empirical Verification Suite"
            >
              <span>🎓 SOTA Benchmark</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;

