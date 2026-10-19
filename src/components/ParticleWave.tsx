"use client";

import { useEffect, useRef } from "react";

/* Particle wave mesh: satu bidang partikel yang bergelombang sinus, digambar
   dengan WebGL murni (tanpa three.js) supaya bundel tetap kecil dan ringan di HP.
   Layer ini murni dekorasi: aria-hidden + pointer-events-none, dan berhenti
   total saat tidak terlihat, tab disembunyikan, atau user minta reduced motion. */

const COLS = 56;
const ROWS = 36; // 2016 titik, di dalam rentang 1.500-2.500

const VERT = `
precision mediump float;

attribute vec2 aCell;      // koordinat grid 0..1
uniform float uTime;
uniform float uAspect;     // lebar / tinggi kanvas
uniform float uDpr;
uniform float uIsLine;

varying float vHeight;
varying float vFade;
varying float vGlow;

void main() {
  float x = (aCell.x - 0.5) * 2.0;   // -1..1: selebar kanvas, apa pun aspect-nya
  float z = aCell.y;                 // 0 dekat .. 1 jauh
  float dz = z - 0.5;
  float xa = x * clamp(uAspect / 3.2, 1.0, 2.4);

  float t = uTime;
  float h = sin(xa * 2.6 + z * 4.6 + t * 0.9) * 0.42
          + sin(xa * 5.4 - z * 3.1 - t * 0.6) * 0.16
          + sin(length(vec2(xa * 1.4, z * 3.0 - 1.4)) * 2.6 - t * 0.7) * 0.12;

  // Perspektif ringan: baris jauh menyempit ke tengah, baris dekat melebar
  // sampai tepi kanvas. Tanpa pembagi 1/z yang bikin baris dekat terlempar keluar.
  float depth = 0.5 - dz;            // 1 dekat .. 0 jauh
  float k = 0.60 + 0.40 * depth;
  float y = -0.18 + dz * 1.5 + h * 0.52 * k;

  gl_Position = vec4(x * k, y, 0.0, 1.0);

  vHeight = clamp((h + 0.70) / 1.40, 0.0, 1.0);
  vFade = 0.45 + 0.55 * depth;
  vGlow = k;

  gl_PointSize = uIsLine < 0.5 ? uDpr * (1.3 + 2.6 * k) * (0.8 + 0.55 * vHeight) : 1.0;
}
`;

const FRAG = `
precision mediump float;

uniform float uIsLine;
varying float vHeight;
varying float vFade;
varying float vGlow;

void main() {
  // Sky blue -> cyan -> emerald, mengikuti tinggi gelombang.
  vec3 sky = vec3(0.008, 0.518, 0.780);     // #0284c7
  vec3 cyan = vec3(0.024, 0.714, 0.831);    // #06b6d4
  vec3 emerald = vec3(0.063, 0.725, 0.506); // #10b981
  vec3 col = mix(sky, cyan, smoothstep(0.05, 0.55, vHeight));
  col = mix(col, emerald, smoothstep(0.55, 1.0, vHeight));

  float a = vFade * mix(0.28, 1.0, vGlow) * (uIsLine > 0.5 ? 0.28 : 0.78);

  if (uIsLine < 0.5) {
    // Partikel bulat dengan tepi lembut, bukan kotak.
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    a *= smoothstep(0.5, 0.06, d);
  }

  gl_FragColor = vec4(col * a, a); // premultiplied alpha
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

export default function ParticleWave({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const points: number[] = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        points.push(col / (COLS - 1), row / (ROWS - 1));
      }
    }

    // Kawat mesh: sambungan horizontal + vertikal antar partikel.
    const lines: number[] = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS - 1; col += 1) {
        lines.push(col / (COLS - 1), row / (ROWS - 1), (col + 1) / (COLS - 1), row / (ROWS - 1));
      }
    }
    for (let col = 0; col < COLS; col += 1) {
      for (let row = 0; row < ROWS - 1; row += 1) {
        lines.push(col / (COLS - 1), row / (ROWS - 1), col / (COLS - 1), (row + 1) / (ROWS - 1));
      }
    }

    const makeBuffer = (data: number[]) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      return buffer;
    };
    const pointBuffer = makeBuffer(points);
    const lineBuffer = makeBuffer(lines);

    const aCell = gl.getAttribLocation(program, "aCell");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uAspect = gl.getUniformLocation(program, "uAspect");
    const uDpr = gl.getUniformLocation(program, "uDpr");
    const uIsLine = gl.getUniformLocation(program, "uIsLine");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // aditif di atas latar gelap
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

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
      // Gelombang mengisi lebar kanvas; aspect hanya mengatur rapatnya riak.
      gl.uniform1f(uAspect, width / height);
      gl.uniform1f(uDpr, dpr);
    };

    const draw = (seconds: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, seconds);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
      gl.enableVertexAttribArray(aCell);
      gl.vertexAttribPointer(aCell, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(uIsLine, 0);
      gl.drawArrays(gl.POINTS, 0, points.length / 2);

      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
      gl.vertexAttribPointer(aCell, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(uIsLine, 1);
      gl.drawArrays(gl.LINES, 0, lines.length / 2);
    };

    resize();
    draw(0);

    let frame = 0;
    let start = 0;
    let visible = true;
    let onScreen = true;

    const loop = (ts: number) => {
      if (!start) start = ts;
      draw((ts - start) / 1000);
      frame = window.requestAnimationFrame(loop);
    };

    const play = () => {
      if (reduced || frame || !visible || !onScreen) return;
      frame = window.requestAnimationFrame(loop);
    };
    const pause = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      start = 0;
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);

    const intersectionObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              onScreen = entry.isIntersecting;
              if (onScreen) play();
              else pause();
            },
            { rootMargin: "128px" },
          )
        : null;
    intersectionObserver?.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) play();
      else pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      draw(0);
    } else {
      play();
    }

    return () => {
      pause();
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      gl.deleteBuffer(pointBuffer);
      gl.deleteBuffer(lineBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
