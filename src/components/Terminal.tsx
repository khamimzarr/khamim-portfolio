"use client";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "./useReducedMotion";

type Line = { prompt: boolean; text: string };

const TRANSCRIPT: Line[] = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: "Khamim Zarkasyi. Karya, foto, dan catatan kecil." },
  { prompt: true, text: "ls karya/" },
  { prompt: false, text: "hr-ai-review   ruang-resepsi   structur-md   dropdeploy" },
  { prompt: true, text: "cat karya/*/status" },
  { prompt: false, text: "live  hr-ai-review    https://hr-ai-review-nine.vercel.app" },
  { prompt: false, text: "live  ruang-resepsi   https://ruang-resepsi.vercel.app" },
  { prompt: false, text: "live  structur-md     https://structur-md.vercel.app" },
  { prompt: false, text: "live  dropdeploy      https://dropdeploy.my.id" },
  { prompt: true, text: "deploy --prod --yes" },
  { prompt: false, text: "4 project live. source terbuka di github.com/khamimzarr" },
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
        aria-label="Terminal ringkasan karya Khamim"
        className="mono m-0 min-h-[240px] overflow-x-auto whitespace-pre-wrap p-4 text-[12.5px] leading-[1.75] text-[#c0c0c8] focus-visible:outline-2 focus-visible:outline-[#b8f050]"
      >
        {visible.join("\n")}
        <span className="caret" />
      </pre>
    </div>
  );
}
