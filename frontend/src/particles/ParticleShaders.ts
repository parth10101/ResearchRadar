// High-Performance Scientific Shader Architecture for 300 Authentic Data Points
// Continuous 2.5-Second Coherent Spatial Reorganization + Density-Aware Alpha Blending

export const particleVertexShader = `
  precision highp float;

  attribute vec3 aTargetPosition;
  attribute vec3 aColorHome;
  attribute vec3 aColorTarget;
  attribute float aDelay;
  attribute float aRandom;
  attribute float aSize;
  attribute float aClusterId;
  attribute float aIsOutlier;

  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uMouseWorld;
  uniform float uBaseSize;
  uniform float uDpr;
  uniform float uConstellationX;
  uniform mat4 uConstellationMatrix;
  uniform float uActiveClusterId;
  uniform float uFocusMode;
  uniform vec3 uFocusClusterCenter;
  uniform mat4 uFocusRotationMatrix;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vIsOutlier;
  varying float vIsSelected;

  // 3D Simplex noise implementation for GPU curl drift
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p_noise = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p_noise - 49.0 * floor(p_noise * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 curlNoise(vec3 p) {
    const float e = 0.1;
    float n1 = snoise(vec3(p.x, p.y + e, p.z));
    float n2 = snoise(vec3(p.x, p.y - e, p.z));
    float n3 = snoise(vec3(p.x, p.y, p.z + e));
    float n4 = snoise(vec3(p.x, p.y, p.z - e));
    float n5 = snoise(vec3(p.x + e, p.y, p.z));
    float n6 = snoise(vec3(p.x - e, p.y, p.z));

    return vec3(
      (n1 - n2) - (n3 - n4),
      (n3 - n4) - (n5 - n6),
      (n5 - n6) - (n1 - n2)
    );
  }

  void main() {
    // 1. Fluid Curl-Noise Atmospheric Flow in Rest State (Landing Page)
    vec3 noiseSeed = position * 0.25 + vec3(0.0, uTime * 0.045, uTime * 0.03);
    vec3 flow = curlNoise(noiseSeed) * (0.35 + aRandom * 0.15);

    vec3 homePos = position + flow;

    // 2. Cursor Deflection Field in Atmospheric State
    vec2 cDiff = homePos.xy - uMouseWorld;
    float cDist = length(cDiff);
    if (cDist < 2.5) {
      float f = (1.0 - cDist / 2.5);
      homePos.xy += normalize(cDiff) * (f * f * 0.85);
    }

    // 3. Coherent 2.5-Second Continuous Reorganization
    // Normalized local progress (0.0 to 1.0)
    float localP = clamp((uProgress - aDelay) / 0.86, 0.0, 1.0);
    
    // Quintic S-Curve Easing (Smooth, physical acceleration and deceleration)
    float p = localP * localP * localP * (localP * (localP * 6.0 - 15.0) + 10.0);

    // 4. Transform Target into Constellation Rotation and 50% Left Shift
    vec3 rotatedTarget = (uConstellationMatrix * vec4(aTargetPosition, 1.0)).xyz;
    rotatedTarget.x += uConstellationX * p;

    vec3 disp = rotatedTarget - homePos;
    
    // Aerodynamic Coherent Stream Swirl (Curved flight paths without independent chaos)
    float swirl = sin(p * 3.14159265) * (0.24 + aRandom * 0.14);
    vec3 tangential = vec3(-disp.y, disp.x, disp.z * 0.25) * swirl;

    // Subtle physical settling damping (dissipates cleanly to 0 at p = 1.0)
    float settle = sin(p * 3.14159265 * 2.0) * exp(-p * 4.8) * 0.06;

    // Microscopic living breathing once in cluster space
    vec3 livingDrift = vec3(
      sin(uTime * 1.2 + aRandom * 15.0) * 0.003,
      cos(uTime * 1.0 + aRandom * 11.0) * 0.003,
      sin(uTime * 0.8 + aRandom * 19.0) * 0.002
    ) * p;

    vec3 currentPos = mix(homePos, rotatedTarget, p) + tangential + disp * settle + livingDrift;

    // 5. Cluster Selection State
    float isSelected = 0.0;
    if (uActiveClusterId > -900.0) {
      if (abs(aClusterId - uActiveClusterId) < 0.1) {
        isSelected = 1.0;
      }
    }
    vIsSelected = isSelected;
    vIsOutlier = aIsOutlier;

    // 6. Focus Showpiece Mode: Center cluster and apply local turntable rotation
    if (uFocusMode > 0.001) {
      if (isSelected > 0.5) {
        // Scale up the real UMAP local offsets so the cluster fills the left half of screen.
        // 2.5x preserves authentic irregular scatter arrangement — no orbital metaphor.
        vec3 localOffset = (aTargetPosition - uFocusClusterCenter) * 2.5;
        vec3 rotatedLocal = (uFocusRotationMatrix * vec4(localOffset, 1.0)).xyz;
        vec3 showpieceTarget = rotatedLocal + vec3(uConstellationX, 0.0, 0.0);
        currentPos = mix(currentPos, showpieceTarget, uFocusMode);
      }
    }

    // Transform to Camera Space
    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 7. Scientific Data Point Sizing & Morphing
    float depthDist = max(0.1, -mvPosition.z);

    // Hero-mode breathing pulse: dots gently swell in the landing page star cloud.
    float breathe = 1.0 + (1.0 - p) * 0.22 * sin(uTime * 1.18 + aRandom * 6.2832);

    float landingBase = aIsOutlier > 0.5 ? 4.2 : 5.4;
    float clusterBase = aIsOutlier > 0.5 ? 8.5 : (isSelected > 0.5 ? 18.0 : 12.0);
    float targetBase  = mix(landingBase, clusterBase, p) * breathe;

    if (uFocusMode > 0.001 && isSelected > 0.5) {
      targetBase = mix(targetBase, 24.0, uFocusMode);
    }

    float effectiveSize = mix(1.0, aSize, p);
    gl_PointSize = targetBase * effectiveSize * (5.8 / depthDist) * uDpr;

    float minPx = mix(3.5, isSelected > 0.5 ? 18.0 : 11.0, p);
    float maxPx = mix(8.0, isSelected > 0.5 ? 30.0 : 22.0, p);
    gl_PointSize = clamp(gl_PointSize, minPx, maxPx);

    // 8. Color Morphing — hero phase gets a warm-cold hue shimmer for the galaxy star-cloud feel.
    float hueCycle = sin(uTime * 0.38 + aRandom * 6.2832);
    vec3 warmTint  = vec3(1.0, 0.82, 0.62);  // warm amber
    vec3 coolTint  = vec3(0.62, 0.93, 1.00);  // cool teal
    vec3 heroTint  = mix(coolTint, warmTint, hueCycle * 0.5 + 0.5);
    vec3 heroHome  = mix(aColorHome, heroTint, (1.0 - p) * 0.28);

    vec3 finalColor = mix(heroHome, aColorTarget, smoothstep(0.05, 0.75, p));
    if (isSelected > 0.5) {
      finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), 0.20);
    }
    vColor = finalColor;

    // 9. Alpha Blending
    // Outliers: visible as authentic grey reference points in cluster space matching reference Image
    float outlierHeroAlpha = 0.70;
    float outlierClusterAlpha = 0.60;
    float outlierAlpha = mix(outlierHeroAlpha, outlierClusterAlpha, p);

    float baseAlpha = aIsOutlier > 0.5 ? outlierAlpha : 1.0;
    // In overview mode (uFocusMode == 0.0), all clusters remain fully visible as in Reference Image
    if (uActiveClusterId > -900.0 && uFocusMode > 0.01) {
      if (isSelected < 0.5) {
        baseAlpha *= mix(1.0, 0.20, uFocusMode);
      } else {
        baseAlpha = 1.0;
      }
    }
    vAlpha = baseAlpha;
  }
`;

