"use client";
import { useState } from "react";

const NAV = [
  { href: "mailto:khamimzarrr@gmail.com", label: "Email" },
  { href: "https://github.com/khamimzarr", label: "GitHub" },
  { href: "https://instagram.com/bukann_bapakmu", label: "Instagram" },
  { href: "#karya", label: "Karya" },
  { href: "#exhibition", label: "Exhibition" },
];

function LogoMark() {
  return (
    <span className="text-signal-lime flex items-center" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M3 1.5 L12 7 L3 12.5 Z" />
      </svg>
    </span>
  );
}

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={open ? "Tutup menu" : "Buka menu"}
      aria-expanded={open}
      onClick={onClick}
      className="md:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 p-1.5 ml-2"
    >
      <span className={`block h-[1.5px] bg-bone-text transition-all duration-300 w-5 ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
      <span className={`block h-[1.5px] bg-bone-text transition-all duration-300 w-5 ${open ? "opacity-0" : ""}`} />
      <span className={`block h-[1.5px] bg-bone-text transition-all duration-300 w-5 ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-slate-canvas/95 sticky top-0 z-40 border-b border-steel-border backdrop-blur-[2px]">
      <div className="w-full flex items-center justify-between px-6 md:px-10 h-[52px]">
        <a href="#" aria-label="KHAMIM ZARKASYI" className="flex items-center gap-3 group">
          <LogoMark />
          <span className="hidden sm:inline font-sans text-[14px] tracking-[0.4px] font-semibold text-bone-text">
            Khamim Zarkasyi — Folio
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 md:gap-7">
          <a href="mailto:khamimzarrr@gmail.com" className="font-sans text-[14px] text-cloud-text hover:text-bone-text transition-colors">
            khamimzarrr@gmail.com
          </a>
          <a href="https://github.com/khamimzarr" target="_blank" className="font-sans text-[14px] text-cloud-text hover:text-bone-text transition-colors">
            GitHub
          </a>
          <a href="https://instagram.com/bukann_bapakmu" target="_blank" className="font-sans text-[14px] text-cloud-text hover:text-bone-text transition-colors">
            Instagram
          </a>
          <a href="#karya" className="font-sans text-[14px] text-cloud-text hover:text-bone-text transition-colors">
            Karya
          </a>
          <a href="#exhibition" className="font-sans text-[14px] text-cloud-text hover:text-bone-text transition-colors">
            Exhibition
          </a>
          <a href="mailto:khamimzarrr@gmail.com" className="bg-signal-lime text-ink-well rounded-[4px] px-4 py-2 font-sans text-[14px] font-medium">
            Hubungi
          </a>
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <MenuButton open={open} onClick={() => setOpen(!open)} />
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden w-full border-t border-steel-border bg-slate-canvas px-6 py-4 flex flex-col gap-3">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-sans text-[14px] text-cloud-text py-1.5 hover:text-bone-text transition-colors"
            >
              {n.label}
              {n.href.startsWith("mailto:") && <span className="text-fog-text text-[14px] ml-2">khamimzarrr@gmail.com</span>}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
