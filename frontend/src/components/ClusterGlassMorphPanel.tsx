import React, { useState, useMemo } from 'react';
import { RealClusterItem, RealClusterPoint } from '../data/realClusterData';

interface ClusterGlassMorphPanelProps {
  cluster: RealClusterItem;
  totalCorpusCount?: number;
  onBackToOverview: () => void;
  onSelectPaper?: (paperId: string) => void;
}

export const ClusterGlassMorphPanel: React.FC<ClusterGlassMorphPanelProps> = ({
  cluster,
  totalCorpusCount = 300,
  onBackToOverview,
  onSelectPaper,
}) => {
  const [isAllPapersOpen, setIsAllPapersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Foundational Landmark Paper (Highest-Cited Central Anchor Nucleus)
  const landmarkPaper: RealClusterPoint | null = useMemo(() => {
    if (!cluster.points || cluster.points.length === 0) return null;
    return [...cluster.points].sort((a, b) => (b.citations || 0) - (a.citations || 0))[0];
  }, [cluster.points]);

  // 2. Dynamic Topic Insights (100% Data-Driven & Universal)
  const insights = useMemo(() => {
    const pts = cluster.points || [];
    const n = pts.length;
    if (n === 0) {
      return {
        timelineStr: 'N/A',
        citationStr: 'N/A',
        growthStr: 'N/A',
        isIncrease: true,
        isDecrease: false,
      };
    }

    // Insight A: Research Timeline (Find most active 4-year range)
    const validYears = pts.map((p) => p.year).filter((y): y is number => typeof y === 'number' && y > 2000 && y <= 2026);
    let timelineStr = 'N/A';
    if (validYears.length > 0) {
      const minYear = Math.min(...validYears);
      const maxYear = Math.max(...validYears);

      // Evaluate 4-year sliding windows to find peak activity epoch
      let bestWindowStart = minYear;
      let maxCountInWindow = 0;
      for (let y = minYear; y <= Math.max(minYear, maxYear - 3); y++) {
        const count = validYears.filter((vy) => vy >= y && vy <= y + 3).length;
        if (count > maxCountInWindow) {
          maxCountInWindow = count;
          bestWindowStart = y;
        }
      }
      const windowEnd = Math.min(maxYear, bestWindowStart + 3);
      const windowPct = Math.round((maxCountInWindow / validYears.length) * 100);
      timelineStr = `${windowPct}% published between ${bestWindowStart} – ${windowEnd}`;
    }

    // Insight B: Citation Impact (Community average citations per paper)
    const totalCitations = pts.reduce((sum, p) => sum + (p.citations || 0), 0);
    const avgCitations = Math.round(totalCitations / n);
    const citationStr = `Average ${avgCitations} citations per paper`;

    // Insight C: Growth Trajectory (Dynamic: increase, decrease, or stable)
    const recentCutoff = 2022;
    const recentCount = pts.filter((p) => p.year && p.year >= recentCutoff).length;
    const priorCount = pts.filter((p) => p.year && p.year < recentCutoff && p.year >= recentCutoff - 4).length;

    let growthStr = '';
    let isIncrease = false;
    let isDecrease = false;

    if (priorCount === 0 && recentCount > 0) {
      growthStr = `+100% emerging field (all publications since ${recentCutoff})`;
      isIncrease = true;
    } else if (recentCount > priorCount) {
      const pctIncrease = Math.round(((recentCount - priorCount) / Math.max(1, priorCount)) * 100);
      growthStr = `+${pctIncrease}% increase in publications since ${recentCutoff}`;
      isIncrease = true;
    } else if (recentCount < priorCount) {
      const pctDecrease = Math.round(((priorCount - recentCount) / Math.max(1, priorCount)) * 100);
      growthStr = `-${pctDecrease}% decrease in publications since ${recentCutoff}`;
      isDecrease = true;
    } else {
      growthStr = `Stable publication rate since ${recentCutoff}`;
    }

    return { timelineStr, citationStr, growthStr, isIncrease, isDecrease };
  }, [cluster.points]);

  // Filtered and sorted papers for the dropdown
  const sortedPapers = useMemo(() => {
    let list = [...(cluster.points || [])].sort((a, b) => (b.citations || 0) - (a.citations || 0));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.authors?.some((a) => a.toLowerCase().includes(q)) ||
          p.venue?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [cluster.points, searchQuery]);

  const papersSectionRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (isAllPapersOpen && papersSectionRef.current) {
      setTimeout(() => {
        papersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [isAllPapersOpen]);

  const corpusPct = ((cluster.pointCount / totalCorpusCount) * 100).toFixed(1);

  return (
    <div className="w-[48%] max-w-[620px] h-full p-3 lg:p-4 flex flex-col shrink-0 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto">
      {/* Cinematic Glass Morph Container */}
      <div
        className="h-full backdrop-blur-2xl bg-zinc-950/80 border border-white/10 rounded-2xl p-4 lg:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden relative"
        style={{
          boxShadow: `0 20px 60px -15px rgba(0,0,0,0.9), 0 0 35px -5px ${cluster.color}25`,
        }}
      >
        {/* Subtle decorative background radial glow */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-15"
          style={{ backgroundColor: cluster.color }}
        />

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 font-mono z-10 custom-scrollbar">
          {/* Header & Back Button */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
            <button
              onClick={onBackToOverview}
              className="px-3 py-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 hover:border-zinc-500 transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer active:scale-95"
            >
              <span>←</span>
              <span>BACK TO OVERVIEW</span>
            </button>

            <div className="flex items-center space-x-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-none shrink-0"
                style={{ backgroundColor: cluster.color, boxShadow: `0 0 10px ${cluster.color}88` }}
              />
              <span className="text-zinc-200 font-semibold tracking-wider">
                {cluster.clusterId === -1 ? 'NOISE' : `TOPIC T${cluster.clusterId}`}
              </span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{cluster.pointCount}p ({corpusPct}%)</span>
            </div>
          </div>

          {/* Topic Title */}
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest">
              FOCUSED EPISTEMIC BASIN // LEVEL 1 INSPECT
            </div>
            <h1 className="text-lg font-bold font-sans tracking-tight text-white mt-1">
              {cluster.name}
            </h1>
          </div>

          {/* Foundational Landmark Paper (The Central Nucleus in Showpiece) */}
          {landmarkPaper && (
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.08] space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5 font-bold tracking-wider text-amber-400">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-none inline-block animate-pulse" />
                  <span>FOUNDATIONAL LANDMARK</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] font-semibold">
                  {landmarkPaper.citations || 0} citations
                </span>
              </div>

              <div className="text-xs font-sans font-medium text-zinc-100 leading-snug">
                {landmarkPaper.title}
              </div>

              <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {landmarkPaper.authors && landmarkPaper.authors.length > 0 && (
                  <span className="text-zinc-300 font-medium">
                    {landmarkPaper.authors.slice(0, 2).join(', ')}
                    {landmarkPaper.authors.length > 2 && ' et al.'}
                  </span>
                )}
                {landmarkPaper.year && <span>· {landmarkPaper.year}</span>}
                {landmarkPaper.venue && (
                  <span className="text-zinc-500 truncate max-w-[200px]">· {landmarkPaper.venue}</span>
                )}
              </div>

              {landmarkPaper.tldr && (
                <div className="text-[11px] font-sans text-zinc-400 bg-black/40 p-2 rounded border border-white/[0.04] leading-relaxed italic">
                  "{landmarkPaper.tldr}"
                </div>
              )}

              {landmarkPaper.doi && (
                <div className="pt-0.5">
                  <a
                    href={
                      landmarkPaper.doi.startsWith('http')
                        ? landmarkPaper.doi
                        : `https://doi.org/${landmarkPaper.doi}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center space-x-1"
                  >
                    <span>View Primary Source Paper (DOI)</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Topic Insights (3 Dynamic, Universal Metrics) */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.08] space-y-2">
            <div className="text-[11px] font-bold tracking-wider text-zinc-300 flex items-center space-x-1.5">
              <span>📊</span>
              <span>TOPIC INSIGHTS</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-start space-x-2">
                <span className="text-zinc-500 font-bold">•</span>
                <div>
                  <span className="text-zinc-400 font-medium">Research Timeline: </span>
                  <span className="text-zinc-200 font-semibold">{insights.timelineStr}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-zinc-500 font-bold">•</span>
                <div>
                  <span className="text-zinc-400 font-medium">Citation Impact: </span>
                  <span className="text-zinc-200 font-semibold">{insights.citationStr}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="text-zinc-500 font-bold">•</span>
                <div>
                  <span className="text-zinc-400 font-medium">Growth Trajectory: </span>
                  <span
                    className={
                      insights.isIncrease
                        ? 'text-emerald-400 font-semibold'
                        : insights.isDecrease
                        ? 'text-amber-400 font-semibold'
                        : 'text-zinc-300 font-semibold'
                    }
                  >
                    {insights.growthStr}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible "Browse All Papers" Dropdown */}
          <div ref={papersSectionRef} className="rounded-xl border border-white/[0.08] bg-zinc-900/40 overflow-hidden transition-all">
            <button
              onClick={() => setIsAllPapersOpen(!isAllPapersOpen)}
              className="w-full py-2.5 px-3.5 flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-850 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <span>📂</span>
                <span>ALL {cluster.pointCount} PAPERS IN THIS TOPIC</span>
              </div>
              <div className="flex items-center space-x-1.5 text-zinc-400 text-[11px]">
                <span>{isAllPapersOpen ? 'Collapse' : 'Click to Expand'}</span>
                <span className={`transform transition-transform duration-200 ${isAllPapersOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {isAllPapersOpen && (
              <div className="p-3 border-t border-white/[0.06] space-y-2.5 bg-zinc-950/60 max-h-56 overflow-y-auto custom-scrollbar">
                {/* Search / Filter Input */}
                {cluster.pointCount > 5 && (
                  <input
                    type="text"
                    placeholder="Search by title, author, venue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-1 px-2.5 rounded bg-zinc-900/90 border border-zinc-700/80 text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
                  />
                )}

                {/* Paper Row Items */}
                <div className="space-y-1.5">
                  {sortedPapers.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      onClick={() => onSelectPaper && p.id && onSelectPaper(p.id)}
                      className="p-2 rounded bg-zinc-900/50 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-start justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="text-[11px] font-sans font-medium text-zinc-200 group-hover:text-white line-clamp-1 leading-tight">
                          {p.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center space-x-2 truncate">
                          {p.authors && p.authors.length > 0 && (
                            <span className="truncate max-w-[140px]">{p.authors[0]} et al.</span>
                          )}
                          <span>· {p.year || 2023}</span>
                          {p.venue && <span className="truncate max-w-[120px]">· {p.venue}</span>}
                        </div>
                      </div>

                      <div className="shrink-0 text-right flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/50">
                          {p.citations || 0} cites
                        </span>
                        {p.doi && (
                          <a
                            href={p.doi.startsWith('http') ? p.doi : `https://doi.org/${p.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-zinc-500 hover:text-cyan-400 text-[11px] p-0.5"
                            title="Open DOI"
                          >
                            ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {sortedPapers.length === 0 && (
                    <div className="text-center py-4 text-xs text-zinc-500">
                      No papers matched "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
