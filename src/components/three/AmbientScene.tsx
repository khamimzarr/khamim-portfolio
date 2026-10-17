"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import useReducedMotion from "./useReducedMotion";

type Bar = {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
  opacity: number;
  speed: number;
};

function Field({ progress, reduced }: { progress: RefObject<number>; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  const layers = useMemo(() => {
    const make = (count: number, z: number, opacity: number): Bar[] =>
      Array.from({ length: count }, (_, id) => ({
        id: id + z * 1000,
        position: [(Math.random() - 0.5) * 9, (Math.random() - 0.5) * 12, z] as [number, number, number],
        rotation: [0, 0, (Math.random() - 0.5) * 1.6] as [number, number, number],
        length: 0.6 + Math.random() * 3.2,
        opacity: opacity * (0.5 + Math.random()),
        speed: 0.4 + Math.random() * 0.6,
      }));
    return [
      { z: -5, bars: make(18, -5, 0.05) },
      { z: -3, bars: make(14, -3, 0.07) },
      { z: -1.5, bars: make(10, -1.5, 0.11) },
    ];
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.z += delta * 0.004;
    g.position.y = THREE.MathUtils.lerp(g.position.y, progress.current * 1.4, 0.05);
    if (!reduced) {
      const t = state.clock.elapsedTime;
      layers.forEach((layer, i) => {
        const child = g.children[i] as THREE.Group | undefined;
        if (!child) return;
        child.position.x = Math.sin(t * 0.05 + i) * 0.25;
      });
    }
  });

  return (
    <group ref={group}>
      {layers.map((layer, i) => (
        <group key={i}>
          {layer.bars.map((b) => (
            <mesh key={b.id} position={b.position} rotation={b.rotation}>
              <boxGeometry args={[0.016, b.length * (1 + i * 0.15), 0.016]} />
              <meshBasicMaterial color="#f5f5f7" transparent opacity={b.opacity} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export default function AmbientScene({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const progress = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? (window.scrollY / max) * 2 - 1 : 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        frameloop={reduced || !visible ? "demand" : "always"}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <Field progress={progress} reduced={reduced} />
      </Canvas>
    </div>
  );
}
