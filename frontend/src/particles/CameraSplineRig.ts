/**
 * ResearchRadar — CameraSplineRig
 * ===============================
 * Persistent cinematic camera spline rig for post-Epistemic spatial exploration.
 *
 * SCALES:
 *   UNIVERSE ◄► CLUSTER ◄► PAPER ◄► CITATION ◄► EVIDENCE ◄► GAP ◄► DEEP
 *
 * RIGOROUS MATHEMATICAL FORMULATION:
 * - Particle coordinates remain 100% immutable. Zero artificial repositioning.
 * - Resolves the selected cluster's genuine analytical centroid from real data.
 * - Computes FOV-derived approach distance: d = (2 * R_cluster) / (tan(halfFOV) * targetOccupancy).
 * - Approach vector places the selected cluster centroid exactly on the camera's optical axis
 *   (DEAD CENTER OF VIEWPORT at screen NDC (0, 0)).
 * - 360° Cinematic Orbit: Orbits the CAMERA on a smooth circle around the fixed centroid
 *   while keeping camera.lookAt(C_world) continuously locked.
 * - Unselected clusters smoothly recede in opacity (uFocusMode) without translating or rotating.
 */

import * as THREE from 'three';
import { SpatialScale, SpatialJourneyState } from './SpatialJourneyController';
import { RealClusterPoint, RealClusterItem } from '../data/realClusterData';
import { Points3DData } from '../types';

export interface CameraPose {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

export interface ScreenAnchorData {
  scale: SpatialScale;
  screenX: number;
  screenY: number;
  inFront: boolean;
  entityId: string | null;
  worldPos: { x: number; y: number; z: number };
}

export class CameraSplineRig {
  // Current active poses
  private startPose: CameraPose = {
    position: new THREE.Vector3(0.10, 0.08, 5.6),
    lookAt: new THREE.Vector3(-0.35, 0.0, 0.0),
  };

  private targetPose: CameraPose = {
    position: new THREE.Vector3(0.10, 0.08, 5.6),
    lookAt: new THREE.Vector3(-0.35, 0.0, 0.0),
  };

  private controlPoint: THREE.Vector3 = new THREE.Vector3(0.10, 0.08, 5.6);
  private currentPose: CameraPose = {
    position: new THREE.Vector3(0.10, 0.08, 5.6),
    lookAt: new THREE.Vector3(-0.35, 0.0, 0.0),
  };

  private isSplineActive: boolean = false;
  private currentScale: SpatialScale = 'universe';
  private targetScale: SpatialScale = 'universe';
  private activeAnchorPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private activeEntityId: string | null = null;

  // 360° Cinematic Camera Orbit State
  private isOrbiting: boolean = false;
  private orbitMode: '360' | '90' | 'paused' = '360';
  private orbitState: 'idle' | 'approaching' | 'orbiting' | 'settled' = 'idle';
  private orbitCenter: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private orbitRadius: number = 1.65;
  private orbitElevation: number = 0.35;
  private orbitAngle: number = 0.0;
  private orbitElapsed: number = 0.0;
  public static readonly ORBIT_DURATION_SEC: number = 6.0; // Exact 6.0 seconds for 360° revolution

  // Usable 3D Stage Viewport Dimensions (accounts for right-side glass inspector)
  private usableStageWidth: number = 0;
  private fullViewportWidth: number = 1920;
  private fullViewportHeight: number = 1080;

  // Cached scene transformation bounds from ClusterTargetGenerator
  private midX: number = -0.2279;
  private midY: number = -0.3553;
  private midZ: number = -0.1564;
  private worldScale: number = 0.647223;

  public setBoundsAndScale(midX: number, midY: number, midZ: number, worldScale: number) {
    this.midX = midX;
    this.midY = midY;
    this.midZ = midZ;
    this.worldScale = worldScale;
  }

  // Set usable 3D stage width to dynamically center camera framing in the open region
  public setUsableDimensions(stageWidth: number, fullWidth: number, fullHeight: number) {
    this.usableStageWidth = stageWidth;
    this.fullViewportWidth = fullWidth;
    this.fullViewportHeight = fullHeight;
  }

