import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Reveal from "@/components/Reveal";
import RoutingDiagram from "@/components/RoutingDiagram";
import MeshBackdrop from "@/components/MeshBackdrop";
import Terminal from "@/components/Terminal";

/* Satu sumber data untuk section 02: kartu karya dan tangkapan layarnya
   duduk di objek yang sama, jadi tidak ada daftar project yang dobel. */
const projects = [
  {
    name: "hr-ai-review",
    shot: "/output/hr-ai-review.jpg",
    alt: "Tampilan hr-ai-review: hero dan kartu ATS Score",
    desc: "Unggah CV dalam PDF, keluar analisis ala reviewer HR plus skor kecocokan. Backend Apps Script, muka depannya di Vercel.",
    stack: ["JavaScript", "Apps Script", "Vercel"],
    live: "https://hr-ai-review-nine.vercel.app",
    href: "https://github.com/khamimzarr/hr-ai-review",
  },
  {
    name: "ruang-resepsi",
    shot: "/output/ruang-resepsi.jpg",
    alt: "Tampilan ruang-resepsi: hero undangan digital",
    desc: "Undangan pernikahan digital dengan satu tautan personal per tamu, aktif 7 hari. Tanpa backend, datanya menempel di tautan.",
    stack: ["HTML", "WhatsApp", "Frontend-only"],
    live: "https://ruang-resepsi.vercel.app",
    href: "https://github.com/khamimzarr/ruang-resepsi",
  },
  {
    name: "structur-md",
    shot: "/output/structur-md.jpg",
    alt: "Tampilan structur-md: hero URL ke Markdown",
    desc: "Tempel satu URL, dapat Markdown bersih plus struktur halamannya. Scraping jalan di serverless, hasilnya disimpan di Supabase.",
    stack: ["TypeScript", "Next.js", "Supabase"],
    live: "https://structur-md.vercel.app",
    href: "https://github.com/khamimzarr/structur-md",
  },
  {
    name: "dropdeploy",
    shot: "/output/dropdeploy.jpg",
    alt: "Tampilan dropdeploy: hero tarik dan lepas .zip",
    desc: "Jatuhkan .zip ke browser, project langsung live di Vercel dan GitHub. Kunci API punya sendiri, semua proses di sisi klien.",
    stack: ["TypeScript", "Next.js", "JSZip"],
    live: "https://dropdeploy.my.id",
    href: "https://github.com/khamimzarr/dropdeploy",
  },
];

/* Diperbarui manual tiap ada perubahan besar, biar panelnya tetap jujur. */
const log = [
  { hash: "a11y", text: "kontras nav + konten tetap terbaca tanpa JS" },
  { hash: "perf", text: "AVIF/WebP, quality 68, sizes diperbaiki" },
  { hash: "sec", text: "CSP + header keamanan di semua path" },
  { hash: "seo", text: "JSON-LD, manifest, theme-color" },
];

const GIT_LOG_CMD = `$ git log --oneline -${log.length}`;

function SectionHead({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title?: string;
}) {
  return (
    <div>
      <p className="eyebrow">
        {index} / {label}
      </p>
      {title ? (
        <h2 className="display mt-3 text-[26px] leading-[1.15] text-[#e8e8ee] md:text-[34px]">
          {title}
        </h2>
      ) : null}
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
                <p className="eyebrow">Builder</p>
                <p className="display mt-2 text-[22px] leading-[1.2] text-[#e8e8ee]">Khamim Zarkasyi</p>
                <p className="mono mt-2 text-[12px] tracking-[0.04em] text-[#8a8a94]">WEB RUNTIME</p>
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

          {/* 01 Terminal: dev environment, bukan data diri */}
          <section id="terminal" className="scroll-mt-16 pt-16">
            <SectionHead index="01" label="Terminal" title="Runtime Environment" />
            <Reveal className="mt-6">
              <Terminal />
            </Reveal>
          </section>

          {/* 02 Karya: satu kartu = satu project, lengkap dengan tangkapan layar */}
          <section id="karya" className="scroll-mt-16 pt-16">
            <SectionHead index="02" label="Karya" title="Selected Deployments" />
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {projects.map((p, i) => (
                <article key={p.name} className="tile flex flex-col overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-[#1e1e22]">
                    <Image
                      src={p.shot}
                      alt={p.alt}
                      fill
                      quality={68}
                      sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 490px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="mono text-[11px] tracking-[0.1em] text-[#8a8a94]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <ul className="flex flex-wrap justify-end gap-1.5" aria-label={`Stack ${p.name}`}>
                        {p.stack.map((tech) => (
                          <li
                            key={tech}
                            className="mono rounded-[3px] border border-[#2a2a30] px-1.5 py-0.5 text-[10px] tracking-[0.08em] text-[#8a8a94]"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <h3 className="display text-[22px] leading-[1.2] text-[#e8e8ee]">{p.name}</h3>
                    <p className="text-[15px] leading-[1.6] text-[#c0c0c8]">{p.desc}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent px-4"
                        aria-label={`Buka demo live ${p.name}`}
                      >
                        Live Demo ↗
                      </a>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost px-4"
                        aria-label={`Buka source ${p.name} di GitHub`}
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 03 Routing: service map, bukan pengulangan daftar project */}
          <section id="routing" className="scroll-mt-16 pt-16">
            <SectionHead index="03" label="Routing" title="Service map: bagaimana karyanya tersambung." />
            <Reveal className="panel relative mt-6 overflow-hidden p-4 md:p-6">
              <MeshBackdrop className="pointer-events-none absolute inset-0" />
              <p className="eyebrow relative pb-4">Alur</p>
              <div className="relative">
                <RoutingDiagram />
              </div>
            </Reveal>
          </section>

          {/* 04 Data: metadata kontak + log perubahan */}
          <section id="data" className="scroll-mt-16 pt-16">
            <SectionHead index="04" label="Data" title="Metadata dan kontak." />

            <div className="mt-6 grid items-stretch gap-3 md:grid-cols-2">
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
                  {GIT_LOG_CMD}
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
