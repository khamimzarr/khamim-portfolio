"use client";
import { useState } from "react";

const NAV = [
  { href: "mailto:khamimzarrr@gmail.com", label: "Email" },
  { href: "https://github.com/khamimzarr", label: "GitHub" },
  { href: "https://instagram.com/bukann_bapakmu", label: "Instagram" },
  { href: "#karya", label: "Karya" },
  { href: "#exhibition", label: "Exhibition" },
];

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={open ? "Tutup menu" : "Buka menu"}
      aria-expanded={open}
      onClick={onClick}
      className="md:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 p-1.5 ml-2"
    >
      <span className={`block h-[1.5px] bg-black transition-all duration-300 w-5 ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
      <span className={`block h-[1.5px] bg-black transition-all duration-300 w-5 ${open ? "opacity-0" : ""}`} />
      <span className={`block h-[1.5px] bg-black transition-all duration-300 w-5 ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-[#c4c3b6] sticky top-0 z-40 border-b border-[#dfdcd5]/60 backdrop-blur-[2px]">
      <div className="w-full flex items-center justify-between px-6 md:px-10 h-[52px]">
        <a href="#" aria-label="KHAMIM ZARKASYI" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border-[1.5px] border-black flex items-center justify-center">
            <span className="font-[--font-davinci] text-[13px] font-medium tracking-[-0.5px]">K</span>
          </div>
          <span className="hidden sm:inline font-[--font-helvetica-now] text-[11px] tracking-[0.14em] uppercase font-medium text-black">
            Khamim Zarkasyi — Folio
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 md:gap-7">
          <a href="mailto:khamimzarrr@gmail.com" className="font-[Inter] text-[12px] font-normal text-black hover:underline underline-offset-4">
            khamimzarrr@gmail.com
          </a>
          <a href="https://github.com/khamimzarr" target="_blank" className="font-[Inter] text-[12px] font-normal text-black hover:underline underline-offset-4">
            GitHub
          </a>
          <a href="https://instagram.com/bukann_bapakmu" target="_blank" className="font-[Inter] text-[12px] font-normal text-black hover:underline underline-offset-4">
            Instagram
          </a>
          <a href="#karya" className="font-[Inter] text-[12px] font-normal text-black hover:underline underline-offset-4">
            Karya
          </a>
          <a href="#exhibition" className="font-[Inter] text-[12px] font-normal text-black hover:underline underline-offset-4">
            Exhibition
          </a>
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <MenuButton open={open} onClick={() => setOpen(!open)} />
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="md:hidden w-full border-t border-[#dfdcd5]/60 bg-[#c4c3b6] px-6 py-4 flex flex-col gap-3 animate-[revealUp_0.25s_ease_both]">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-[Inter] text-[13px] font-normal text-black py-1.5 hover:underline underline-offset-4"
            >
              {n.label}
              {n.href.startsWith("mailto:") && <span className="text-[#808080] text-[11px] ml-2">khamimzarrr@gmail.com</span>}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}