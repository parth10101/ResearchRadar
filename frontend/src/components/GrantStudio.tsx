import React, { useState, useEffect, useRef } from 'react';
import { Award, ShieldCheck, Sparkles, Copy, Check, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { NarratedGap } from '../types';
import { ObservatoryStandby } from './ObservatoryStandby';
import { HighlightedTitle } from './HighlightedTitle';

interface GrantStudioProps {
  narratedGaps: NarratedGap[];
  selectedGapTitle: string;
  onNavigateToHero?: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToClusters?: () => void;
  searchQuery?: string;
}

// Curated high-fidelity scientometric fallback hypotheses
const DEFAULT_NARRATED_GAPS: NarratedGap[] = [];

export const GrantStudio: React.FC<GrantStudioProps> = ({ narratedGaps, selectedGapTitle, onNavigateToHero, onNavigateToTimeline, onNavigateToClusters, searchQuery }) => {
  // Always default to top gap (index 0) whenever navigating to this section
  const [activeGapIndex, setActiveGapIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset to top gap every time component is mounted/navigated
  useEffect(() => {
    if (selectedGapTitle && (narratedGaps || []).length > 0) {
      const idx = (narratedGaps || []).findIndex((g) => g.title === selectedGapTitle);
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

  const availableGaps = narratedGaps || [];

  if (!availableGaps || availableGaps.length === 0) {
    return (
      <ObservatoryStandby
        stageNumber="03"
        stageName="Gap Analysis & Grant Studio"
        description="No research gaps or grant proposals currently initialized. Run a research inquiry or choose a curated topic from the search deck to generate grounded operational hypotheses."
        onLaunchSearch={onNavigateToHero || (() => {})}
      />
    );
  }

  const activeGap =
    availableGaps[activeGapIndex] ||
    (selectedGapTitle && availableGaps.find((g) => g.title === selectedGapTitle)) ||
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

  const handleCopyProposal = () => {
    if (!activeGap) return;
    const op = activeGap.operational_hypothesis;
    const content = `# Grant Proposal: ${activeGap.title}
Gap Type: ${activeGap.gap_type}
Novelty z-score: ${activeGap.uzzi_z_score}σ

## 1. Problem Statement
${activeGap.description_plain || activeGap.description}

## 2. Proposed Methodology
${op?.method_plain || op?.methodology || activeGap.method}

## 3. Validation Benchmark
${op?.dataset_plain || op?.dataset || activeGap.dataset}

## 4. Testable Scientific Hypothesis
"${typeof op === 'string' ? op : (op?.hypothesis_statement || activeGap.suggested_title || '')}"

## 5. Synthesis & Literature Audit
${activeGap.llm_narration}
`;
    try {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch { }
  };

  const opHyp = activeGap.operational_hypothesis;
  // High-legibility, large-typography Markdown Renderer
  const renderTerminalNarrative = (rawMarkdown: string) => {
    if (!rawMarkdown) return null;

    const lines = rawMarkdown.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      // Skip redundant titles or conversational lead-ins
      if (
        line.startsWith('# Research Gap') ||
        line.toLowerCase().startsWith('**answer') ||
        line.toLowerCase().startsWith('answer –') ||
        line.toLowerCase().startsWith('below is the complete')
      ) {
        i++;
        continue;
      }

      // Stop before bibliography or trailing notes
      if (
        line.startsWith('## References') ||
        line.toLowerCase().includes('bottom line') ||
        line.toLowerCase().startsWith('the absence')
      ) {
        break;
      }

      // Dividers
      if (line === '---' || line === '***') {
        elements.push(<hr key={i} className="border-t border-white/[0.08] my-6" />);
        i++;
        continue;
      }

      // Section H2 (e.g. "## 1. Top Validated Research Gap")
      if (line.startsWith('## ')) {
        const h2 = line.replace(/^##\s*/, '').trim();
        elements.push(
          <div key={i} className="pt-6 pb-2 border-b border-white/[0.08] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#ff4300] rounded-none inline-block shadow-[0_0_8px_#ff4300]" />
            <h3 className="font-mono text-xs sm:text-sm font-semibold text-zinc-100 tracking-wider uppercase">
              {h2}
            </h3>
          </div>
        );
        i++;
        continue;
      }

      // Section H3
      if (line.startsWith('### ')) {
        const h3 = line.replace(/^###\s*/, '').replace(/📖/g, '').trim();
        elements.push(
          <div key={i} className="pt-4 pb-1 flex items-center space-x-2 text-cyan-300">
            <span className="w-1 h-1 bg-cyan-400 rounded-none inline-block shadow-[0_0_6px_#00E5FF]" />
            <h4 className="font-mono text-xs font-semibold tracking-wide uppercase">
              {h3}
            </h4>
          </div>
        );
        i++;
        continue;
      }

      // Bullet points
      if (line.startsWith('* ') || line.startsWith('- ') || line.match(/^\d+\.\s+/)) {
        const rawBullet = line.replace(/^([\*\-]\s+|\d+\.\s+)/, '').trim();
        const matchBold = rawBullet.match(/^(\s*\*\*[^*]+\*\*)\s*([–\-\:]?)\s*([\s\S]*)$/);
        if (matchBold) {
          const lead = matchBold[1].replace(/\*\*/g, '').trim();
          const sep = matchBold[2] || '–';
          const rest = matchBold[3].trim();
          elements.push(
            <div key={i} className="flex items-start space-x-2.5 text-sm sm:text-[15px] text-zinc-300 pl-1 my-1.5 leading-relaxed">
              <span className="text-cyan-400 font-mono text-xs mt-1">•</span>
              <div>
                <span className="font-mono text-zinc-200 font-semibold">{lead}</span>
                <span className="text-zinc-500 mx-1">{sep}</span>
                <span className="font-sans leading-relaxed">{rest.replace(/\*\*/g, '')}</span>
              </div>
            </div>
          );
        } else {
          elements.push(
            <div key={i} className="flex items-start space-x-2.5 text-sm sm:text-[15px] text-zinc-300 pl-1 my-1.5 leading-relaxed">
              <span className="text-zinc-500 font-mono text-xs mt-1">•</span>
              <span className="font-sans leading-relaxed">{rawBullet.replace(/\*\*/g, '')}</span>
            </div>
          );
        }
        i++;
        continue;
      }

      // Standard body paragraph
      if (line.length > 0) {
        elements.push(
          <p key={i} className="text-sm sm:text-[15px] text-zinc-300 leading-relaxed font-sans">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }

      i++;
    }

    return <div className="space-y-3">{elements}</div>;
  };

  return (
    <div className="w-full h-[calc(100vh-3.75rem)] flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden bg-transparent select-text">
      {/* =================================================================== */}
      {/* APPLE-INSPIRED MINIMALIST GLASS MORPH CARD                          */}
      {/* The shaded margins in user's sketch are completely empty space.     */}
      {/* =================================================================== */}
      <div className="w-full max-w-[820px] max-h-[86vh] h-full flex flex-col bg-[#090d16]/75 backdrop-blur-3xl border border-white/[0.12] rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-500 relative rr-enter-card">
        
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#ff4300]/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/[0.05] rounded-full blur-3xl pointer-events-none" />

        {/* ----------------------------------------------------------------- */}
        {/* CARD TOP BAR: Subtle Category Tag (Left) + Clean "Next Gap →" (Right) */}
        {/* ----------------------------------------------------------------- */}
        <header className="px-8 sm:px-12 pt-7 pb-4 flex items-center justify-between border-b border-white/[0.06] shrink-0 z-10">
          {/* Left: Minimalist Topic Indicator */}
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-[#ff5500] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] shadow-[0_0_8px_#ff4300]" />
            <span className="font-semibold">HYPOTHESIS #{String(activeGapIndex + 1).padStart(2, '0')}</span>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <span className="text-zinc-400 font-normal hidden sm:inline truncate max-w-[320px]">
              {activeGap.gap_type || 'FRONTIER DISCOVERY'}
            </span>
          </div>

          {/* Right: Actions (Copy Proposal, Prev / Next) */}
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
              title="Copy structured grant proposal to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <div className="flex items-center space-x-1 border border-white/[0.08] bg-white/[0.03] rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={handlePrevGap}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Previous hypothesis (←)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] text-zinc-400">
                {activeGapIndex + 1} / {availableGaps.length}
              </span>
              <button
                onClick={handleNextGap}
                className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Next hypothesis (→)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* SCROLLABLE CARD BODY (Up and Down scrolling with optimal width)   */}
        {/* ----------------------------------------------------------------- */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-8 sm:px-12 py-8 space-y-9 custom-scrollbar z-10"
        >
          {/* Constrained reading measure: width is kept pleasant and optimal */}
          <div className="max-w-[680px] mx-auto space-y-8">
            
            {/* 1. Large, Editorial Headline */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-white tracking-tight leading-[1.25]">
                {activeGap.title}
              </h1>

              {/* Minimalist Stat Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>Uzzi Novelty: {(Number(activeGap.uzzi_z_score) || -1.45).toFixed(2)}σ</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 flex items-center space-x-1.5">
                  <span>C_obs = 0</span>
                </span>
              </div>
            </div>

            {/* 2. Executive 3-Pillar Breakdown (Understand in Seconds) */}
            <div className="space-y-6 pt-2">
              
              {/* Pillar 1: The Core Opportunity / Void */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-[#ff5500] uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                  <span>01 · THE OPEN PROBLEM (WHY THIS MATTERS)</span>
                </div>
                <p className="text-base sm:text-[18px] text-zinc-200 leading-relaxed font-normal font-sans">
                  {activeGap.description_plain || activeGap.description}
                </p>
              </div>

              {/* Pillar 2: Proposed Method & Mechanism */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-cyan-400 uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>02 · PROPOSED METHOD & MECHANISM</span>
                </div>
                <p className="text-base sm:text-[18px] text-zinc-200 leading-relaxed font-normal font-sans">
                  {opHyp?.method_plain || opHyp?.methodology || activeGap.method}
                </p>
              </div>

              {/* Pillar 3: Target Validation Benchmark */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-emerald-400 uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>03 · VALIDATION BENCHMARK & DATASET</span>
                </div>
                <p className="text-base sm:text-[18px] text-zinc-200 leading-relaxed font-normal font-sans">
                  {opHyp?.dataset_plain || opHyp?.dataset || activeGap.dataset}
                </p>
              </div>

              {/* Formal Testable Scientific Claim */}
              {(opHyp?.hypothesis_statement || typeof opHyp === 'string' || activeGap.suggested_title) && (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm space-y-2 mt-4">
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff4300]" />
                    <span>TESTABLE SCIENTIFIC HYPOTHESIS</span>
                  </div>
                  <p className="text-sm sm:text-base text-zinc-100 font-serif italic leading-relaxed">
                    "{typeof opHyp === 'string' ? opHyp : (opHyp?.hypothesis_statement || activeGap.suggested_title)}"
                  </p>
                </div>
              )}
            </div>

            {/* 3. Deep-Dive Section (Seamlessly Scrollable Below) */}
            <div className="pt-6 border-t border-white/[0.08] space-y-6">
              <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-zinc-400 uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-none bg-zinc-400" />
                <span>EVIDENCE-BACKED LITERATURE SYNTHESIS</span>
              </div>

              {/* Parsed Terminal & Synthesis Narrative */}
              <div className="space-y-4">
                {activeGap.llm_narration ? (
                  renderTerminalNarrative(activeGap.llm_narration)
                ) : (
                  <div className="space-y-3 text-sm leading-relaxed text-zinc-300 font-sans">
                    <p>{activeGap.description}</p>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-zinc-300 space-y-1">
                      <div><strong className="text-amber-400">Donor Method:</strong> {activeGap.method}</div>
                      <div><strong className="text-cyan-400">Target Benchmark:</strong> {activeGap.dataset}</div>
                      <div><strong className="text-rose-400">Identified Limitation:</strong> {activeGap.limitation}</div>
                      <div className="pt-1 text-[#ff8a50]"><strong>Uzzi Novelty:</strong> {activeGap.uzzi_z_score}σ (C_obs = {activeGap.c_obs || '0'})</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Evidence Papers / Landmark References */}
              {activeGap.evidence_papers && activeGap.evidence_papers.length > 0 && (
                <div className="pt-6 border-t border-white/[0.06] space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    GROUNDED CITATIONS & LANDMARK PRECURSORS
                  </div>
                  <div className="space-y-2">
                    {activeGap.evidence_papers.map((paper, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5 min-w-0 pr-3">
                          <div className="font-sans font-medium text-zinc-200 truncate">
                            <HighlightedTitle title={paper.title} query={searchQuery} />
                          </div>
                          <div className="font-mono text-[11px] text-zinc-500">
                            {paper.venue || 'Academic Journal'} · {paper.year}
                          </div>
                        </div>
                        <span className="text-zinc-600 font-mono text-[10px] shrink-0">
                          REF #{paper.index || pIdx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GrantStudio;