  // Clean 3D projection (no skewed view offsets)
  public applyViewOffset(camera: THREE.PerspectiveCamera, _fullWidth: number, _fullHeight: number) {
    camera.clearViewOffset();
  }

  // Convert analytical coordinates directly to WebGL world space
  // Analytical mapping: Dim 1 -> X, Dim 3 -> Y (vertical), Dim 2 -> Z (depth)
  public toWorldCoords(x: number, y: number, z: number, constellationXOffset: number = -0.95): THREE.Vector3 {
    const wx = (x - this.midX) * this.worldScale + constellationXOffset;
    const wy = (z - this.midZ) * this.worldScale; // Dim 3 -> Y
    const wz = (y - this.midY) * this.worldScale; // Dim 2 -> Z
    return new THREE.Vector3(wx, wy, wz);
  }

  // Derive genuine target pose from real data entities
  public computeTargetPoseForScale(
    scale: SpatialScale,
    state: SpatialJourneyState,
    clusters: RealClusterItem[],
    points: RealClusterPoint[],
    data3d: Points3DData | null
  ): CameraPose {
    const defaultUniversePose: CameraPose = {
      position: new THREE.Vector3(0.10, 0.08, 5.6),
      lookAt: new THREE.Vector3(-0.35, 0.0, 0.0),
    };

    switch (scale) {
      case 'universe': {
        this.activeAnchorPos.set(-0.35, 0.0, 0.0);
        this.activeEntityId = null;
        this.isOrbiting = false;
        return defaultUniversePose;
      }

      case 'cluster': {
        const cid = state.context.clusterId;
        const targetCluster =
          clusters.find((c) => String(c.clusterId) === String(cid) || c.id === String(cid)) ||
          clusters.find((c) => String(c.clusterId) === '3') ||
          clusters[0];

        if (targetCluster && targetCluster.centroid) {
          // 1. Resolve REAL world-space centroid
          const cWorld = this.toWorldCoords(
            targetCluster.centroid.x,
            targetCluster.centroid.y,
            targetCluster.centroid.z
          );
          this.activeAnchorPos.copy(cWorld);
          this.activeEntityId = String(targetCluster.clusterId);

          // 2. Resolve REAL bounding radius
          let maxRadius = 0.22;
          if (targetCluster.points && targetCluster.points.length > 0) {
            targetCluster.points.forEach((pt) => {
              const ptWorld = this.toWorldCoords(pt.x, pt.y, pt.z);
              const dist = ptWorld.distanceTo(cWorld);
              if (dist > maxRadius) maxRadius = dist;
            });
          }

          // 3. FOV-Derived Approach Distance (Camera FOV = 46 deg -> halfFOV = 23 deg, tan(23) = 0.4245)
          const optimalDist = Math.max(1.4, Math.min(2.8, (2 * maxRadius) / (0.849 * 0.48)));
          const optimalElevation = Math.max(0.15, optimalDist * 0.12);

          // 4. Invariant Orbit Center: Centroid of selected cluster is the absolute anchor
          this.orbitCenter.copy(cWorld);
          this.orbitRadius = optimalDist;
          this.orbitElevation = optimalElevation;
          this.orbitAngle = 0.0;
          this.orbitElapsed = 0.0;

          if (typeof window !== 'undefined' && (window as any).__DEV_RIG_LOG !== false) {
            console.log(`[CameraSplineRig] FOCUS -> Cluster ${targetCluster.clusterId}: "${targetCluster.name}"`);
            console.log(`[CameraSplineRig] Analytical Centroid: { x: ${targetCluster.centroid.x}, y: ${targetCluster.centroid.y}, z: ${targetCluster.centroid.z} }`);
            console.log(`[CameraSplineRig] Invariant World Centroid (orbitCenter): (${cWorld.x.toFixed(4)}, ${cWorld.y.toFixed(4)}, ${cWorld.z.toFixed(4)})`);
          }

          // 5. Target Pose: Optical axis points DIRECTLY at centroid
          // Centroid is at DEAD CENTER of viewport (NDC 0,0)
          return {
            position: new THREE.Vector3(cWorld.x, cWorld.y + optimalElevation, cWorld.z + optimalDist),
            lookAt: new THREE.Vector3(cWorld.x, cWorld.y, cWorld.z),
          };
        }
        return defaultUniversePose;
      }

      case 'paper': {
        this.isOrbiting = false;
        const pid = state.context.paperId;
        const targetPaper = points.find((p) => p.id === pid) || points[0];

        if (targetPaper) {
          const pWorld = this.toWorldCoords(targetPaper.x, targetPaper.y, targetPaper.z);
          this.activeAnchorPos.copy(pWorld);
          this.activeEntityId = targetPaper.id;

          return {
            position: new THREE.Vector3(pWorld.x, pWorld.y + 0.10, pWorld.z + 1.25),
            lookAt: new THREE.Vector3(pWorld.x, pWorld.y, pWorld.z),
          };
        }
        return defaultUniversePose;
      }

      case 'citation': {
        this.isOrbiting = false;
        const pid = state.context.paperId;
        const targetPaper = points.find((p) => p.id === pid) || points.find((p) => p.citations && p.citations > 50) || points[0];

        if (targetPaper) {
          const pWorld = this.toWorldCoords(targetPaper.x, targetPaper.y, targetPaper.z);
          this.activeAnchorPos.copy(pWorld);
          this.activeEntityId = targetPaper.id;

          return {
            position: new THREE.Vector3(pWorld.x + 0.25, pWorld.y + 0.20, pWorld.z + 1.8),
            lookAt: new THREE.Vector3(pWorld.x, pWorld.y, pWorld.z),
          };
        }
        return defaultUniversePose;
      }

      case 'evidence': {
        this.isOrbiting = false;
        const pid = state.context.evidenceId || state.context.paperId;
        const targetPaper = points.find((p) => p.id === pid) || points[0];

        if (targetPaper) {
          const pWorld = this.toWorldCoords(targetPaper.x, targetPaper.y, targetPaper.z);
          this.activeAnchorPos.copy(pWorld);
          this.activeEntityId = targetPaper.id;

          return {
            position: new THREE.Vector3(pWorld.x, pWorld.y + 0.08, pWorld.z + 1.15),
            lookAt: new THREE.Vector3(pWorld.x, pWorld.y, pWorld.z),
          };
        }
        return defaultUniversePose;
      }

      case 'gap': {
        this.isOrbiting = false;
        if (data3d && data3d.gaps_3d && data3d.gaps_3d.length > 0) {
          const gap = data3d.gaps_3d[0];
          const gWorld = this.toWorldCoords(gap.centroid.x, gap.centroid.y, gap.centroid.z);
          this.activeAnchorPos.copy(gWorld);
          this.activeEntityId = gap.gap_id;

          return {
            position: new THREE.Vector3(gWorld.x, gWorld.y + 0.15, gWorld.z + 1.8),
            lookAt: new THREE.Vector3(gWorld.x, gWorld.y, gWorld.z),
          };
        }

        const c1 = clusters[0];
        const c2 = clusters[1] || clusters[0];
        if (c1 && c2 && c1.centroid && c2.centroid) {
          const midAx = (c1.centroid.x + c2.centroid.x) / 2;
          const midAy = (c1.centroid.y + c2.centroid.y) / 2;
          const midAz = (c1.centroid.z + c2.centroid.z) / 2;
          const gWorld = this.toWorldCoords(midAx, midAy, midAz);
          this.activeAnchorPos.copy(gWorld);
          this.activeEntityId = 'gap_inter_cluster';

          return {
            position: new THREE.Vector3(gWorld.x, gWorld.y + 0.15, gWorld.z + 2.0),
            lookAt: new THREE.Vector3(gWorld.x, gWorld.y, gWorld.z),
          };
        }
        return defaultUniversePose;
      }

      case 'deep': {
        this.isOrbiting = false;
        const currentTarget = this.targetPose;
        return {
          position: new THREE.Vector3(
            currentTarget.position.x,
            currentTarget.position.y,
            Math.max(0.9, currentTarget.position.z - 0.35)
          ),
          lookAt: currentTarget.lookAt.clone(),
        };
      }

      default:
        return defaultUniversePose;
    }
  }

