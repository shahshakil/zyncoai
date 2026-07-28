"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Orb() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.003;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.16;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.6}>
      <Sphere ref={ref} args={[1.5, 128, 128]} scale={1.5}>
        <MeshDistortMaterial
          color="#7c3aed"
          distort={0.42}
          speed={2.2}
          roughness={0.08}
          metalness={0.35}
          emissive="#8b5cf6"
          emissiveIntensity={0.45}
        />
      </Sphere>

      <Html center>
        <div className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold tracking-[0.18em] text-white backdrop-blur-xl">
          ZYNCOAI
        </div>
      </Html>
    </Float>
  );
}

export default function OrbScene() {
  return (
    <div className="relative h-[520px] overflow-hidden rounded-[40px] border border-white/10 bg-[#090910] shadow-[0_40px_140px_rgba(76,29,149,0.28)]">
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.18),transparent_25%)]" />
      <div className="absolute inset-0 z-10 opacity-[0.14] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="absolute left-6 top-6 z-20 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-zinc-300">
        3D brain orb
      </div>

      <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 5]} intensity={2.2} color="#c4b5fd" />
        <pointLight position={[-3, -2, 2]} intensity={1.4} color="#60a5fa" />
        <pointLight position={[3, 2, 2]} intensity={1.4} color="#ec4899" />
        <Orb />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
