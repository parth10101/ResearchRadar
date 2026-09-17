import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { generateAstraParticleData, getEmbeddingBoundsAndScale, convertPoints3DData, sampleRepresentativePoints, PARTICLE_WORLD_MAX } from './ClusterTargetGenerator';
import { particleVertexShader, particleFragmentShader } from './ParticleShaders';
import { ALL_REAL_POINTS, REAL_CLUSTERS, SEMANTIC_EDGES, RealClusterPoint } from '../data/realClusterData';
import { Points3DData } from '../types';

interface Props {
  viewMode: 'hero' | 'studio';
  isTransitioning?: boolean;
  activeTab?: string;
  selectedClusterId?: string | null;
  onSelectCluster?: (id: string) => void;
  activeLayer?: number;
  points3dData?: Points3DData | null;
}

// Module-level synchronization state
const astraState = {
  viewMode: 'hero',
  activeTab: 'archipelago',
  isTransitioning: false,
  selectedClusterId: null as string | null,
};

export const AstraParticleWorld: React.FC<Props> = ({
  viewMode,
  isTransitioning = false,
  activeTab = 'archipelago',
  selectedClusterId = null,
  onSelectCluster,
  activeLayer = 1,
  points3dData = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  astraState.viewMode = viewMode;
  astraState.activeTab = activeTab;
  astraState.isTransitioning = isTransitioning;
  astraState.selectedClusterId = selectedClusterId;

  const onSelectClusterRef = useRef(onSelectCluster);
  onSelectClusterRef.current = onSelectCluster;

  const activeLayerRef = useRef(activeLayer);
  activeLayerRef.current = activeLayer;

  const points3dDataRef = useRef(points3dData);
  points3dDataRef.current = points3dData;
  const updateGeometryRef = useRef<((d: Points3DData | null) => void) | null>(null);
  const activeClusterMetasRef = useRef<any[]>([]);

  const orbitAngleYRef = useRef(-0.45);
  const orbitAngleXRef = useRef(0.28);
  const isDraggingRef = useRef(false);
  const isAutoRotatingRef = useRef(true);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Hovered paper inspection state
  const [hoveredPaper, setHoveredPaper] = useState<RealClusterPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Single Primary WebGL Renderer (Shared Common Canvas)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // 2. Deep Obsidian Ambient Background Quad
    const bgUniforms = {
      uT: { value: 0 },
      uR: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uM: { value: new THREE.Vector2(0.5, 0.5) },
      uProgress: { value: 0.0 },
    };

    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: bgUniforms,
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        precision highp float;
        uniform float uT;
        uniform vec2 uR;
        uniform vec2 uM;
        uniform float uProgress;

        float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float n(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(h(i), h(i+vec2(1,0)), u.x),
                     mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0; float a = 0.5;
          mat2 r = mat2(0.80, 0.60, -0.60, 0.80);
          for(int i=0; i<4; i++) { v += a * n(p); p = r*p*2.0; a *= 0.5; }
          return v;
        }
        void main() {
          vec2 p = (gl_FragCoord.xy - 0.5 * uR) / min(uR.x, uR.y);
          float t = uT * 0.024;
          vec2 q = vec2(fbm(p + vec2(t*0.2, t*0.1)), fbm(p + vec2(-t*0.15, t*0.25)));
          float f = fbm(p + q*1.3 + vec2(t*0.06, -t*0.04));

          // 1. Dark obsidian ambient stardust space for Hero Landing
          // 1. Dark obsidian ambient stardust space for all views (Universal dark cosmic canvas)
          vec3 cBase = vec3(0.022, 0.025, 0.035);
          vec3 cMid  = vec3(0.035, 0.042, 0.062);
          vec3 cGlow = vec3(0.08, 0.030, 0.012);
          vec3 cCyan = vec3(0.01, 0.045, 0.075);

          vec3 colDark = mix(cBase, cMid, f * 1.1);
          colDark += cGlow * pow(max(0.0, f - 0.38), 2.2) * 1.3;
          colDark += cCyan * pow(max(0.0, 1.0 - length(p)*0.85), 2.0) * 0.32;
          colDark *= (1.0 - smoothstep(0.4, 1.6, length(p)));

          gl_FragColor = vec4(colDark, 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const bgScene = new THREE.Scene();
    bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMaterial));

    let currentPoints: RealClusterPoint[] = [];

    const buildGeometryFromData = (data: Points3DData | null) => {
      const { points: rawPoints, clusters } = convertPoints3DData(data);
      // For initial hero background stardust when no dataset is loaded yet:
      const points = rawPoints.length > 0
        ? sampleRepresentativePoints(rawPoints, clusters, PARTICLE_WORLD_MAX)
        : sampleRepresentativePoints(ALL_REAL_POINTS, REAL_CLUSTERS, PARTICLE_WORLD_MAX);
      currentPoints = points;
      const pData = generateAstraParticleData(
        points,
        rawPoints.length > 0 ? clusters : REAL_CLUSTERS
      );
      activeClusterMetasRef.current = pData.clusterMetas;

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pData.homePositions, 3));
      geo.setAttribute('aTargetPosition', new THREE.BufferAttribute(pData.targetPositions, 3));
      geo.setAttribute('aColorHome', new THREE.BufferAttribute(pData.colorsHome, 3));
      geo.setAttribute('aColorTarget', new THREE.BufferAttribute(pData.colorsTarget, 3));
      geo.setAttribute('aDelay', new THREE.BufferAttribute(pData.delays, 1));
      geo.setAttribute('aRandom', new THREE.BufferAttribute(pData.randomSeeds, 1));
      geo.setAttribute('aSize', new THREE.BufferAttribute(pData.sizes, 1));
      geo.setAttribute('aClusterId', new THREE.BufferAttribute(pData.clusterIds, 1));
      geo.setAttribute('aIsOutlier', new THREE.BufferAttribute(pData.isOutliers, 1));
      return { geo, pData };
    };

    const initialBuild = buildGeometryFromData(points3dDataRef.current);
    const ptsGeo = initialBuild.geo;

    const particleUniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouseWorld: { value: new THREE.Vector2(999, 999) },
      uBaseSize: { value: 1.0 },
      uDpr: { value: Math.min(window.devicePixelRatio, 2.0) },
      uConstellationX: { value: -1.25 }, // Left ~54% offset in studio mode (matching Reference Image)
      uConstellationMatrix: { value: new THREE.Matrix4() },
      uActiveClusterId: { value: -999.0 },
      uFocusMode: { value: 0.0 },
      uFocusClusterCenter: { value: new THREE.Vector3(0, 0, 0) },
      uFocusRotationMatrix: { value: new THREE.Matrix4() },
    };

    const ptsMat = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
    });

    const ptsMesh = new THREE.Points(ptsGeo, ptsMat);
    ptsMesh.renderOrder = 999; // Always render particles in front of coordinate grids
    scene.add(ptsMesh);

    // In-place attribute updates: NEVER dispose geometry or reset transitionClock mid-flight
    updateGeometryRef.current = (newData: Points3DData | null) => {
      const { points: rawPoints, clusters } = convertPoints3DData(newData);
      const points = rawPoints.length > 0
        ? sampleRepresentativePoints(rawPoints, clusters, PARTICLE_WORLD_MAX)
        : sampleRepresentativePoints(ALL_REAL_POINTS, REAL_CLUSTERS, PARTICLE_WORLD_MAX);
      currentPoints = points;
      const pData = generateAstraParticleData(
        points,
        rawPoints.length > 0 ? clusters : REAL_CLUSTERS
      );
      activeClusterMetasRef.current = pData.clusterMetas;

      const targetPosAttr = ptsGeo.getAttribute('aTargetPosition') as THREE.BufferAttribute;
      const colorTargetAttr = ptsGeo.getAttribute('aColorTarget') as THREE.BufferAttribute;
      const delayAttr = ptsGeo.getAttribute('aDelay') as THREE.BufferAttribute;
      const sizeAttr = ptsGeo.getAttribute('aSize') as THREE.BufferAttribute;
      const clusterIdAttr = ptsGeo.getAttribute('aClusterId') as THREE.BufferAttribute;
      const isOutlierAttr = ptsGeo.getAttribute('aIsOutlier') as THREE.BufferAttribute;

      if (targetPosAttr && pData.targetPositions.length === targetPosAttr.array.length) {
        targetPosAttr.copyArray(pData.targetPositions);
        targetPosAttr.needsUpdate = true;
      }
      if (colorTargetAttr && pData.colorsTarget.length === colorTargetAttr.array.length) {
        colorTargetAttr.copyArray(pData.colorsTarget);
        colorTargetAttr.needsUpdate = true;
      }
      if (delayAttr && pData.delays.length === delayAttr.array.length) {
        delayAttr.copyArray(pData.delays);
        delayAttr.needsUpdate = true;
      }
      if (sizeAttr && pData.sizes.length === sizeAttr.array.length) {
        sizeAttr.copyArray(pData.sizes);
        sizeAttr.needsUpdate = true;
      }
      if (clusterIdAttr && pData.clusterIds.length === clusterIdAttr.array.length) {
        clusterIdAttr.copyArray(pData.clusterIds);
        clusterIdAttr.needsUpdate = true;
      }
      if (isOutlierAttr && pData.isOutliers.length === isOutlierAttr.array.length) {
        isOutlierAttr.copyArray(pData.isOutliers);
        isOutlierAttr.needsUpdate = true;
      }
    };

    // 4. Subtle 3D Metric Coordinate Frame on Dark Cosmic Canvas
    const gridGroup = new THREE.Group();
    gridGroup.position.set(0, 0, 0);
    gridGroup.renderOrder = 0;
    scene.add(gridGroup);

    const boxW = 5.6;
    const boxH = 4.4;
    const boxD = 5.6;
    const floorY = -boxH / 2;
    const backZ = -boxD / 2;
    const sideX = -boxW / 2;

    // 4.1 Crisp Subtle Grid Lines on Dark Background (#334155 / #1e293b)
    const gridLineColor = 0x334155;
    const gridSecondaryColor = 0x1e293b;

    const floorGrid = new THREE.GridHelper(boxW, 10, gridLineColor, gridSecondaryColor);
    floorGrid.position.y = floorY + 0.005;
    (floorGrid.material as THREE.Material).transparent = true;
    (floorGrid.material as THREE.Material).opacity = 0.22;
    gridGroup.add(floorGrid);

    const backGrid = new THREE.GridHelper(boxW, 10, gridLineColor, gridSecondaryColor);
    backGrid.position.set(0, 0, backZ + 0.005);
    backGrid.rotation.x = Math.PI / 2;
    (backGrid.material as THREE.Material).transparent = true;
    (backGrid.material as THREE.Material).opacity = 0.22;
    gridGroup.add(backGrid);

    const sideGrid = new THREE.GridHelper(boxD, 10, gridLineColor, gridSecondaryColor);
    sideGrid.position.set(sideX + 0.005, 0, 0);
    sideGrid.rotation.z = Math.PI / 2;
    (sideGrid.material as THREE.Material).transparent = true;
    (sideGrid.material as THREE.Material).opacity = 0.22;
    gridGroup.add(sideGrid);

    // 4.2 Clean Coordinate Bounding Box Frame
    const boxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
    const boxWire = new THREE.WireframeGeometry(boxGeo);
    const boxLineMat = new THREE.LineBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.20,
    });
    const boxMesh = new THREE.LineSegments(boxWire, boxLineMat);
    gridGroup.add(boxMesh);

    // 4.3 High-Legibility Axis Text Sprites matching Dark Cosmic Canvas (#cbd5e1 / #64748b)
    const createAxisSprite = (title: string, ticks: string = '') => {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 128;
      const ctx = cv.getContext('2d')!;
      ctx.font = '700 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, 256, 44);

      if (ticks) {
        ctx.font = '500 24px -apple-system, BlinkMacSystemFont, monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(ticks, 256, 92);
      }

      const tex = new THREE.CanvasTexture(cv);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.85 });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(2.0, 0.50, 1.0);
      return sp;
    };

    const spDim1 = createAxisSprite('Dim 1', '-6   -4   -2    0    2');
    spDim1.position.set(0, floorY - 0.35, boxD / 2 + 0.45);
    gridGroup.add(spDim1);

    const spDim2 = createAxisSprite('Dim 2', '-5    0    5');
    spDim2.position.set(boxW / 2 + 0.45, floorY - 0.35, 0);
    gridGroup.add(spDim2);

    const spDim3 = createAxisSprite('Dim 3', '4   2   0  -2  -4');
    spDim3.position.set(sideX - 0.45, 0, backZ - 0.30);
    gridGroup.add(spDim3);

    const { midX, midY, midZ, worldScale } = getEmbeddingBoundsAndScale();

    const edgeUniforms = {
      uActiveClusterId: particleUniforms.uActiveClusterId,
      uOpacity: { value: 0.0 },
    };

    // 4.5 Selective Semantic Constellation Filaments (NO GLOBAL SPIDERWEB)
    // Filaments illuminate ONLY when a cluster is actively selected
    const edgeCount = SEMANTIC_EDGES.length;
    const edgePos = new Float32Array(edgeCount * 2 * 3);
    const edgeColors = new Float32Array(edgeCount * 2 * 3);
    const edgeClusterIds = new Float32Array(edgeCount * 2);

    SEMANTIC_EDGES.forEach((edge, eIdx) => {
      const i6 = eIdx * 6;
      const i2 = eIdx * 2;
      const sx = (edge.sourcePos[0] - midX) * worldScale;
      const sy = (edge.sourcePos[1] - midY) * worldScale;
      const sz = (edge.sourcePos[2] - midZ) * worldScale;
      const tx = (edge.targetPos[0] - midX) * worldScale;
      const ty = (edge.targetPos[1] - midY) * worldScale;
      const tz = (edge.targetPos[2] - midZ) * worldScale;

      edgePos[i6] = sx;
      edgePos[i6 + 1] = sy;
      edgePos[i6 + 2] = sz;
      edgePos[i6 + 3] = tx;
      edgePos[i6 + 4] = ty;
      edgePos[i6 + 5] = tz;

      const col = new THREE.Color(edge.color);
      edgeColors[i6] = col.r;
      edgeColors[i6 + 1] = col.g;
      edgeColors[i6 + 2] = col.b;
      edgeColors[i6 + 3] = col.r;
      edgeColors[i6 + 4] = col.g;
      edgeColors[i6 + 5] = col.b;

      edgeClusterIds[i2] = edge.clusterId;
      edgeClusterIds[i2 + 1] = edge.clusterId;
    });

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
    edgeGeo.setAttribute('color', new THREE.BufferAttribute(edgeColors, 3));
    edgeGeo.setAttribute('aClusterId', new THREE.BufferAttribute(edgeClusterIds, 1));

    const edgeMat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 color;
        attribute float aClusterId;
        uniform float uActiveClusterId;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = color;
          float sel = 0.0;
          if (uActiveClusterId > -900.0) {
            sel = abs(aClusterId - uActiveClusterId) < 0.1 ? 1.0 : 0.0;
          }
          // ZERO GLOBAL SPIDERWEBS: lines only render for the actively selected cluster
          if (uActiveClusterId > -900.0) {
            vAlpha = sel > 0.5 ? 0.75 : 0.0;
          } else {
            vAlpha = 0.0;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(vColor, vAlpha * uOpacity);
        }
      `,
      uniforms: edgeUniforms,
      transparent: true,
      depthWrite: false,
    });

    const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);
    gridGroup.add(edgeMesh);

    // 5. Landing Page Signature Torus Knot (Low Opacity, Dissolves on Transition)
    const tkGeo = new THREE.TorusKnotGeometry(1.80, 0.42, 130, 22, 2, 3);
    const tkMat = new THREE.MeshBasicMaterial({
      color: 0xea580c,
      wireframe: true,
      transparent: true,
      opacity: 0.11,
    });
    const tkMesh = new THREE.Mesh(tkGeo, tkMat);
    tkMesh.position.x = 1.35;
    tkMesh.rotation.set(0.35, 0.25, 0.15);
    scene.add(tkMesh);

    // 6. Interaction & Mouse/Wheel/HUD Event Handling
    const mouse2D = new THREE.Vector2();
    let mouseNormX = 0;
    let mouseNormY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let targetCameraZ = 7.2;
    let targetFocusMode = 0.0;
    let currentFocusMode = 0.0;
    const targetFocusCenter = new THREE.Vector3();
    let showpieceSpinAngle = 0.0;
    const showpieceEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    const showpieceMatrix = new THREE.Matrix4();
    const onCameraCmd = (e: any) => {
      const { cmd, clusterId } = e.detail || {};
      if (cmd === 'reset' || cmd === 'reset_overview') {
        orbitAngleXRef.current = 0.35;
        orbitAngleYRef.current = 0.45;
        targetCameraZ = 6.2;
        targetFocusMode = 0.0;
        targetFocusCenter.set(0, 0, 0);
      } else if (cmd === 'top') {
        orbitAngleXRef.current = 1.52;
        orbitAngleYRef.current = 0;
        targetCameraZ = 6.4;
      } else if (cmd === 'side') {
        orbitAngleXRef.current = 0.05;
        orbitAngleYRef.current = 1.57;
        targetCameraZ = 6.4;
      } else if (cmd === 'toggle_auto_rotate') {
        isAutoRotatingRef.current = !isAutoRotatingRef.current;
      } else if (cmd === 'auto_rotate_on') {
        isAutoRotatingRef.current = true;
      } else if (cmd === 'auto_rotate_off') {
        isAutoRotatingRef.current = false;
      } else if (cmd === 'focus' || cmd === 'focus_showpiece') {
        const meta = activeClusterMetasRef.current.find(
          (m) => m.id === String(clusterId) || m.clusterId === Number(clusterId)
        );
        if (meta) {
          targetFocusCenter.copy(meta.centroid);
          targetFocusMode = 0.85;
          targetCameraZ = 3.6;
          orbitAngleXRef.current = 0.20;
        }
      }
    };
    window.addEventListener('rr-camera-cmd', onCameraCmd as EventListener);

    const isOverScrollableOrUI = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      return !!target.closest(
        'button, a, input, textarea, select, nav, header, [data-interactive="true"]'
      );
    };

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 0.16 };

    const onMouseDown = (e: MouseEvent) => {
      if (
        astraState.viewMode === 'studio' &&
        astraState.activeTab !== 'archipelago'
      ) {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (isOverScrollableOrUI(target)) {
        return;
      }

      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseNormX = mouse2D.x;
      mouseNormY = mouse2D.y;

      bgUniforms.uM.value.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);

      if (isDraggingRef.current) {
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        orbitAngleYRef.current += dx * 0.007;
        orbitAngleXRef.current = Math.max(-1.4, Math.min(1.4, orbitAngleXRef.current + dy * 0.007));
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }

      // 3D Point Hover Raycasting in Archipelago View
      if (
        astraState.viewMode === 'studio' &&
        (astraState.activeTab === 'archipelago' || !astraState.activeTab)
      ) {
        raycaster.setFromCamera(mouse2D, camera);
        const intersects = raycaster.intersectObject(ptsMesh);
        if (intersects.length > 0 && intersects[0].index !== undefined) {
          const ptIdx = intersects[0].index;
          if (currentPoints && currentPoints[ptIdx]) {
            const paper = currentPoints[ptIdx];
            window.dispatchEvent(
              new CustomEvent('rr-paper-hover', {
                detail: { paper, screenX: e.clientX, screenY: e.clientY },
              })
            );
          }
        } else {
          window.dispatchEvent(new CustomEvent('rr-paper-hover', { detail: null }));
        }
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onClick = (e: MouseEvent) => {
      if (
        astraState.viewMode === 'studio' &&
        (astraState.activeTab === 'archipelago' || !astraState.activeTab)
      ) {
        const target = e.target as HTMLElement | null;
        if (isOverScrollableOrUI(target)) return;

        raycaster.setFromCamera(mouse2D, camera);
        const intersects = raycaster.intersectObject(ptsMesh);
        if (intersects.length > 0 && intersects[0].index !== undefined) {
          const ptIdx = intersects[0].index;
          if (currentPoints && currentPoints[ptIdx]) {
            const paper = currentPoints[ptIdx];
            window.dispatchEvent(
              new CustomEvent('rr-paper-click', {
                detail: { paper, screenX: e.clientX, screenY: e.clientY },
              })
            );
          }
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (
        astraState.viewMode === 'studio' &&
        astraState.activeTab !== 'archipelago'
      ) {
        return;
      }
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const target = e.target as HTMLElement | null;
        if (isOverScrollableOrUI(target)) return;
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - lastMousePosRef.current.x;
      const dy = touch.clientY - lastMousePosRef.current.y;
      orbitAngleYRef.current += dx * 0.008;
      orbitAngleXRef.current = Math.max(-1.4, Math.min(1.4, orbitAngleXRef.current + dy * 0.008));
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (
        astraState.viewMode !== 'studio' ||
        astraState.activeTab !== 'archipelago'
      ) {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (isOverScrollableOrUI(target)) return;

      e.preventDefault();
      targetCameraZ = Math.max(2.2, Math.min(12.0, targetCameraZ + e.deltaY * 0.005));
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      bgUniforms.uR.value.set(window.innerWidth, window.innerHeight);
      particleUniforms.uDpr.value = Math.min(window.devicePixelRatio, 2.0);
    };
    window.addEventListener('resize', onResize);

    // 7. Deterministic Paced Physical Simulation Loop
    const TRANSITION_DURATION = 1.35; // 1.35s immediate smooth physical GPU flight
    let transitionClock = 0.0;
    let animId = 0;
    let t = 0;
    let lastTimestamp = performance.now();

    const clusterRotMatrix = new THREE.Matrix4();
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');

    let isAlive = true;
    let timeoutId: any = 0;

    const scheduleFrame = () => {
      if (!isAlive) return;
      if (document.hidden) {
        timeoutId = setTimeout(scheduleFrame, 16);
      } else {
        animId = requestAnimationFrame(scheduleFrame);
      }
      loop();
    };

    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTimestamp) / 1000);
      lastTimestamp = now;
      t += dt;

      // Render Obsidian Background
      bgUniforms.uT.value = t;
      renderer.autoClear = false;
      renderer.clear();
      renderer.render(bgScene, bgCamera);

      const isStudio = astraState.viewMode === 'studio';
      const isArchipelago = astraState.activeTab === 'archipelago' || !astraState.activeTab;

      // In non-archipelago studio tabs (e.g. timeline, gaps, grant), hide the 3D cluster manifold
      if (isStudio && !isArchipelago && !astraState.isTransitioning) {
        ptsMesh.visible = false;
        gridGroup.visible = false;
        tkMesh.visible = false;
        edgeMesh.visible = false;
        return;
      }
      ptsMesh.visible = true;

      // Determine State Target
      const isTargetingClusterSpace = (isStudio && isArchipelago) || astraState.isTransitioning;

      // Deterministic physical transition clock (0.0 to 4.5s)
      if (isTargetingClusterSpace) {
        transitionClock = Math.min(TRANSITION_DURATION, transitionClock + dt);
      } else {
        transitionClock = Math.max(0.0, transitionClock - dt * 1.6);
      }

      const progress = transitionClock / TRANSITION_DURATION;

      particleUniforms.uTime.value = t;
      particleUniforms.uProgress.value = progress;

      // Parse active cluster selection
      const activeCid = astraState.selectedClusterId;
      if (activeCid && activeCid !== '') {
        const parsed = parseFloat(activeCid);
        particleUniforms.uActiveClusterId.value = isNaN(parsed) ? -999.0 : parsed;
      } else {
        particleUniforms.uActiveClusterId.value = -999.0;
      }

      // Smooth Cursor Inertia
      smoothMouseX += (mouseNormX - smoothMouseX) * 0.065;
      smoothMouseY += (mouseNormY - smoothMouseY) * 0.065;

      // Project Mouse to 3D World Space for Interactive Curl Deflection
      const aspect = window.innerWidth / window.innerHeight;
      const halfH = Math.tan((46 * Math.PI) / 360) * camera.position.z;
      const halfW = halfH * aspect;
      particleUniforms.uMouseWorld.value.set(smoothMouseX * halfW, smoothMouseY * halfH);

      // 3D Constellation Rotation Matrix
      if (progress > 0.45) {
        if (isAutoRotatingRef.current && !isDraggingRef.current && currentFocusMode < 0.01) {
          orbitAngleYRef.current += dt * 0.22; // Continuous 360° turntable spin
        }
        euler.set(orbitAngleXRef.current, orbitAngleYRef.current, 0);
        clusterRotMatrix.makeRotationFromEuler(euler);
        particleUniforms.uConstellationMatrix.value.copy(clusterRotMatrix);
        gridGroup.rotation.copy(euler);
      } else {
        // Landing Page Subtle Parallax Tilt
        euler.set(-smoothMouseY * 0.22, smoothMouseX * 0.28, 0);
        clusterRotMatrix.makeRotationFromEuler(euler);
        particleUniforms.uConstellationMatrix.value.copy(clusterRotMatrix);
      }

      // Smooth interpolation for Focus Showpiece Mode
      currentFocusMode += (targetFocusMode - currentFocusMode) * 0.085;
      particleUniforms.uFocusMode.value = currentFocusMode;
      particleUniforms.uFocusClusterCenter.value.copy(targetFocusCenter);

      if (currentFocusMode > 0.001) {
        if (!isDraggingRef.current) {
          showpieceSpinAngle += dt * 0.40;
        }
        showpieceEuler.set(orbitAngleXRef.current, showpieceSpinAngle + orbitAngleYRef.current, 0);
        showpieceMatrix.makeRotationFromEuler(showpieceEuler);
        particleUniforms.uFocusRotationMatrix.value.copy(showpieceMatrix);
      }

      // 3D Coordinate Grid Opacity (Fades in with clusters, smoothly vanishes in focused showpiece mode)
      gridGroup.visible = progress > 0.25 && currentFocusMode < 0.95;
      const gridAlpha = Math.max(0, (progress - 0.25) / 0.75) * (1.0 - currentFocusMode);
      boxLineMat.opacity = 0.20 * gridAlpha;
      (floorGrid.material as THREE.Material).opacity = 0.22 * gridAlpha;
      (backGrid.material as THREE.Material).opacity = 0.22 * gridAlpha;
      (sideGrid.material as THREE.Material).opacity = 0.22 * gridAlpha;
      spDim1.material.opacity = 0.75 * gridAlpha;
      spDim2.material.opacity = 0.75 * gridAlpha;
      spDim3.material.opacity = 0.75 * gridAlpha;
      edgeUniforms.uOpacity.value = Math.max(gridAlpha * 0.6, currentFocusMode * 0.85);

      // Smooth Constellation Left-Shift into Studio View (-1.25 for left 54% viewport)
      if (isTargetingClusterSpace) {
        particleUniforms.uConstellationX.value = -1.25;
        gridGroup.position.x = -1.25 * progress;
      } else {
        particleUniforms.uConstellationX.value = 0.0;
        gridGroup.position.x = 0.0;
      }

      // Update background shader progress
      bgUniforms.uProgress.value = progress;

      // Torus Knot: strictly a Hero element — vanishes completely during flight and cluster space
      const isHeroLanding = astraState.viewMode === 'hero' && !astraState.isTransitioning && progress < 0.05;
      tkMesh.visible = isHeroLanding;
      tkMat.opacity = isHeroLanding ? Math.max(0.0, 0.11 * (1.0 - progress * 8.0)) : 0.0;
      tkMesh.position.x = 1.35 + smoothMouseX * 0.22;
      tkMesh.position.y = smoothMouseY * 0.18;
      tkMesh.rotation.x = 0.35 + t * 0.06 + smoothMouseY * 0.45;
      tkMesh.rotation.y = 0.25 + t * 0.05 + smoothMouseX * 0.55;
      tkMesh.rotation.z = smoothMouseX * 0.15;

      // Camera Smooth Zoom & Framing matching Reference Image
      const baseCamZ = astraState.viewMode === 'studio' ? targetCameraZ : 7.2;
      const targetCamY = 0.0;
      camera.position.z += (baseCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.position.x += (0.0 - camera.position.x) * 0.08;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    scheduleFrame();

    return () => {
      isAlive = false;
      cancelAnimationFrame(animId);
      clearTimeout(timeoutId);
      window.removeEventListener('rr-camera-cmd', onCameraCmd as EventListener);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

      renderer.dispose();
      bgMaterial.dispose();
      ptsGeo.dispose();
      ptsMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      (floorGrid.material as THREE.Material).dispose();
      floorGrid.geometry.dispose();
      (backGrid.material as THREE.Material).dispose();
      backGrid.geometry.dispose();
      boxGeo.dispose();
      boxWire.dispose();
      boxLineMat.dispose();
      tkGeo.dispose();
      tkMat.dispose();
    };
  }, []);

  useEffect(() => {
    if (updateGeometryRef.current) {
      updateGeometryRef.current(points3dData);
    }
  }, [points3dData]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#07090e',
        transition: 'background-color 0.8s ease-out',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: viewMode === 'studio' && activeTab === 'archipelago' ? 'auto' : 'none',
          cursor: isDraggingRef.current ? 'grabbing' : 'grab',
        }}
      />
    </div>
  );
};
