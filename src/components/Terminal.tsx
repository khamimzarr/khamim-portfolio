"use client";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "./useReducedMotion";

type Line = { prompt: boolean; text: string };

/* Isi terminal = spesifikasi kerja, bukan data diri.
   Format neofetch: label rata kiri, nilai sejajar karena font mono. */
const SPECS = [
  ["OS / Host", "Web Runtime / khamimzar.my.id"],
  ["Stack", "TypeScript · Next.js · Node.js · Tailwind"],
  ["Tools", "Git · Vercel · Docker · Terminal CLI"],
  ["Focus", "Micro Web-Tools, Automation & Fast Delivery"],
  ["Status", "Available for builds & collaborations"],
] as const;

const SPEC_WIDTH = Math.max(...SPECS.map(([key]) => key.length)) + 2;
const specLine = ([key, value]: readonly [string, string]) => key.padEnd(SPEC_WIDTH) + value;

const TRANSCRIPT: Line[] = [
  { prompt: true, text: "neofetch" },
  ...SPECS.map((spec) => ({ prompt: false, text: specLine(spec) })),
];

const PROMPT = "khamim@folio:~$ ";

/* Typing rhythm: commands type slowly, output lands at once, like a real session. */
const TYPE_MS = 45;
const OUTPUT_PAUSE_MS = 180;
const LINE_PAUSE_MS = 420;
const START_DELAY_MS = 400;

function fullLine(entry: Line) {
  return (entry.prompt ? PROMPT : "") + entry.text;
}

const PLAIN_TRANSCRIPT = TRANSCRIPT.map(fullLine).join("\n");

const escapeHtml = (value: string) =>
  value.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char] as string);

export default function Terminal() {
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) {
      setLine(TRANSCRIPT.length);
      setChars(0);
      return;
    }
    if (!started || line >= TRANSCRIPT.length) return;

    const entry = TRANSCRIPT[line];
    const full = fullLine(entry);

    if (!entry.prompt) {
      const timer = setTimeout(() => {
        setLine((l) => l + 1);
        setChars(0);
      }, OUTPUT_PAUSE_MS);
      return () => clearTimeout(timer);
    }

    if (chars < full.length) {
      const delay = chars === 0 ? START_DELAY_MS : TYPE_MS;
      const timer = setTimeout(() => setChars((c) => c + 1), delay);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setLine((l) => l + 1);
      setChars(0);
    }, LINE_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [reduced, started, line, chars]);

  const visible = TRANSCRIPT.slice(0, line).map(fullLine);
  if (line < TRANSCRIPT.length) {
    const entry = TRANSCRIPT[line];
    const full = fullLine(entry);
    if (entry.prompt && chars > 0) visible.push(full.slice(0, chars));
    if (!entry.prompt && chars > 0) visible.push(full);
  }

  return (
    <div ref={host} className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[#1e1e22] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="eyebrow ml-2">khamim@folio: ~</span>
      </div>
      <pre
        tabIndex={0}
        aria-label="Spesifikasi dev environment: stack, tooling, dan fokus kerja Khamim"
        className="terminal-live mono m-0 min-h-[240px] overflow-x-auto whitespace-pre-wrap p-4 text-[12.5px] leading-[1.75] text-[#c0c0c8] focus-visible:outline-2 focus-visible:outline-[#b8f050]"
      >
        {visible.join("\n")}
        <span className="caret" />
      </pre>
      {/* Tanpa JavaScript animasinya tidak pernah jalan, jadi transkrip utuh tampil sebagai teks biasa */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<pre class="mono m-0 overflow-x-auto whitespace-pre-wrap p-4 text-[12.5px] leading-[1.75] text-[#c0c0c8]">${escapeHtml(
            PLAIN_TRANSCRIPT,
          )}</pre>`,
        }}
      />
    </div>
  );
}
