"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Points } from "three";
import * as THREE from "three";

function ParticleCluster() {
  const pointsRef = useRef<Points>(null);
  const groupRef = useRef<Group>(null);

  const positions = useMemo(() => {
    const count = 2200;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const seed = i + 1;
      const randA = fract(Math.sin(seed * 12.9898) * 43758.5453);
      const randB = fract(Math.sin(seed * 78.233) * 9621.3729);
      const randC = fract(Math.sin(seed * 39.425) * 12345.6789);

      const radius = 2.4 + randA * 2.2;
      const theta = randB * Math.PI * 2;
      const phi = Math.acos(2 * randC - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      data[i * 3] = x;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = z;
    }

    return data;
  }, []);

  useFrame(({ clock, pointer }, delta) => {
    if (!groupRef.current || !pointsRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y += delta * 0.06;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.x * 0.55,
      0.04,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      pointer.y * 0.35,
      0.04,
    );
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#7C3AED"
          size={0.03}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh>
        <sphereGeometry args={[2.05, 36, 36]} />
        <meshBasicMaterial
          color="#7C3AED"
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>
    </group>
  );
}

function fract(value: number) {
  return value - Math.floor(value);
}

type Background3DProps = {
  onReady?: () => void;
};

export function Background3D({ onReady }: Background3DProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 58 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        onCreated={() => onReady?.()}
      >
        <color attach="background" args={["#0A0A0A"]} />
        <ambientLight intensity={0.55} />
        <ParticleCluster />
      </Canvas>
    </div>
  );
}
