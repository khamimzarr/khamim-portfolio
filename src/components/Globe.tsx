"use client";

import { useEffect, useRef } from "react";
import ThreeGlobe from "three-globe";
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { decodeLandDots } from "./globe-land";

/* Globe jaringan untuk kartu "Global Network" di section 03.

   Render memakai three.js + three-globe, bukan shader tulis sendiri:

   - Bola benar-benar SphereGeometry, jadi bulat 3D utuh: tidak ada kutub
     terpotong rata dan tidak ada garis antena vertikal.
   - Peta daratan memakai 6.822 titik hasil rasterisasi Natural Earth 110m
     (point-in-polygon), bukan kisi heksagon, jadi bentuk benua mengikuti
     geografi asli.
   - Busur rute memakai Bézier 3D yang melayang di atas atmosfer, bukan
     lingkaran radar datar.
   - Marker Indonesia adalah satu titik kecil berdenyut plus gelombang yang
     merambat di permukaan bola, bukan target bidik konsentris.
   - Rim light memakai lapisan atmosphere three-globe, supaya siluet bola
     padat tanpa menambah kabut hijau di latar kartu.

   Referensi visual: Aceternity UI / GitHub Globe.

   Hemat daya: render berhenti saat kartu keluar viewport, tab disembunyikan,
   atau user meminta prefers-reduced-motion (satu frame statis; drag tetap
   menggambar ulang). */

type Arc = { startLat: number; startLng: number; endLat: number; endLng: number };

/* Rute antar node. three-globe mengangkat busur ke altitude sebagai Bézier,
   jadi tidak ada lagi great-circle datar yang menusuk wajah bola. */
const ARCS: Arc[] = [
  { startLat: -6.2, startLng: 106.8, endLat: 50.1, endLng: 8.7 }, // Jakarta - Frankfurt
  { startLat: 1.35, startLng: 103.8, endLat: 39.0, endLng: -77.5 }, // Singapore - Ashburn
  { startLat: 35.7, startLng: 139.7, endLat: -23.5, endLng: -46.6 }, // Tokyo - Sao Paulo
];

/* Satu marker aktif di Indonesia: titik kecil + gelombang denyut. */
const MARKER = { lat: -2, lng: 118 };

const EMERALD = "#10b981";
const LIME = "#a3e635";
const SLATE_NEAR = "#94a3b8";
const SLATE_FAR = "#64748b";
const BODY = 0x0f1318;
const GLOBE_RADIUS = 100;
const FOV = 30;

/* Ukuran & framing globe.

   Dulu jarak kamera diberi supaya BOLA mengisi 92% kanvas. Akibatnya busur
   (yang melayang 34% di atas permukaan) dan ekor glow atmosphere keluar dari
   frustum: isinya menyentuh x=0 dan hampir menyentuh tepi atas/bawah, jadi
   terlihat terpotong kotak.

   Sekarang yang dijadikan patokan adalah ISI TERLUAR globe (busur, karena
   paling jauh), lalu bola ikut mengecil sendiri. Hasilnya bola ~0.73 dari
   sisi kanvas (≈20% lebih kecil dari sebelumnya) dengan margin kosong di
   keempat sisi, jadi glow atmosphere memudar alami sebelum tepi. */
const OUTER_FILL = 0.93;
/* Busur digambar sebagai tube; tambah sedikit ruang untuk tebal tube,
   antialias, dan marker yang menonjol. Rotasi tidak menambah radius
   terluar (bola & busur berpusat di origin), jadi tidak perlu margin besar. */
const ARC_HEADROOM = 1.04;

/* Altitude relatif terhadap radius bola, dipakai dua tempat sekaligus:
   lapisan three-globe dan perhitungan jarak kamera. Kalau salah satu
   berubah tanpa yang lain, busur/glow akan terpotong tepi kanvas lagi. */
const ARC_ALTITUDE = 0.24;
const ATMOSPHERE_ALTITUDE = 0.16;

type Dot = { lat: number; lng: number; tone: number; marker?: boolean };

/* Daratan: 6.822 titik. Warna dipilih dari pola deterministik (bukan acak)
   supaya render stabil antar reload dan tidak berkedip. */
const LAND: Dot[] = decodeLandDots().map(([lat, lng]) => ({
  lat,
  lng,
  tone: Math.abs(Math.round(lat * 3 + lng)) % 3,
}));

const DOTS: Dot[] = [...LAND, { ...MARKER, tone: 0, marker: true }];

