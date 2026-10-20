"use client";

import { useEffect, useRef } from "react";
import { LAND_COLS, LAND_MASK, LAND_ROWS } from "./globe-land";

/* Dotted globe untuk kartu "Global Network" di section 03.
   Digambar dengan Canvas 2D biasa: titik daratan diproyeksikan sendiri ke bola,
   jadi tidak perlu three.js dan tetap ringan di HP (877 titik + 4 busur).
   Bisa diputar dengan drag; auto-rotate berhenti saat offscreen, tab
   disembunyikan, atau prefers-reduced-motion aktif. */

const DOT = "71, 85, 105"; // #475569 slate
const EMERALD = "16, 185, 129"; // #10b981
const LIME = "163, 230, 53"; // #a3e635

// Rute antar node: [lat, lon] -> [lat, lon]
const ARCS: { from: [number, number]; to: [number, number]; color: string }[] = [
  { from: [-6.2, 106.8], to: [50.1, 8.7], color: EMERALD }, // Jakarta - Frankfurt
  { from: [39.0, -77.5], to: [1.35, 103.8], color: LIME }, // Ashburn - Singapore
  { from: [-23.5, -46.6], to: [-6.2, 106.8], color: EMERALD }, // Sao Paulo - Jakarta
  { from: [35.7, 139.7], to: [-33.9, 151.2], color: LIME }, // Tokyo - Sydney
];

type Vec3 = [number, number, number];

const toVec = (latDeg: number, lonDeg: number): Vec3 => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
};

/* Titik daratan dibaca sekali dari peta 72 x 36. Titik laut diambil jarang
   (tiap 3 sel) hanya untuk memberi badan bola, supaya sisi samudra tidak
   tampak kosong saat globe berputar. */
const LAND: Vec3[] = [];
const OCEAN: Vec3[] = [];
for (let row = 0; row < LAND_ROWS; row += 1) {
  const line = LAND_MASK[row] ?? "";
  const lat = 90 - ((row + 0.5) * 180) / LAND_ROWS;
  for (let col = 0; col < LAND_COLS; col += 1) {
    const lon = -180 + ((col + 0.5) * 360) / LAND_COLS;
    if (line[col] === "#") {
      LAND.push(toVec(lat, lon));
    } else if (col % 3 === 0 && row % 2 === 0) {
      OCEAN.push(toVec(lat, lon));
    }
  }
}

const normalize = (v: Vec3): Vec3 => {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
};

const slerp = (a: Vec3, b: Vec3, t: number): Vec3 => {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const theta = Math.acos(dot);
  if (theta < 1e-5) return a;
  const s1 = Math.sin((1 - t) * theta) / Math.sin(theta);
  const s2 = Math.sin(t * theta) / Math.sin(theta);
  return normalize([a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2]);
};

/* Busur diangkat di tengah (sin pi t) supaya terbaca sebagai lengkungan orbital. */
const makeArc = (from: Vec3, to: Vec3, steps = 56): Vec3[] => {
  const out: Vec3[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const p = slerp(from, to, t);
    const lift = 1 + Math.sin(Math.PI * t) * 0.16;
    out.push([p[0] * lift, p[1] * lift, p[2] * lift]);
  }
  return out;
};

const ARCS_3D = ARCS.map((arc) => ({
  points: makeArc(toVec(arc.from[0], arc.from[1]), toVec(arc.to[0], arc.to[1])),
  color: arc.color,
}));