  // Initiate smooth curved 3D Bézier transition
  public startTransition(
    fromPose: CameraPose,
    toPose: CameraPose,
    fromScale: SpatialScale,
    toScale: SpatialScale
  ) {
    this.isOrbiting = false;

    this.startPose = {
      position: fromPose.position.clone(),
      lookAt: fromPose.lookAt.clone(),
    };

    this.targetPose = {
      position: toPose.position.clone(),
      lookAt: toPose.lookAt.clone(),
    };

    this.currentScale = fromScale;
    this.targetScale = toScale;
    this.isSplineActive = true;

    // Calculate arched Bézier control point for natural trajectory curve
    const midPos = new THREE.Vector3()
      .addVectors(fromPose.position, toPose.position)
      .multiplyScalar(0.5);

    const dist = fromPose.position.distanceTo(toPose.position);
    // Graceful elevation curve during flight
    const arcHeight = Math.min(0.45, dist * 0.12);
    midPos.y += arcHeight;
    midPos.z += arcHeight * 0.3;

    this.controlPoint = midPos;
  }

  // Sample camera pose along the quadratic Bézier spline
  public evaluate(progress: number): CameraPose {
    const s = Math.min(1.0, Math.max(0.0, progress));
    const invS = 1.0 - s;

    const p0 = this.startPose.position;
    const pCtrl = this.controlPoint;
    const p1 = this.targetPose.position;

    const posX = invS * invS * p0.x + 2 * invS * s * pCtrl.x + s * s * p1.x;
    const posY = invS * invS * p0.y + 2 * invS * s * pCtrl.y + s * s * p1.y;
    const posZ = invS * invS * p0.z + 2 * invS * s * pCtrl.z + s * s * p1.z;

    // Smooth look-at linear blend directly toward genuine centroid
    const lookX = invS * this.startPose.lookAt.x + s * this.targetPose.lookAt.x;
    const lookY = invS * this.startPose.lookAt.y + s * this.targetPose.lookAt.y;
    const lookZ = invS * this.startPose.lookAt.z + s * this.targetPose.lookAt.z;

    this.currentPose.position.set(posX, posY, posZ);
    this.currentPose.lookAt.set(lookX, lookY, lookZ);

    if (s >= 1.0) {
      this.isSplineActive = false;
      this.currentScale = this.targetScale;
      // If we arrived at the cluster scale, initiate the deterministic 6.0s cluster orbit
      if (this.targetScale === 'cluster') {
        this.isOrbiting = true;
        this.orbitElapsed = 0.0;
        this.orbitAngle = 0.0;
        this.orbitState = 'orbiting';
      }
    }

    return this.currentPose;
  }

