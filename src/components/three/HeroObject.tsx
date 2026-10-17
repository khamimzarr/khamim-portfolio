"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type PointerEvent, type RefObject } from "react";
import * as THREE from "three";
import useReducedMotion from "./useReducedMotion";

function roundedRect(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function extrude(width: number, height: number) {
  return new THREE.ExtrudeGeometry(roundedRect(width, height, 0.05), {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 3,
    curveSegments: 8,
  });
}

function Monogram({
  reduced,
  dragRef,
  spinRef,
}: {
  reduced: boolean;
  dragRef: RefObject<boolean>;
  spinRef: RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  const stem = useMemo(() => extrude(0.26, 1.2), []);
  const arm = useMemo(() => extrude(0.22, 0.82), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e9e2d8"),
        metalness: 0.5,
        roughness: 0.3,
        emissive: new THREE.Color("#2a1f16"),
        emissiveIntensity: 0.5,
      }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    if (spinRef.current !== 0) {
      g.rotation.y += spinRef.current;
      spinRef.current *= 0.9;
      if (Math.abs(spinRef.current) < 0.0004) spinRef.current = 0;
    } else if (!dragRef.current && !reduced) {
      g.rotation.y += delta * 0.22;
    }

    if (!reduced) {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, Math.sin(state.clock.elapsedTime * 0.25) * 0.08, 0.05);
      g.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={stem} material={material} position={[-0.34, 0, 0]} />
      <mesh geometry={arm} material={material} position={[0.02, 0.31, 0]} rotation={[0, 0, -0.86]} />
      <mesh geometry={arm} material={material} position={[0.02, -0.31, 0]} rotation={[0, 0, 0.86]} />
    </group>
  );
}

export default function HeroObject({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const dragRef = useRef(false);
  const spinRef = useRef(0);
  const lastX = useRef(0);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = true;
    lastX.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    spinRef.current += (event.clientX - lastX.current) * 0.0045;
    lastX.current = event.clientX;
  };
  const onPointerUp = () => {
    dragRef.current = false;
  };

  return (
    <div
      className={`touch-pan-y cursor-grab active:cursor-grabbing ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.6]}
        frameloop={reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 4.4], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 4]} intensity={2.1} color="#f5f5f7" />
        <pointLight position={[-3.5, -1.5, 2]} intensity={12} color="#b6763c" />
        <pointLight position={[3, -2, -2]} intensity={6} color="#0071e3" />
        <Monogram reduced={reduced} dragRef={dragRef} spinRef={spinRef} />
      </Canvas>
    </div>
  );
}
