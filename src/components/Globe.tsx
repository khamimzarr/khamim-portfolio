"use client";

import { useEffect, useRef } from "react";
import { LAND_COLS, LAND_MASK, LAND_ROWS } from "./globe-land";

/* Globe jaringan untuk kartu "Global Network" di section 03.
   WebGL murni (tanpa three.js dan tanpa cobe): benua, busur great-circle, dan
   marker Indonesia digambar di GPU lewat shader kecil. Rotasi, redup kedalaman,
   dan denyut marker dihitung di vertex shader, jadi tiap frame cuma beberapa
   draw call dan tetap ringan di HP.

   Ke-readingan visual:
   - titik benua pakai slate; sisi yang menghadap kamera (#64748b) lebih terang
     dan besar, sisi belakang (#475569) makin redup dan transparan -> bola
     terbaca bulat tanpa garis tepi;
   - tidak ada outline lingkaran sama sekali, siluetnya ikut warna kartu;
   - busur melayang di atas permukaan sebagai orbit, emerald ke cyber lime;
   - satu marker emerald di Indonesia berdenyut halus.

   Render berhenti saat kartu keluar viewport, tab disembunyikan, atau user
   minta prefers-reduced-motion (satu frame statis, drag tetap menggambar). */

type Vec3 = [number, number, number];

const toVec = (latDeg: number, lonDeg: number): Vec3 => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
};

// Palet: slate untuk benua, emerald + cyber lime untuk orbit dan marker.
const SLATE_NEAR = [203 / 255, 213 / 255, 225 / 255]; // #cbd5e1 sisi depan
const SLATE_FAR = [71 / 255, 85 / 255, 105 / 255]; // #475569 sisi belakang
const EMERALD = [16 / 255, 185 / 255, 129 / 255]; // #10b981
const LIME = [163 / 255, 230 / 255, 53 / 255]; // #a3e635

/* Marker aktif di Indonesia (lat -2, lon 118). */
const INDONESIA = toVec(-2, 118);

/* Rute antar node: [lat, lon] -> [lat, lon].
   Pasang dipilih dengan selisih bujur besar, jadi great-circle-nya melingkari
   kutub: proyeksinya sebagian besar di luar siluet bola, bukan melintas di
   depan wajahnya. Jalur yang melintas di tengah wajah bola terbaca sebagai
   "garis menusuk", dan itu yang harus dihindari. */
const ARCS: { from: [number, number]; to: [number, number] }[] = [
  { from: [-6.2, 106.8], to: [50.1, 8.7] }, // Jakarta - Frankfurt
  { from: [1.35, 103.8], to: [39.0, -77.5] }, // Singapore - Ashburn
  { from: [35.7, 139.7], to: [-23.5, -46.6] }, // Tokyo - Sao Paulo
];

/* Node di kedua ujung tiap rute: lingkaran emerald kecil, jadi garisnya
   terbaca sebagai koneksi antar node, bukan garis tanpa konteks. */
const ARC_NODES: Vec3[] = ARCS.flatMap((arc) => [
  toVec(arc.from[0], arc.from[1]),
  toVec(arc.to[0], arc.to[1]),
]);

const ARC_STEPS = 64;

/* Rotasi bola dipakai dua shader, jadi ditulis sekali di sini. */
const ROT = `
  float s = sin(uYaw), c = cos(uYaw);
  float x1 = aPos.x * c + aPos.z * s;
  float z1 = -aPos.x * s + aPos.z * c;
  float s2 = sin(uPitch), c2 = cos(uPitch);
  float y1 = aPos.y * c2 - z1 * s2;
  float z2 = aPos.y * s2 + z1 * c2;
`;

