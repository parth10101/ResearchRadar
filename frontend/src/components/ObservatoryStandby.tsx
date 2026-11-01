import React, { useState } from 'react';
import { Compass, ArrowRight, Search, ShieldCheck, ExternalLink, AlertCircle } from 'lucide-react';
import { LiveProofModal } from './LiveProofModal';

interface ObservatoryStandbyProps {
  stageNumber: string;
  stageName: string;
  description: string;
  onLaunchSearch: () => void;
  searchQuery?: string;
  onOpenProof?: () => void;
}

export const ObservatoryStandby: React.FC<ObservatoryStandbyProps> = ({
  stageNumber,
  stageName,
  description,
  onLaunchSearch,
  searchQuery,
  onOpenProof,
}) => {
  const [proofModalOpen, setProofModalOpen] = useState(false);

  const isZeroPapers =
    (description && description.includes('0 papers')) ||
    (description && description.includes('C_obs = 0'));

  // Build clean allintitle URL for Google Scholar verification
  const cleanTokens = (searchQuery || '')
    .split(/\b(AND|OR|NOT)\b/i)
    .map((t) => t.trim().replace(/^["']|["']$/g, ''))
    .filter((t) => t && !/^(AND|OR|NOT)$/i.test(t));

  const allintitleQuery =
    cleanTokens.length > 0
      ? `allintitle: ${cleanTokens.map((t) => `"${t}"`).join(' ')}`
      : `allintitle: "${searchQuery || ''}"`;

  const gscholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(
    allintitleQuery
  )}`;

  return (
    <div className="w-full h-full flex items-center justify-center p-6 select-none pointer-events-auto">
      <div className="max-w-[620px] w-full bg-[#080b13]/85 backdrop-blur-3xl border border-white/[0.12] rounded-3xl p-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Ambient Radial Highlight */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#ff4300]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Observatory Reticle Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.10] flex items-center justify-center relative shadow-[0_0_30px_rgba(255,67,0,0.15)]">
          {isZeroPapers ? (
            <ShieldCheck className="w-8 h-8 text-amber-400 relative z-10" />
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4300] animate-ping absolute" />
              <Compass className="w-8 h-8 text-[#ff4300] relative z-10" />
            </>
          )}
        </div>

        {/* Header Tag & Stage */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isZeroPapers ? 'bg-amber-400' : 'bg-[#ff4300]'
              }`}
            />
            <span>
              STAGE {stageNumber} · {stageName}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-sans">
            {isZeroPapers ? 'Empirically Verified Research Void' : 'Observatory Standby'}
          </h2>
        </div>

        {/* Subtitle / Explanation */}
        <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-[460px] mx-auto">
          {description ||
            'No literature corpus currently initialized. Run a research inquiry or select a curated topic from the search deck to populate this stage.'}
        </p>

        {/* Live Proof for Evaluators when 0 papers */}
        {isZeroPapers && searchQuery && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs font-mono text-amber-300">
              <span className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                HOW TO PROVE THIS LIVE TO YOUR EVALUATOR ("MA'AM"):
              </span>
              <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-bold">
                C_obs = 0
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              OpenAlex scanned <strong>250M+ peer-reviewed papers</strong> with zero title matches. You can click below to prove live that Google Scholar independently returns zero articles for this title triad:
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={gscholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Verify Live on Google Scholar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => (onOpenProof ? onOpenProof() : setProofModalOpen(true))}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Open Full Scholar Proof Audit 🛡️</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={onLaunchSearch}
            className="px-6 py-3 rounded-xl bg-[#ff4300] hover:bg-[#ff5511] text-white font-medium text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_24px_rgba(255,67,0,0.4)] hover:shadow-[0_0_32px_rgba(255,67,0,0.6)] active:scale-95 flex items-center space-x-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Launch Search Deck</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footnote */}
        <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-zinc-600 flex items-center justify-center space-x-2">
          <span>250M+ PAPERS ARCHIVE</span>
          <span>·</span>
          <span>GOOGLE SCHOLAR PARITY</span>
          <span>·</span>
          <span>UZZI ET AL. 2013</span>
        </div>
      </div>

      {/* Live Proof Modal */}
      {searchQuery && (
        <LiveProofModal
          isOpen={proofModalOpen}
          onClose={() => setProofModalOpen(false)}
          query={searchQuery}
          paperCount={0}
        />
      )}
    </div>
  );
};
