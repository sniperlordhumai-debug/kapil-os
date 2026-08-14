"use client";

import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function AvatarPanel() {
  const texture = useTexture("/images/avatar-photo-square.jpg");
  const group = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  // Sprite ring points around the avatar
  const particles = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 1.45 + Math.random() * 0.15;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    if (!reduce) {
      // gentle floating bob
      g.position.y = Math.sin(t * 0.6) * 0.05;
      // cursor-following tilt (parallax 3D)
      const targetX = -pointer.y * 0.28;
      const targetY = pointer.x * 0.34;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.08);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.08);
      // slow spin on orbit rings
      if (ring1.current) {
        ring1.current.rotation.x += delta * 0.4;
        ring1.current.rotation.y += delta * 0.2;
      }
      if (ring2.current) {
        ring2.current.rotation.y -= delta * 0.35;
        ring2.current.rotation.z += delta * 0.15;
      }
    }
  });

  return (
    <group ref={group}>
      <Float speed={reduce ? 0 : 1.5} rotationIntensity={reduce ? 0 : 0.12} floatIntensity={reduce ? 0 : 0.6}>
        {/* circular portrait */}
        <mesh position={[0, 0, 0.05]}>
          <circleGeometry args={[1.5, 80]} />
          <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        {/* circular emissive ring border */}
        <mesh position={[0, 0, 0.06]}>
          <ringGeometry args={[1.5, 1.62, 80]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* outer thin glow ring */}
        <mesh position={[0, 0, 0.03]}>
          <ringGeometry args={[1.68, 1.72, 80]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        {/* soft under-glow disc */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[1.62, 60]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.06} />
        </mesh>
      </Float>

      {/* orbit rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.9, 0.012, 12, 80]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2} rotation={[0, Math.PI / 2, 0.6]}>
        <torusGeometry args={[2.15, 0.01, 12, 80]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.35} />
      </mesh>

      {/* orbit particle dots */}
      <points geometry={particles}>
        <pointsMaterial color="#4ade80" size={0.03} transparent opacity={0.7} />
      </points>

      <Sparkles count={reduce ? 0 : 40} scale={[3.2, 3.2, 2]} size={1.6} speed={0.35} color="#67e8f9" />
    </group>
  );
}

export default function Avatar3D() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} color="#bfeefb" />
      <pointLight position={[-3, 1, -2]} intensity={0.6} color="#22d3ee" />
      <Suspense fallback={null}>
        <AvatarPanel />
      </Suspense>
    </Canvas>
  );
}