const POINT_VERT = `
precision mediump float;

attribute vec3 aPos;

uniform float uYaw;
uniform float uPitch;
uniform float uAspect;
uniform float uDpr;
uniform float uTime;
uniform float uSize;
uniform float uAlpha;
uniform float uScale;
uniform vec3 uNear;
uniform vec3 uFar;

varying vec3 vColor;
varying float vAlpha;

void main() {
  ${ROT}

  // Proyeksi ortografis murni: bola bulat sempurna di layar. Volume dibaca
  // dari ukuran titik, cahaya, dan redup kedalaman - bukan dari skala
  // per-titik, supaya shader bola dan shader busur memakai koordinat yang
  // sama (oklusi jadi akurat).
  gl_Position = vec4(x1 * uScale / uAspect, y1 * uScale, 0.0, 1.0);

  // Cahaya directional dari kiri-atas-depan: sisi yang menghadap cahaya
  // lebih terang, sisi belakang meredup. Ini yang bikin bola terasa 3D.
  float diffuse = max(0.0, x1 * -0.35 + y1 * 0.45 + z2 * 0.82);
  float lit = 0.75 + 0.45 * diffuse;

  float front = clamp(z2 * 0.5 + 0.5, 0.0, 1.0);
  vColor = mix(uFar, uNear, smoothstep(0.18, 0.88, front)) * lit;

  float twinkle = 0.94 + 0.06 * sin(uTime * 2.2 + aPos.x * 11.0 + aPos.y * 7.0 + aPos.z * 5.0);

  // Depth attenuation: belakang jauh lebih redup, tapi tidak hilang total,
  // supaya benua di sisi Seam tetap punya bentuk.
  float depthFade = mix(0.42, 1.0, smoothstep(-0.25, 0.45, z2));

  vAlpha = uAlpha * twinkle * depthFade;
  // Titik di sisi belakang mengecil, titik di sisi depan membesar.
  gl_PointSize = uDpr * uSize * (0.62 + 0.38 * front);
}
`;

const POINT_FRAG = `
precision mediump float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  // Titik padat dengan tepi lembut satu piksel: benua terbaca sebagai
  // peta bertitik, bukan sebagai kabut.
  float a = smoothstep(0.5, 0.38, d);
  gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);
}
`;

const ARC_VERT = `
precision mediump float;

attribute vec3 aPos;
attribute float aTint;
attribute float aSide;
attribute vec3 aTangent;

uniform float uYaw;
uniform float uPitch;
uniform float uAspect;
uniform float uArcAlpha;
uniform float uScale;
uniform float uWidth;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3 vColor;
varying float vAlpha;

void main() {
  ${ROT}

  // Busur digambar sebagai pita, bukan gl.LINES: garis WebGL selalu 1
  // piksel device, jadi saat globe diperbesar busurnya jadi hairline.
  // Pita punya lebar yang bisa diatur dan tetap nempel di permukaan bola.
  //
  // Arah tangensial busur diputar sama seperti posisinya, lalu diproyeksikan
  // ke layar. Normalnya tegak lurus arah itu, jadi pita melintang busur.
  float ts = sin(uYaw), tc = cos(uYaw);
  float tx1 = aTangent.x * tc + aTangent.z * ts;
  float tz1 = -aTangent.x * ts + aTangent.z * tc;
  float ps = sin(uPitch), pc = cos(uPitch);
  float ty1 = aTangent.y * pc - tz1 * ps;

  vec2 p = vec2(x1 * uScale / uAspect, y1 * uScale);
  vec2 tp = vec2(tx1 * uScale / uAspect, ty1 * uScale);

  vec2 dir = vec2(1.0, 0.0);
  float len = length(tp);
  if (len > 1e-5) dir = tp / len;
  vec2 perp = vec2(-dir.y, dir.x);

  p += perp * aSide * uWidth;

  gl_Position = vec4(p.x, p.y, 0.0, 1.0);
  vColor = mix(uColorA, uColorB, aTint);

  // Oklusi bola: untuk proyeksi ortografis, permukaan depan bola pada
  // posisi layar (x1, y1) punya kedalaman sqrt(1 - r^2). Busur yang
  // berada di belakang permukaan itu disembunyikan, jadi tidak pernah
  // terbaca sebagai garis yang menusuk globe.
  //
  // Titik yang menempel di permukaan (z2 == zFront) harus tetap terlihat
  // penuh; titik di hemisfer belakang (z2 == -zFront) harus hilang total.
  //
  // Oklusi dihitung dari garis tengah, bukan dari tepi pita, supaya pita
  // tidak munculmenusuk siluet bola.
  float r2 = x1 * x1 + y1 * y1;
  float visible = 1.0;
  if (r2 <= 1.0) {
    float zFront = sqrt(max(0.0, 1.0 - r2));
    visible = smoothstep(zFront - 0.14, zFront - 0.02, z2);
  }

  // Sabuk luar saja: great-circle yang melintasi tengah bola selalu
  // memproyeksikan diri sebagai garis di depan wajah bola, dan itu yang
  // terbaca sebagai "garis menusuk". Kalau busur pudar di bagian tengah
  // disc, dia terbaca sebagai ring orbit yang muncul dari balik bola.
  float r = sqrt(r2);
  float limb = smoothstep(0.52, 0.86, r);
  // Di luar siluet bola, busur boleh penuh (bagian yang melayang).
  float outside = smoothstep(0.92, 1.02, r);

  vAlpha = uArcAlpha * visible * max(limb, outside);
}
`;

