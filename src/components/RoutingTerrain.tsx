"use client";

import { useEffect, useRef } from "react";

/* Terrain partikel untuk kartu 03 Routing.
   Beda konsep dari wave di panel hero: di sini bidang kisi (grid plane) dilihat
   dari sudut rendah, seperti lantai topografi/jaringan server yang bergelombang
   tenang di sumbu Z. Warna emerald -> cyber lime dengan slate untuk lembah,
   dan seluruh layer ditahan di ~22% opacity supaya diagram alur tetap juara. */

const COLS = 54;
const ROWS = 34; // 1.836 titik

const VERT = `
precision mediump float;

attribute vec2 aCell;      // koordinat grid 0..1
uniform float uTime;
uniform float uAspect;
uniform float uDpr;
uniform float uIsLine;

varying float vHeight;
varying float vFade;
varying float vGlow;

void main() {
  float x = (aCell.x - 0.5) * 2.0;   // selebar kanvas
  float z = aCell.y;                 // 0 dekat .. 1 jauh
  float dz = z - 0.5;
  float xa = x * clamp(uAspect / 2.0, 1.0, 2.6);

  float t = uTime * 0.55;
  // Riak menjalar di sumbu Z: lambat, ritmis, seperti denyut jaringan.
  float h = sin(z * 9.0 - t * 1.1 + xa * 1.6) * 0.30
          + sin(z * 4.5 + t * 0.6 - xa * 2.4) * 0.22
          + sin(length(vec2(xa * 1.2, z * 2.6 - 1.0)) * 3.4 - t * 0.8) * 0.10;

  // Sudut pandang rendah: baris jauh menyempit ke horizon, baris dekat melebar.
  float depth = 0.5 - dz;            // 1 dekat .. 0 jauh
  float k = 0.52 + 0.48 * depth;
  float y = -0.10 + dz * 1.62 + h * 0.42 * k;

  gl_Position = vec4(x * k, y, 0.0, 1.0);

  vHeight = clamp((h + 0.62) / 1.24, 0.0, 1.0);
  vFade = (0.35 + 0.65 * depth) * smoothstep(0.0, 0.10, z);
  vGlow = k;

  gl_PointSize = uIsLine < 0.5 ? uDpr * (1.0 + 1.9 * k) : 1.0;
}
`;

const FRAG = `
precision mediump float;

uniform float uIsLine;
varying float vHeight;
varying float vFade;
varying float vGlow;

void main() {
  vec3 slate = vec3(0.200, 0.255, 0.333);   // #334155
  vec3 emerald = vec3(0.063, 0.725, 0.506); // #10b981
  vec3 lime = vec3(0.639, 0.902, 0.208);    // #a3e635

  vec3 col = mix(slate, emerald, smoothstep(0.15, 0.62, vHeight));
  col = mix(col, lime, smoothstep(0.62, 1.0, vHeight));

  float a = vFade * mix(0.55, 1.0, vGlow) * (uIsLine > 0.5 ? 0.55 : 0.95);

  if (uIsLine < 0.5) {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    a *= smoothstep(0.5, 0.08, d);
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

export default function RoutingTerrain({ className = "" }: { className?: string }) {
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
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
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
