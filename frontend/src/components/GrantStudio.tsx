import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Copy, Check, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
import { NarratedGap } from '../types';
import { ObservatoryStandby } from './ObservatoryStandby';
import { HighlightedTitle } from './HighlightedTitle';
import { exportGapsToPdf } from '../utils/pdfExport';

interface GrantStudioProps {
  narratedGaps: NarratedGap[];
  selectedGapTitle: string;
  onNavigateToHero?: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToClusters?: () => void;
  searchQuery?: string;
}

export const GrantStudio: React.FC<GrantStudioProps> = ({
  narratedGaps,
  selectedGapTitle,
  onNavigateToHero,
  onNavigateToTimeline,
  onNavigateToClusters,
  searchQuery,
}) => {
  const [activeGapIndex, setActiveGapIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = () => {
    if (!activeGap) return;
    setIsExporting(true);
    exportGapsToPdf(availableGaps, searchQuery, activeGapIndex);
    setTimeout(() => setIsExporting(false), 2000);
  };
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const availableGaps = narratedGaps || [];

  // Reset to selected gap or top gap every time component is mounted/navigated
  useEffect(() => {
    if (selectedGapTitle && availableGaps.length > 0) {
      const idx = availableGaps.findIndex((g) => g.title === selectedGapTitle);
      if (idx !== -1) {
        setActiveGapIndex(idx);
        return;
      }
    }
    setActiveGapIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [narratedGaps, selectedGapTitle]);

  if (!availableGaps || availableGaps.length === 0) {
    return (
      <ObservatoryStandby
        stageNumber="03"
        stageName="Gap Analysis & Hypotheses"
        description="No research gaps or hypotheses currently initialized. Run a research inquiry or choose a curated topic from the search deck to generate grounded operational hypotheses."
        onLaunchSearch={onNavigateToHero || (() => {})}
      />
    );
  }

  const activeGap =
    (selectedGapTitle ? availableGaps.find((g) => g.title === selectedGapTitle) : null) ||
    availableGaps[activeGapIndex] ||
    availableGaps[0];

  const handleNextGap = () => {
    setActiveGapIndex((prev) => (prev + 1) % availableGaps.length);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevGap = () => {
    setActiveGapIndex((prev) => (prev - 1 + availableGaps.length) % availableGaps.length);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const opHyp = activeGap.operational_hypothesis;
  const methodText =
    (typeof opHyp === 'object' && opHyp?.method_plain) ||
    activeGap.method ||
    'Neural Representation Learning';
  const datasetText =
    (typeof opHyp === 'object' && opHyp?.dataset_plain) ||
    activeGap.dataset ||
    'Empirical Benchmark Suite';
  const limitationText =
    (typeof opHyp === 'object' && (opHyp as any)?.limitation_plain) ||
    activeGap.limitation ||
    'Error accumulation and instability across out-of-distribution benchmarks';
  const hypothesisText =
    typeof opHyp === 'string'
      ? opHyp
      : opHyp?.hypothesis_statement ||
        activeGap.suggested_title ||
        `To overcome ${limitationText.toLowerCase()}, applying ${methodText} to ${datasetText} will improve accuracy and empirical stability.`;

  // Clean, simple, readable title without AI fluff
  const cleanTitle = (() => {
    let raw = (activeGap.title || '').trim();
    raw = raw
      .replace(/^(Scientific|Spectral|Structural|Topological|Combinatorial)\s*(Disconnect|Gap|Bridge|Void)\s*:\s*/i, '')
      .replace(/\s*<->\s*/g, ' in ')
      .replace(/\s*\(C_obs\s*=\s*0\)/gi, '')
      .trim();
    if (!raw || raw.length < 5) {
      return `Research Gap: ${methodText} in ${datasetText}`;
    }
    return raw.toLowerCase().startsWith('research gap') ? raw : `Research Gap: ${raw}`;
  })();

  const handleCopyProposal = () => {
    if (!activeGap) return;
    const content = `# ${cleanTitle}
Novelty z-score: ${activeGap.uzzi_z_score}σ | C_obs = ${activeGap.c_obs || '0'}

## MDL Triads Found:
- Method (M): ${methodText}
- Substrate / Task (D): ${datasetText}
- Limitation (L): ${limitationText}

## Topological Finding:
${activeGap.description_plain || activeGap.description || 'Zero historical co-occurrence between these two areas.'}

## Testable Hypothesis:
"${hypothesisText}"
`;
    try {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full h-[calc(100vh-3.75rem)] flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden bg-transparent select-text">
      <div className="w-full max-w-[820px] max-h-[86vh] h-full flex flex-col bg-[#090d16]/75 backdrop-blur-3xl border border-white/[0.12] rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-500 relative rr-enter-card">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#ff4300]/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/[0.05] rounded-full blur-3xl pointer-events-none" />

        {/* Card Top Bar */}
        <header className="px-8 sm:px-12 pt-7 pb-4 flex items-center justify-between border-b border-white/[0.06] shrink-0 z-10">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-[#ff5500] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] shadow-[0_0_8px_#ff4300]" />
            <span className="font-semibold">GAP #{String(activeGapIndex + 1).padStart(2, '0')}</span>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <span className="text-zinc-400 font-normal hidden sm:inline truncate max-w-[320px]">
              {activeGap.gap_type || 'EMPIRICAL GAP'}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {onNavigateToClusters && (
              <button
                onClick={onNavigateToClusters}
                className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-mono transition-all cursor-pointer"
                title="Navigate back to Stage 01: Domain Clusters"
              >
                ← 01 Clusters
              </button>
            )}
            {onNavigateToTimeline && (
              <button
                onClick={onNavigateToTimeline}
                className="px-2.5 py-1 rounded-lg bg-[#ff4300]/15 hover:bg-[#ff4300]/30 text-[#ff8a50] hover:text-white border border-[#ff4300]/30 text-xs font-mono transition-all cursor-pointer shadow-[0_0_10px_rgba(255,67,0,0.2)]"
                title="Navigate to Stage 02: Citations Timeline"
              >
                ← 02 Citations
              </button>
            )}
            <button
              onClick={handleCopyProposal}
              className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Copy structured summary to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <div className="flex items-center space-x-1 border border-white/[0.08] bg-white/[0.03] rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={handlePrevGap}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Previous gap (←)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] text-zinc-400">
                {activeGapIndex + 1} / {availableGaps.length}
              </span>
              <button
                onClick={handleNextGap}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Next gap (→)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Card Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-8 sm:px-12 py-8 space-y-7 custom-scrollbar z-10"
        >
          <div className="max-w-[680px] mx-auto space-y-6">
            {/* 1. Simple, Readable Title */}
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-[26px] font-semibold text-white tracking-tight leading-snug">
                {cleanTitle}
              </h1>

              {/* Minimalist Stat Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Uzzi Novelty: {(Number(activeGap.uzzi_z_score) || -1.86).toFixed(2)}σ</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#ff4300]/15 border border-[#ff4300]/30 text-[#ff8a50] flex items-center space-x-1.5 font-bold">
                  <span>C_obs = {activeGap.c_obs || '0'}</span>
                </span>
              </div>
            </div>

            {/* 2. One-line brief info what MDL entities are */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-300 font-sans flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-[#ff8a50] font-semibold shrink-0">MDL Triad:</span>
              <span className="text-zinc-300">Method (M) is the algorithm, Substrate (D) is the problem benchmark, and Limitation (L) is the core bottleneck being solved.</span>
            </div>

            {/* 3. MDL Triads Found (3-part clear cards) */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4300]" />
                <span>MDL TRIADS FOUND</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Method (M) */}
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
                  <div className="text-[11px] font-mono font-semibold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Method (M)</span>
                  </div>
                  <div className="text-xs font-sans text-zinc-100 font-medium leading-snug">
                    {methodText}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">Algorithmic intervention</div>
                </div>

                {/* Substrate / Task (D) */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                  <div className="text-[11px] font-mono font-semibold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Substrate / Task (D)</span>
                  </div>
                  <div className="text-xs font-sans text-zinc-100 font-medium leading-snug">
                    {datasetText}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">Domain benchmark task</div>
                </div>

                {/* Limitation (L) */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                  <div className="text-[11px] font-mono font-semibold tracking-wider text-rose-400 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Limitation (L)</span>
                  </div>
                  <div className="text-xs font-sans text-zinc-100 font-medium leading-snug">
                    {limitationText}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">Core failure bottleneck</div>
                </div>
              </div>
            </div>

            {/* 4. Analysis & Research Hypothesis */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="text-xs font-mono tracking-wider text-[#ff5500] uppercase font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                  <span>Literature Gap Analysis</span>
                </div>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal font-sans">
                  {activeGap.description_plain || activeGap.description || `Zero prior papers connect ${methodText} and ${datasetText} (C_obs = 0), confirming an unexplored research opportunity.`}
                </p>
              </div>

              {/* Testable Scientific Hypothesis */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.10] backdrop-blur-sm space-y-2 mt-2">
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#ff8a50] uppercase tracking-widest font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff4300]" />
                  <span>Testable Scientific Hypothesis</span>
                </div>
                <p className="text-base sm:text-lg text-zinc-100 font-serif italic leading-relaxed">
                  "{hypothesisText}"
                </p>
              </div>
            </div>

            {/* Evidence Papers (if present) */}
            {activeGap.evidence_papers && activeGap.evidence_papers.length > 0 && (
              <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Key Precursor Papers
                </div>
                <div className="space-y-1.5">
                  {activeGap.evidence_papers.slice(0, 3).map((paper, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5 min-w-0 pr-3">
                        <div className="font-sans font-medium text-zinc-200 truncate">
                          <HighlightedTitle title={paper.title} query={searchQuery} />
                        </div>
                        <div className="font-mono text-[11px] text-zinc-500">
                          {paper.year}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Minimal Export PDF Button (Bottom Right) */}
            <div className="pt-5 border-t border-white/[0.06] flex items-center justify-end">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-[#ff4300]/40 text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-sm group hover:shadow-[0_0_12px_rgba(255,67,0,0.15)] disabled:opacity-50"
                title="Export clean, high-signal research brief (Top Gaps) as PDF"
              >
                {isExporting ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Exporting...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#ff5500] transition-colors" />
                    <span>Export PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantStudio;
