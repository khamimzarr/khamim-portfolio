/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import Ticker from "@/components/Ticker";
import SectionLabel from "@/components/SectionLabel";
import FeaturePill from "@/components/FeaturePill";
import CodePane from "@/components/CodePane";
import HairlineDivider from "@/components/HairlineDivider";
import type { CodeLine } from "@/lib/code-tokens";

const HERO_CODE: CodeLine[] = [
  [{ text: "// folio.ts — khamimzar", kind: "comment" }],
  [{ text: "const", kind: "keyword" }, { text: " ", kind: "default" }, { text: "rituals", kind: "variable" }, { text: " = [", kind: "default" }],
  [{ text: "  \"foto-random\"", kind: "string" }, { text: ", ", kind: "default" }, { text: "\"bersepeda\"", kind: "string" }, { text: ", ", kind: "default" }, { text: "\"tanaman\"", kind: "string" }, { text: ",", kind: "default" }],
  [{ text: "  \"aquarium\"", kind: "string" }, { text: ", ", kind: "default" }, { text: "\"vibes-coding\"", kind: "string" }, { text: ", ", kind: "default" }, { text: "\"ngopi\"", kind: "string" }, { text: ",", kind: "default" }],
  [{ text: "] as const", kind: "default" }, { text: " ", kind: "default" }, { text: "readonly", kind: "type" }],
  [{ text: "", kind: "default" }],
  [{ text: "function", kind: "keyword" }, { text: " ", kind: "default" }, { text: "build", kind: "variable" }, { text: "(kind: ", kind: "default" }, { text: "\"slowly\"", kind: "type" }, { text: "): ", kind: "default" }, { text: "string", kind: "type" }, { text: " {", kind: "default" }],
  [{ text: "  return", kind: "keyword" }, { text: " rituals.join(", kind: "default" }, { text: "\" + \"", kind: "string" }, { text: ") + ", kind: "default" }, { text: "\" - \"", kind: "string" }, { text: " + kind;", kind: "default" }],
  [{ text: "}", kind: "default" }],
];

