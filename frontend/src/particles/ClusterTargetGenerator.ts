import * as THREE from 'three';
import { ALL_REAL_POINTS, REAL_CLUSTERS, RealClusterPoint, RealClusterItem } from '../data/realClusterData';
import { ParticleClusterMeta, ParticleTargetData } from './ParticleTypes';
import { Points3DData } from '../types';

export const TOTAL_PARTICLE_COUNT = ALL_REAL_POINTS.length;

// Universal adapter from API Points3DData to internal cluster format
export function convertPoints3DData(data3d: Points3DData | null): { points: RealClusterPoint[]; clusters: RealClusterItem[] } {
  if (!data3d || !data3d.clusters || data3d.clusters.length === 0) {
    return { points: [], clusters: [] };
  }

  const clusters: RealClusterItem[] = [];
  const points: RealClusterPoint[] = [];

  data3d.clusters.forEach((c) => {
    const cPoints: RealClusterPoint[] = (c.points || []).map((p) => ({
      id: p.id,
      x: p.x,
      y: p.y,
      z: p.z,
      title: p.title,
      citations: p.citations || 0,
      doi: p.doi || '',
      year: p.year || 2024,
      clusterId: c.cluster_id,
      color: p.color || c.color,
      authors: p.authors || [],
      venue: p.venue || '',
      tldr: p.tldr || '',
      abstract: p.abstract || '',
    }));

    clusters.push({
      id: String(c.cluster_id),
      clusterId: c.cluster_id,
      name: c.name,
      color: c.color,
      pointCount: cPoints.length,
      centroid: c.centroid || { x: 0, y: 0, z: 0 },
      points: cPoints,
    });

    points.push(...cPoints);
  });

  if (points.length === 0) {
    return { points: [], clusters: [] };
  }

  return { points, clusters };
}

// Compute authentic bounds across points in direct 3D UMAP space
export function getEmbeddingBoundsAndScale(points: RealClusterPoint[] = ALL_REAL_POINTS) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  points.forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  });

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const spanZ = maxZ - minZ || 1;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const midZ = (minZ + maxZ) / 2;

  const maxSpan = Math.max(spanX, spanY, spanZ);
  const worldScale = 3.2 / maxSpan;

  return { midX, midY, midZ, worldScale };
}

/**
 * Maximum number of particles rendered in the 3D WebGL particle world.
 * Keeping this invariant at 300 ensures the landing-page stardust density
 * never changes regardless of corpus size, eliminating all count-related
 * transition flashes. The studio data panels (side panel, paper list) still
 * use the full N-paper dataset — only the WebGL background is capped.
 */
export const PARTICLE_WORLD_MAX = 300;

/**
 * Proportionally sample up to PARTICLE_WORLD_MAX representative points.
 * Each cluster contributes a quota ∝ its size, prioritising high-citation
 * (landmark) papers so the most prominent nodes are always visible.
 * Outlier papers (clusterId === -1) are excluded — they're not needed
 * for the 3D background and add visual noise.
 */
export function sampleRepresentativePoints(
  points: RealClusterPoint[],
  clusters: RealClusterItem[],
  max: number = PARTICLE_WORLD_MAX
): RealClusterPoint[] {
  if (points.length <= max) return points;

  // Group by cluster id
  const byCluster = new Map<number, RealClusterPoint[]>();
  for (const pt of points) {
    const cid = pt.clusterId ?? -1;
    if (!byCluster.has(cid)) byCluster.set(cid, []);
    byCluster.get(cid)!.push(pt);
  }

  // Total non-outlier papers for proportional allocation
  const nonOutlierTotal = points.filter(p => (p.clusterId ?? -1) !== -1).length;

  const result: RealClusterPoint[] = [];

  // Allocate quota per real cluster; sort desc by citations (landmark first)
  for (const cluster of clusters) {
    if (cluster.clusterId === -1) continue; // outliers excluded
    const cPts = byCluster.get(cluster.clusterId) ?? [];
    if (cPts.length === 0) continue;
    const proportion = cPts.length / Math.max(1, nonOutlierTotal);
    const quota = Math.max(1, Math.round(proportion * max));
    const sorted = [...cPts].sort((a, b) => (b.citations || 0) - (a.citations || 0));
    result.push(...sorted.slice(0, quota));
  }

  // Trim to exactly max
  return result.slice(0, max);
}


