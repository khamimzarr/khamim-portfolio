import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Reveal from "@/components/Reveal";
import RoutingDiagram from "@/components/RoutingDiagram";
import MeshBackdrop from "@/components/MeshBackdrop";
import Terminal from "@/components/Terminal";

const vignettes = [
  { title: "Foto Hal Random", img: "/hobi/foto-random.jpg" },
  { title: "Bersepeda", img: "/hobi/bersepeda.jpg" },
  { title: "Merawat Tanaman", img: "/hobi/tanaman.jpg" },
  { title: "Ikan Hias & Aquarium", img: "/hobi/ikan.jpg" },
  { title: "Vibes Coding", img: "/hobi/coding.jpg" },
  { title: "Ngopi + Nge-project", img: "/hobi/ngopi.jpg" },
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
    <div className="min-h-screen bg-[#080808]">
      <Sidebar />

      <main className="px-5 pb-20 pt-16 md:px-8 lg:ml-[248px] lg:pt-10">
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
                  BASED: INDONESIA · EST. 2026 · KARYA & HOBI
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:khamimzarrr@gmail.com" className="btn-accent min-h-[44px] px-4">
                  ngopi sambil ngobrol project
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
                      className="mono text-[12px] tracking-[0.04em] text-[#b8f050] underline underline-offset-4"
                    >
                      live ↗
                    </a>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-[12px] tracking-[0.04em] text-[#8a8a94] underline underline-offset-4"
                    >
                      github
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Exhibition */}
          <section id="exhibition" className="scroll-mt-16 pt-16">
            <SectionHead index="03" label="Exhibition" title="Enam ritual harian" />
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {vignettes.map((v, i) => (
                <figure key={v.title} className="tile overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={v.img}
                      alt={`${v.title}, foto asli Khamim`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="p-4">
                    <span className="mono text-[11px] tracking-[0.1em] text-[#8a8a94]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-1 text-[14px] leading-[1.3] text-[#e8e8ee]">{v.title}</p>
                  </figcaption>
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
                  <div className="flex justify-between gap-4">
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
                </dl>
              </Reveal>

              <Reveal className="panel flex flex-col p-4 md:p-5">
                <p className="eyebrow">Still life, bunga di halaman Khamim</p>
                <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-[3px]">
                  <Image
                    src="/hobi/foto-bunga.jpg"
                    alt="Foto asli, bunga di halaman"
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </section>

          <footer className="rule-dotted mt-16 flex flex-col justify-between gap-2 pt-6 md:flex-row">
            <span className="mono text-[11px] tracking-[0.08em] text-[#8a8a94]">© 2026 Khamim Zarkasyi</span>
            <span className="mono text-[11px] tracking-[0.08em] text-[#8a8a94]">Made with ngopi & vibes coding wkwk</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
