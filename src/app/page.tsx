import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Reveal from "@/components/Reveal";
import RoutingDiagram from "@/components/RoutingDiagram";
import Terminal from "@/components/Terminal";

const HERO_LINE =
  "Khamim Zarkasyi. Yang dipajang di sini: empat project yang sudah live, dan enam kebiasaan harian yang menopangnya.";

const vignettes = [
  {
    title: "Foto Hal Random",
    desc: "Menangkap yang terlewat, cahaya random yang kebetulan jujur.",
    img: "/hobi/foto-random.jpg",
    caption: "Foto asli, jepretan random Khamim",
  },
  {
    title: "Bersepeda",
    desc: "Ritual roda di pagi sunyi, gerak adalah doa yang paling sederhana.",
    img: "/hobi/bersepeda.jpg",
    caption: "Foto asli, goes pagi",
  },
  {
    title: "Merawat Tanaman",
    desc: "Merawat diam, daun mengajarkan kesabaran yang tidak dimiliki notifikasi.",
    img: "/hobi/tanaman.jpg",
    caption: "Foto asli, tanaman di halaman",
  },
  {
    title: "Ikan Hias & Aquarium",
    desc: "Katedral kaca, cahaya menari di air, waktu melambat di balik gelembung.",
    img: "/hobi/ikan.jpg",
    caption: "Foto asli, aquarium di rumah",
  },
  {
    title: "Vibes Coding",
    desc: "Kode sebagai kaligrafi, bukan sekadar sintaks, tapi suasana yang mengalir.",
    img: "/hobi/coding.jpg",
    caption: "Foto asli, setup vibes coding",
  },
  {
    title: "Ngopi + Nge-project",
    desc: "Pahit yang menyalakan ide, ngopi sambil ngulik project, wkwk tapi serius.",
    img: "/hobi/ngopi.jpg",
    caption: "Foto asli, ngopi sambil nge-project",
  },
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
            <h1 className="mt-3 text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-[#e8e8ee] md:text-[52px]">
              Khamim Zarkasyi.
            </h1>
            <p className="mt-4 max-w-[70ch] text-[15px] leading-[1.6] text-[#c0c0c8]">{HERO_LINE}</p>

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
            <SectionHead
              index="01"
              label="Terminal"
              title="Ringkasan karya, versi terminal."
              description="Perintah di bawah ini mengeluarkan daftar project yang benar-benar live, bukan contoh karangan."
            />
            <Reveal className="mt-6">
              <Terminal />
            </Reveal>
          </section>

          {/* Karya */}
          <section id="karya" className="scroll-mt-16 pt-16">
            <SectionHead
              index="02"
              label="Karya"
              title="Kode yang sudah dipajang"
              description="Empat project yang tumbuh dari ngopi dan vibes coding, live di Vercel dan source terbuka di GitHub."
            />
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
            <SectionHead
              index="03"
              label="Exhibition"
              title="Enam ritual harian"
              description="Enam kebiasaan yang aku rawat seperti koleksi galeri, hangat dan pelan."
            />
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {vignettes.map((v, i) => (
                <figure key={v.title} className="tile overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={v.img}
                      alt={v.caption}
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
                    <p className="mt-1 text-[12px] leading-[1.4] text-[#8a8a94]">{v.caption}</p>
                    <p className="mt-2 text-[13px] leading-[1.5] text-[#c0c0c8]">{v.desc}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Tentang */}
          <section id="tentang" className="scroll-mt-16 pt-16">
            <SectionHead index="04" label="Tentang" />

            <Reveal className="panel mt-6 p-4 md:p-6">
              <p className="eyebrow pb-4">Alur</p>
              <RoutingDiagram />
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
