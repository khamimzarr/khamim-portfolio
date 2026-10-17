"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import useReducedMotion from "./useReducedMotion";

function BarField({ progress, reduced }: { progress: RefObject<number>; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  const bars = useMemo(
    () =>
      Array.from({ length: 26 }, (_, id) => ({
        id,
        position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -1 - Math.random() * 3.5] as [number, number, number],
        rotation: [0, 0, Math.random() * Math.PI] as [number, number, number],
        length: 0.5 + Math.random() * 2.4,
        opacity: 0.04 + Math.random() * 0.07,
      })),
    [],
  );

  useFrame((_state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.z += delta * 0.008;
    g.position.y = THREE.MathUtils.lerp(g.position.y, progress.current * 0.9, 0.06);
  });

  return (
    <group ref={group}>
      {bars.map((b) => (
        <mesh key={b.id} position={b.position} rotation={b.rotation}>
          <boxGeometry args={[0.018, b.length, 0.018]} />
          <meshBasicMaterial color="#f5f5f7" transparent opacity={b.opacity} />
        </mesh>
      ))}
    </group>
  );
}

export default function KaryaBackdrop({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const progress = useRef(0);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current?.parentElement ?? host.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      progress.current = Math.max(-1, Math.min(1, (center - vh / 2) / vh));
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

  return (
    <div ref={host} className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        frameloop={reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <BarField progress={progress} reduced={reduced} />
      </Canvas>
    </div>
  );
}