export default function TechGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let yaw = -1.15; // buka menghadap Afrika/Eropa, bukan Samudra Pasifik
    let pitch = 0.14;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let onScreen = true;
    let frame = 0;
    let lastTs = 0;
    let elapsed = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const draw = () => {
      const w = width;
      const h = height;
      if (!w || !h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.44;

      // Halo emerald tipis di tepi bola.
      const glow = ctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r * 1.16);
      glow.addColorStop(0, `rgba(${EMERALD}, 0)`);
      glow.addColorStop(0.72, `rgba(${EMERALD}, 0.05)`);
      glow.addColorStop(1, `rgba(${EMERALD}, 0.20)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.16, 0, Math.PI * 2);
      ctx.fill();

      // Badan bola: gelap transparan dengan sentuhan emerald.
      const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
      body.addColorStop(0, "rgba(20, 20, 23, 0.92)");
      body.addColorStop(1, "rgba(14, 14, 16, 0.55)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      // Proyeksi ortografis: z > 0 = sisi yang menghadap kamera.
      const project = (v: Vec3): [number, number, number] => {
        const x1 = v[0] * cosY + v[2] * sinY;
        const z1 = -v[0] * sinY + v[2] * cosY;
        const y1 = v[1] * cosP - z1 * sinP;
        const z2 = v[1] * sinP + z1 * cosP;
        return [cx + x1 * r, cy - y1 * r, z2];
      };

      // Busur: segmen dikelompokkan per kedalaman lalu distroke sekali per grup,
      // jadi 4 panggilan stroke per busur, bukan 56.
      for (const arc of ARCS_3D) {
        const segments: Path2D[] = [0, 1, 2, 3].map(() => new Path2D());
        for (let i = 0; i < arc.points.length - 1; i += 1) {
          const a = project(arc.points[i]);
          const b = project(arc.points[i + 1]);
          const depth = (a[2] + b[2]) / 2;
          if (depth <= -0.15) continue;
          const level = Math.min(3, Math.floor((Math.max(0, depth) / 1.01) * 4));
          segments[level].moveTo(a[0], a[1]);
          segments[level].lineTo(b[0], b[1]);
        }
        ctx.lineWidth = 1;
        for (let i = 0; i < segments.length; i += 1) {
          ctx.strokeStyle = `rgba(${arc.color}, ${(0.10 + 0.18 * i).toFixed(3)})`;
          ctx.stroke(segments[i]);
        }

        // Titik pijar yang berjalan pelan di sepanjang busur.
        const t = (elapsed * 0.09 + ARCS_3D.indexOf(arc) * 0.27) % 1;
        const idx = Math.min(arc.points.length - 1, Math.round(t * (arc.points.length - 1)));
        const p = project(arc.points[idx]);
        if (p[2] > -0.05) {
          const size = 2.6 + 2.2 * Math.max(0, p[2]);
          const spark = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], size * 3);
          spark.addColorStop(0, `rgba(${arc.color}, 0.95)`);
          spark.addColorStop(0.35, `rgba(${arc.color}, 0.35)`);
          spark.addColorStop(1, `rgba(${arc.color}, 0)`);
          ctx.fillStyle = spark;
          ctx.beginPath();
          ctx.arc(p[0], p[1], size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Badan bola: titik laut yang sangat redup, cuma penanda volume.
      const ocean = new Path2D();
      for (const v of OCEAN) {
        const p = project(v);
        if (p[2] <= 0.02) continue;
        ocean.moveTo(p[0] + 0.7, p[1]);
        ocean.arc(p[0], p[1], 0.7, 0, Math.PI * 2);
      }
      ctx.fillStyle = `rgba(${DOT}, 0.10)`;
      ctx.fill(ocean);

      // Titik daratan, dikelompokkan per tingkat alpha supaya fill-nya sedikit.
      const buckets: Path2D[] = [0, 1, 2, 3, 4, 5].map(() => new Path2D());
      for (const v of LAND) {
        const p = project(v);
        if (p[2] <= 0.02) continue;
        const depth = Math.min(1, p[2]);
        const size = 1.05 + 1.75 * depth;
        const level = Math.min(5, Math.floor(depth * 6));
        // moveTo dulu: tanpa itu canvas menyambung tiap titik dengan garis lurus
        // dari titik sebelumnya, dan hasilnya jadi lempeng polygon, bukan titik.
        buckets[level].moveTo(p[0] + size, p[1]);
        buckets[level].arc(p[0], p[1], size, 0, Math.PI * 2);
      }
      for (let i = 0; i < buckets.length; i += 1) {
        ctx.fillStyle = `rgba(${DOT}, ${(0.34 + i * 0.125).toFixed(3)})`;
        ctx.fill(buckets[i]);
      }

      // Rim tipis supaya batas bola tetap terbaca di atas latar gelap.
      ctx.strokeStyle = `rgba(${EMERALD}, 0.14)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    };

    resize();
    draw();

    const loop = (ts: number) => {
      const dt = lastTs ? Math.min(48, ts - lastTs) : 16;
      lastTs = ts;
      elapsed += dt / 1000;
      if (!dragging) yaw += dt * 0.00005; // ± 2 menit per putaran
      draw();
      frame = window.requestAnimationFrame(loop);
    };

    const play = () => {
      if (reduced || frame || !visible || !onScreen) return;
      lastTs = 0;
      frame = window.requestAnimationFrame(loop);
    };
    const pause = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTs = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture?.(event.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      yaw += (event.clientX - lastX) * 0.009;
      pitch = Math.max(-0.6, Math.min(0.6, pitch + (event.clientY - lastY) * 0.006));
      lastX = event.clientX;
      lastY = event.clientY;
      if (reduced) draw();
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            resize();
            draw();
          })
        : null;
    resizeObserver?.observe(canvas);

    const intersectionObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              onScreen = entry.isIntersecting;
              if (onScreen) play();
              else pause();
            },
            { rootMargin: "96px" },
          )
        : null;
    intersectionObserver?.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) play();
      else pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) draw();
    else play();

    return () => {
      pause();
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Globe titik-titik benua dengan empat busur rute emerald; geser untuk memutar"
        className="block h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
      />
    </div>
  );
}