export default function Home() {
  const frames = [
    {
      title: "Foto Hal Random",
      file: "foto-random.jpg",
      desc: "Menangkap yang terlewat — cahaya random yang kebetulan jujur.",
      img: "/hobi/foto-random.jpg",
      caption: "Foto asli — jepretan random Khamim",
    },
    {
      title: "Bersepeda",
      file: "ride-pagi.sh",
      desc: "Ritual roda di pagi sunyi — gerak adalah doa yang paling sederhana.",
      img: "/hobi/bersepeda.jpg",
      caption: "Foto asli — goes pagi",
    },
    {
      title: "Merawat Tanaman",
      file: "tanaman.care",
      desc: "Merawat diam — daun mengajarkan kesabaran yang tidak dimiliki notifikasi.",
      img: "/hobi/tanaman.jpg",
      caption: "Foto asli — tanaman di halaman",
    },
    {
      title: "Ikan Hias & Aquarium",
      file: "aquarium.md",
      desc: "Katedral kaca — cahaya menari di air, waktu melambat di balik gelembung.",
      img: "/hobi/ikan.jpg",
      caption: "Foto asli — aquarium di rumah",
    },
    {
      title: "Vibes Coding",
      file: "coding.vibes",
      desc: "Kode sebagai kaligrafi — bukan sekadar sintaks, tapi suasana yang mengalir.",
      img: "/hobi/coding.jpg",
      caption: "Foto asli — setup vibes coding",
    },
    {
      title: "Ngopi + Nge-project",
      file: "ngopi-project.log",
      desc: "Pahit yang menyalakan ide — ngopi sambil ngulik project, wkwk tapi serius.",
      img: "/hobi/ngopi.jpg",
      caption: "Foto asli — ngopi sambil nge-project",
    },
  ];

  const projects = [
    {
      name: "hr-ai-review",
      desc: "Kurator HR di atas kertas putty — unggah PDF CV, terima analisis & skor seteliti tatapan kurator galeri.",
      lang: "JavaScript",
      href: "https://github.com/khamimzarr/hr-ai-review",
      vercel: "https://hr-ai-review-nine.vercel.app",
      featured: true,
    },
    {
      name: "ruang-resepsi",
      desc: "Undangan bagai kartu pameran — satu tautan per tamu, lestari 7 hari lalu memudar seperti tinta yang mengering.",
      lang: "HTML",
      href: "https://github.com/khamimzarr/ruang-resepsi",
      vercel: "https://ruang-resepsi.vercel.app",
      featured: true,
    },
    {
      name: "structur-md",
      desc: "Transkripsi URL statis jadi Markdown — ekstrak DESIGN.md & struktur laman layaknya menyalin naskah Renaissance.",
      lang: "TypeScript",
      href: "https://github.com/khamimzarr/structur-md",
      vercel: "https://structur-md.vercel.app",
      featured: true,
    },
    {
      name: "dropdeploy",
      desc: "Deploy kilat dari browser — jatuhkan .zip, langsung terpajang di Vercel & GitHub (BYOK, 90% client-side).",
      lang: "TypeScript",
      href: "https://github.com/khamimzarr/dropdeploy",
      vercel: "https://dropdeploy.my.id",
      featured: true,
    },

  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative w-full bg-slate-canvas flex flex-col items-center pt-16 md:pt-24 pb-0 overflow-hidden border-b border-steel-border">
        <div className="w-full max-w-[1200px] px-6 flex flex-col items-center text-center gap-6 relative">
          <SectionLabel>Portfolio — Folio No. 01 · Dev &amp; Daily Rituals</SectionLabel>
          <h1 className="font-display text-[34px] md:text-[60px] font-medium leading-[1.05] tracking-[3px] text-bone-text text-center">
            Hidup aku <span style={{ color: "var(--color-event-violet)" }}>build</span> pelan-pelan — satu ritual sehari
          </h1>
          <p className="font-sans text-[18px] leading-[1.5] text-fog-text max-w-[600px]">
            Saya <span className="text-bone-text font-medium">Khamim Zarkasyi</span> — foto hal random, bersepeda, merawat tanaman & aquarium, vibes coding, dan ngopi sambil mengerjakan project.
            Semua aku rawat seperti koleksi: hangat, flat, dan jujur — karena hidup yang paling sederhana biasanya yang paling layak dipajang.
          </p>
          <div className="flex items-center gap-6 pt-1 font-sans text-[14px] font-medium tracking-[0.4px] text-cloud-text">
            <span>Based: Indonesia</span>
            <span className="w-1 h-1 rounded-full bg-graphite-hairline" />
            <span>Est. 2026</span>
            <span className="w-1 h-1 rounded-full bg-graphite-hairline" />
            <span>Slate &amp; Lime</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="mailto:khamimzarrr@gmail.com" className="inline-flex items-center justify-center bg-signal-lime text-ink-well font-sans text-[14px] font-medium px-4 py-2 rounded-[4px]">
              hubungi via email
            </a>
            <a href="https://github.com/khamimzarr" target="_blank" className="inline-flex items-center justify-center border border-steel-border bg-transparent text-cloud-text font-sans text-[14px] px-4 py-2 rounded-[4px] hover:border-graphite-hairline hover:text-bone-text transition-colors">
              github / khamimzarr
            </a>
            <a href="https://instagram.com/bukann_bapakmu" target="_blank" className="inline-flex items-center justify-center border border-steel-border bg-transparent text-cloud-text font-sans text-[14px] px-4 py-2 rounded-[4px] hover:border-graphite-hairline hover:text-bone-text transition-colors">
              @bukann_bapakmu
            </a>
          </div>
        </div>

        <div className="w-full overflow-hidden select-none pt-12 md:pt-16 leading-none relative">
          <div
            className="w-full whitespace-nowrap text-center font-semibold"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 9vw, 140px)", lineHeight: 1, letterSpacing: "0.05em", color: "var(--color-bone-text)" }}
          >
            <span className="wordmark-carve">KHAMIMZA<span style={{ color: "var(--color-signal-lime)" }}>R</span></span>
          </div>
          <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 pt-8 md:pt-12 pb-12">
            <CodePane lines={HERO_CODE} filename="folio.ts" />
          </div>
        </div>
      </section>

      {/* TERMINAL META STRIP */}
      <section className="w-full bg-slate-canvas">
        <HairlineDivider />
        <div className="w-full max-w-[1200px] mx-auto flex justify-between px-6 md:px-10 py-3 font-mono text-[14px] text-fog-text">
          <span>terminal pane - scroll to read</span>
          <span>01 / 06</span>
        </div>
        <HairlineDivider />
      </section>

      {/* MOTTO — Tawakal */}
      <section className="w-full bg-slate-canvas px-6 md:px-10 py-20 md:py-28">
        <Reveal className="w-full max-w-[1200px] mx-auto flex flex-col items-center text-center gap-6">
          <SectionLabel>Motto — Tawakal</SectionLabel>
          <HairlineDivider className="max-w-[40px]" />
          <blockquote className="font-display italic text-[21px] md:text-[30px] leading-[1.33] text-bone-text max-w-[680px]">
            “Menitipkan segala cemas dan rencana pada Sang Maha Perencana. Jika langkah ini keliru, biarkan proses meluruskannya. Jika hati ini ragu, biarkan keyakinan menguatkannya. Sebab aku tahu, berserah bukanlah sebuah kekalahan, melainkan puncak dari rasa percaya akan takdir yang lebih indah.”
          </blockquote>
          <p className="font-display text-[14px] tracking-[0.4px] uppercase text-fog-text pt-1">— Khamim Zarkasyi</p>
        </Reveal>
      </section>

      <Ticker />

      {/* KARYA — Bone cards */}
      <section id="karya" className="w-full bg-[#e7e5e4] border-y border-[#dfdcd5] px-6 md:px-10 py-14 md:py-20">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-8">
          <div className="flex justify-between items-end gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-[Inter] text-[9px] tracking-[0.2em] uppercase text-[#595855]">Karya — Selected Works</p>
              <h2 className="font-[Playfair_Display] text-[32px] md:text-[52px] font-medium leading-[1] tracking-[-0.47px]">
                Kode & <em className="italic font-normal">kertas</em> yang sudah dipajang
              </h2>
              <p className="font-[Inter] text-[13px] leading-[1.5] text-[#595855] max-w-[520px]">
                Empat karya kecil yang tumbuh dari ngopi & vibes coding — live di Vercel, source terbuka di GitHub. Dari catatan harian jadi halaman yang beneran dikunjungi.
              </p>
            </div>
            <a href="https://github.com/khamimzarr" target="_blank" className="hidden md:inline-flex shrink-0 bg-black text-white font-[Inter] text-[12px] px-[17px] py-[9px] rounded-[28.8px]">lihat semua di GitHub →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((p) => (
              <div
                key={p.name}
                className={`group relative bg-white border border-[#dfdcd5] rounded-[9px] p-6 flex flex-col gap-4 hover:border-black/20 transition-colors ${p.featured ? "md:col-span-1" : ""}`}
              >
                {/* Klik kartu = ke website (vercel). Klik "github ↗" = ke repo */}
                <a
                  href={p.vercel ?? p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buka website ${p.name}`}
                  className="absolute inset-0 rounded-[9px] z-0"
                />
                <div className="relative z-10 flex justify-between items-start gap-4 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${p.featured ? "bg-black" : "bg-[#c4c3b6]"}`} />
                    <span className="font-[Inter] text-[9px] tracking-[0.16em] uppercase text-[#595855]">{p.lang}</span>
                    {p.featured && <span className="font-[Inter] text-[9px] tracking-[0.14em] uppercase bg-black text-white rounded-full px-2 py-0.5">Featured</span>}
                  </div>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto font-[Inter] text-[10px] text-[#808080] group-hover:text-black hover:underline underline-offset-4 transition-colors relative"
                  >
                    github ↗
                  </a>
                </div>
                <h3 className="relative z-10 pointer-events-none font-[Playfair_Display] text-[22px] leading-[1.1] tracking-[-0.11px] font-medium group-hover:tracking-[-0.14px] transition-all">
                  {p.name}
                </h3>
                <p className="relative z-10 pointer-events-none font-[Inter] text-[13px] leading-[1.5] text-[#595855]">{p.desc}</p>
                <div className="relative z-10 flex flex-wrap gap-2 pt-1 pointer-events-none">
                  <span className="font-[Inter] text-[11px] border border-[#dfdcd5] rounded-full px-3 py-1 group-hover:border-black/15 transition-colors">{p.name}</span>
                  {p.vercel && (
                    <span className="font-[Inter] text-[11px] bg-[#c4c3b6] border border-transparent rounded-full px-3 py-1 group-hover:bg-black group-hover:text-white transition-colors">
                      live ↗
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex md:hidden justify-center">
            <a href="https://github.com/khamimzarr" target="_blank" className="inline-flex bg-black text-white font-[Inter] text-[12px] px-[17px] py-[9px] rounded-[28.8px]">lihat semua di GitHub →</a>
          </div>
        </div>
      </section>

      {/* DARK EXHIBITION */}
      <section id="exhibition" className="w-full bg-black text-white px-6 md:px-10 py-14 md:py-20">
        <div className="w-full flex justify-between items-start font-[Inter] text-[9px] tracking-[0.18em] uppercase text-white/50 pb-8">
          <span>Exhibition — 06 Rituals</span>
          <span>Putty on Ink · Flat · No Shadow</span>
        </div>
        <Reveal className="w-full flex flex-col items-center text-center gap-4 pb-12 md:pb-16">
          <h2 className="font-[Playfair_Display] text-[42px] md:text-[94px] font-medium leading-[0.84] tracking-[-0.85px]">
            HIDUP — DI<br /><em className="font-normal italic">KURASI</em>
          </h2>
          <p className="font-[Inter] text-[13px] md:text-[15px] leading-[1.5] text-white/60 max-w-[560px]">
            Enam ritual harian yang aku rawat seperti koleksi galeri — hangat, pelan, dan sedikit filosofis.
            <span className="text-white/90"> Hover lingkaran untuk melihat detail.</span>
          </p>
          <p className="font-[Playfair_Display] italic text-[15px] md:text-[18px] text-white/70">“Every shadow is proof of the light that once passed through it.”</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-10 max-w-[1120px] mx-auto">
          {frames.map((v, i) => (
            <div key={v.title} className="frame flex flex-col items-center text-center gap-4 group" style={{ transitionDelay: `${(i * 90)}ms` }}>
              <Reveal className="flex flex-col items-center text-center gap-4">
                <p className="font-display text-[18px] md:text-[22px] leading-[1.33] font-normal">{v.title}</p>
              </Reveal>
              <Reveal
                className="flex flex-col items-center text-center gap-4"
                style={{ transitionDelay: `${(i * 90) + 60}ms` }}
              >
                <p className="frame-file -mt-3">{v.file}</p>
                <div className="f-image relative w-[200px] h-[200px] rounded-full overflow-hidden bg-graphite-hairline">
                  <Image src={v.img} alt={v.caption} width={400} height={400} sizes="200px" className="w-full h-full object-cover" />
                </div>
                <p className="font-[Inter] text-[12px] leading-[1.5] text-white/60 max-w-[26ch] px-2">{v.desc}</p>
                <p className="f-caption font-sans text-[14px] text-fog-text">{v.caption}</p>
              </Reveal>
              <Reveal style={{ transitionDelay: `${(i * 90) + 120}ms` }}>
                <div className="flex items-center gap-2 pt-1">
                  <Hexagon active />
                  <Hexagon />
                  <Hexagon />
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center pt-12 md:pt-16">
          <a href="mailto:khamimzarrr@gmail.com" className="inline-flex bg-white text-black font-[Inter] text-[12px] px-[17px] py-[9px] rounded-[28.8px]">
            ngopi sambil ngobrol project →
          </a>
        </div>
      </section>

      <Ticker />

      {/* ABOUT */}
      <section className="w-full bg-[#e7e5e4] border-y border-[#dfdcd5] px-6 md:px-10 py-14 md:py-20">
        <div className="max-w-[1120px] mx-auto grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-14 items-start">
          <div className="flex flex-col gap-6">
            <p className="font-[Inter] text-[9px] tracking-[0.2em] uppercase text-[#595855]">Tentang — About the Keeper</p>
            <h3 className="font-[Playfair_Display] text-[32px] md:text-[43px] leading-[1.1] tracking-[-0.215px] font-medium">
              Seorang penjaga hal-hal <em className="italic font-normal">kecil</em> yang tumbuh pelan.
            </h3>
            <div className="font-[Inter] text-[15px] leading-[1.6] text-[#595855] flex flex-col gap-4">
              <p>
                Halo, aku <strong className="text-black font-medium">Khamim Zarkasyi</strong>. Hari-hariku sederhana — motret hal random yang menurut orang lain biasa aja, sepedaan biar kepala adem, nyiram tanaman, ngasih makan ikan hias sambil ngeliatin aquarium kayak ngeliatin galeri kaca. Lalu vibes coding sampai lupa waktu, dan ngopi sambil ngerjain project — wkwk, tapi jadi.
              </p>
              <p>
                Website ini aku bikin dengan bahasa galeri Renaissance — <span className="text-black">Putty #c4c3b6</span> sebagai kanvas hangat,
                <span className="text-black"> Ink #000000</span> sebagai ketegasan, tipografi Davinci & Helvetica Now, tanpa shadow, tanpa gradient.
                Flat, jujur, seperti kertas museum.
              </p>
              <p className="font-[Playfair_Display] italic text-[16px] text-black">“Time does not preserve great work — great work preserves time.”</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="font-[Inter] text-[11px] tracking-[0.12em] uppercase bg-white border border-[#dfdcd5] rounded-full px-4 py-2">Foto Random</span>
              <span className="font-[Inter] text-[11px] tracking-[0.12em] uppercase bg-white border border-[#dfdcd5] rounded-full px-4 py-2">Bersepeda</span>
              <span className="font-[Inter] text-[11px] tracking-[0.12em] uppercase bg-white border border-[#dfdcd5] rounded-full px-4 py-2">Tanaman</span>
              <span className="font-[Inter] text-[11px] tracking-[0.12em] uppercase bg-white border border-[#dfdcd5] rounded-full px-4 py-2">Aquarium</span>
              <span className="font-[Inter] text-[11px] tracking-[0.12em] uppercase bg-white border border-[#dfdcd5] rounded-full px-4 py-2">Vibes Coding</span>
              <span className="font-[Inter] text-[11px] tracking-[0.12em] uppercase bg-black text-white rounded-full px-4 py-2">Ngopi & Project</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#dfdcd5] rounded-[9px] p-6 flex flex-col gap-4">
              <p className="font-[Inter] text-[9px] tracking-[0.18em] uppercase text-[#595855]">Wall Label — Visitor Info</p>
              <div className="flex flex-col gap-3 font-[Inter] text-[13px] leading-[1.5]">
                <div className="flex justify-between border-b border-[#ebebeb] pb-3">
                  <span className="text-[#595855]">Nama</span>
                  <span className="font-medium">Khamim Zarkasyi</span>
                </div>
                <div className="flex justify-between border-b border-[#ebebeb] pb-3">
                  <span className="text-[#595855]">Email</span>
                  <a href="mailto:khamimzarrr@gmail.com" className="font-medium hover:underline underline-offset-4">khamimzarrr@gmail.com</a>
                </div>
                <div className="flex justify-between border-b border-[#ebebeb] pb-3">
                  <span className="text-[#595855]">Instagram</span>
                  <a href="https://instagram.com/bukann_bapakmu" target="_blank" className="font-medium hover:underline underline-offset-4">@bukann_bapakmu</a>
                </div>
                <div className="flex justify-between border-b border-[#ebebeb] pb-3">
                  <span className="text-[#595855]">GitHub</span>
                  <a href="https://github.com/khamimzarr" target="_blank" className="font-medium hover:underline underline-offset-4">github.com/khamimzarr</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#595855]">Vercel</span>
                  <span className="font-medium">khamimzar-2499 / voiddarkfire</span>
                </div>
              </div>
              <a href="mailto:khamimzarrr@gmail.com" className="mt-2 inline-flex justify-center bg-black text-white font-[Inter] text-[12px] px-[17px] py-[9px] rounded-[28.8px]">
                kirim email
              </a>
              <p className="font-[Inter] text-[10px] leading-[1.4] text-[#808080] text-center">Balas cepat kalau tidak sedang nyiram tanaman atau ngasih makan ikan.</p>
            </div>

            <div className="rounded-[9px] overflow-hidden border border-[#dfdcd5] bg-[#c4c3b6] p-3">
              <div className="rounded-[6px] overflow-hidden h-[220px] relative">
                <Image src="/hobi/foto-bunga.jpg" alt="Foto asli — bunga di halaman" width={600} height={220} className="w-full h-full object-cover" />
              </div>
              <p className="font-[Inter] text-[9px] tracking-[0.16em] uppercase text-[#595855] pt-3 px-1">Still Life — Foto asli — bunga di halaman Khamim</p>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      <footer className="w-full bg-[#ebebeb] border-t border-[#dfdcd5] px-6 md:px-10 py-10">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-[1.5px] border-black flex items-center justify-center">
                  <span className="font-[Playfair_Display] text-[13px] font-medium">K</span>
                </div>
                <span className="font-[Playfair_Display] text-[16px] tracking-[-0.02em] font-medium">KHAMIM ZARKASYI</span>
              </div>
              <p className="font-[Inter] text-[12px] leading-[1.5] text-[#595855] max-w-[36ch]">
                Renaissance gallery on putty paper. Dibuat dengan Next.js + Tailwind, tinta hitam di atas kertas putty hangat.
              </p>
            </div>
            <div className="flex gap-10 md:gap-14 font-[Inter] text-[12px]">
              <div className="flex flex-col gap-2">
                <p className="text-[9px] tracking-[0.18em] uppercase text-[#595855]">Social — Ghost Links</p>
                <a href="https://instagram.com/bukann_bapakmu" target="_blank" className="hover:underline underline-offset-4">Instagram — @bukann_bapakmu</a>
                <a href="https://github.com/khamimzarr" target="_blank" className="hover:underline underline-offset-4">GitHub — khamimzarr</a>
                <a href="mailto:khamimzarrr@gmail.com" className="hover:underline underline-offset-4">Email — khamimzarrr@gmail.com</a>
                <span className="text-[#808080]">Vercel — khamimzar-2499</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[9px] tracking-[0.18em] uppercase text-[#595855]">Exhibition</p>
                <a href="#karya" className="hover:underline underline-offset-4">Karya — 04</a>
                <a href="#exhibition" className="hover:underline underline-offset-4">06 Rituals</a>
                <a href="#" className="hover:underline underline-offset-4">Top — Kembali ke atas</a>
                <span className="text-[#808080]">Putty #c4c3b6 · Ink #000000</span>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#dfdcd5]" />
          <div className="flex flex-col md:flex-row justify-between gap-3 font-[Inter] text-[10px] tracking-[0.08em] text-[#595855]">
            <span>© 2026 Khamim Zarkasyi. Set in Playfair Display (Davinci) & Inter (Helvetica Now). No gradients, no shadows — only putty & ink.</span>
            <span className="tracking-[0.14em] uppercase">Made with ngopi & vibes coding wkwk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Hexagon({ active = false }: { active?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 1 L10.5 3.5 L10.5 8.5 L6 11 L1.5 8.5 L1.5 3.5 Z" stroke={active ? "white" : "rgba(255,255,255,0.35)"} strokeWidth="1.2" fill={active ? "white" : "transparent"} />
    </svg>
  );
}
