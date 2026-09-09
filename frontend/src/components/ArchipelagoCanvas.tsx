import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Compass, ZoomIn, ZoomOut, RotateCcw, ExternalLink, X, Sparkles, Layers, Eye, Play, Pause, ArrowRight, Box, Zap } from 'lucide-react';
import { Points3DData, Point3D, Cluster3D, Gap3D, ArchipelagoData } from '../types';

interface ArchipelagoCanvasProps {
  data3d: Points3DData | null;
  data?: ArchipelagoData | null;
  datasetName: string;
  onNavigateToGrant?: (gapTitle: string) => void;
}

export const ArchipelagoCanvas: React.FC<ArchipelagoCanvasProps> = ({
  data3d,
  datasetName,
  onNavigateToGrant,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Extract clusters list (excluding noise for main navigation)
  const clusters = useMemo(() => {
    return (data3d?.clusters || []).filter(c => c.cluster_id > 0);
  }, [data3d]);

  // 3-Level Navigation State
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);
  const [selectedClusterId, setSelectedClusterId] = useState<number>(1);
  const [selectedPoint, setSelectedPoint] = useState<Point3D | null>(null);
  const [selectedGap, setSelectedGap] = useState<Gap3D | null>(null);

  // Update initial selected cluster once data loads
  useEffect(() => {
    if (clusters.length > 0 && !clusters.find(c => c.cluster_id === selectedClusterId)) {
      setSelectedClusterId(clusters[0].cluster_id);
    }
  }, [clusters, selectedClusterId]);

  // 3D Camera State: Spherical Coordinates (Yaw, Pitch, Distance)
  const [yaw, setYaw] = useState<number>(0.65);
  const [pitch, setPitch] = useState<number>(0.45);
  const [zoom, setZoom] = useState<number>(1.0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<Point3D | null>(null);

  // Mouse drag tracking
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Auto-rotation animation loop
  useEffect(() => {
    if (!autoRotate) return;
    let animId: number;
    const animate = () => {
      setYaw(prev => prev + 0.003);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate]);

  // Level switching camera transitions
  const handleLevelChange = (level: 1 | 2 | 3) => {
    setActiveLevel(level);
    if (level === 1) {
      setZoom(1.0);
      setSelectedGap(null);
    } else if (level === 2) {
      setZoom(1.0);
      setSelectedGap(null);
      setAutoRotate(false);
      const targetCl = clusters.find(c => c.cluster_id === selectedClusterId) || clusters[0];
      if (targetCl) {
        setSelectedClusterId(targetCl.cluster_id);
        if (targetCl.points && targetCl.points.length > 0) {
          setSelectedPoint(targetCl.points[0]);
        }
      }
    } else if (level === 3) {
      setZoom(1.0);
      setSelectedPoint(null);
      setAutoRotate(false);
      if (data3d?.gaps_3d && data3d.gaps_3d.length > 0) {
        setSelectedGap(data3d.gaps_3d[0]);
      }
    }
  };

  const activeCluster = useMemo(() => {
    return clusters.find(c => c.cluster_id === selectedClusterId) || clusters[0] || null;
  }, [clusters, selectedClusterId]);

  // Render 3D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data3d) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Deep cosmic background
    ctx.fillStyle = '#080b11';
    ctx.fillRect(0, 0, width, height);

    // Camera Center & Rotation Matrix
    const cx = width / 2;
    const cy = height / 2;

    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    // Normalization coordinates
    const b = data3d.bounds || { min_x: -10, max_x: 10, min_y: -10, max_y: 10, min_z: -10, max_z: 10 };
    const globalMidX = (b.min_x + b.max_x) / 2;
    const globalMidY = (b.min_y + b.max_y) / 2;
    const globalMidZ = (b.min_z + b.max_z) / 2;
    const globalMaxSpan = Math.max(b.max_x - b.min_x, b.max_y - b.min_y, b.max_z - b.min_z) || 20;

    // Level 2 Local Cluster Centering & Scaling
    let midX = globalMidX;
    let midY = globalMidY;
    let midZ = globalMidZ;
    let maxSpan = globalMaxSpan;

    if (activeLevel === 2 && activeCluster && activeCluster.points.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
      activeCluster.points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
        if (p.z < minZ) minZ = p.z;
        if (p.z > maxZ) maxZ = p.z;
      });
      midX = (minX + maxX) / 2;
      midY = (minY + maxY) / 2;
      midZ = (minZ + maxZ) / 2;
      const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 0.5);
      maxSpan = span * 1.45; // comfortable margin
    }

    // 3D to 2D projection function
    const project3D = (rawX: number, rawY: number, rawZ: number) => {
      // Normalize to [-1, 1]
      const nx = (rawX - midX) / (maxSpan / 2);
      const ny = (rawY - midY) / (maxSpan / 2);
      const nz = (rawZ - midZ) / (maxSpan / 2);

      // 1. Yaw rotation (around Z/Y plane)
      const x1 = nx * cosY - ny * sinY;
      const y1 = nx * sinY + ny * cosY;
      const z1 = nz;

      // 2. Pitch rotation (tilt)
      const x2 = x1;
      const y2 = y1 * cosP - z1 * sinP;
      const z2 = y1 * sinP + z1 * cosP;

      // 3. Perspective projection
      const cameraDistance = 3.5;
      const factor = (cameraDistance / (cameraDistance - z2 * 0.45)) * zoom;
      const scale = Math.min(width, height) * 0.38;

      return {
        screenX: cx + x2 * scale * factor,
        screenY: cy - y2 * scale * factor,
        depth: z2,
        factor: Math.max(0.3, factor),
      };
    };

    // 1. Draw 3D Coordinate Grid & Cage
    const boxR = 1.0;
    const corners = [
      [-boxR, -boxR, -boxR], [boxR, -boxR, -boxR], [boxR, boxR, -boxR], [-boxR, boxR, -boxR],
      [-boxR, -boxR, boxR], [boxR, -boxR, boxR], [boxR, boxR, boxR], [-boxR, boxR, boxR]
    ];
    const pCorners = corners.map(c => project3D(midX + c[0] * (maxSpan / 2), midY + c[1] * (maxSpan / 2), midZ + c[2] * (maxSpan / 2)));

    // Floor wireframe plane
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pCorners[0].screenX, pCorners[0].screenY);
    ctx.lineTo(pCorners[1].screenX, pCorners[1].screenY);
    ctx.lineTo(pCorners[2].screenX, pCorners[2].screenY);
    ctx.lineTo(pCorners[3].screenX, pCorners[3].screenY);
    ctx.closePath();
    ctx.stroke();

    // Subtle coordinate box pillars
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.moveTo(pCorners[0].screenX, pCorners[0].screenY);
    ctx.lineTo(pCorners[4].screenX, pCorners[4].screenY);
    ctx.moveTo(pCorners[1].screenX, pCorners[1].screenY);
    ctx.lineTo(pCorners[5].screenX, pCorners[5].screenY);
    ctx.moveTo(pCorners[2].screenX, pCorners[2].screenY);
    ctx.lineTo(pCorners[6].screenX, pCorners[6].screenY);
    ctx.moveTo(pCorners[3].screenX, pCorners[3].screenY);
    ctx.lineTo(pCorners[7].screenX, pCorners[7].screenY);
    ctx.stroke();

    // Axis indicators (Dim 1, Dim 2, Dim 3)
    const p0 = project3D(midX, midY, midZ - (maxSpan / 2));
    const px = project3D(midX + (maxSpan / 2), midY, midZ - (maxSpan / 2));
    const py = project3D(midX, midY + (maxSpan / 2), midZ - (maxSpan / 2));
    const pz = project3D(midX, midY, midZ + (maxSpan / 2));

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(p0.screenX, p0.screenY);
    ctx.lineTo(px.screenX, px.screenY);
    ctx.moveTo(p0.screenX, p0.screenY);
    ctx.lineTo(py.screenX, py.screenY);
    ctx.moveTo(p0.screenX, p0.screenY);
    ctx.lineTo(pz.screenX, pz.screenY);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono"';
    ctx.fillText('Dim 1', px.screenX + 6, px.screenY);
    ctx.fillText('Dim 2', py.screenX + 6, py.screenY);
    ctx.fillText('Dim 3', pz.screenX, pz.screenY - 6);

    // 2. Draw Epistemic Void Bridges (Level 1 and Level 3)
    if (activeLevel === 3 || activeLevel === 1) {
      (data3d.gaps_3d || []).forEach(gap => {
        const c1 = data3d.clusters.find(c => c.cluster_id === gap.source_cluster);
        const c2 = data3d.clusters.find(c => c.cluster_id === gap.target_cluster);
        if (!c1 || !c2) return;

        const p1 = project3D(c1.centroid.x, c1.centroid.y, c1.centroid.z);
        const p2 = project3D(c2.centroid.x, c2.centroid.y, c2.centroid.z);
        const pMid = project3D(gap.centroid.x, gap.centroid.y, gap.centroid.z);

        const isGapSelected = selectedGap?.gap_id === gap.gap_id;

        // Void Bridge Beam
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = isGapSelected ? '#f43f5e' : (activeLevel === 3 ? 'rgba(168, 85, 247, 0.85)' : 'rgba(168, 85, 247, 0.4)');
        ctx.lineWidth = isGapSelected ? 3.0 : (activeLevel === 3 ? 2.0 : 1.2);
        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.quadraticCurveTo(pMid.screenX, pMid.screenY, p2.screenX, p2.screenY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Centered Gap Badge
        const radius = (isGapSelected ? 18 : 14) * pMid.factor;
        ctx.fillStyle = isGapSelected ? '#f43f5e' : '#1c2638';
        ctx.beginPath();
        ctx.arc(pMid.screenX, pMid.screenY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isGapSelected ? '#ffffff' : '#a855f7';
        ctx.lineWidth = isGapSelected ? 2.0 : 1.5;
        ctx.stroke();

        // Gap Label Text
        ctx.fillStyle = isGapSelected ? '#ffffff' : '#a855f7';
        ctx.font = `700 ${Math.max(9, 10 * pMid.factor)}px "JetBrains Mono"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`G#${gap.rank}`, pMid.screenX, pMid.screenY);
      });
    }

    // 3. Project & Depth-Sort Points (Z-Buffering)
    const renderItems: Array<{
      type: 'point' | 'centroid';
      depth: number;
      screenX: number;
      screenY: number;
      factor: number;
      data: any;
    }> = [];

    // Filter points based on active level
    data3d.clusters.forEach(cluster => {
      const isCurrentCluster = cluster.cluster_id === selectedClusterId;
      const isNoise = cluster.cluster_id === -1;

      // In Level 2: only render the active cluster's points in high detail
      if (activeLevel === 2) {
        if (!isCurrentCluster) return; // focus entirely on active cluster
        cluster.points.forEach(pt => {
          const proj = project3D(pt.x, pt.y, pt.z);
          renderItems.push({
            type: 'point',
            depth: proj.depth,
            screenX: proj.screenX,
            screenY: proj.screenY,
            factor: proj.factor,
            data: pt
          });
        });
        return;
      }

      // Level 1 & Level 3: render all clusters
      cluster.points.forEach(pt => {
        const proj = project3D(pt.x, pt.y, pt.z);
        renderItems.push({
          type: 'point',
          depth: proj.depth,
          screenX: proj.screenX,
          screenY: proj.screenY,
          factor: proj.factor,
          data: pt
        });
      });

      // Centroid billboard in Level 1 and 3
      if (!isNoise) {
        const projC = project3D(cluster.centroid.x, cluster.centroid.y, cluster.centroid.z);
        renderItems.push({
          type: 'centroid',
          depth: projC.depth + 0.1,
          screenX: projC.screenX,
          screenY: projC.screenY,
          factor: projC.factor,
          data: cluster
        });
      }
    });

    // Sort by depth (farthest first)
    renderItems.sort((a, b) => a.depth - b.depth);

    // 4. Draw Depth-Sorted Items
    renderItems.forEach(item => {
      if (item.type === 'point') {
        const pt = item.data as Point3D;
        const isHovered = hoveredPoint?.id === pt.id;
        const isSelected = selectedPoint?.id === pt.id;

        // Size: in Level 2 dots are larger and more distinct
        const baseRadius = activeLevel === 2 ? 7.5 : 4.2;
        const r = Math.max(2.5, baseRadius * item.factor);

        const alpha = Math.min(1.0, Math.max(0.4, 0.75 + item.depth * 0.25));

        // Glow halo
        if (isHovered || isSelected) {
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(item.screenX, item.screenY, r * 3.0, 0, Math.PI * 2);
          ctx.globalAlpha = 0.35;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }

        // Particle Circle
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(item.screenX, item.screenY, r, 0, Math.PI * 2);
        ctx.fill();

        // White rim on particles (exact aesthetic of user Image 1 & Image 2)
        ctx.strokeStyle = isSelected ? '#ffffff' : (isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.65)');
        ctx.lineWidth = isSelected ? 2.5 : (activeLevel === 2 ? 1.5 : 1.0);
        ctx.beginPath();
        ctx.arc(item.screenX, item.screenY, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
      } else if (item.type === 'centroid') {
        const cl = item.data as Cluster3D;
        const isSelected = cl.cluster_id === selectedClusterId;

        const nameText = cl.name.replace(/^Topic\s*\d+:\s*/i, '');
        ctx.font = `600 ${Math.max(10, 12 * item.factor)}px "Plus Jakarta Sans"`;
        const textW = ctx.measureText(nameText).width;
        const cardW = textW + 28;
        const cardH = 22 * item.factor;

        const left = item.screenX - cardW / 2;
        const top = item.screenY - cardH - (10 * item.factor);

        // Card surface
        ctx.fillStyle = isSelected ? 'rgba(28, 38, 56, 0.95)' : 'rgba(15, 20, 31, 0.85)';
        ctx.beginPath();
        ctx.roundRect(left, top, cardW, cardH, 4);
        ctx.fill();

        // Hairline border
        ctx.strokeStyle = isSelected ? cl.color : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Indicator dot
        ctx.fillStyle = cl.color;
        ctx.beginPath();
        ctx.arc(left + 10, top + cardH / 2, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Text
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(nameText, left + 18, top + cardH / 2);
      }
    });

  }, [data3d, yaw, pitch, zoom, activeLevel, selectedClusterId, selectedPoint, selectedGap, hoveredPoint, activeCluster]);

  // Mouse drag orbit controls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !data3d) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      setYaw(prev => prev + dx * 0.008);
      setPitch(prev => Math.max(-1.2, Math.min(1.2, prev + dy * 0.008)));
      return;
    }

    // Hover detection on points
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let foundPt: Point3D | null = null;
    const allPts = activeLevel === 2 && activeCluster 
      ? activeCluster.points 
      : data3d.clusters.flatMap(c => c.points);

    const b = data3d.bounds;
    let midX = (b.min_x + b.max_x) / 2;
    let midY = (b.min_y + b.max_y) / 2;
    let midZ = (b.min_z + b.max_z) / 2;
    let maxSpan = Math.max(b.max_x - b.min_x, b.max_y - b.min_y, b.max_z - b.min_z) || 20;

    if (activeLevel === 2 && activeCluster && activeCluster.points.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
      activeCluster.points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
        if (p.z < minZ) minZ = p.z;
        if (p.z > maxZ) maxZ = p.z;
      });
      midX = (minX + maxX) / 2;
      midY = (minY + maxY) / 2;
      midZ = (minZ + maxZ) / 2;
      const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 0.5);
      maxSpan = span * 1.45;
    }

    const cosY = Math.cos(yaw), sinY = Math.sin(yaw), cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    const cx = rect.width / 2, cy = rect.height / 2;
    const scale = Math.min(rect.width, rect.height) * 0.38;

    for (const pt of allPts) {
      const nx = (pt.x - midX) / (maxSpan / 2);
      const ny = (pt.y - midY) / (maxSpan / 2);
      const nz = (pt.z - midZ) / (maxSpan / 2);

      const x1 = nx * cosY - ny * sinY;
      const y1 = nx * sinY + ny * cosY;
      const z2 = y1 * sinP + nz * cosP;
      const factor = (3.5 / (3.5 - z2 * 0.45)) * zoom;

      const sx = cx + x1 * scale * factor;
      const sy = cy - (y1 * cosP - nz * sinP) * scale * factor;

      const dist = Math.hypot(mouseX - sx, mouseY - sy);
      if (dist <= 14) {
        foundPt = pt;
        break;
      }
    }
    setHoveredPoint(foundPt);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCanvasClick = () => {
    if (hoveredPoint) {
      setSelectedPoint(hoveredPoint);
      if (hoveredPoint.cluster_id > 0) {
        setSelectedClusterId(hoveredPoint.cluster_id);
      }
    }
  };

  // Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.4, Math.min(3.5, z - e.deltaY * 0.0015)));
    setAutoRotate(false);
  };

  if (!data3d) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f141f] p-8 text-center">
        <Compass className="h-8 w-8 text-[#64748b] animate-spin" />
        <h3 className="mt-3 font-serif text-lg text-[#f8fafc]">Loading 3D Spatial Manifold...</h3>
        <p className="mt-1 text-xs text-[#64748b]">Reconstructing high-dimensional topic geometry in 3D coordinate space.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 py-6">
      {/* 3-Level Tactile Navigator Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] pb-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center space-x-2 text-[#38bdf8] font-mono text-xs mb-1">
            <Box className="h-3.5 w-3.5" />
            <span>3D KNOWLEDGE GRAPH MANIFOLD — 3 LEVELS OF DETAIL (LOD)</span>
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#f8fafc] sm:text-3xl">
            {activeLevel === 1 && 'Level 1: Macro Topic Universe in 3D Space'}
            {activeLevel === 2 && `Level 2: Intra-Cluster Constellation — ${activeCluster?.name || 'Cluster'}`}
            {activeLevel === 3 && 'Level 3: Epistemic Voids & Centered Research Gaps'}
          </h2>
          <p className="text-xs text-[#94a3b8]">
            {activeLevel === 1 && 'Global 3D point cloud showing all clusters floating in coordinate space (Dim 1, Dim 2, Dim 3).'}
            {activeLevel === 2 && `Deep zoom into ${activeCluster?.name || 'cluster'}: showing individual publication scatter dots in 3D space.`}
            {activeLevel === 3 && 'Structural white-space void bridges connecting disparate topic clusters across zero cross-citations.'}
          </p>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex items-center rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0f141f] p-1 font-mono text-xs shadow-specular">
          <button
            onClick={() => handleLevelChange(1)}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeLevel === 1
                ? 'bg-[#38bdf8] text-[#080b11] font-semibold shadow-md'
                : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#161e2e]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Level 1: Macro</span>
          </button>
          <button
            onClick={() => handleLevelChange(2)}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeLevel === 2
                ? 'bg-[#10b981] text-[#080b11] font-semibold shadow-md'
                : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#161e2e]'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Level 2: Cluster</span>
          </button>
          <button
            onClick={() => handleLevelChange(3)}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeLevel === 3
                ? 'bg-[#a855f7] text-[#080b11] font-semibold shadow-md'
                : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#161e2e]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Level 3: Voids</span>
          </button>
        </div>
      </div>

      {/* Level 2 Sub-Nav: Cluster Selector Pills */}
      {activeLevel === 2 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[rgba(255,255,255,0.06)]">
          <span className="font-mono text-xs text-[#64748b] whitespace-nowrap">Focus Cluster:</span>
          {clusters.map((c) => {
            const isSelected = c.cluster_id === selectedClusterId;
            return (
              <button
                key={c.cluster_id}
                onClick={() => {
                  setSelectedClusterId(c.cluster_id);
                  if (c.points && c.points.length > 0) {
                    setSelectedPoint(c.points[0]);
                  } else {
                    setSelectedPoint(null);
                  }
                }}
                className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1 text-xs font-mono whitespace-nowrap transition-all ${
                  isSelected
                    ? 'border-[#10b981] bg-[#10b981]/15 text-[#10b981] font-bold shadow-specular'
                    : 'border-[rgba(255,255,255,0.06)] bg-[#0f141f] text-[#94a3b8] hover:border-[rgba(255,255,255,0.14)]'
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name.replace(/^Topic\s*\d+:\s*/i, '').slice(0, 24)}</span>
                <span className="text-[10px] text-[#64748b]">({c.point_count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Level 3 Sub-Nav: Epistemic Void Bridges Selector Pills */}
      {activeLevel === 3 && data3d?.gaps_3d && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[rgba(255,255,255,0.06)]">
          <span className="font-mono text-xs text-[#a855f7] whitespace-nowrap flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Epistemic Voids:</span>
          </span>
          {data3d.gaps_3d.map((g) => {
            const isSelected = selectedGap?.gap_id === g.gap_id;
            return (
              <button
                key={g.gap_id}
                onClick={() => {
                  setSelectedGap(g);
                }}
                className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1 text-xs font-mono whitespace-nowrap transition-all ${
                  isSelected
                    ? 'border-[#a855f7] bg-[#a855f7]/20 text-[#a855f7] font-bold shadow-specular'
                    : 'border-[rgba(255,255,255,0.06)] bg-[#0f141f] text-[#94a3b8] hover:border-[rgba(255,255,255,0.14)]'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-[#a855f7]" />
                <span>GAP #{g.rank}: {g.title.slice(0, 28)}...</span>
                <span className="text-[10px] text-[#eab308]">{(Number(g.uzzi_z_score) || -1.45).toFixed(1)}σ</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main 3D Viewport */}
      <div className="relative h-[650px] w-full overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#080b11] shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        />

        {/* 3D Camera Controls Bar */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0f141f]/90 p-1.5 backdrop-blur-md">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition-colors ${
              autoRotate ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
            title="Auto Orbit Rotation"
          >
            {autoRotate ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>{autoRotate ? 'Orbiting' : 'Orbit'}</span>
          </button>
          <div className="h-4 w-[1px] bg-[rgba(255,255,255,0.08)]" />
          <button
            onClick={() => setZoom(z => Math.min(3.5, z + 0.25))}
            className="rounded p-1 text-[#94a3b8] hover:bg-[#161e2e] hover:text-[#f8fafc]"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.4, z - 0.25))}
            className="rounded p-1 text-[#94a3b8] hover:bg-[#161e2e] hover:text-[#f8fafc]"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setYaw(0.65);
              setPitch(0.45);
              setZoom(1.0);
            }}
            className="rounded p-1 text-[#94a3b8] hover:bg-[#161e2e] hover:text-[#f8fafc]"
            title="Reset 3D View"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="pointer-events-none absolute bottom-4 left-4 max-w-sm rounded-xl border border-[rgba(255,255,255,0.14)] bg-[#0f141f]/95 p-3.5 shadow-2xl backdrop-blur-md space-y-1 font-sans text-xs transition-all"
          >
            <div className="flex items-center space-x-2 font-mono text-[10px]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: hoveredPoint.color }} />
              <span className="text-[#38bdf8]">{hoveredPoint.cluster_name}</span>
              <span className="text-[#64748b]">· {hoveredPoint.year}</span>
              <span className="text-[#eab308] font-bold">{hoveredPoint.citations} cits</span>
            </div>
            <h4 className="font-serif text-sm font-medium text-[#f8fafc] line-clamp-2">
              {hoveredPoint.title}
            </h4>
            <p className="font-mono text-[10px] text-[#94a3b8]">Click point to open deep paper inspector →</p>
          </div>
        )}

        {/* Slide-over Context Drawer for Selected Paper (Level 2 Deep-Dive) */}
        {selectedPoint && (
          <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-[rgba(255,255,255,0.12)] bg-[#111826]/95 backdrop-blur-xl p-6 overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
              <div>
                <span className="font-mono text-[10px] text-[#10b981] uppercase font-bold flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedPoint.color }} />
                  <span>{selectedPoint.cluster_name}</span>
                </span>
                <h3 className="font-serif text-xl font-normal text-[#f8fafc] mt-1">
                  {selectedPoint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="rounded-lg p-1 text-[#64748b] hover:bg-[#161e2e] hover:text-[#f8fafc]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#080b11] p-3 font-mono text-xs space-y-1 text-[#94a3b8]">
              <div>Year: <strong className="text-[#f8fafc]">{selectedPoint.year}</strong></div>
              <div>Citations: <strong className="text-[#eab308]">{selectedPoint.citations}</strong></div>
              <div>Venue: <strong className="text-[#f8fafc]">{selectedPoint.venue || 'Proceedings'}</strong></div>
              <div>Authors: <strong className="text-[#94a3b8]">{Array.isArray(selectedPoint.authors) ? selectedPoint.authors.join(', ') : selectedPoint.authors || 'Listed'}</strong></div>
            </div>

            {selectedPoint.tldr && (
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#64748b] uppercase">Extractive TL;DR</span>
                <p className="text-xs text-[#94a3b8] italic bg-[#080b11] p-3 rounded border border-[rgba(255,255,255,0.04)]">
                  "{selectedPoint.tldr}"
                </p>
              </div>
            )}

            {selectedPoint.abstract && (
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#64748b] uppercase">Full Abstract</span>
                <div className="max-h-48 overflow-y-auto text-xs text-[#cbd5e1] bg-[#080b11] p-3 rounded border border-[rgba(255,255,255,0.04)] leading-relaxed">
                  {selectedPoint.abstract}
                </div>
              </div>
            )}

            {selectedPoint.doi && (
              <a
                href={`https://doi.org/${selectedPoint.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 rounded-lg bg-[#38bdf8] px-4 py-2 font-sans text-xs font-semibold text-[#080b11] hover:bg-[#38bdf8]/90"
              >
                <span>Open Paper DOI</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Slide-over Context Drawer for Selected Gap (Level 3 Void Bridges) */}
        {selectedGap && (
          <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-[rgba(255,255,255,0.12)] bg-[#111826]/95 backdrop-blur-xl p-6 overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
              <div>
                <span className="font-mono text-[10px] text-[#a855f7] uppercase font-bold">
                  EPISTEMIC VOID BRIDGE · RANK #{selectedGap.rank}
                </span>
                <h3 className="font-serif text-xl font-normal text-[#f8fafc] mt-1">
                  {selectedGap.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGap(null)}
                className="rounded-lg p-1 text-[#64748b] hover:bg-[#161e2e] hover:text-[#f8fafc]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#080b11] p-4 font-mono text-xs space-y-1.5">
              <div>Method (M): <strong className="text-[#38bdf8]">{selectedGap.method}</strong></div>
              <div>Benchmark (D): <strong className="text-[#10b981]">{selectedGap.dataset}</strong></div>
              <div>Constraint (L): <strong className="text-[#ea580c]">{selectedGap.limitation}</strong></div>
              <div>Uzzi Novelty z: <strong className="text-[#a855f7]">{(Number(selectedGap.uzzi_z_score) || -1.45).toFixed(2)}σ</strong></div>
            </div>

            <div className="space-y-2 text-xs text-[#94a3b8] leading-relaxed">
              <h5 className="font-mono text-[11px] text-[#f8fafc] uppercase">Gap Formulation</h5>
              <p>{selectedGap.description}</p>
            </div>

            {onNavigateToGrant && (
              <button
                onClick={() => onNavigateToGrant(selectedGap.title)}
                className="flex items-center space-x-1.5 rounded-lg bg-[#a855f7] px-4 py-2 font-sans text-xs font-semibold text-[#080b11] hover:bg-[#a855f7]/90"
              >
                <span>Synthesize Proposal in AI Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
