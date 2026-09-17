import React, { useState, useMemo } from 'react';
import { Points3DData } from '../types';
import { OmniScopeL1ClusterSpace } from './OmniScopeL1ClusterSpace';
import { convertPoints3DData } from '../particles/ClusterTargetGenerator';

interface OmniScopeStudioProps {
  data3d?: Points3DData | null;
  datasetName?: string;
  onNavigateToGrant?: (gapTitle: string) => void;
  selectedClusterId?: string;
  onSelectCluster?: (id: string) => void;
  activeLayer?: 1 | 2 | 3;
  onSelectLayer?: (layer: 1 | 2 | 3) => void;
}

export const OmniScopeStudio: React.FC<OmniScopeStudioProps> = ({
  data3d,
  datasetName = 'Satellite Earth Observation & Remote Sensing',
  onNavigateToGrant,
  selectedClusterId,
  onSelectCluster,
  activeLayer = 1,
  onSelectLayer,
}) => {
  const [localClusterId, setLocalClusterId] = useState<string>('0');
  const [localLayer, setLocalLayer] = useState<1 | 2 | 3>(1);

  const curClusterId = selectedClusterId || localClusterId;
  const curLayer = activeLayer !== undefined ? activeLayer : localLayer;

  const handleSelectCluster = (id: string) => {
    if (onSelectCluster) onSelectCluster(id);
    setLocalClusterId(id);
  };

  const handleSelectLayer = (layer: 1 | 2 | 3) => {
    if (onSelectLayer) onSelectLayer(layer);
    setLocalLayer(layer);
  };

  const { clusters } = useMemo(() => convertPoints3DData(data3d || null), [data3d]);
  const scientificClusters = clusters.filter((c) => c.clusterId >= 0);
  const fallbackCluster = { id: '3', clusterId: 3, name: 'Land Cover Change Detection', color: '#a855f7', pointCount: 27, centroid: { x: 0, y: 0, z: 0 }, points: [] };
  const activeCluster =
    clusters.find((c) => c.id === curClusterId) || scientificClusters[0] || clusters[0] || fallbackCluster;

  return (
    <div className="w-full h-[calc(100vh-4.25rem)] text-slate-100 flex flex-col font-sans overflow-hidden bg-transparent">
      {/* Clean, Unified Top Sub-Header Bar */}
      <header className="w-full h-12 border-b border-white/[0.08] bg-[#07080B]/85 backdrop-blur-xl px-6 flex items-center justify-between z-30 shrink-0">
        {/* Left: Breadcrumb / Active Context */}
        <div className="flex items-center space-x-2.5 text-xs font-mono">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
          <span className="text-white font-semibold tracking-wide">OmniScope</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-[200px] hidden md:inline">{datasetName}</span>
          <span className="text-slate-600 hidden md:inline">/</span>
          <div className="flex items-center space-x-1.5 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded text-[11px]">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: activeCluster.color }}
            />
            <span className="text-slate-200 font-medium truncate max-w-[240px]">
              Basin #{activeCluster.clusterId}: {activeCluster.name}
            </span>
          </div>
        </div>

        {/* Center: 3-Layer Navigation Tabs matching Reference Image */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => handleSelectLayer(1)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all ${
              curLayer === 1
                ? 'bg-cyan-950/80 border border-cyan-400/80 text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.25)] font-semibold'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-[10px]">01</span>
            <span>MACRO MANIFOLD</span>
          </button>
          <span className="text-zinc-600">—</span>
          <button
            onClick={() => handleSelectLayer(2)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all ${
              curLayer === 2
                ? 'bg-cyan-950/80 border border-cyan-400/80 text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.25)] font-semibold'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-[10px]">02</span>
            <span>POLAR BURST</span>
          </button>
          <span className="text-zinc-600">—</span>
          <button
            onClick={() => handleSelectLayer(3)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md transition-all ${
              curLayer === 3
                ? 'bg-cyan-950/80 border border-cyan-400/80 text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.25)] font-semibold'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-[10px]">03</span>
            <span>GAP TRIADS</span>
          </button>
        </div>

        {/* Right: Telemetry & Cluster Purity */}
        <div className="hidden lg:flex items-center space-x-3 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-medium">PURITY: 92.4%</span>
          <span className="text-white/20">|</span>
          <span>{clusters.length} REAL BASINS</span>
        </div>
      </header>

      {/* Main Single-Layer Full-Screen Container */}
      <main className="relative flex-1 w-full h-[calc(100%-3rem)] overflow-hidden">
        <OmniScopeL1ClusterSpace
          data3d={data3d}
          selectedClusterId={curClusterId}
          onSelectCluster={handleSelectCluster}
        />
      </main>
    </div>
  );
};