export default function Globe({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const canvasEl = renderer.domElement;
    canvasEl.style.display = "block";
    canvasEl.style.width = "100%";
    canvasEl.style.height = "100%";
    canvasEl.style.touchAction = "pan-y";
    canvasEl.style.cursor = "grab";
    host.appendChild(canvasEl);

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 1, GLOBE_RADIUS * 40);

    /* Jarak kamera dihitung dari radius ISI TERLUAR globe, bukan radius bola.
       Isi terluar = busur (altitude-nya paling jauh) dikali headroom untuk
       tebal tube + antialias. Bola lalu mengisi ~0.73 kanvas, jadi ada margin
       kosong di keempat sisi dan glow atmosphere memudar sebelum tepi. */
    const outerRadius =
      GLOBE_RADIUS * (1 + ARC_ALTITUDE) * ARC_HEADROOM;

    const fitCamera = (aspect: number) => {
      // Muat di kedua arah: batas vertikal (FOV) dan horizontal (FOV * aspect).
      // Ambil jarak terjauh, jadi globe tidak terpotong di sisi mana pun.
      const halfFov = (FOV * Math.PI) / 360;
      const dVertical = outerRadius / (OUTER_FILL * Math.tan(halfFov));
      const dHorizontal =
        outerRadius / (OUTER_FILL * Math.tan(halfFov) * Math.min(aspect, 1));
      const distance = Math.max(dVertical, dHorizontal);
      camera.aspect = aspect;
      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    fitCamera(1);

    const globe = new ThreeGlobe()
      .showGraticules(false)
      .showAtmosphere(true)
      .atmosphereColor(EMERALD)
      .atmosphereAltitude(ATMOSPHERE_ALTITUDE)
      .globeCurvatureResolution(2);

    /* Rim light: atmosphere three-globe (pelapis bola, shader glow). Intensitas
       bawaannya sangat redup (coefficient 0.1, power 3.5) sehingga di kartu
       gelap rim-nya nyaris tak terlihat. Dinaikkan lewat uniform materialnya
       supaya siluet bola padat, tanpa menaruh kabut hijau di latar kartu:
       glow ini hanya menempel di tepi bola, dan canvas-nya transparan. */
    const atmos = globe.children.find(
      (child) => (child as { __globeObjType?: string }).__globeObjType === "atmosphere",
    ) as unknown as {
      material?: { uniforms?: Record<string, { value: number }> };
    } | undefined;
    const uniforms = atmos?.material?.uniforms;
    if (uniforms?.coefficient) uniforms.coefficient.value = 0.42;
    if (uniforms?.power) uniforms.power.value = 2.4;
    type MaterialLike = {
      color?: { set(value: number): void };
      emissive?: { set(value: number): void };
      specular?: { set(value: number): void };
      shininess?: number;
      needsUpdate: boolean;
    };
    const material = globe.globeMaterial() as unknown as MaterialLike;
    material.color?.set(BODY);
    material.emissive?.set(0x05070a);
    material.specular?.set(0x0e1a1e);
    if (typeof material.shininess === "number") material.shininess = 8;
    material.needsUpdate = true;

    /* Titik daratan + marker dalam satu layer (three-globe hanya punya satu
       layer points). pointsMerge menggabungkan 6.823 titik jadi satu mesh,
       jadi satu draw call. */
    globe
      .pointsData(DOTS)
      .pointLat("lat")
      .pointLng("lng")
      .pointAltitude((d: object) => ((d as Dot).marker ? 0.016 : 0.012))
      .pointRadius((d: object) => ((d as Dot).marker ? 0.75 : 0.34))
      .pointResolution(6)
      .pointsMerge(true)
      .pointsTransitionDuration(0)
      .pointColor((d: object) => {
        const dot = d as Dot;
        if (dot.marker) return EMERALD;
        return dot.tone === 0 ? SLATE_NEAR : SLATE_FAR;
      });

    /* Busur orbit: Bézier 3D melayang tinggi di atas atmosfer, emerald ke
       cyber lime, putus-putus yang bergerak. */
    globe
      .arcsData(ARCS)
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcAltitude(ARC_ALTITUDE)
      .arcAltitudeAutoScale(0)
      .arcStroke(0.55)
      .arcCurveResolution(96)
      .arcCircularResolution(6)
      .arcColor([EMERALD, LIME])
      .arcDashLength(0.42)
      .arcDashGap(0.16)
      .arcDashInitialGap((d: object) => ((d as Arc).startLng % 7) / 7)
      .arcDashAnimateTime(4200);

    /* Gelombang denyut dari marker: merambat di permukaan bola dan makin
       redup saat melebar. Pengganti target bidik konsentris. */
    globe
      .ringsData([MARKER])
      .ringLat("lat")
      .ringLng("lng")
      .ringAltitude(0.006)
      .ringResolution(96)
      .ringMaxRadius(3.2)
      .ringPropagationSpeed(1.1)
      .ringRepeatPeriod(1500)
      .ringColor(() => ["rgba(16,185,129,0.85)", "rgba(163,230,53,0)"]);

    scene.add(globe);

    /* Cahaya: satu ambient ringan + satu directional dari kiri-atas-depan.
       Tanpa ini MeshPhongMaterial bola jadi hitam rata dan tidak terbaca
       sebagai benda bulat. */
    scene.add(new AmbientLight(0xffffff, 1.6));
    const key = new DirectionalLight(0xffffff, 2.1);
    key.position.set(-120, 90, 220);
    scene.add(key);
    const fill = new DirectionalLight(0x4b5563, 0.9);
    fill.position.set(180, -60, -160);
    scene.add(fill);

    let width = 1;
    let height = 1;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      // Jarak kamera ikut dihitung ulang: kanvas bukan selalu bujur sangkar
      // (di 375px dia 301x301, tapi di panel lebar bisa lebih pendek), dan
      // isi terluar harus tetap 74% dari sisi terpendek supaya tidak clipped.
      fitCamera(width / height);
    };
    resize();

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let yaw = -2.55; // buka menghadap Asia Tenggara
    let pitch = 0.18;
    let targetYaw = yaw;
    let targetPitch = pitch;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let manual = false;

    const draw = () => {
      globe.rotation.y = yaw;
      globe.rotation.x = pitch;
      renderer.render(scene, camera);
    };
    draw();

    let frame = 0;
    let lastTs = 0;
    let onScreen = true;
    let visible = true;

    const loop = (ts: number) => {
      const dt = lastTs ? Math.min(48, ts - lastTs) : 16;
      lastTs = ts;
      if (!dragging && !manual) targetYaw += dt * 0.000055; // ~110 detik per putaran
      // Easing lembut supaya drag tidak terasa kaku.
      yaw += (targetYaw - yaw) * 0.14;
      pitch += (targetPitch - pitch) * 0.14;
      draw();
      frame = window.requestAnimationFrame(loop);
    };

    const play = () => {
      if (reduced || frame || !onScreen || !visible) return;
      globe.resumeAnimation?.();
      lastTs = 0;
      frame = window.requestAnimationFrame(loop);
    };
    const pause = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTs = 0;
      globe.pauseAnimation?.();
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      manual = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvasEl.setPointerCapture?.(event.pointerId);
      canvasEl.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      targetYaw += (event.clientX - lastX) * 0.008;
      targetPitch = Math.max(
        -0.85,
        Math.min(0.85, targetPitch + (event.clientY - lastY) * 0.005),
      );
      lastX = event.clientX;
      lastY = event.clientY;
      if (reduced) {
        yaw = targetYaw;
        pitch = targetPitch;
        draw();
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      canvasEl.releasePointerCapture?.(event.pointerId);
      canvasEl.style.cursor = "grab";
    };

    canvasEl.addEventListener("pointerdown", onPointerDown);
    canvasEl.addEventListener("pointermove", onPointerMove);
    canvasEl.addEventListener("pointerup", onPointerUp);
    canvasEl.addEventListener("pointercancel", onPointerUp);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            resize();
            if (reduced) draw();
          })
        : null;
    resizeObserver?.observe(host);

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
    intersectionObserver?.observe(host);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) play();
      else pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduced) play();

    return () => {
      pause();
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      canvasEl.removeEventListener("pointermove", onPointerMove);
      canvasEl.removeEventListener("pointerup", onPointerUp);
      canvasEl.removeEventListener("pointercancel", onPointerUp);
      scene.clear();
      globe._destructor?.();
      renderer.dispose();
      canvasEl.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="Globe jaringan: titik-titik benua, tiga busur rute emerald melayang di atas atmosfer, dan marker berdenyut di Indonesia; geser untuk memutar"
      className={`block h-full w-full select-none ${className}`}
    />
  );
}
