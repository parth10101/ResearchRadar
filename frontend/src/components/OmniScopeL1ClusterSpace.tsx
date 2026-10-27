import React, { useState, useEffect, useMemo } from 'react';
import { RotateCw, Compass, Layers, ArrowRight } from 'lucide-react';
import { Points3DData } from '../types';
import { convertPoints3DData } from '../particles/ClusterTargetGenerator';
import { ClusterGlassMorphPanel } from './ClusterGlassMorphPanel';
import { spatialJourneyController } from '../particles/SpatialJourneyController';
import { cameraSplineRig } from '../particles/CameraSplineRig';

interface OmniScopeL1ClusterSpaceProps {
  data3d?: Points3DData | null;
  selectedClusterId: string;
  onSelectCluster: (id: string) => void;
  onSelectPaper?: (id: string) => void;
  onNavigateToHero?: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToGrant?: () => void;
  activeQuery?: string;
}

export const OmniScopeL1ClusterSpace: React.FC<OmniScopeL1ClusterSpaceProps> = ({
  data3d,
  selectedClusterId,
  onSelectCluster,
  onSelectPaper,
  onNavigateToHero,
  onNavigateToTimeline,
  onNavigateToGrant,
  activeQuery,
}) => {
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [orbitMode, setOrbitMode] = useState<'360' | '90' | 'paused'>('360');
  const stageRef = React.useRef<HTMLDivElement>(null);

  // Responsively track usable 3D stage width (open area on left of glass inspector)
  useEffect(() => {
    const updateDimensions = () => {
      if (stageRef.current) {
        const stageW = stageRef.current.clientWidth;
        cameraSplineRig.setUsableDimensions(stageW, window.innerWidth, window.innerHeight);
      }
    };
    updateDimensions();
    // Use requestAnimationFrame / timeout to ensure post-layout glass panel width is accurate
    const rId = requestAnimationFrame(updateDimensions);
    window.addEventListener('resize', updateDimensions);
    return () => {
      cancelAnimationFrame(rId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isInspectMode, selectedClusterId]);

  const cleanTopicName = (rawName: string) => {
    return (rawName || '').replace(/^Topic\s*\d+\s*[:\-]\s*/i, '').trim() || rawName;
  };

  const { clusters } = useMemo(() => convertPoints3DData(data3d || null), [data3d]);
  const scientificClusters = clusters.filter((c) => c.clusterId >= 0);
  const outlierCluster = clusters.find((c) => c.clusterId === -1);

  // Authoritative selected cluster derivation (no silent random fallback)
  const activeCluster = useMemo(() => {
    if (!selectedClusterId) return null;
    return (
      clusters.find(
        (c) =>
          String(c.clusterId) === String(selectedClusterId) ||
          c.id === String(selectedClusterId)
      ) || null
    );
  }, [clusters, selectedClusterId]);

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

  const handleTest90DegOrbit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrbitMode('90');
    cameraSplineRig.startOrbit('90');
  };

  const handleTest360DegOrbit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrbitMode('360');
    cameraSplineRig.startOrbit('360');
  };

  const handleResetCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'reset_overview' },
      })
    );
    spatialJourneyController.resetToUniverse();
    onSelectCluster('');
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

  // Single-click: Select cluster in macro 3D manifold & trigger cinematic approach + 360 orbit
  const handleSelectCluster = (clusterId: string) => {
    onSelectCluster(clusterId);
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'focus', clusterId },
      })
    );
    spatialJourneyController.selectCluster(clusterId, true);
  };

  // Double-click: Enter focused 3D Showpiece exhibition mode
  const handleDoubleClickCluster = (clusterId: string) => {
    onSelectCluster(clusterId);
    setIsInspectMode(true);
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'focus_showpiece', clusterId },
      })
    );
    spatialJourneyController.selectCluster(clusterId, true);
  };

  // Handle returning to macro 10-cluster overview
  const handleBackToOverview = () => {
    setIsInspectMode(false);
    onSelectCluster('');
    window.dispatchEvent(
      new CustomEvent('rr-camera-cmd', {
        detail: { cmd: 'reset_overview' },
      })
    );
    spatialJourneyController.resetToUniverse();
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
      {/* LEFT 54%: PURE OPEN 3D STAGE (FULL 360° ORBIT & CONTROLS)           */}
      {/* =================================================================== */}
      <div ref={stageRef} className="flex-1 relative cursor-grab active:cursor-grabbing select-none">
        {/* Top-Left Stage Bar & 360° Controls */}
        <div className="absolute top-4 left-6 flex flex-wrap items-center gap-2 pointer-events-auto z-10">
          {isInspectMode ? (
            <div className="px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center space-x-2 font-mono text-[11px] text-zinc-300 shadow-xl">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeCluster?.color || '#ff4300' }} />
              <span className="font-semibold text-zinc-100">3D SHOWPIECE EXHIBITION</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">Turntable Active</span>
              <span className="text-zinc-600 hidden md:inline">· Drag to inspect 360°</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-zinc-950/70 border border-white/10 backdrop-blur-md flex items-center space-x-2 font-mono text-[10px] text-zinc-300 shadow-xl">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none inline-block" />
              <span className="font-semibold text-zinc-200">3D EPISTEMIC MANIFOLD</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">360° Turntable</span>
            </div>
          )}

          {/* 360° Orbit & Camera Controls */}
          <div className="flex items-center space-x-1 bg-zinc-950/80 border border-white/10 rounded-lg p-0.5 backdrop-blur-md font-mono text-[10px]">
            {selectedClusterId && !isInspectMode && (
              <button
                onClick={handleTest360DegOrbit}
                className={`px-2 py-1 rounded-md transition-colors ${
                  orbitMode === '360'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title="Full 360° continuous orbit around selected cluster"
              >
                360° Orbit (6s)
              </button>
            )}

            <button
              onClick={handleToggleAutoRotate}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
                isAutoRotate ? 'bg-[#ff4300]/20 text-[#ff7744] border border-[#ff4300]/40 font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Toggle continuous 360° turntable spin"
            >
              <RotateCw className={`w-3 h-3 ${isAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span>{isAutoRotate ? 'Auto Spin' : 'Manual'}</span>
            </button>

            <button
              onClick={handleResetCamera}
              className="px-2 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Reset camera to default overview"
            >
              Reset
            </button>

            {!isInspectMode && (
              <>
                <button
                  onClick={handleTopView}
                  className="px-2 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-block"
                  title="Top-down 2D manifold projection"
                >
                  Top (2D)
                </button>

                <button
                  onClick={handleSideView}
                  className="px-2 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:inline-block"
                  title="Side-elevation 3D perspective"
                >
                  Side (3D)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom-Left 360° Interaction Hint */}
        <div className="absolute bottom-4 left-6 pointer-events-none z-10">
          <div className="px-2.5 py-1 rounded-md bg-black/60 border border-white/5 font-mono text-[9px] text-zinc-500 backdrop-blur-sm flex items-center space-x-2">
            <span>3D INTERACTIVE MANIFOLD</span>
            <span>·</span>
            <span>DRAG TO ROTATE 360° · SCROLL TO ZOOM</span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RIGHT STAGE: GLASS MORPH DETAIL PANEL OR OVERVIEW DIRECTORY        */}
      {/* =================================================================== */}
      {isInspectMode ? (
        <ClusterGlassMorphPanel
          cluster={activeCluster || clusters[0]}
          totalCorpusCount={totalPapers}
          onBackToOverview={handleBackToOverview}
          activeQuery={activeQuery}
          onSelectPaper={(paperId) => {
            if (onSelectPaper) {
              onSelectPaper(paperId);
            }
          }}
        />
      ) : (
        <div className="cluster-directory-panel w-[46%] max-w-[580px] h-full p-4 lg:p-5 flex flex-col shrink-0 pointer-events-auto rr-enter-panel">
          <div
            className="h-full relative bg-[#0b101d]/65 backdrop-blur-2xl backdrop-saturate-150 border border-white/[0.12] rounded-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient Radial Glass Refraction Glow */}
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-20 transition-all duration-700"
              style={{
                backgroundColor: activeCluster?.color || '#38bdf8',
              }}
            />

            {/* Header */}
            <div className="space-y-2 pb-3.5 border-b border-white/[0.08] shrink-0 relative z-10">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-semibold tracking-wider text-zinc-300 font-mono backdrop-blur-sm">
                  STAGE 04 · TOPIC CLUSTERING
                </span>
                <span className="text-[11px] font-sans text-zinc-400 shrink-0 flex items-center gap-1.5">
                  <span className="text-zinc-200 font-semibold font-mono">{totalPapers}</span>
                  <span>Publications</span>
                </span>
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight text-white font-sans">
                  Thematic Research Domains
                </h2>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  {scientificClusters.length} distinct partition clusters across active scientific literature
                </p>
              </div>
            </div>

            {/* Cluster List */}
            <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-2 custom-scrollbar relative z-10">
              {scientificClusters.map((c, idx) => {
                const isSelected = Boolean(selectedClusterId && c.id === selectedClusterId);
                const pct = ((c.pointCount / totalPapers) * 100).toFixed(1);
                const topicNum = c.clusterId >= 0 ? c.clusterId : idx + 1;
                const displayName = cleanTopicName(c.name);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCluster(c.id)}
                    onDoubleClick={() => handleDoubleClickCluster(c.id)}
                    title="Click to select · Double-click to open Deep-Dive"
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start justify-between group cursor-pointer border select-none ${
                      isSelected
                        ? 'bg-white/[0.10] text-white border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.20)] backdrop-blur-md'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white border-white/[0.05] hover:border-white/[0.14] backdrop-blur-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3 min-w-0 flex-1 pr-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: c.color,
                          boxShadow: isSelected ? `0 0 10px ${c.color}` : `0 0 4px ${c.color}66`,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-sans font-medium text-zinc-100 group-hover:text-white leading-snug line-clamp-2">
                          {displayName}
                        </div>
                        <div className="text-[11px] text-zinc-400 flex items-center space-x-2 mt-1">
                          <span className="text-zinc-300 font-medium font-sans">Topic {topicNum}</span>
                          <span className="text-zinc-600">·</span>
                          <span className="font-mono text-[10px] text-zinc-400">{pct}% corpus</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 self-center">
                      <span className="text-xs font-semibold font-mono text-zinc-200">{c.pointCount}</span>
                      <span className="text-[10px] text-zinc-500 ml-1 font-sans">papers</span>
                    </div>
                  </button>
                );
              })}

              {outlierCluster && (() => {
                const outlierPct = ((outlierCluster.pointCount / totalPapers) * 100).toFixed(1);
                const isSelected = Boolean(selectedClusterId && outlierCluster.id === selectedClusterId);
                return (
                  <button
                    key={outlierCluster.id}
                    onClick={() => handleSelectCluster(outlierCluster.id)}
                    onDoubleClick={() => handleDoubleClickCluster(outlierCluster.id)}
                    title="Click to select · Double-click to open Deep-Dive"
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start justify-between group cursor-pointer mt-2 border border-dashed select-none ${
                      isSelected
                        ? 'bg-white/[0.10] text-white border-zinc-400 shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.20)] backdrop-blur-md'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-300 border-white/[0.06] backdrop-blur-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3 min-w-0 flex-1 pr-3">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 bg-zinc-500 opacity-60" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-sans text-zinc-300 font-medium">{cleanTopicName(outlierCluster.name)}</div>
                        <div className="text-[11px] text-zinc-400 flex items-center space-x-2 mt-1">
                          <span className="text-zinc-400 font-sans">Outliers</span>
                          <span className="text-zinc-600">·</span>
                          <span className="font-mono text-[10px] text-zinc-400">{outlierPct}% corpus</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 self-center">
                      <span className="text-xs font-mono text-zinc-400 font-semibold">{outlierCluster.pointCount}</span>
                      <span className="text-[10px] text-zinc-600 ml-1 font-sans">papers</span>
                    </div>
                  </button>
                );
              })()}
            </div>

            {/* Active Target Footer / Status Bar */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans shrink-0 relative z-10">
              {activeCluster ? (
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: activeCluster.color,
                      boxShadow: `0 0 6px ${activeCluster.color}88`,
                    }}
                  />
                  <span className="text-zinc-400 shrink-0">Selected:</span>
                  <span className="text-zinc-200 font-medium truncate">
                    {activeCluster.clusterId >= 0 ? `Topic ${activeCluster.clusterId}` : 'Outliers'} · {cleanTopicName(activeCluster.name)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  <span className="text-zinc-500 italic text-[11px]">Click a domain to highlight in 3D</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5 text-[10px] text-zinc-300 font-mono shrink-0 bg-white/[0.06] border border-white/[0.10] px-2 py-1 rounded-md select-none backdrop-blur-sm">
                <span>Double-click for Deep-Dive</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {onNavigateToTimeline && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onNavigateToTimeline(); }}
                    className="flex items-center space-x-1 text-[11px] font-mono text-[#ff8a50] hover:text-white bg-[#ff4300]/15 hover:bg-[#ff4300]/30 border border-[#ff4300]/40 px-2.5 py-1 rounded-md transition-all cursor-pointer shadow-[0_0_10px_rgba(255,67,0,0.2)]"
                    title="Navigate to Stage 02: Citations Timeline"
                  >
                    <span>02 Citations →</span>
                  </button>
                )}
                {onNavigateToGrant && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onNavigateToGrant(); }}
                    className="flex items-center space-x-1 text-[11px] font-mono text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 px-2.5 py-1 rounded-md transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    title="Navigate to Stage 03: Gap Analysis Studio"
                  >
                    <span>03 Gap Analysis →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
