"use client";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "./useReducedMotion";

/* Isi terminal = spesifikasi kerja, bukan data diri.
   Format neofetch: label di kolom kiri, nilai di kolom kanan. Di layar HP
   nilai membungkus di kolomnya sendiri, jadi label tidak ikut terpotong. */
const SPECS = [
  ["OS / Host", "Web Runtime / khamimzar.my.id"],
  ["Stack", "TypeScript · Next.js · Node.js · Tailwind"],
  ["Tools", "Git · Vercel · Docker · Terminal CLI"],
  ["Focus", "Micro Web-Tools, Automation & Fast Delivery"],
  ["Status", "Available for builds & collaborations"],
] as const;

const COMMAND = "neofetch";
const PROMPT = "khamim@folio:~$ ";

/* Typing rhythm: perintah diketik pelan, baris output muncul berurutan. */
const TYPE_MS = 45;
const LINE_PAUSE_MS = 160;
const START_DELAY_MS = 400;

const escapeHtml = (value: string) =>
  value.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char] as string);

/* Cadangan tanpa JavaScript: markup yang sama, tanpa animasi. */
const NOSCRIPT_HTML = `<pre class="mono m-0 overflow-x-auto p-4 text-[11px] leading-[1.7] text-[#c0c0c8] sm:text-[12.5px]">${escapeHtml(
  PROMPT + COMMAND,
)}
${SPECS.map(([key, value]) => `${escapeHtml(key.padEnd(11))}${escapeHtml(value)}`).join("\n")}</pre>`;

export default function Terminal() {
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [chars, setChars] = useState(0);
  const [rows, setRows] = useState(0);
  const host = useRef<HTMLDivElement>(null);

  const commandDone = chars >= COMMAND.length;

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
      setChars(COMMAND.length);
      setRows(SPECS.length);
      return;
    }
    if (!started) return;

    if (chars < COMMAND.length) {
      const delay = chars === 0 ? START_DELAY_MS : TYPE_MS;
      const timer = setTimeout(() => setChars((c) => c + 1), delay);
      return () => clearTimeout(timer);
    }

    if (rows < SPECS.length) {
      const timer = setTimeout(() => setRows((r) => r + 1), LINE_PAUSE_MS);
      return () => clearTimeout(timer);
    }
  }, [reduced, started, chars, rows]);

  return (
    <div ref={host} className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[#1e1e22] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="eyebrow ml-2">khamim@folio: ~</span>
      </div>
      <div
        tabIndex={0}
        role="group"
        aria-label="Spesifikasi runtime: stack, tooling, dan fokus kerja Khamim"
        className="terminal-live mono min-h-[240px] p-4 text-[11px] leading-[1.7] text-[#c0c0c8] focus-visible:outline-2 focus-visible:outline-[#b8f050] sm:text-[12.5px] sm:leading-[1.75]"
      >
        <p className="m-0 break-words">
          <span className="text-[#8a8a94]">{PROMPT}</span>
          {COMMAND.slice(0, chars)}
          {!commandDone ? <span className="caret" /> : null}
        </p>
        <dl className="mt-2 grid grid-cols-[74px_1fr] gap-x-3 gap-y-0.5 sm:grid-cols-[88px_1fr]">
          {SPECS.slice(0, rows).map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-[#8a8a94]">{key}</dt>
              <dd className="m-0 break-words text-[#c0c0c8]">{value}</dd>
            </div>
          ))}
        </dl>
        {commandDone && rows >= SPECS.length ? <span className="caret mt-1 inline-block" /> : null}
      </div>
      {/* Tanpa JavaScript animasinya tidak pernah jalan, jadi transkrip utuh tampil sebagai teks biasa */}
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_HTML }} />
    </div>
  );
}