const ARC_FRAG = `
precision mediump float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(vColor * vAlpha, vAlpha);
}
`;

const MARKER_VERT = `
precision mediump float;

attribute vec3 aPos;

uniform float uYaw;
uniform float uPitch;
uniform float uAspect;
uniform float uDpr;
uniform float uTime;
uniform float uScale;
uniform float uSize;
uniform float uPulseOn;

varying float vPulse;
varying float vDepth;

void main() {
  ${ROT}
  gl_Position = vec4(x1 * uScale / uAspect, y1 * uScale, 0.0, 1.0);
  vDepth = z2;
  // Denyut halus: denyut lambat dari 0,45 ke 1,0. Node rute tidak berdenyut.
  float beat = 0.5 + 0.5 * sin(uTime * 3.2);
  vPulse = mix(1.0, 0.45 + 0.55 * beat, uPulseOn);
  gl_PointSize = uDpr * uSize;
}
`;

const MARKER_FRAG = `
precision mediump float;

uniform vec3 uMarkerColor;

varying float vPulse;
varying float vDepth;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));

  // Inti marker.
  float core = smoothstep(0.13, 0.02, d);
  // Cincin tipis di sekeliling inti: bikin marker terbaca sebagai penanda
  // aktif, bukan sekadar titik biasa.
  float ring = smoothstep(0.045, 0.0, abs(d - 0.32));

  float a = (core + ring * 0.9) * vPulse;
  if (vDepth < 0.0) a = 0.0; // hilang saat di sisi belakang bola
  gl_FragColor = vec4(uMarkerColor * a, a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function makeProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  return { program: p, vs: v, fs: f };
}

export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const pointProg = makeProgram(gl, POINT_VERT, POINT_FRAG);
    const arcProg = makeProgram(gl, ARC_VERT, ARC_FRAG);
    const markerProg = makeProgram(gl, MARKER_VERT, MARKER_FRAG);
    if (!pointProg || !arcProg || !markerProg) return;

    /* Titik daratan diambil dari peta 144 x 72 (2,5 derajat), lalu disaring
       supaya jaraknya renggang: kalau terlalu padat, benua berubah jadi gumpalan
       dan mesh, bukan bentuk yang bisa dibaca. Titik laut jauh lebih jarang
       dan sangat redup: tugasnya cuma memberi volume bola. Baris kutub
       dilewati: lintang kutub membentuk cincin konsentris yang terbaca sebagai
       ripple asing, dan Antarctica jadi gumpalan padat di bawah bola. */
    const landPoints: number[] = [];
    const oceanPoints: number[] = [];
    for (let row = 0; row < LAND_ROWS; row += 1) {
      const line = LAND_MASK[row] ?? "";
      const lat = 90 - ((row + 0.5) * 180) / LAND_ROWS;
      const polar = Math.abs(lat) > 58;
      for (let col = 0; col < LAND_COLS; col += 1) {
        const lon = -180 + ((col + 0.5) * 360) / LAND_COLS;
        const hash = (col * 73 + row * 151) % 11;
        if (line[col] === "#") {
          if (!polar && hash < 8) {
            // Titik digeser sedikit supaya tidak forming baris lurus.
            const dLat = ((hash - 3) * 0.05 * (180 / LAND_ROWS));
            const dLon = (((hash * 3) % 5) - 2) * 0.05 * (360 / LAND_COLS);
            const v = toVec(lat + dLat, lon + dLon);
            landPoints.push(v[0], v[1], v[2]);
          }
        } else if (!polar && hash < 1) {
          const jitter = ((col * 37) % 11) * 0.02;
          const vj = toVec(lat + jitter, lon);
          oceanPoints.push(vj[0], vj[1], vj[2]);
        }
      }
    }

    /* Busur: great-circle yang diangkat di tengah (sin pi t) supaya melayang
       di luar permukaan bola. Digambar putus-putus: jalur rata yang menembus
       bola terbaca sebagai "garis menusuk", ritme putus-putus terbaca sebagai
       lintasan orbit.

       Busur digambar sebagai pita (ribbon), bukan gl.LINES: garis WebGL
       selalu 1 piksel device, jadi begitu globe diperbesar busurnya jadi
       hairline. Tiap titik pita digeser tegak lurus arah busur, jadi pita
       tetap membingkar di permukaan bola dan tidak keluar dari bola. */
    const arcPositions: number[] = [];
    const arcTangents: number[] = [];
    const arcSides: number[] = [];
    const arcTints: number[] = [];
    for (const arc of ARCS) {
      const a = toVec(arc.from[0], arc.from[1]);
      const b = toVec(arc.to[0], arc.to[1]);
      const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const theta = Math.acos(dot);
      const s = Math.sin(theta) || 1;

      // Dua titik tiap segmen: posisi dan tangent-nya.
      const pt = (t: number) => {
        const w0 = Math.sin((1 - t) * theta) / s;
        const w1 = Math.sin(t * theta) / s;
        // Busur menempel permukaan bola: bagian belakang disembunyikan
        // oklusi, jadi separuh yang terlihat mengikuti lekukan bola
        // alih-alih memotong wajahnya. Lift nyaris nol supaya busur
        // benar-benar menempel kulit bola.
        const lift = 1 + Math.sin(Math.PI * t) * 0.02;
        const pos: Vec3 = [
          (a[0] * w0 + b[0] * w1) * lift,
          (a[1] * w0 + b[1] * w1) * lift,
          (a[2] * w0 + b[2] * w1) * lift,
        ];
        // Tangen: turunan great-circle terhadap t.
        const d0 = Math.cos((1 - t) * theta) / s;
        const d1 = Math.cos(t * theta) / s;
        const tangent: Vec3 = [
          (a[0] * d0 + b[0] * d1) * lift,
          (a[1] * d0 + b[1] * d1) * lift,
          (a[2] * d0 + b[2] * d1) * lift,
        ];
        return { pos, tangent, t };
      };

      for (let i = 0; i < ARC_STEPS; i += 1) {
        // Ritme putus-putus: dua segmen menyala, satu jeda.
        if (i % 3 === 2) continue;
        const p0 = pt(i / ARC_STEPS);
        const p1 = pt((i + 1) / ARC_STEPS);
        // Dua segitiga: pita dari p0 ke p1, sisi -1 dan +1.
        const corners: [{ pos: Vec3; tangent: Vec3; t: number }, number][] = [
          [p0, -1], [p0, 1], [p1, -1],
          [p1, -1], [p0, 1], [p1, 1],
        ];
        for (const [c, side] of corners) {
          arcPositions.push(c.pos[0], c.pos[1], c.pos[2]);
          arcTangents.push(c.tangent[0], c.tangent[1], c.tangent[2]);
          arcSides.push(side);
          arcTints.push(c.t);
        }
      }
    }

    const makeBuffer = (data: number[]) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      return buffer;
    };

    const landBuffer = makeBuffer(landPoints);
    const oceanBuffer = makeBuffer(oceanPoints);
    const arcBuffer = makeBuffer(arcPositions);
    const arcTangentBuffer = makeBuffer(arcTangents);
    const arcSideBuffer = makeBuffer(arcSides);
    const arcTintBuffer = makeBuffer(arcTints);
    const markerBuffer = makeBuffer([INDONESIA[0], INDONESIA[1], INDONESIA[2]]);
    const nodeBuffer = makeBuffer(ARC_NODES.flat());

    const pPos = gl.getAttribLocation(pointProg.program, "aPos");
    const pTime = gl.getUniformLocation(pointProg.program, "uTime");
    const pYaw = gl.getUniformLocation(pointProg.program, "uYaw");
    const pPitch = gl.getUniformLocation(pointProg.program, "uPitch");
    const pAspect = gl.getUniformLocation(pointProg.program, "uAspect");
    const pDpr = gl.getUniformLocation(pointProg.program, "uDpr");
    const pSize = gl.getUniformLocation(pointProg.program, "uSize");
    const pAlpha = gl.getUniformLocation(pointProg.program, "uAlpha");
    const pScale = gl.getUniformLocation(pointProg.program, "uScale");
    const pNear = gl.getUniformLocation(pointProg.program, "uNear");
    const pFar = gl.getUniformLocation(pointProg.program, "uFar");

    const aPos = gl.getAttribLocation(arcProg.program, "aPos");
    const aTint = gl.getAttribLocation(arcProg.program, "aTint");
    const aSide = gl.getAttribLocation(arcProg.program, "aSide");
    const aTangent = gl.getAttribLocation(arcProg.program, "aTangent");
    const aYaw = gl.getUniformLocation(arcProg.program, "uYaw");
    const aPitch = gl.getUniformLocation(arcProg.program, "uPitch");
    const aAspect = gl.getUniformLocation(arcProg.program, "uAspect");
    const aAlpha = gl.getUniformLocation(arcProg.program, "uArcAlpha");
    const aScale = gl.getUniformLocation(arcProg.program, "uScale");
    const aWidth = gl.getUniformLocation(arcProg.program, "uWidth");
    const aColorA = gl.getUniformLocation(arcProg.program, "uColorA");
    const aColorB = gl.getUniformLocation(arcProg.program, "uColorB");

    const mPos = gl.getAttribLocation(markerProg.program, "aPos");
    const mTime = gl.getUniformLocation(markerProg.program, "uTime");
    const mYaw = gl.getUniformLocation(markerProg.program, "uYaw");
    const mPitch = gl.getUniformLocation(markerProg.program, "uPitch");
    const mAspect = gl.getUniformLocation(markerProg.program, "uAspect");
    const mDpr = gl.getUniformLocation(markerProg.program, "uDpr");
    const mScale = gl.getUniformLocation(markerProg.program, "uScale");
    const mSize = gl.getUniformLocation(markerProg.program, "uSize");
    const mPulseOn = gl.getUniformLocation(markerProg.program, "uPulseOn");
    const mColor = gl.getUniformLocation(markerProg.program, "uMarkerColor");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // warna sudah premultiplied
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let yaw = -0.15; // buka menghadap Afrika, Asia, dan Indonesia sekaligus
    let pitch = 0.12;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let onScreen = true;
    let frame = 0;
    let start = 0;
    let lastTs = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (seconds: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      const aspect = width / height;
      // Skala bola: bola mengisi hampir seluruh kanvas, jadi di kartu
      // selebar ~950px globe-nya terbaca sebagai elemen utama, bukan
      // aksen kecil. Sisa ruang dipakai busur yang melayang di luar siluet.
      const scale = 0.60;

      gl.useProgram(pointProg.program);
      gl.uniform1f(pTime, seconds);
      gl.uniform1f(pYaw, yaw);
      gl.uniform1f(pPitch, pitch);
      gl.uniform1f(pAspect, aspect);
      gl.uniform1f(pDpr, dpr);
      gl.uniform1f(pScale, scale);
      gl.uniform3fv(pNear, SLATE_NEAR);
      gl.uniform3fv(pFar, SLATE_FAR);
      gl.enableVertexAttribArray(pPos);

      // Badan bola: titik laut sangat redup.
      gl.uniform1f(pSize, 1.85);
      gl.uniform1f(pAlpha, 0.20);
      gl.bindBuffer(gl.ARRAY_BUFFER, oceanBuffer);
      gl.vertexAttribPointer(pPos, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, oceanPoints.length / 3);

      // Benua: slate, terang di sisi depan. Ukuran titik ikut skala globe,
      // supaya kepadatanSampling tetap sama saat globe diperbesar.
      gl.uniform1f(pSize, 4.4);
      gl.uniform1f(pAlpha, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, landBuffer);
      gl.vertexAttribPointer(pPos, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, landPoints.length / 3);

      // Marker Indonesia: emerald, berdenyut, hilang saat di belakang bola.
      gl.useProgram(markerProg.program);
      gl.uniform1f(mTime, seconds);
      gl.uniform1f(mYaw, yaw);
      gl.uniform1f(mPitch, pitch);
      gl.uniform1f(mAspect, aspect);
      gl.uniform1f(mDpr, dpr);
      gl.uniform1f(mScale, scale);
      // Ukuran marker ikut skala globe (diameter bola 179 -> 228 px), jadi
      // cincinnya tetap sepadan dengan bola, bukan jadi titik kecil.
      gl.uniform1f(mSize, 37);
      gl.uniform1f(mPulseOn, 1);
      gl.uniform3fv(mColor, EMERALD);
      gl.bindBuffer(gl.ARRAY_BUFFER, markerBuffer);
      gl.enableVertexAttribArray(mPos);
      gl.vertexAttribPointer(mPos, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, 1);

      // Node rute: cincin emerald kecil di tiap ujung busur, tanpa denyut.
      gl.uniform1f(mSize, 22);
      gl.uniform1f(mPulseOn, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, nodeBuffer);
      gl.vertexAttribPointer(mPos, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, ARC_NODES.length);

      // Busur orbit: emerald ke cyber lime.
      gl.useProgram(arcProg.program);
      gl.uniform1f(aYaw, yaw);
      gl.uniform1f(aPitch, pitch);
      gl.uniform1f(aAspect, aspect);
      gl.uniform1f(aAlpha, 0.7);
      gl.uniform1f(aScale, scale);
      gl.uniform3fv(aColorA, EMERALD);
      gl.uniform3fv(aColorB, LIME);
      // Lebar pita: 1,6 piksel CSS per sisi, jadi total ~3,2 piksel CSS.
      // NDC y membentang 2 unit di seluruh tinggi kanvas (height piksel
      // CSS), jadi 1 piksel CSS = 2 / height unit NDC. Lebar sengaja
      // tidak dibagi dpr, biar tebalnya sama di layar biasa dan retina.
      // Kanvas selalu bujur sangkar, jadi arah x punya skala sama.
      gl.uniform1f(aWidth, (1.6 * 2) / height);
      gl.bindBuffer(gl.ARRAY_BUFFER, arcBuffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aTangent);
      gl.bindBuffer(gl.ARRAY_BUFFER, arcTangentBuffer);
      gl.vertexAttribPointer(aTangent, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aSide);
      gl.bindBuffer(gl.ARRAY_BUFFER, arcSideBuffer);
      gl.vertexAttribPointer(aSide, 1, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aTint);
      gl.bindBuffer(gl.ARRAY_BUFFER, arcTintBuffer);
      gl.vertexAttribPointer(aTint, 1, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, arcPositions.length / 3);
    };

    resize();
    draw(0);

    const loop = (ts: number) => {
      if (!start) start = ts;
      const dt = lastTs ? Math.min(48, ts - lastTs) : 16;
      lastTs = ts;
      if (!dragging) yaw += dt * 0.00007; // sekitar 90 detik per putaran
      draw((ts - start) / 1000);
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
      yaw += (event.clientX - lastX) * 0.008;
      pitch = Math.max(-0.6, Math.min(0.6, pitch + (event.clientY - lastY) * 0.005));
      lastX = event.clientX;
      lastY = event.clientY;
      if (reduced) draw(0);
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
            if (reduced) draw(0);
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

    if (!reduced) play();

    return () => {
      pause();
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      gl.deleteBuffer(landBuffer);
      gl.deleteBuffer(oceanBuffer);
      gl.deleteBuffer(arcBuffer);
      gl.deleteBuffer(arcTangentBuffer);
      gl.deleteBuffer(arcSideBuffer);
      gl.deleteBuffer(arcTintBuffer);
      gl.deleteBuffer(markerBuffer);
      gl.deleteBuffer(nodeBuffer);
      gl.deleteProgram(pointProg.program);
      gl.deleteProgram(arcProg.program);
      gl.deleteProgram(markerProg.program);
      gl.deleteShader(pointProg.vs);
      gl.deleteShader(pointProg.fs);
      gl.deleteShader(arcProg.vs);
      gl.deleteShader(arcProg.fs);
      gl.deleteShader(markerProg.vs);
      gl.deleteShader(markerProg.fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Globe jaringan titik-titik benua dengan tiga busur rute emerald dan marker Indonesia; geser untuk memutar"
      className={`block h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing ${className}`}
    />
  );
}
