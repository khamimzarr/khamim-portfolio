"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "terminal", index: "01", label: "Terminal" },
  { id: "karya", index: "02", label: "Karya" },
  { id: "output", index: "03", label: "Output" },
  { id: "tentang", index: "04", label: "Tentang" },
];

const LINKS = [
  { href: "mailto:khamimzarrr@gmail.com", label: "Email", external: false },
  { href: "https://github.com/khamimzarr", label: "GitHub", external: true },
  { href: "https://instagram.com/bukann_bapakmu", label: "Instagram", external: true },
];

function Brand() {
  return (
    <span className="flex flex-col leading-none">
      <span className="mono text-[15px] font-medium tracking-[0.16em] text-[#e8e8ee]">KHAMIM</span>
      <span className="eyebrow mt-1">Folio</span>
    </span>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow px-3 pb-2 pt-6">{children}</p>;
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sections = (
    <nav className="flex flex-col gap-1">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={active === s.id}
          onClick={() => setOpen(false)}
          className="nav-row"
        >
          <span className="w-5 text-[11px]">{s.index}</span>
          <span>{s.label}</span>
        </a>
      ))}
    </nav>
  );

  const links = (
    <nav className="flex flex-col gap-1">
      {LINKS.map((l) => (
        <a
          key={l.label}
          href={l.href}
          {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={() => setOpen(false)}
          className="nav-row"
        >
          <span className="w-5 text-[11px]">↗</span>
          <span>{l.label}</span>
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-40 flex h-11 items-center justify-between border-b border-[#1e1e22] bg-[#0e0e10] px-4">
        <Brand />
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-11 h-11 flex-col items-center justify-center gap-[5px]"
        >
          <span className={`block h-[1.5px] w-5 bg-[#e8e8ee] transition-transform duration-200 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-[#e8e8ee] transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-[#e8e8ee] transition-transform duration-200 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-[#0e0e10] px-3 pb-8 pt-14 lg:hidden">
          <GroupLabel>Workspace</GroupLabel>
          {sections}
          <GroupLabel>Links</GroupLabel>
          {links}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[248px] flex-col border-r border-[#1e1e22] bg-[#0e0e10]">
        <div className="flex h-14 items-center border-b border-[#1e1e22] px-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <GroupLabel>Workspace</GroupLabel>
          {sections}
          <GroupLabel>Links</GroupLabel>
          {links}
        </div>
        <div className="flex items-center gap-3 border-t border-[#1e1e22] p-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2a2a30] mono text-[12px] text-[#e8e8ee]">
            K
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] text-[#e8e8ee]">Khamim Zarkasyi</span>
            <span className="eyebrow mt-1">Folio · 2026</span>
          </span>
        </div>
      </aside>
    </>
  );
}
