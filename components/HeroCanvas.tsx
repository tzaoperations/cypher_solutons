"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import dynamic from "next/dynamic";

// ─────────────────────────────────────────────
// Shared mouse state (outside React to avoid re-renders)
// ─────────────────────────────────────────────
const mouse = new THREE.Vector2(-10, -10);

if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

// ─────────────────────────────────────────────
// Particle field configuration
// ─────────────────────────────────────────────
const COLS = 80;
const ROWS = 50;
const SPREAD_X = 28;
const SPREAD_Y = 18;
const REPEL_RADIUS = 2.2;
const REPEL_STRENGTH = 0.55;
const RETURN_SPEED = 0.04;
const WAVE_SPEED = 0.35;
const WAVE_AMP = 0.18;

// Added { color } prop to ParticleField
function ParticleField({ color = "#a855f7", opacity = 0.65 }: { color?: string; opacity?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const { camera } = useThree();

  const dataRef = useRef<{ restPositions: Float32Array; currentPositions: Float32Array; count: number } | null>(null);
  if (!dataRef.current) {
    const count = COLS * ROWS;
    const rest = new Float32Array(count * 3);
    const current = new Float32Array(count * 3);

    let i = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = (col / (COLS - 1) - 0.5) * SPREAD_X;
        const y = (row / (ROWS - 1) - 0.5) * SPREAD_Y;
        rest[i * 3]     = x;
        rest[i * 3 + 1] = y;
        rest[i * 3 + 2] = 0;
        current[i * 3]     = x;
        current[i * 3 + 1] = y;
        current[i * 3 + 2] = 0;
        i++;
      }
    }
    dataRef.current = { restPositions: rest, currentPositions: current, count };
  }
  const { restPositions, currentPositions, count } = dataRef.current;

  const geoRef = useRef<THREE.BufferGeometry | null>(null);
  if (!geoRef.current) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    geoRef.current = geo;
  }
  const geometry = geoRef.current;

  const worldMouse = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, worldMouse);

    const pos = currentPositions;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const restX = restPositions[idx];
      const restY = restPositions[idx + 1];

      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const wave = Math.sin(col * 0.18 + t * WAVE_SPEED) * WAVE_AMP
                 + Math.cos(row * 0.22 + t * WAVE_SPEED * 0.7) * WAVE_AMP * 0.6;

      const targetX = restX;
      const targetY = restY + wave;

      let cx = pos[idx];
      let cy = pos[idx + 1];

      const dx = cx - worldMouse.x;
      const dy = cy - worldMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0.001) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        cx += (dx / dist) * force;
        cy += (dy / dist) * force;
      }

      pos[idx]     = cx + (targetX - cx) * RETURN_SPEED;
      pos[idx + 1] = cy + (targetY - cy) * RETURN_SPEED;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <PointMaterial
        transparent
        color={color}
        size={0.065}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
      />
    </points>
  );
}

// ─────────────────────────────────────────────
// Canvas wrapper — receives color from parent
// ─────────────────────────────────────────────
function HeroCanvasInner({ color, opacity }: { color?: string; opacity?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 60 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ParticleField color={color} opacity={opacity} />
    </Canvas>
  );
}

// Ensure the dynamic export passes props through
export const HeroCanvas = dynamic(
  () => Promise.resolve(({ color, opacity }: { color?: string; opacity?: number }) => <HeroCanvasInner color={color} opacity={opacity} />),
  {
    ssr: false,
    loading: () => null,
  }
);