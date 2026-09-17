import React, { useState, useEffect, useMemo } from 'react';
import { Layers, RotateCcw, Play, Pause, Sparkles, Box, ExternalLink, ArrowRight, X, Compass, Eye, ShieldCheck } from 'lucide-react';
import { Points3DData } from '../types';

interface ArchipelagoCanvasProps {
  data3d: Points3DData | null;
  datasetName: string;
  onNavigateToGrant?: (gapTitle: string) => void;
  selectedDataset?: string;
}

interface HoveredPaperInfo {
  id?: string;
  title: string;
  clusterId?: number;
  clusterName?: string;
  color?: string;
  year?: number;
  citations?: number;
  authors?: string[];
  venue?: string;
  tldr?: string;
  abstract?: string;
  doi?: string;
}

export const ArchipelagoCanvas: React.FC<ArchipelagoCanvasProps> = ({
  data3d,
  datasetName,
  onNavigateToGrant,
  selectedDataset,
}) => {
  const [activeClusterFilter, setActiveClusterFilter] = useState<number | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [hoveredPaper, setHoveredPaper] = useState<HoveredPaperInfo | null>(null);
  const [pinnedPaper, setPinnedPaper] = useState<HoveredPaperInfo | null>(null);

  // Extract cluster list
  const clusters = useMemo(() => {
    return (data3d?.clusters || []).filter((c) => c.cluster_id >= 0);
  }, [data3d]);

  // Listen for 3D point hover and click events from AstraParticleWorld WebGL engine
  useEffect(() => {
    const handlePaperHover = (e: any) => {
      const p = e.detail?.paper;
      if (p) {
        setHoveredPaper({
          id: p.id,
          title: p.title,
          clusterId: p.clusterId ?? p.cluster_id,
          clusterName: p.clusterName ?? p.cluster_name,
          color: p.color,
          year: p.year,
          citations: p.citations,
          authors: p.authors,
          venue: p.venue,
          tldr: p.tldr,
          abstract: p.abstract,
          doi: p.doi,
        });
      } else {
        setHoveredPaper(null);
      }
    };

    const handlePaperClick = (e: any) => {
      const p = e.detail?.paper;
      if (p) {
        setPinnedPaper({
          id: p.id,
          title: p.title,
          clusterId: p.clusterId ?? p.cluster_id,
          clusterName: p.clusterName ?? p.cluster_name,
          color: p.color,
          year: p.year,
          citations: p.citations,
          authors: p.authors,
          venue: p.venue,
          tldr: p.tldr,
          abstract: p.abstract,
          doi: p.doi,
        });
      }
    };

    window.addEventListener('rr-paper-hover', handlePaperHover);
    window.addEventListener('rr-paper-click', handlePaperClick);
    return () => {
      window.removeEventListener('rr-paper-hover', handlePaperHover);
      window.removeEventListener('rr-paper-click', handlePaperClick);
    };
  }, []);

  const handleToggleAutoRotate = () => {
    const nextState = !isAutoRotating;
    setIsAutoRotating(nextState);
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: nextState ? 'auto_rotate_on' : 'auto_rotate_off' },
      })
    );
  };

  const handleResetCamera = () => {
    window.dispatchEvent(new CustomEvent('rr-camera-cmd', { detail: { cmd: 'reset' } }));
    setActiveClusterFilter(null);
  };

  const handleTopView = () => {
    window.dispatchEvent(new CustomEvent('rr-camera-cmd', { detail: { cmd: 'top' } }));
  };

  const handleSideView = () => {
    window.dispatchEvent(new CustomEvent('rr-camera-cmd', { detail: { cmd: 'side' } }));
  };

  const handleSelectCluster = (cid: number | null) => {
    setActiveClusterFilter(cid);
    if (cid === null) {
      window.dispatchEvent(new CustomEvent('rr-camera-cmd', { detail: { cmd: 'reset' } }));
    } else {
      window.dispatchEvent(
        new CustomEvent('rr-camera-cmd', {
          detail: { cmd: 'focus', clusterId: cid },
        })
      );
    }
  };

  const activeDisplayPaper = pinnedPaper || hoveredPaper;

  return (
    <div className="relative w-full h-[calc(100vh-4.25rem)] pointer-events-none flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden font-sans">
      {/* 1. Sleek Floating Top Control HUD */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-auto">
        {/* Left: Scientific Dataset Label */}
        <div className="flex items-center space-x-3 rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-xl px-4 py-2.5 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)] animate-pulse" />
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono font-semibold tracking-wider text-sky-600 uppercase">
              <Box className="h-3 w-3" />
              <span>3D SCIENTOMETRIC MANIFOLD · UMAP 3D SCATTER</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 truncate max-w-sm sm:max-w-md">
              {datasetName}
            </h2>
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-500 border-l border-slate-200 pl-3">
            {data3d?.total_points || 300} nodes
          </span>
        </div>

        {/* Right: Camera Orientation & Auto-Orbit Controls */}
        <div className="flex items-center space-x-1.5 rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-1 shadow-lg font-mono text-xs text-slate-700">
          <button
            onClick={handleToggleAutoRotate}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              isAutoRotating
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Toggle Continuous Turntable Orbit"
          >
            {isAutoRotating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isAutoRotating ? 'Orbiting' : 'Orbit'}</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-200" />

          <button
            onClick={handleResetCamera}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all"
            title="Reset to Default Perspective"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleTopView}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all"
            title="Top-Down Orthogonal View"
          >
            Top
          </button>

          <button
            onClick={handleSideView}
            className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all"
            title="Profile Side View"
          >
            Side
          </button>
        </div>
      </div>

      {/* 2. Horizontal Cluster Filter Pills Bar */}
      {clusters.length > 0 && (
        <div className="w-full flex items-center space-x-2 overflow-x-auto py-2 px-1 pointer-events-auto scrollbar-none">
          <button
            onClick={() => handleSelectCluster(null)}
            className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1 text-xs font-mono whitespace-nowrap transition-all shadow-sm ${
              activeClusterFilter === null
                ? 'border-slate-900 bg-slate-900 text-white font-bold'
                : 'border-slate-200/90 bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span>All Topics</span>
            <span className={`text-[10px] ${activeClusterFilter === null ? 'text-slate-300' : 'text-slate-400'}`}>
              ({data3d?.total_points || 300})
            </span>
          </button>

          {clusters.map((c) => {
            const isSelected = activeClusterFilter === c.cluster_id;
            return (
              <button
                key={c.cluster_id}
                onClick={() => handleSelectCluster(isSelected ? null : c.cluster_id)}
                className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1 text-xs font-mono whitespace-nowrap transition-all shadow-sm ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md'
                    : 'border-slate-200/90 bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full border border-white"
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.name.replace(/^Topic\s*\d+:\s*/i, '').slice(0, 24)}</span>
                <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  ({c.point_count})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Floating Node Inspection Card (When a paper is hovered or clicked) */}
      <div className="w-full flex items-end justify-between pointer-events-none">
        {activeDisplayPaper ? (
          <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-2xl p-5 shadow-2xl text-left animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: activeDisplayPaper.color || '#38bdf8' }}
                />
                <span className="text-[11px] font-mono text-slate-700 font-bold tracking-wide truncate max-w-[260px]">
                  {activeDisplayPaper.clusterName || `Topic ${activeDisplayPaper.clusterId ?? 'Outlier'}`}
                </span>
              </div>

              {pinnedPaper && (
                <button
                  onClick={() => setPinnedPaper(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
                  title="Close Inspector"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2.5 line-clamp-2">
              {activeDisplayPaper.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono text-slate-600">
              {activeDisplayPaper.year && (
                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                  {activeDisplayPaper.year}
                </span>
              )}
              {activeDisplayPaper.citations !== undefined && (
                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                  {activeDisplayPaper.citations} citations
                </span>
              )}
              {activeDisplayPaper.venue && (
                <span className="text-slate-500 truncate max-w-[160px]">
                  {activeDisplayPaper.venue}
                </span>
              )}
            </div>

            {activeDisplayPaper.abstract && (
              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed font-sans">
                {activeDisplayPaper.abstract}
              </p>
            )}

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              {onNavigateToGrant && (
                <button
                  onClick={() => onNavigateToGrant(activeDisplayPaper.title)}
                  className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-sky-600 text-white font-semibold text-xs py-2 px-3 hover:bg-sky-700 transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Synthesize Grant Proposal</span>
                </button>
              )}
              {activeDisplayPaper.doi && (
                <a
                  href={`https://doi.org/${activeDisplayPaper.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all"
                  title="Open Publication DOI"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="text-[11px] font-mono text-slate-600 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            Hover or click any 3D node to inspect publication metadata
          </div>
        )}

        {/* Bottom Right: 3D Dimension Mapping Legend matching Image 2 */}
        <div className="hidden sm:flex items-center space-x-4 text-[11px] font-mono text-slate-600 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-md">
          <div className="flex items-center space-x-1.5">
            <span className="text-sky-600 font-bold">Dim 1</span>
            <span className="text-slate-400">→</span>
            <span>UMAP X</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-sky-600 font-bold">Dim 3</span>
            <span className="text-slate-400">→</span>
            <span>Height Y</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-sky-600 font-bold">Dim 2</span>
            <span className="text-slate-400">→</span>
            <span>Depth Z</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Drag: 360° Orbit · Wheel: Zoom</span>
        </div>
      </div>
    </div>
  );
};