export function generateAstraParticleData(
  points: RealClusterPoint[] = ALL_REAL_POINTS,
  clusters: RealClusterItem[] = REAL_CLUSTERS
): ParticleTargetData {
  const count = points.length;

  if (count === 0) {
    return {
      count: 0,
      homePositions: new Float32Array(0),
      targetPositions: new Float32Array(0),
      colorsHome: new Float32Array(0),
      colorsTarget: new Float32Array(0),
      delays: new Float32Array(0),
      randomSeeds: new Float32Array(0),
      sizes: new Float32Array(0),
      clusterIds: new Float32Array(0),
      isOutliers: new Float32Array(0),
      clusterMetas: [],
    };
  }

  const homePositions = new Float32Array(count * 3);
  const targetPositions = new Float32Array(count * 3);
  const colorsHome = new Float32Array(count * 3);
  const colorsTarget = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const randomSeeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const clusterIds = new Float32Array(count);
  const isOutliers = new Float32Array(count);

  const { midX, midY, midZ, worldScale } = getEmbeddingBoundsAndScale(points);

  // Process cluster centroids
  const clusterMetas: ParticleClusterMeta[] = [];
  clusters.forEach((c, cIdx) => {
    // Exact mapping: Dim 1 -> X, Dim 3 -> Y (vertical up), Dim 2 -> Z (depth)
    const cx = (c.centroid.x - midX) * worldScale;
    const cy = (c.centroid.z - midZ) * worldScale;
    const cz = (c.centroid.y - midY) * worldScale;

    // Subtle coherent departure wave offset (tight range 0.04 to 0.14)
    const waveDelay = c.clusterId === -1 ? 0.10 : 0.04 + (cIdx / Math.max(1, clusters.length)) * 0.09;

    clusterMetas.push({
      id: c.id,
      clusterId: c.clusterId,
      name: c.name,
      color: c.color,
      paperCount: c.pointCount,
      centroid: new THREE.Vector3(cx, cy, cz),
      formationDelay: waveDelay,
      formationDuration: 0.85,
    });
  });

  // Precompute highest-citation paper index per cluster to guarantee prominent landmark nucleus
  const maxCitPerCluster: Record<number, { maxCit: number; index: number }> = {};
  points.forEach((pt, idx) => {
    const cid = pt.clusterId ?? -1;
    if (cid >= 0) {
      const c = pt.citations || 0;
      if (!maxCitPerCluster[cid] || c > maxCitPerCluster[cid].maxCit) {
        maxCitPerCluster[cid] = { maxCit: c, index: idx };
      }
    }
  });

  // PRESERVE EXACT ORIGINAL LANDING-PAGE COMPOSITION & INITIAL POSITIONS
  points.forEach((pt, i) => {
    const i3 = i * 3;
    const cid = pt.clusterId ?? -1;
    const isOutlier = cid === -1;
    const isLandmark = !isOutlier && maxCitPerCluster[cid]?.index === i;
    const colorHex = pt.color || (isOutlier ? '#aaaaaa' : '#00E5FF');
    const cCol = new THREE.Color(colorHex);

    // Target position: exact authentic UMAP 3D embedding (Dim 1 -> X, Dim 3 -> Y, Dim 2 -> Z)
    const tx = (pt.x - midX) * worldScale;
    const ty = (pt.z - midZ) * worldScale;
    const tz = (pt.y - midY) * worldScale;

    targetPositions[i3] = tx;
    targetPositions[i3 + 1] = ty;
    targetPositions[i3 + 2] = tz;

    // Home position: Full-screen atmospheric golden-angle stardust cloud
    // Spread across entire viewport (left + right) so all 300 particles are clearly visible
    const HOME_COUNT = PARTICLE_WORLD_MAX;
    const phi = i * 137.5 * (Math.PI / 180);
    const radiusNorm = Math.sqrt((i + 1) / HOME_COUNT);
    // Wide spread so particles are distributed across full canvas, not just a small patch
    const hx = Math.cos(phi) * radiusNorm * 4.8 + (Math.sin(i * 1.7) * 1.0);
    const hy = Math.sin(phi) * radiusNorm * 3.0 + (Math.cos(i * 2.1) * 0.6);
    const hz = ((i / HOME_COUNT) - 0.5) * 4.0 + (Math.sin(i * 3.3) * 0.8);

    homePositions[i3] = hx;
    homePositions[i3 + 1] = hy;
    homePositions[i3 + 2] = hz;

    // Home color: Bright celestial stardust — high luminance so they are CLEARLY VISIBLE
    const starLum = 0.85 + Math.sin(i * 0.73) * 0.15; // 0.70 to 1.0 range, clearly bright
    const warmBias = 0.04 * Math.sin(i * 0.41); // slight blue-white temperature variation
    colorsHome[i3]     = Math.min(1.0, 0.88 * starLum + warmBias);
    colorsHome[i3 + 1] = Math.min(1.0, 0.93 * starLum);
    colorsHome[i3 + 2] = Math.min(1.0, 1.00 * starLum);

    // Target color: authentic cluster color from UMAP reference
    colorsTarget[i3] = cCol.r;
    colorsTarget[i3 + 1] = cCol.g;
    colorsTarget[i3 + 2] = cCol.b;

    // Tight, coherent delay (spread over 0.0 to 0.14 normalized progress)
    const clusterMeta = clusterMetas.find((m) => m.clusterId === cid);
    const baseDelay = clusterMeta ? clusterMeta.formationDelay : 0.08;
    const jitter = ((i * 13) % 100) / 100 * 0.05;
    delays[i] = Math.min(0.14, baseDelay + jitter);

    randomSeeds[i] = ((i * 9301 + 49297) % 233280) / 233280;
    // Quantitative Scientometric Node Sizing (VOSviewer citation scaling: van Eck & Waltman 2010)
    const cit = pt.citations || 0;
    // VOSviewer-style sqrt citation scaling: creates clearly visible size variation
    // Low-cite papers: ~1.0, average-cite: ~1.8, high-cite: ~2.8, landmark: ~3.5
    const citBonus = Math.min(2.5, Math.sqrt(cit) * 0.22);
    sizes[i] = isLandmark ? 3.5 : (isOutlier ? 0.85 : 1.0 + citBonus);
    clusterIds[i] = cid;
    isOutliers[i] = isOutlier ? 1.0 : 0.0;
  });

  return {
    count,
    homePositions,
    targetPositions,
    colorsHome,
    colorsTarget,
    delays,
    randomSeeds,
    sizes,
    clusterIds,
    isOutliers,
    clusterMetas,
  };
}
