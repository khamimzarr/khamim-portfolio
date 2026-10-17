import Image from "next/image";
import Header from "@/components/Header";
import Reveal from "@/components/Reveal";

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
    desc: "Pahit yang menyalakan ide — ngopi sambil ngulik project, wkwk tapi serius.",
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

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#000000]">
      <Header />

      {/* Hero: the wordmark is the object on the stage */}
      <section className="relative w-full bg-[#000000] px-6 md:px-10 pt-20 md:pt-28 pb-14 overflow-hidden">
        <div className="w-full max-w-[1120px] mx-auto flex flex-col gap-8">
          <Reveal className="flex flex-col gap-6">
            <div className="inline-flex self-start items-center gap-3 bg-[#333336] rounded-[36px] px-4 py-2">
              <span className="font-sans text-[12px] leading-none tracking-[-0.12px] text-[#f5f5f7]">
                Based: Indonesia · Est. 2026 · Karya dan hobi
              </span>
            </div>
            <h1
              className="font-sans font-semibold text-[#f5f5f7]"
              style={{ fontSize: "clamp(40px, 14vw, 168px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
            >
              KHAMIMZAR
            </h1>
          </Reveal>
          <Reveal className="flex flex-col gap-6 max-w-[640px]">
            <p className="font-sans text-[17px] leading-[1.47] tracking-[-0.374px] text-[#f5f5f7]">
              {HERO_LINE}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:khamimzarrr@gmail.com"
                className="inline-flex items-center justify-center min-h-[44px] bg-[#0071e3] text-white font-sans text-[12px] leading-[1.33] tracking-[-0.12px] px-5 py-3 rounded-[9999px]"
              >
                ngopi sambil ngobrol project
              </a>
              <a
                href="https://github.com/khamimzarr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] border border-[#f5f5f7] text-[#f5f5f7] font-sans text-[12px] leading-[1.33] tracking-[-0.12px] px-5 py-3 rounded-[9999px]"
              >
                github / khamimzarr
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Motto: Khamim's own words, kept as they are */}
      <section className="w-full bg-[#000000] px-6 md:px-10 py-16 md:py-20">
        <Reveal className="w-full max-w-[820px] mx-auto flex flex-col items-center text-center gap-6">
          <p className="font-sans text-[12px] tracking-[-0.12px] uppercase text-[#86868b]">Motto</p>
          <blockquote className="font-sans text-[21px] md:text-[28px] leading-[1.35] tracking-[-0.374px] text-[#f5f5f7] max-w-[680px]">
            “Menitipkan segala cemas dan rencana pada Sang Maha Perencana. Jika langkah ini keliru, biarkan proses meluruskannya. Jika hati ini ragu, biarkan keyakinan menguatkannya. Sebab aku tahu, berserah bukanlah sebuah kekalahan, melainkan puncak dari rasa percaya akan takdir yang lebih indah.”
          </blockquote>
          <p className="font-sans text-[12px] tracking-[-0.12px] uppercase text-[#86868b]">Khamim Zarkasyi</p>
        </Reveal>
      </section>

      {/* Karya */}
      <section id="karya" className="w-full bg-[#000000] px-6 md:px-10 py-16 md:py-20">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-10">
          <Reveal className="flex flex-col gap-3 max-w-[640px]">
            <p className="font-sans text-[12px] tracking-[-0.12px] uppercase text-[#86868b]">Karya</p>
            <h2
              className="font-sans font-semibold text-[#f5f5f7]"
              style={{ fontSize: "clamp(28px, 5vw, 56px)", lineHeight: 1.07, letterSpacing: "-0.28px" }}
            >
              Kode yang sudah dipajang
            </h2>
            <p className="font-sans text-[17px] leading-[1.47] tracking-[-0.374px] text-[#86868b]">
              Empat project yang tumbuh dari ngopi dan vibes coding, live di Vercel dan source terbuka di GitHub.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {projects.map((p) => (
              <Reveal key={p.name}>
                <div className="media-card relative bg-[#111111] p-6 flex flex-col gap-4">
                  <a
                    href={p.vercel}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buka website ${p.name}`}
                    className="absolute inset-0"
                  />
                  <div className="relative flex items-center justify-between gap-4 pointer-events-none">
                    <span className="font-sans text-[12px] tracking-[-0.12px] uppercase text-[#86868b]">{p.lang}</span>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto font-sans text-[12px] text-[#0066cc]"
                    >
                      github
                    </a>
                  </div>
                  <h3 className="relative pointer-events-none font-sans font-semibold text-[28px] leading-[1.14] tracking-[0.196px] text-[#f5f5f7]">
                    {p.name}
                  </h3>
                  <p className="relative pointer-events-none font-sans text-[17px] leading-[1.47] tracking-[-0.374px] text-[#86868b]">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibition */}
      <section id="exhibition" className="w-full bg-[#000000] px-6 md:px-10 py-16 md:py-20">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-10">
          <Reveal className="flex flex-col gap-3 max-w-[640px]">
            <p className="font-sans text-[12px] tracking-[-0.12px] uppercase text-[#86868b]">Exhibition</p>
            <h2
              className="font-sans font-semibold text-[#f5f5f7]"
              style={{ fontSize: "clamp(28px, 5vw, 56px)", lineHeight: 1.07, letterSpacing: "-0.28px" }}
            >
              Enam ritual harian
            </h2>
            <p className="font-sans text-[17px] leading-[1.47] tracking-[-0.374px] text-[#86868b]">
              Enam kebiasaan yang aku rawat seperti koleksi galeri, hangat dan pelan.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {vignettes.map((v) => (
              <Reveal key={v.title}>
                <figure className="media-card bg-[#111111]">
                  <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={v.img}
                      alt={v.caption}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="media-image object-cover"
                    />
                  </div>
                  <figcaption className="p-4 flex flex-col gap-1">
                    <span className="font-sans font-semibold text-[17px] leading-[1.24] tracking-[-0.374px] text-[#f5f5f7]">
                      {v.title}
                    </span>
                    <span className="font-sans text-[12px] leading-none tracking-[-0.12px] text-[#86868b]">{v.caption}</span>
                    <span className="font-sans text-[14px] leading-[1.29] tracking-[-0.224px] text-[#86868b]">{v.desc}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About: light merchandising surface */}
      <section className="w-full bg-[#f5f5f7] px-6 md:px-10 py-16 md:py-20">
        <div className="max-w-[1120px] mx-auto grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-14 items-start">
          <Reveal className="flex flex-col gap-5">
            <p className="font-sans text-[12px] tracking-[-0.12px] uppercase text-[#6e6e73]">Tentang</p>
            <h3
              className="font-sans font-semibold text-[#1d1d1f]"
              style={{ fontSize: "clamp(28px, 4vw, 43px)", lineHeight: 1.1, letterSpacing: "-0.215px" }}
            >
              Seorang penjaga hal kecil yang tumbuh pelan.
            </h3>
            <p className="font-sans text-[17px] leading-[1.47] tracking-[-0.374px] text-[#6e6e73]">
              Halo, aku <strong className="text-[#1d1d1f] font-semibold">Khamim Zarkasyi</strong>. Hari-hariku sederhana: motret hal random, sepedaan biar kepala adem, nyiram tanaman, ngasih makan ikan hias sambil ngeliatin aquarium kayak ngeliatin galeri kaca. Lalu vibes coding sampai lupa waktu, dan ngopi sambil ngerjain project — wkwk, tapi jadi.
            </p>
            <p className="font-sans text-[17px] leading-[1.47] tracking-[-0.374px] text-[#6e6e73]">
              Halaman ini dibangun seperti panggung produk: latar hitam penuh, satu accent biru, tanpa bayangan. Tipografinya Inter, fotonya foto asli, dan tidak ada angka yang aku karang.
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-4">
            <div className="bg-[#ffffff] rounded-[28px] p-6 flex flex-col gap-3">
              <p className="font-sans text-[12px] tracking-[-0.12px] uppercase text-[#6e6e73]">Data</p>
              <div className="flex justify-between gap-4 font-sans text-[14px] leading-[1.29] tracking-[-0.224px] text-[#1d1d1f]">
                <span className="text-[#6e6e73]">Nama</span>
                <span className="font-semibold">Khamim Zarkasyi</span>
              </div>
              <div className="hairline-ink flex justify-between gap-4 font-sans text-[14px] leading-[1.29] tracking-[-0.224px] text-[#1d1d1f] pt-3">
                <span className="text-[#6e6e73]">Email</span>
                <a href="mailto:khamimzarrr@gmail.com" className="font-semibold text-[#0066cc]">khamimzarrr@gmail.com</a>
              </div>
              <div className="hairline-ink flex justify-between gap-4 font-sans text-[14px] leading-[1.29] tracking-[-0.224px] text-[#1d1d1f] pt-3">
                <span className="text-[#6e6e73]">Instagram</span>
                <a href="https://instagram.com/bukann_bapakmu" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0066cc]">@bukann_bapakmu</a>
              </div>
              <div className="hairline-ink flex justify-between gap-4 font-sans text-[14px] leading-[1.29] tracking-[-0.224px] text-[#1d1d1f] pt-3">
                <span className="text-[#6e6e73]">GitHub</span>
                <a href="https://github.com/khamimzarr" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0066cc]">khamimzarr</a>
              </div>
            </div>

            <div className="media-card bg-[#e8e8ed] p-3">
              <div className="relative w-full aspect-[16/9] rounded-[20px] overflow-hidden">
                <Image
                  src="/hobi/foto-bunga.jpg"
                  alt="Foto asli, bunga di halaman"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <p className="font-sans text-[12px] tracking-[-0.12px] uppercase text-[#6e6e73] pt-3 px-1">
                Still life, bunga di halaman Khamim
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#ffffff] px-6 md:px-10 py-12">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-sans font-semibold text-[17px] leading-[1.24] tracking-[-0.374px] text-[#1d1d1f]">
                KHAMIM ZARKASYI
              </span>
              <p className="font-sans text-[14px] leading-[1.29] tracking-[-0.224px] text-[#6e6e73] max-w-[36ch]">
                Karya, foto, dan catatan kecil. Dibangun dengan Next.js dan Tailwind.
              </p>
            </div>
            <div className="flex gap-10 md:gap-14 font-sans text-[14px] leading-[1.29] tracking-[-0.224px]">
              <div className="flex flex-col gap-2">
                <a href="https://instagram.com/bukann_bapakmu" target="_blank" rel="noopener noreferrer" className="text-[#0066cc]">
                  Instagram
                </a>
                <a href="https://github.com/khamimzarr" target="_blank" rel="noopener noreferrer" className="text-[#0066cc]">
                  GitHub
                </a>
                <a href="mailto:khamimzarrr@gmail.com" className="text-[#0066cc]">
                  Email
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <a href="#karya" className="text-[#0066cc]">Karya</a>
                <a href="#exhibition" className="text-[#0066cc]">Exhibition</a>
              </div>
            </div>
          </div>
          <div className="hairline-ink flex flex-col md:flex-row justify-between gap-2 pt-6 font-sans text-[12px] leading-none tracking-[-0.12px] text-[#6e6e73]">
            <span>© 2026 Khamim Zarkasyi</span>
            <span>Made with ngopi & vibes coding wkwk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
