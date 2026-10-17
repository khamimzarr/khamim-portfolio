"use client";
import { useEffect, useRef, useState } from "react";
import useReducedMotion from "./useReducedMotion";

const TRANSCRIPT = [
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

const FULL = TRANSCRIPT.map((line) => (line.prompt ? "khamim@folio:~$ " : "") + line.text).join("\n");

export default function Terminal() {
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [shown, setShown] = useState(0);
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
      setShown(FULL.length);
      return;
    }
    if (!started) return;
    let index = 0;
    const id = setInterval(() => {
      index += 2;
      setShown(index);
      if (index >= FULL.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [reduced, started]);

  const done = reduced || shown >= FULL.length;
  const text = done ? FULL : FULL.slice(0, shown);

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
        className="mono m-0 overflow-x-auto whitespace-pre-wrap p-4 text-[12.5px] leading-[1.75] text-[#c0c0c8] focus-visible:outline-2 focus-visible:outline-[#b8f050]"
      >
        {text}
        {!done && <span className="caret" />}
      </pre>
    </div>
  );
}
