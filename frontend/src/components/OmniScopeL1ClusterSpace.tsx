import React, { useState, useEffect, useMemo } from 'react';
import { RotateCw, Compass, Layers } from 'lucide-react';
import { Points3DData } from '../types';
import { convertPoints3DData } from '../particles/ClusterTargetGenerator';
import { ClusterGlassMorphPanel } from './ClusterGlassMorphPanel';

interface OmniScopeL1ClusterSpaceProps {
  data3d?: Points3DData | null;
  selectedClusterId: string;
  onSelectCluster: (id: string) => void;
}

export const OmniScopeL1ClusterSpace: React.FC<OmniScopeL1ClusterSpaceProps> = ({
  data3d,
  selectedClusterId,
  onSelectCluster,
}) => {
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  const { clusters } = useMemo(() => convertPoints3DData(data3d || null), [data3d]);
  const scientificClusters = clusters.filter((c) => c.clusterId >= 0);
  const outlierCluster = clusters.find((c) => c.clusterId === -1);

  const fallbackCluster = { id: '3', clusterId: 3, name: 'Land Cover Change Detection', color: '#a855f7', pointCount: 27, centroid: { x: 0, y: 0, z: 0 }, points: [] };
  const activeCluster =
    clusters.find((c) => c.id === selectedClusterId) || scientificClusters[0] || clusters[0] || fallbackCluster;

  const totalPapers = clusters.reduce((acc, c) => acc + c.pointCount, 0);

  const handleToggleAutoRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isAutoRotate;
    setIsAutoRotate(next);
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: next ? 'auto_rotate_on' : 'auto_rotate_off' },
      })
    );
  };

  const handleResetCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'reset_overview' },
      })
    );
  };

  const handleTopView = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'top' },
      })
    );
  };

  const handleSideView = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'side' },
      })
    );
  };

  // Handle entering focused 3D Showpiece inspect mode
  const handleClusterClick = (clusterId: string) => {
    onSelectCluster(clusterId);
    setIsInspectMode(true);
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'focus_showpiece', clusterId },
      })
    );
  };

  // Handle returning to macro 10-cluster overview
  const handleBackToOverview = () => {
    setIsInspectMode(false);
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'reset_overview' },
      })
    );
  };

  // Escape key handler for intuitive scientific navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInspectMode) {
        handleBackToOverview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInspectMode]);

  return (
    <div className="w-full h-full flex font-sans overflow-hidden">
      {/* =================================================================== */}
      {/* LEFT 52-54%: PURE OPEN 3D STAGE (FULL 360° ORBIT & CONTROLS)        */}
      {/* =================================================================== */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing select-none">
        {/* Top-Left Stage Bar & 360° Controls */}
        <div className="absolute top-4 left-6 flex flex-wrap items-center gap-2 pointer-events-auto z-10">
          {isInspectMode ? (
            <div className="px-3 py-1.5 rounded-md bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center space-x-2 font-mono text-[11px] text-zinc-300 shadow-lg">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeCluster.color }} />
              <span className="font-semibold text-zinc-100">3D SHOWPIECE EXHIBITION</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">Turntable Active</span>
              <span className="text-zinc-600 hidden md:inline">· Drag to orbit 360°</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-md bg-zinc-950/70 border border-white/10 backdrop-blur-md flex items-center space-x-2 font-mono text-[10px] text-zinc-300 shadow-lg">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none inline-block" />
              <span className="font-semibold text-zinc-200">3D EPISTEMIC MANIFOLD</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">360° View</span>
            </div>
          )}

          {/* 360° Orbit & Camera Controls */}
          <div className="flex items-center space-x-1 bg-zinc-950/80 border border-white/10 rounded-md p-0.5 backdrop-blur-md font-mono text-[10px]">
            <button
              onClick={handleToggleAutoRotate}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors ${
                isAutoRotate ? 'bg-[#ff4300]/20 text-[#ff7744] border border-[#ff4300]/40 font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Toggle continuous 360° turntable orbit"
            >
              <RotateCw className={`w-3 h-3 ${isAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span>360° {isAutoRotate ? 'Auto-Rotate' : 'Paused'}</span>
            </button>

            <button
              onClick={handleResetCamera}
              className="px-2 py-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Reset camera to default overview perspective"
            >
              Reset
            </button>

            <button
              onClick={handleTopView}
              className="px-2 py-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-block"
              title="Top-down 2D manifold projection"
            >
              Top (2D)
            </button>

            <button
              onClick={handleSideView}
              className="px-2 py-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-block"
              title="Side-elevation 3D perspective"
            >
              Side (3D)
            </button>
          </div>
        </div>

        {/* Bottom-Left 360° Interaction Hint */}
        <div className="absolute bottom-4 left-6 pointer-events-none z-10">
          <div className="px-2.5 py-1 rounded bg-black/60 border border-white/5 font-mono text-[9px] text-zinc-500 backdrop-blur-sm flex items-center space-x-2">
            <span>DRAG 3D STAGE TO ROTATE 360°</span>
            <span>·</span>
            <span>SCROLL WHEEL TO ZOOM</span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RIGHT STAGE: GLASS MORPH DETAIL PANEL OR OVERVIEW DIRECTORY        */}
      {/* =================================================================== */}
      {isInspectMode ? (
        <ClusterGlassMorphPanel
          cluster={activeCluster}
          totalCorpusCount={totalPapers}
          onBackToOverview={handleBackToOverview}
          onSelectPaper={(paperId) => {
            console.log('Selected paper:', paperId);
          }}
        />
      ) : (
        <div className="cluster-directory-panel w-[46%] max-w-[580px] h-full p-4 lg:p-5 flex flex-col shrink-0 pointer-events-auto">
          <div className="h-full bg-[#090b10]/95 border border-zinc-800/90 rounded-xl p-5 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="space-y-2.5 pb-4 border-b border-zinc-800/80 shrink-0">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none inline-block" />
                  <span>TOPOLOGICAL MANIFOLD // STAGE 04</span>
                </span>
                <span className="text-zinc-500 font-mono">INIT: PCA (EIGEN-3)</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-100 font-sans">
                  {scientificClusters.length} Epistemic Constellations
                </h2>
                <div className="flex items-center space-x-2 mt-1 font-mono text-[11px] text-zinc-400">
                  <span>{totalPapers} documents</span>
                  <span className="text-zinc-600">·</span>
                  <span>384-D Embeddings</span>
                  <span className="text-zinc-600">·</span>
                  <span>Two-Scale VOS</span>
                </div>
              </div>
            </div>

            {/* Cluster List */}
            <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-1.5 font-mono custom-scrollbar">
              {scientificClusters.map((c) => {
                const isSelected = c.id === activeCluster.id;
                const pct = ((c.pointCount / totalPapers) * 100).toFixed(1);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleClusterClick(c.id)}
                    className={`w-full text-left py-2 px-3 rounded-md transition-colors flex items-center justify-between group cursor-pointer border ${
                      isSelected
                        ? 'bg-zinc-800/90 text-white font-medium border-zinc-600 shadow-sm'
                        : 'bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-300 hover:text-white border-zinc-800/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 shrink-0 rounded-none"
                        style={{
                          backgroundColor: c.color,
                          boxShadow: isSelected ? `0 0 8px ${c.color}66` : 'none',
                        }}
                      />
                      <div className="truncate">
                        <div className="text-xs truncate tracking-normal font-sans font-medium text-zinc-200">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 flex items-center space-x-2 mt-0.5">
                          <span className="text-zinc-400 font-semibold">T{c.clusterId}</span>
                          <span className="text-zinc-600">·</span>
                          <span>{pct}% corpus</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3 flex items-center space-x-2">
                      <div>
                        <span className="text-xs font-semibold text-zinc-200">{c.pointCount}</span>
                        <span className="text-[10px] text-zinc-500 ml-1">papers</span>
                      </div>
                      <span className="text-zinc-600 group-hover:text-zinc-400 text-xs">→</span>
                    </div>
                  </button>
                );
              })}

              {outlierCluster && (
                <button
                  key={outlierCluster.id}
                  onClick={() => handleClusterClick(outlierCluster.id)}
                  className={`w-full text-left py-2 px-3 rounded-md transition-colors flex items-center justify-between group cursor-pointer mt-2 pt-2 border border-dashed ${
                    outlierCluster.id === activeCluster.id
                      ? 'bg-zinc-800/90 text-white font-medium border-zinc-600'
                      : 'bg-zinc-950/20 hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-300 border-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span
                      className="w-2 h-2 shrink-0 rounded-none bg-zinc-500 opacity-60"
                    />
                    <div className="truncate">
                      <div className="text-xs truncate font-sans text-zinc-400 italic">{outlierCluster.name}</div>
                      <div className="text-[10px] text-zinc-600 mt-0.5">HDBSCAN Residual Noise (ρ &lt; ρ_min)</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3 flex items-center space-x-2">
                    <div>
                      <span className="text-xs text-zinc-400">{outlierCluster.pointCount}</span>
                      <span className="text-[10px] text-zinc-600 ml-1">papers</span>
                    </div>
                    <span className="text-zinc-600 group-hover:text-zinc-400 text-xs">→</span>
                  </div>
                </button>
              )}
            </div>

            {/* Active Target Footer matching Reference Image */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-2 shrink-0 font-mono">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="text-zinc-500">ACTIVE TARGET:</span>
                <span className="text-zinc-200 font-semibold tracking-wider">
                  TOPIC T{activeCluster.clusterId >= 0 ? activeCluster.clusterId + 1 : '0'} · {activeCluster.pointCount} PAPERS
                </span>
              </div>
              <button
                onClick={() => handleClusterClick(activeCluster.id)}
                className="w-full py-2.5 px-4 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-500 text-xs text-zinc-100 flex items-center justify-center space-x-2 transition-colors cursor-pointer group shadow-lg"
              >
                <span className="w-1.5 h-1.5 bg-[#ff5500] rounded-none inline-block shadow-[0_0_6px_#ff5500]" />
                <span className="font-semibold tracking-wider">EXPLORE TOPIC SUB-GRAPH (POLAR BURST L2) →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
