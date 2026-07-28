"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function BrainCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.22;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.8}>
      <Sphere ref={ref} args={[1.45, 128, 128]} scale={1}>
        <MeshDistortMaterial
          color="#7c3aed"
          emissive="#a855f7"
          emissiveIntensity={0.5}
          roughness={0.08}
          metalness={0.4}
          distort={0.38}
          speed={1.6}
        />
      </Sphere>
    </Float>
  );
}

function OrbitDots() {
  const group = useRef<THREE.Group>(null);

  const dots = useMemo(() => {
    return new Array(22).fill(0).map((_, i) => {
      const angle = (i / 22) * Math.PI * 2;
      const radius = 2.5 + (i % 3) * 0.18;
      return {
        position: [
          Math.cos(angle) * radius,
          ((i % 5) - 2) * 0.22,
          Math.sin(angle) * radius,
        ] as [number, number, number],
      };
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  return (
    <group ref={group}>
      {dots.map((dot, i) => (
        <mesh key={i} position={dot.position}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#c084fc" : "#e9d5ff"} emissive="#c084fc" emissiveIntensity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export default function BrainOrb() {
  return (
    <div className="h-[420px] w-full rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.18),rgba(255,255,255,0.98)_52%,rgba(245,242,237,1)_100%)]">
      <Canvas camera={{ position: [0, 0, 5.6], fov: 42 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 3, 3]} intensity={2} />
        <pointLight position={[-3, -2, 3]} intensity={2.2} color="#a855f7" />
        <BrainCore />
        <OrbitDots />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
