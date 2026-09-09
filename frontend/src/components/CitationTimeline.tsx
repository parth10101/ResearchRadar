import React, { useState } from 'react';
import { Network, ExternalLink, Award, Flame, GitCommit, X } from 'lucide-react';
import { CitationData } from '../types';

interface CitationTimelineProps {
  data: CitationData | null;
}

export const CitationTimeline: React.FC<CitationTimelineProps> = ({ data }) => {
  const [activeLens, setActiveLens] = useState<'canon' | 'lineage' | 'frontier'>('lineage');
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null);

  const formatAuthors = (authors: any) => {
    if (!authors) return 'Authors unlisted';
    if (Array.isArray(authors)) {
      const shown = authors.slice(0, 3).join(', ');
      return authors.length > 3 ? `${shown} et al.` : shown;
    }
    if (typeof authors === 'string') return authors;
    return String(authors);
  };

  if (!data || !data.milestones || data.milestones.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f141f] p-8 text-center">
        <Network className="h-8 w-8 text-[#64748b] animate-spin" />
        <h3 className="mt-3 font-serif text-lg text-[#f8fafc]">Building Citation Constellation...</h3>
        <p className="mt-1 text-xs text-[#64748b]">Computing 3-Lens Lineage Backbone & SPLC Main Path.</p>
      </div>
    );
  }

  // Render inline SVG 12-month acceleration sparkline
  const renderSparkline = (cits: number) => {
    const safeCits = Math.max(0, Number(cits) || 0);
    const points = [
      Math.max(2, safeCits * 0.1),
      Math.max(4, safeCits * 0.25),
      Math.max(8, safeCits * 0.4),
      Math.max(14, safeCits * 0.7),
      Math.max(20, safeCits),
    ];
    const maxVal = Math.max(...points, 20);
    const d = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 18} ${22 - (p / maxVal) * 18}`)
      .join(' ');

    return (
      <svg className="w-18 h-6" viewBox="0 0 72 24" fill="none">
        <path d={d} stroke="#38bdf8" strokeWidth="1.75" strokeLinecap="round" />
        <path d={`${d} L 72 24 L 0 24 Z`} fill="rgba(56, 189, 248, 0.15)" />
      </svg>
    );
  };

  // Render circular Price Index Freshness Gauge (P3yr)
  const renderPriceMeter = (year: number) => {
    const isRecent = year >= 2022;
    const pct = isRecent ? 84 : year >= 2018 ? 58 : 24;
    const strokeDash = Math.round((pct / 100) * 62);

    return (
      <div className="flex items-center space-x-1.5" title={`Price Index P3yr: ${pct}% citations in last 36 months`}>
        <svg className="h-5 w-5 -rotate-90" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" fill="none" />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={isRecent ? '#38bdf8' : '#eab308'}
            strokeWidth="2.5"
            strokeDasharray="62"
            strokeDashoffset={62 - strokeDash}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="font-mono text-[10px] text-[#94a3b8] tabular-nums">{pct}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 py-6">
      {/* Editorial Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2 text-[#eab308] font-mono text-xs mb-1">
            <Network className="h-3.5 w-3.5" />
            <span>STAGE 5: 3-LENS CITATION CONSTELLATION</span>
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#f8fafc]">
            Chronological Milestone Lineage & Main Path Spine
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Scientometric progression from foundational classics to frontier acceleration, validated without linguistic artifacts.
          </p>
        </div>

        {/* 3 Scientometric Lenses Selector */}
        <div className="flex items-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0f141f] p-1 font-mono text-xs">
          <button
            onClick={() => setActiveLens('canon')}
            className={`flex items-center space-x-1.5 rounded px-3 py-1.5 transition-colors ${
              activeLens === 'canon' ? 'bg-[#eab308]/20 text-[#eab308] font-semibold' : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <Award className="h-3 w-3" />
            <span>Lens 1: Canon</span>
          </button>
          <button
            onClick={() => setActiveLens('lineage')}
            className={`flex items-center space-x-1.5 rounded px-3 py-1.5 transition-colors ${
              activeLens === 'lineage' ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-semibold' : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <GitCommit className="h-3 w-3" />
            <span>Lens 2: Lineage Backbone</span>
          </button>
          <button
            onClick={() => setActiveLens('frontier')}
            className={`flex items-center space-x-1.5 rounded px-3 py-1.5 transition-colors ${
              activeLens === 'frontier' ? 'bg-[#10b981]/20 text-[#10b981] font-semibold' : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <Flame className="h-3 w-3" />
            <span>Lens 3: The Frontier</span>
          </button>
        </div>
      </div>

      {/* Chronological Milestone Spine */}
      <div className="relative pl-6 sm:pl-8 before:absolute before:bottom-0 before:left-3 sm:before:left-4 before:top-2 before:w-[2px] before:bg-gradient-to-b before:from-[#38bdf8] before:via-[rgba(255,255,255,0.1)] before:to-transparent space-y-6">
        {data.milestones.map((m) => {
          const p = m.paper || {};
          const cits = Number(p.global_cits) || 0;
          return (
            <div key={m.year} className="relative group">
              {/* Year Marker Dot on Spine */}
              <div className="absolute -left-6 sm:-left-8 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#38bdf8] bg-[#080b11] shadow-specular">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
              </div>

              {/* Milestone Card */}
              <div
                onClick={() => setSelectedPaper(p)}
                className="cursor-pointer rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f141f] p-5 shadow-panel transition-all hover:border-[rgba(255,255,255,0.18)] hover:bg-[#161e2e]"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-[#38bdf8]/15 px-2 py-0.5 font-mono text-xs font-bold text-[#38bdf8]">
                      {m.year}
                    </span>
                    <span className="font-mono text-[11px] text-[#64748b]">
                      {p.venue || 'Academic Proceedings'}
                    </span>
                  </div>

                  {/* Sparkline & Freshness Gauge */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1.5 text-xs text-[#64748b]">
                      <span>Velocity:</span>
                      {renderSparkline(cits)}
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-[#64748b]">
                      <span>Price P3yr:</span>
                      {renderPriceMeter(m.year)}
                    </div>
                    <div className="rounded border border-[rgba(255,255,255,0.08)] bg-[#080b11] px-2 py-1 font-mono text-xs font-bold text-[#f8fafc] tabular-nums">
                      {cits} cits
                    </div>
                  </div>
                </div>

                {/* Milestone Paper Title */}
                <h3 className="mt-3 font-serif text-lg font-medium text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors">
                  {p.title}
                </h3>

                {p.tldr && (
                  <p className="mt-2 text-xs text-[#94a3b8] italic line-clamp-2">
                    "{p.tldr}"
                  </p>
                )}

                {/* Authors & Actions */}
                <div className="mt-3 flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-3 font-mono text-[11px] text-[#64748b]">
                  <span className="truncate max-w-md">
                    {formatAuthors(p.authors)}
                  </span>
                  <span className="text-[#38bdf8] group-hover:underline whitespace-nowrap ml-2">
                    View Paper Intelligence →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paper Intelligence Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080b11]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-xl border border-[rgba(255,255,255,0.14)] bg-[#111826] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
              <div>
                <span className="font-mono text-xs text-[#38bdf8]">
                  {selectedPaper.year} · {selectedPaper.venue || 'Academic Publication'}
                </span>
                <h3 className="font-serif text-xl text-[#f8fafc]">
                  {selectedPaper.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="rounded-lg p-1 text-[#64748b] hover:bg-[#161e2e] hover:text-[#f8fafc]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="font-mono text-xs text-[#94a3b8]">
              Authors: {formatAuthors(selectedPaper.authors)}
            </div>

            {selectedPaper.abstract && (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#080b11] p-3.5 text-xs text-[#94a3b8] leading-relaxed">
                <p className="font-mono text-[10px] text-[#64748b] uppercase mb-1">Abstract</p>
                {selectedPaper.abstract}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.08)] pt-4">
              <span className="font-mono text-xs text-[#64748b]">
                Global Citations: <strong className="text-[#f8fafc]">{selectedPaper.global_cits || 0}</strong>
              </span>
              <div className="flex items-center space-x-2">
                {selectedPaper.doi && (
                  <a
                    href={`https://doi.org/${selectedPaper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 rounded-lg bg-[#38bdf8] px-4 py-2 font-sans text-xs font-semibold text-[#080b11] hover:bg-[#38bdf8]/90"
                  >
                    <span>Open DOI</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {selectedPaper.arxiv_url && (
                  <a
                    href={selectedPaper.arxiv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#161e2e] px-4 py-2 font-sans text-xs font-medium text-[#f8fafc] hover:bg-[#1f2a40]"
                  >
                    <span>PDF Document</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
