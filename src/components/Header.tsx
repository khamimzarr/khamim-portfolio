"use client";
import { useEffect, useState } from "react";

const NAV = [
  { href: "mailto:khamimzarrr@gmail.com", label: "Email" },
  { href: "https://github.com/khamimzarr", label: "GitHub" },
  { href: "https://instagram.com/bukann_bapakmu", label: "Instagram" },
  { href: "#karya", label: "Karya" },
  { href: "#exhibition", label: "Exhibition" },
];

function isExternal(href: string) {
  return href.startsWith("http");
}

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="w-full bg-[#111111] sticky top-0 z-40">
      <div className="w-full max-w-[1120px] mx-auto flex items-center justify-between px-6 md:px-10 h-11">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full border border-[#f5f5f7] flex items-center justify-center font-sans font-semibold text-[12px] text-[#f5f5f7]">
            K
          </span>
          <span className="hidden sm:inline font-sans font-semibold text-[17px] leading-[1.24] tracking-[-0.374px] text-[#f5f5f7]">
            Khamim Zarkasyi
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              {...(isExternal(n.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-sans text-[12px] leading-none tracking-[-0.12px] text-[#f5f5f7]/80 hover:text-[#f5f5f7]"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col items-center justify-center gap-[5px] w-11 h-11"
        >
          <span className={`block h-[1.5px] w-5 bg-[#f5f5f7] transition-transform duration-300 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-[#f5f5f7] transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-[#f5f5f7] transition-transform duration-300 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden w-full bg-[#111111] px-6 py-4 flex flex-col gap-1 hairline-top">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              {...(isExternal(n.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => setOpen(false)}
              className="font-sans text-[14px] leading-[1.29] tracking-[-0.224px] text-[#f5f5f7] py-3.5"
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
