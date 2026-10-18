import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const sidebar = readFileSync("src/components/Sidebar.tsx", "utf8");
const terminal = readFileSync("src/components/Terminal.tsx", "utf8");
const routing = readFileSync("src/components/RoutingDiagram.tsx", "utf8");

/* Kontrak alur halaman: 01 Terminal, 02 Karya, 03 Routing, 04 Data.
   Tiap section punya satu tugas, dan tidak ada yang mengulang daftar project. */
const FLOW = [
  { index: "01", id: "terminal", label: "Terminal" },
  { index: "02", id: "karya", label: "Karya" },
  { index: "03", id: "routing", label: "Routing" },
  { index: "04", id: "data", label: "Data" },
];

const PROJECTS = ["hr-ai-review", "ruang-resepsi", "structur-md", "dropdeploy"];

test("empat section tampil berurutan dengan nomor yang benar", () => {
  const positions = FLOW.map((s) => {
    const at = page.indexOf(`id="${s.id}"`);
    assert.ok(at > 0, `section #${s.id} hilang`);
    return at;
  });
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, "urutan section tidak 01..04");
  for (const s of FLOW) {
    assert.ok(page.includes(`index="${s.index}"`), `section ${s.index} kehilangan nomornya`);
    assert.ok(page.includes(`label="${s.label}"`), `section ${s.index} tidak berlabel ${s.label}`);
    assert.ok(sidebar.includes(`id: "${s.id}"`), `nav kehilangan #${s.id}`);
    assert.ok(sidebar.includes(`label: "${s.label}"`), `nav kehilangan label ${s.label}`);
  }
});

test("01 Terminal fokus ke stack dan tooling, bukan data diri atau daftar project", () => {
  const specs = [
    "Web Runtime / khamimzar.my.id",
    "TypeScript · Next.js · Node.js · Tailwind",
    "Git · Vercel · Docker · Terminal CLI",
    "Micro Web-Tools, Automation & Fast Delivery",
    "Available for builds & collaborations",
  ];
  for (const line of specs) {
    assert.ok(terminal.includes(line), `baris spec hilang: ${line}`);
  }
  assert.ok(!/whoami|Khamim Zarkasyi/.test(terminal), "terminal masih memuat data diri");
  for (const p of PROJECTS) {
    assert.ok(!terminal.includes(p), `terminal masih menyebut project ${p}`);
  }
});

test("judul section dan label hero sesuai revisi terakhir", () => {
  assert.ok(page.includes('title="Runtime Environment"'), "judul 01 bukan Runtime Environment");
  assert.ok(page.includes('title="Selected Deployments"'), "judul 02 bukan Selected Deployments");
  assert.ok(!page.includes("Dev environment, versi terminal."), "judul lama 01 masih ada");
  assert.ok(!page.includes("Kode yang sudah dipajang"), "judul lama 02 masih ada");
  assert.ok(/<p className="eyebrow">Builder<\/p>/.test(page), "label hero bukan Builder");
  assert.ok(!/>Profile</.test(page), "label PROFILE masih ada");
  assert.ok(page.includes(">WEB RUNTIME<"), "subtext hero bukan WEB RUNTIME");
  assert.ok(!page.includes("BASED: INDONESIA"), "subtext lama hero masih ada");
});

