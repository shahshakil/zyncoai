"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

function NeuralOrb() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);

  const lineGeometry = useMemo(() => {
    const points: number[] = [];
    const lines = 120;

    for (let i = 0; i < lines; i++) {
      const a = new THREE.Vector3().setFromSphericalCoords(
        1.55 + Math.random() * 0.1,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );
      const b = new THREE.Vector3().setFromSphericalCoords(
        1.55 + Math.random() * 0.1,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );

      points.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, []);

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      const v = new THREE.Vector3().setFromSphericalCoords(
        1.4 + Math.random() * 0.35,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.22;
      groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.08;
    }

    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.025);
    }

    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.16;
      outerRef.current.rotation.z = Math.sin(t * 0.5) * 0.18;
    }

    if (ringARef.current) {
      ringARef.current.rotation.x = t * 0.45;
      ringARef.current.rotation.y = t * 0.28;
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.z = -t * 0.38;
      ringBRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 4, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={9} color="#8b5cf6" />
      <pointLight position={[2.6, 0.5, 2.2]} intensity={4.5} color="#60a5fa" />
      <pointLight position={[-2.2, -1.1, -2.2]} intensity={4.2} color="#ec4899" />

      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.28}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.05, 32]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            emissive="#7c3aed"
            emissiveIntensity={1.8}
            roughness={0.16}
            metalness={0.52}
            transmission={0.12}
            thickness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>
      </Float>

      <mesh ref={outerRef}>
        <sphereGeometry args={[1.72, 64, 64]} />
        <meshPhysicalMaterial
          color="#c4b5fd"
          transparent
          opacity={0.09}
          roughness={0.08}
          metalness={0.7}
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={ringARef}>
        <torusGeometry args={[2.05, 0.03, 16, 240]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} />
      </mesh>

      <mesh ref={ringBRef} rotation={[Math.PI / 2.8, 0, 0]}>
        <torusGeometry args={[2.22, 0.02, 16, 240]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.35} />
      </mesh>

      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#c4b5fd" transparent opacity={0.38} />
      </lineSegments>

      <Points positions={nodePositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.028}
          sizeAttenuation
          depthWrite={false}
          opacity={0.82}
        />
      </Points>
    </group>
  );
}

export default function HeroBrainOrbScene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5.8], fov: 42 }}>
        <fog attach="fog" args={["#09090f", 5, 12]} />
        <NeuralOrb />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.55}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}