  // Deterministic 6.0-second Invariant Cluster Centroid Orbit Evaluation
  // Camera moves in exact 360° revolution while camera.lookAt(orbitCenter) remains strictly locked
  public evaluateOrbit(dt: number): CameraPose {
    if (this.orbitState === 'orbiting') {
      if (this.orbitMode === '90') {
        // Test 1: 90° Arc over 1.5 seconds (0s=0°, 1.5s=90°)
        const test90Duration = 1.5;
        this.orbitElapsed = Math.min(test90Duration, this.orbitElapsed + dt);
        const progress90 = this.orbitElapsed / test90Duration;
        this.orbitAngle = progress90 * (Math.PI / 2);

        if (this.orbitElapsed >= test90Duration) {
          this.isOrbiting = false;
          this.orbitState = 'settled';
        }
      } else if (this.orbitMode === '360') {
        // Test 2 & Production: Deterministic 6.0-second 360° revolution
        // 0.0s = 0°, 1.5s = 90°, 3.0s = 180°, 4.5s = 270°, 6.0s = 360°
        this.orbitElapsed = Math.min(CameraSplineRig.ORBIT_DURATION_SEC, this.orbitElapsed + dt);
        const orbitProgress = this.orbitElapsed / CameraSplineRig.ORBIT_DURATION_SEC;
        this.orbitAngle = orbitProgress * 2 * Math.PI;

        if (this.orbitElapsed >= CameraSplineRig.ORBIT_DURATION_SEC) {
          this.isOrbiting = false; // Complete exact full revolution
          this.orbitState = 'settled';
          this.orbitAngle = 0.0; // Settle at 0°/360° rest position facing cluster
        }
      }
    }

    const ox = this.orbitCenter.x + Math.sin(this.orbitAngle) * this.orbitRadius;
    const oy = this.orbitCenter.y + this.orbitElevation;
    const oz = this.orbitCenter.z + Math.cos(this.orbitAngle) * this.orbitRadius;

    this.currentPose.position.set(ox, oy, oz);
    this.currentPose.lookAt.copy(this.orbitCenter); // ALWAYS locked on centroid

    return this.currentPose;
  }