test("terminal mobile memakai key-value dua kolom, bukan teks pre yang membungkus paksa", () => {
  // Pre + padEnd bikin nilai panjang terlipat di tengah kata pada layar HP.
  assert.ok(!/<pre[\s\S]{0,400}terminal-live/.test(terminal), "terminal masih memakai <pre>");
  assert.ok(/<dl[^>]*grid-cols-\[74px_1fr\]/.test(terminal), "label dan nilai belum jadi grid dua kolom");
  assert.ok(terminal.includes("sm:grid-cols-[88px_1fr]"), "grid belum melebar di layar besar");
  assert.ok(/text-\[11px\][^"]*sm:text-\[12\.5px\]/.test(terminal), "ukuran font terminal belum compact di mobile");
  assert.ok(terminal.includes("break-words"), "nilai tidak boleh memotong kata");
  assert.ok(/<dt className="text-\[#8a8a94\]">/.test(terminal) && /<dd className="m-0 break-words/.test(terminal), "pasangan dt/dd hilang");
});

test("02 Karya: satu kartu memuat preview, nama, stack, deskripsi, dan dua tombol", () => {
  const start = page.indexOf("const projects = [");
  const block = page.slice(start, page.indexOf("];", start));
  const cards = block.match(/name: "/g) || [];
  assert.equal(cards.length, 4, `harus empat kartu, ada ${cards.length}`);
  for (const p of PROJECTS) {
    assert.ok(block.includes(`/output/${p}.jpg`), `preview ${p} hilang`);
  }
  assert.ok(page.includes("<Image"), "preview tidak memakai next/image");
  assert.ok(page.includes("quality={68}"), "quality preview berubah, cek images.qualities");
  assert.ok(page.includes("object-cover"), "preview tidak dipotong rapi");
  assert.ok(page.includes('aria-label={`Stack ${p.name}`}'), "tag stack tidak punya label aksesibel");
  assert.ok(/desc:\s*"/.test(block), "deskripsi kartu hilang");
  assert.ok(page.includes("Live Demo"), "tombol Live Demo hilang");
  assert.ok(page.includes("GitHub"), "tombol GitHub hilang");
});

test("tidak ada daftar project kedua di section lain", () => {
  // Sumber duplikasi lama: `outputs` (screenshot) terpisah dari `projects` (kartu).
  assert.ok(!/const outputs = \[/.test(page), "array outputs masih ada");
  const start = page.indexOf("const projects = [");
  const end = page.indexOf("];", start);
  const outside = page.slice(0, start) + page.slice(end);
  for (const p of PROJECTS) {
    assert.ok(!outside.includes(p), `${p} masih disebut di luar data kartu, sepertinya ada daftar kedua`);
  }
});

test("03 Routing kembali ke alur KHAMIMZAR -> TERMINAL -> project", () => {
  assert.ok(routing.includes('label="KHAMIMZAR"'), "node atas bukan KHAMIMZAR");
  assert.ok(routing.includes('label="TERMINAL"'), "node tengah bukan TERMINAL");
  assert.ok(routing.includes('sub="vibe coding"'), "keterangan node tengah bukan vibe coding");
  for (const p of PROJECTS) {
    assert.ok(routing.includes(p), `service ${p} hilang dari peta`);
  }
  assert.ok(/aria-label="Alur: KHAMIMZAR/.test(routing), "svg tidak punya label alur");
});

test("tiga section tampil tanpa kalimat deskripsi di bawah judul", () => {
  const gone = [
    "Stack, tooling, dan fokus kerja yang dipakai tiap hari.",
    "Empat web tool yang jalan di produksi. Tiap kartu membawa tangkapan layar, fungsi singkat, dan tautan keluar.",
    "Satu domain, satu edge, empat micro web-tool yang masing-masing punya backend sendiri.",
  ];
  for (const line of gone) {
    assert.ok(!page.includes(line), `deskripsi section masih ada: ${line}`);
  }
  // Prop description sudah tidak dipakai sama sekali, jadi komponennya ikut bersih.
  assert.ok(!/description[=:]\s*"/.test(page), "masih ada prop description di page.tsx");
  assert.ok(!page.includes("description?: string"), "SectionHead masih menerima prop description");
});

test("04 Data: tabel metadata di atas, log tetap di bawah", () => {
  const data = page.indexOf('id="data"');
  const table = page.indexOf("NAMA", data);
  const log = page.indexOf("{GIT_LOG_CMD}", data);
  assert.ok(data > 0 && table > data, "tabel metadata hilang dari section Data");
  assert.ok(log > table, "blok git log harus di bawah tabel metadata");
  assert.ok(page.includes("$ git log --oneline -${log.length}"), "perintah git log hilang");
  for (const row of ["NAMA", "EMAIL", "GITHUB", "VERCEL"]) {
    assert.ok(page.includes(`>${row}<`), `baris metadata ${row} hilang`);
  }
  assert.ok(page.includes("khamimzarrr@gmail.com"), "email hilang");
  assert.ok(page.includes("github.com/khamimzarr"), "github hilang");
  assert.ok(page.includes("vercel.com/voiddarkfire"), "vercel hilang");
});
