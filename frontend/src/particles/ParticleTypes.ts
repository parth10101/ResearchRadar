import * as THREE from 'three';

export type ParticleWorldState = 'ATMOSPHERE' | 'FORMING' | 'FORMED' | 'LIVING';

export interface ParticleClusterMeta {
  id: string;
  clusterId: number;
  name: string;
  color: string;
  paperCount: number;
  centroid: THREE.Vector3;
  formationDelay: number;
  formationDuration: number;
}

export interface ParticleTargetData {
  count: number;
  homePositions: Float32Array;
  targetPositions: Float32Array;
  colorsHome: Float32Array;
  colorsTarget: Float32Array;
  delays: Float32Array;
  randomSeeds: Float32Array;
  sizes: Float32Array;
  clusterIds: Float32Array;
  isOutliers: Float32Array;
  clusterMetas: ParticleClusterMeta[];
}