  // Trigger / Replay Orbit Test Modes
  public startOrbit(mode: '360' | '90' = '360') {
    this.orbitMode = mode;
    this.orbitElapsed = 0.0;
    this.orbitAngle = 0.0;
    this.isOrbiting = true;
    this.orbitState = 'orbiting';
  }

  public setOrbitMode(mode: '360' | '90' | 'paused') {
    this.orbitMode = mode;
    if (mode === '90' && this.orbitAngle >= Math.PI / 2) {
      this.orbitElapsed = 0.0;
      this.orbitAngle = 0.0;
      this.isOrbiting = true;
      this.orbitState = 'orbiting';
    }
  }

  public resetOrbitAngle() {
    this.orbitElapsed = 0.0;
    this.orbitAngle = 0.0;
    this.isOrbiting = true;
    this.orbitState = 'orbiting';
  }

  public getOrbitMode(): '360' | '90' | 'paused' {
    return this.orbitMode;
  }

  public getOrbitState(): 'idle' | 'approaching' | 'orbiting' | 'settled' {
    return this.orbitState;
  }

  public getOrbitAngle(): number {
    return this.orbitAngle;
  }

  public getOrbitProgress(): number {
    if (this.orbitMode === '90') {
      return Math.min(1.0, this.orbitElapsed / 1.5);
    }
    return Math.min(1.0, this.orbitElapsed / CameraSplineRig.ORBIT_DURATION_SEC);
  }

  public getOrbitCenter(): THREE.Vector3 {
    return this.orbitCenter.clone();
  }

  // Project active 3D research entity anchor to 2D viewport coordinates
  public projectActiveAnchorToScreen(
    camera: THREE.Camera,
    viewportWidth: number,
    viewportHeight: number
  ): ScreenAnchorData | null {
    if (this.activeAnchorPos.lengthSq() < 1e-4) return null;

    const ndc = this.activeAnchorPos.clone().project(camera);
    const inFront = ndc.z < 1.0 && ndc.z > -1.0;

    const screenX = (ndc.x * 0.5 + 0.5) * viewportWidth;
    const screenY = (-(ndc.y * 0.5) + 0.5) * viewportHeight;

    const data: ScreenAnchorData = {
      scale: this.targetScale,
      screenX,
      screenY,
      inFront,
      entityId: this.activeEntityId,
      worldPos: {
        x: this.activeAnchorPos.x,
        y: this.activeAnchorPos.y,
        z: this.activeAnchorPos.z,
      },
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('rr-spatial-anchor', {
          detail: data,
        })
      );
    }

    return data;
  }

  public getIsSplineActive(): boolean {
    return this.isSplineActive;
  }

  public getIsOrbiting(): boolean {
    return this.isOrbiting;
  }

  public getIsSettled(): boolean {
    return this.orbitState === 'settled';
  }

  public getCurrentPose(): CameraPose {
    return this.currentPose;
  }

  public getTargetScale(): SpatialScale {
    return this.targetScale;
  }
}

// Global Singleton Rig Instance
export const cameraSplineRig = new CameraSplineRig();
