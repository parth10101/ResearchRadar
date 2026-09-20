import React from 'react';
import { Compass, Sparkles, ArrowRight, Database, Search } from 'lucide-react';

interface ObservatoryStandbyProps {
  stageNumber: string;
  stageName: string;
  description: string;
  onLaunchSearch: () => void;
}

export const ObservatoryStandby: React.FC<ObservatoryStandbyProps> = ({
  stageNumber,
  stageName,
  description,
  onLaunchSearch,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 select-none pointer-events-auto">
      <div className="max-w-[580px] w-full bg-[#080b13]/85 backdrop-blur-3xl border border-white/[0.12] rounded-3xl p-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Ambient Radial Highlight */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#ff4300]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Observatory Reticle Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.10] flex items-center justify-center relative shadow-[0_0_30px_rgba(255,67,0,0.15)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff4300] animate-ping absolute" />
          <Compass className="w-8 h-8 text-[#ff4300] relative z-10" />
        </div>

        {/* Header Tag & Stage */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4300]" />
            <span>STAGE {stageNumber} · {stageName}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-sans">
            Observatory Standby
          </h2>
        </div>

        {/* Subtitle / Explanation */}
        <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-[440px] mx-auto">
          {description || 'No literature corpus currently initialized. Run a research inquiry or select a curated topic from the search deck to populate this stage.'}
        </p>

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
          <span>200M+ PAPERS ARCHIVE</span>
          <span>·</span>
          <span>8-STAGE SCIENTOMETRIC REASONING</span>
        </div>

      </div>
    </div>
  );
};
