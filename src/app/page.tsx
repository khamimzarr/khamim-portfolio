import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Reveal from "@/components/Reveal";
import RoutingDiagram from "@/components/RoutingDiagram";
import MeshBackdrop from "@/components/MeshBackdrop";
import Terminal from "@/components/Terminal";

const outputs = [
  {
    name: "hr-ai-review",
    shot: "/output/hr-ai-review.jpg",
    live: "https://hr-ai-review-nine.vercel.app",
    alt: "Tampilan hr-ai-review: hero dan kartu ATS Score",
  },
  {
    name: "ruang-resepsi",
    shot: "/output/ruang-resepsi.jpg",
    live: "https://ruang-resepsi.vercel.app",
    alt: "Tampilan ruang-resepsi: hero undangan digital",
  },
  {
    name: "structur-md",
    shot: "/output/structur-md.jpg",
    live: "https://structur-md.vercel.app",
    alt: "Tampilan structur-md: hero URL ke Markdown",
  },
  {
    name: "dropdeploy",
    shot: "/output/dropdeploy.jpg",
    live: "https://dropdeploy.my.id",
    alt: "Tampilan dropdeploy: hero tarik dan lepas .zip",
  },
];

/* Diperbarui manual tiap ada perubahan besar, biar panelnya tetap jujur. */
const log = [
  { hash: "a11y", text: "kontras nav + konten tetap terbaca tanpa JS" },
  { hash: "perf", text: "AVIF/WebP, quality 68, sizes diperbaiki" },
  { hash: "sec", text: "CSP + header keamanan di semua path" },
  { hash: "seo", text: "JSON-LD, manifest, theme-color" },
];

const projects = [
  {
    name: "hr-ai-review",
    desc: "Unggah PDF CV, terima analisis dan skor.",
    lang: "JavaScript",
    href: "https://github.com/khamimzarr/hr-ai-review",
    vercel: "https://hr-ai-review-nine.vercel.app",
  },
  {
    name: "ruang-resepsi",
    desc: "Undangan digital pernikahan, satu tautan per tamu, aktif 7 hari.",
    lang: "HTML",
    href: "https://github.com/khamimzarr/ruang-resepsi",
    vercel: "https://ruang-resepsi.vercel.app",
  },
  {
    name: "structur-md",
    desc: "Ubah URL jadi Markdown dan ekstrak struktur halaman.",
    lang: "TypeScript",
    href: "https://github.com/khamimzarr/structur-md",
    vercel: "https://structur-md.vercel.app",
  },
  {
    name: "dropdeploy",
    desc: "Deploy dari browser: jatuhkan .zip, langsung live di Vercel dan GitHub.",
    lang: "TypeScript",
    href: "https://github.com/khamimzarr/dropdeploy",
    vercel: "https://dropdeploy.my.id",
  },
];

