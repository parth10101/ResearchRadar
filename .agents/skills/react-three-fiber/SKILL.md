---
name: react-three-fiber
description: React renderer for Three.js. Use for declarative 3D canvas management, lighting, cameras, meshes, hooks (useFrame, useThree), and high-performance WebGL rendering.
---

# React Three Fiber (R3F) Skill

Build declarative, reactive 3D WebGL scenes directly within React applications using `@react-three/fiber` and Three.js.

## Core Architecture & Patterns
- `<Canvas>`: Root WebGL container with automatic resize, DPR scaling, and render loop.
- `useFrame((state, delta) => ...)`: Frame loop hook for 60fps animations, physics updates, and procedural rotations.
- `useThree()`: Access WebGLRenderer, Scene, Camera, viewport metrics, and pointer coordinates.
- Object lifecycle: Automatic disposal and GPU memory management for geometries and materials.