export const particleFragmentShader = `
  precision highp float;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vIsOutlier;
  varying float vIsSelected;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Crisp Circular Dots with Luminous White Border on Dark Cosmic Canvas
    float edgeAlpha = 1.0 - smoothstep(0.47, 0.50, dist);

    vec3 col;
    float alpha = vAlpha * edgeAlpha;

    if (vIsOutlier > 0.5) {
      // Outlier: clean muted slate-grey marker
      col = vec3(0.50, 0.55, 0.62);
      if (dist > 0.38) {
        col = vec3(0.68, 0.73, 0.80);
      }
      alpha *= 0.55;
    } else {
      if (dist < 0.38) {
        // Saturated, vibrant cluster color core
        col = vColor;
      } else if (dist <= 0.46) {
        // Crisp bright white luminous rim
        col = mix(vColor, vec3(1.0, 1.0, 1.0), 0.85);
      } else {
        // Smooth border anti-aliasing
        col = mix(vec3(1.0, 1.0, 1.0), vColor, 0.4);
      }
      // Rich overlapping disk opacity
      alpha *= 0.90;
    }

    if (vIsSelected > 0.5) {
      // Highlight for hovered/selected point
      col = mix(col, vec3(1.0), 0.25);
      alpha = min(1.0, alpha * 1.15);
    }

    gl_FragColor = vec4(col, alpha);
  }
`;