function SectionHead({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title?: string;
  description?: string;
}) {
  return (
    <div>
      <p className="eyebrow">
        {index} / {label}
      </p>
      {title ? (
        <h2 className="mt-3 text-[26px] font-medium leading-[1.15] tracking-[-0.01em] text-[#e8e8ee] md:text-[34px]">
          {title}
        </h2>
      ) : null}
      {description ? <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.6] text-[#c0c0c8]">{description}</p> : null}
      <div className="rule-dotted mt-6" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#080808]">
      <div className="dot-grid" aria-hidden />
      <Sidebar />

      <main className="relative z-10 px-5 pb-20 pt-16 md:px-8 lg:ml-[248px] lg:pt-10">
        <div className="mx-auto flex max-w-[1000px] flex-col">
          {/* Hero */}
          <section id="top">
            <p className="eyebrow">Console</p>
            <h1 className="sr-only">Khamim Zarkasyi</h1>

            <div className="panel mt-8 flex flex-col justify-between gap-6 p-5 md:flex-row md:items-center md:p-6">
              <div>
                <p className="eyebrow">Profile</p>
                <p className="mt-2 text-[22px] leading-[1.2] text-[#e8e8ee]">Khamim Zarkasyi</p>
                <p className="mono mt-2 text-[12px] tracking-[0.04em] text-[#8a8a94]">
                  BASED: INDONESIA · EST. 2026 · KARYA
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:khamimzarrr@gmail.com" className="btn-accent min-h-[44px] px-4">
                  Kontak
                </a>
                <a
                  href="https://github.com/khamimzarr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost min-h-[44px] px-4"
                >
                  github
                </a>
              </div>
            </div>
          </section>

          {/* Terminal */}
          <section id="terminal" className="scroll-mt-16 pt-16">
            <SectionHead index="01" label="Terminal" title="Ringkasan karya, versi terminal." />
            <Reveal className="mt-6">
              <Terminal />
            </Reveal>
          </section>

          {/* Karya */}
          <section id="karya" className="scroll-mt-16 pt-16">
            <SectionHead index="02" label="Karya" title="Kode yang sudah dipajang" />
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {projects.map((p, i) => (
                <article key={p.name} className="tile flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="mono text-[11px] tracking-[0.1em] text-[#8a8a94]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="eyebrow">{p.lang}</span>
                  </div>
                  <h3 className="text-[22px] leading-[1.2] text-[#e8e8ee]">{p.name}</h3>
                  <p className="text-[15px] leading-[1.6] text-[#c0c0c8]">{p.desc}</p>
                  <div className="mt-auto flex items-center gap-4 pt-1">
                    <a
                      href={p.vercel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-action mono text-[12px] tracking-[0.04em] text-[#b8f050] underline underline-offset-4"
                    >
                      live ↗
                    </a>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-action mono text-[12px] tracking-[0.04em] text-[#8a8a94] underline underline-offset-4"
                    >
                      github
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Output */}
          <section id="output" className="scroll-mt-16 pt-16">
            <SectionHead index="03" label="Output" title="Empat project, dari layar aslinya" />
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {outputs.map((o, i) => (
                <figure key={o.name} className="tile overflow-hidden">
                  <a href={o.live} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-[#1e1e22]">
                      <Image
                        src={o.shot}
                        alt={o.alt}
                        fill
                        quality={68}
                        sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 490px"
                        className="object-cover object-top"
                      />
                    </div>
                    <figcaption className="flex items-center justify-between gap-3 p-4">
                      <span className="flex items-baseline gap-3">
                        <span className="mono text-[11px] tracking-[0.1em] text-[#8a8a94]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[14px] leading-[1.3] text-[#e8e8ee]">{o.name}</span>
                      </span>
                      <span className="mono text-[11px] tracking-[0.1em] text-[#b8f050]">live ↗</span>
                    </figcaption>
                  </a>
                </figure>
              ))}
            </div>
          </section>

          {/* Tentang */}
          <section id="tentang" className="scroll-mt-16 pt-16">
            <SectionHead index="04" label="Tentang" />

            <Reveal className="panel relative mt-6 overflow-hidden p-4 md:p-6">
              <MeshBackdrop className="pointer-events-none absolute inset-0" />
              <p className="eyebrow relative pb-4">Alur</p>
              <div className="relative">
                <RoutingDiagram />
              </div>
            </Reveal>

            <div className="mt-3 grid items-stretch gap-3 md:grid-cols-2">
              <Reveal className="panel flex flex-col p-4 md:p-5">
                <p className="eyebrow">Data</p>
                <dl className="mono mt-4 flex flex-1 flex-col justify-between gap-3 text-[12px] tracking-[0.04em]">
                  <div className="flex justify-between gap-4 border-b border-[#1e1e22] pb-3">
                    <dt className="text-[#8a8a94]">NAMA</dt>
                    <dd className="text-[#e8e8ee]">Khamim Zarkasyi</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-[#1e1e22] pb-3">
                    <dt className="text-[#8a8a94]">EMAIL</dt>
                    <dd>
                      <a href="mailto:khamimzarrr@gmail.com" className="text-[#b8f050] underline underline-offset-4">
                        khamimzarrr@gmail.com
                      </a>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-[#1e1e22] pb-3">
                    <dt className="text-[#8a8a94]">INSTAGRAM</dt>
                    <dd>
                      <a
                        href="https://instagram.com/bukann_bapakmu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#b8f050] underline underline-offset-4"
                      >
                        @bukann_bapakmu
                      </a>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-[#1e1e22] pb-3">
                    <dt className="text-[#8a8a94]">GITHUB</dt>
                    <dd>
                      <a
                        href="https://github.com/khamimzarr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#b8f050] underline underline-offset-4"
                      >
                        khamimzarr
                      </a>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#8a8a94]">VERCEL</dt>
                    <dd>
                      <a
                        href="https://vercel.com/voiddarkfire/khamim-portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#b8f050] underline underline-offset-4"
                      >
                        voiddarkfire
                      </a>
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal className="panel flex flex-col p-4 md:p-5">
                <p className="eyebrow">Log</p>
                <p className="mono mt-3 text-[12px] tracking-[0.04em] text-[#8a8a94]">
                  $ git log --oneline -{log.length}
                </p>
                <ul className="mono mt-4 flex flex-1 flex-col justify-between gap-3 text-[12px] tracking-[0.04em]">
                  {log.map((entry, i) => (
                    <li
                      key={entry.hash}
                      className={`flex gap-3 ${i < log.length - 1 ? "border-b border-[#1e1e22] pb-3" : ""}`}
                    >
                      <span className="w-12 shrink-0 text-[#b8f050]">{entry.hash}</span>
                      <span className="text-[#c0c0c8]">{entry.text}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
