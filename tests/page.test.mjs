import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync("src/app/page.tsx", "utf8");
const sidebar = readFileSync("src/components/Sidebar.tsx", "utf8");
const terminal = readFileSync("src/components/Terminal.tsx", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const PROJECTS = ["hr-ai-review", "ruang-resepsi", "structur-md", "dropdeploy"];
const LIVE = ["hr-ai-review-nine.vercel.app", "ruang-resepsi.vercel.app", "structur-md.vercel.app", "dropdeploy.my.id"];
const REPOS = [
  "github.com/khamimzarr/hr-ai-review",
  "github.com/khamimzarr/ruang-resepsi",
  "github.com/khamimzarr/structur-md",
  "github.com/khamimzarr/dropdeploy",
];
const SECTIONS = ["terminal", "karya", "routing", "data"];

test("section console ada semua, urut 01 sampai 04", () => {
  for (const id of SECTIONS) {
    assert.ok(page.includes(`id="${id}"`), `section missing: #${id}`);
  }
  const order = SECTIONS.map((id) => page.indexOf(`id="${id}"`));
  assert.deepEqual([...order].sort((a, b) => a - b), order, "urutan section tidak sesuai 01..04");
  // Dua section lama (daftar project dobel dan Tentang) tidak boleh muncul lagi.
  assert.ok(!page.includes('id="output"'), "#output masih ada");
  assert.ok(!page.includes('id="tentang"'), "#tentang masih ada");
});

test("section Motto sudah dihapus", () => {
  assert.ok(!/Motto/i.test(page), "Motto section still present");
  assert.ok(!/Maha Perencana/.test(page), "motto quote still present");
});

test("empat karya nyata dengan tautan live dan repo", () => {
  for (const p of PROJECTS) {
    assert.ok(page.includes(p), `project missing: ${p}`);
  }
  for (const url of LIVE) {
    assert.ok(page.includes(url), `live url missing: ${url}`);
  }
  for (const repo of REPOS) {
    assert.ok(page.includes(repo), `repo url missing: ${repo}`);
  }
});

test("kontak dan metadata data nyata", () => {
  for (const p of PROJECTS) {
    assert.ok(page.includes(`/output/${p}.jpg`), `screenshot missing: ${p}`);
  }
  assert.ok(!page.includes("/hobi/"), "halaman masih menautkan foto hobi");
  assert.ok(/mailto:khamimzarrr@gmail\.com/.test(page), "email missing");
  assert.ok(page.includes("github.com/khamimzarr"), "github missing");
  assert.ok(page.includes("instagram.com/bukann_bapakmu"), "instagram missing");
  assert.ok(page.includes("vercel.com/voiddarkfire"), "akun vercel missing");
});

test("tiap kartu karya membawa tangkapan layar, deskripsi, stack, dan dua aksi", () => {
  const start = page.indexOf("const projects = [");
  const block = page.slice(start, page.indexOf("];", start));
  for (const p of PROJECTS) {
    assert.ok(block.includes(`/output/${p}.jpg`), `screenshot missing in card: ${p}`);
    assert.ok(block.includes(`github.com/khamimzarr/${p}`), `repo missing in card: ${p}`);
  }
  assert.ok(block.includes("desc:"), "kartu tidak punya deskripsi");
  assert.ok(block.includes("stack:"), "kartu tidak punya tag stack");
  assert.ok(page.includes("Live Demo"), "tombol Live Demo hilang");
  assert.ok(/GitHub\s*<\/a>/.test(page), "tombol GitHub hilang");
  // Satu sumber data: daftar outputs yang dulu mengulang project yang sama sudah lebur.
  assert.ok(!/const outputs = \[/.test(page), "daftar outputs masih terpisah dari projects");
  const shots = page.match(/\/output\/[a-z-]+\.jpg/g) || [];
  assert.equal(shots.length, PROJECTS.length, `tangkapan layar muncul ${shots.length} kali, harus ${PROJECTS.length}`);
});

test("terminal berisi spesifikasi kerja, bukan daftar project", () => {
  for (const field of ["OS / Host", "Stack", "Tools", "Focus", "Status"]) {
    assert.ok(terminal.includes(field), `terminal kehilangan baris ${field}`);
  }
  for (const tool of ["TypeScript", "Next.js", "Node.js", "Tailwind", "Git", "Vercel", "Docker"]) {
    assert.ok(terminal.includes(tool), `terminal kehilangan tool ${tool}`);
  }
  assert.ok(terminal.includes("khamimzar.my.id"), "terminal tidak menyebut host");
  assert.ok(!terminal.includes("Khamim Zarkasyi"), "terminal masih memuat data diri");
  for (const p of PROJECTS) {
    assert.ok(!terminal.includes(p), `terminal masih mengulang project ${p}`);
  }
  assert.ok(/prefers-reduced-motion|useReducedMotion/.test(terminal), "terminal ignores reduced motion");
});

test("sidebar menautkan section console", () => {
  for (const id of SECTIONS) {
    assert.ok(sidebar.includes(`id: "${id}"`), `sidebar missing target ${id}`);
    assert.ok(page.includes(`id="${id}"`), `page missing section ${id}`);
  }
  assert.ok(sidebar.includes('label: "Routing"'), "nav 03 bukan Routing");
  assert.ok(sidebar.includes('label: "Data"'), "nav 04 bukan Data");
  assert.ok(sidebar.includes("aria-current"), "sidebar has no active state");
});

test("tiga dimensi sudah dilepas", () => {
  assert.ok(!pkg.dependencies.three, "three still a dependency");
  assert.ok(!pkg.dependencies["@react-three/fiber"], "r3f still a dependency");
  assert.ok(!existsSync("src/components/three"), "three components still present");
  assert.ok(!/AmbientBackground|HeroScene|KaryaScene/.test(page), "3D still imported");
});

test("teks Tentang yang lama sudah dihapus", () => {
  assert.ok(!/Seorang penjaga hal kecil/.test(page), "old heading still present");
  assert.ok(!/Halo, aku Khamim Zarkasyi/.test(page), "old paragraph still present");
  assert.ok(page.includes("RoutingDiagram"), "routing diagram hilang");
  assert.ok(!page.includes("Still life"), "foto still life seharusnya sudah diganti panel log");
  assert.ok(page.includes("git log --oneline"), "panel log hilang dari section Data");
});

test("card Data dan card log memakai perlakuan yang sama", () => {
  assert.ok(page.includes("items-stretch"), "grid does not stretch both cards to one height");
  assert.ok(!page.includes('className="tile p-2"'), "photo card still uses the old mismatched frame");
  const panelCards = page.match(/panel flex flex-col p-4 md:p-5/g) || [];
  assert.ok(panelCards.length >= 2, `expected both cards to share one treatment, found ${panelCards.length}`);
});

test("nama tidak diulang di judul hero dan baris pembuka", () => {
  assert.ok(!/<h1(?![^>]*sr-only)[^>]*>[\s\S]{0,80}Khamim Zarkasyi/.test(page), "big visible name still at the top of the hero");
  assert.ok(page.includes('className="sr-only"'), "no screen-reader h1 keeping the page semantics");
  assert.ok(!/Khamim Zarkasyi\. Yang dipajang/.test(page), "opening line still repeats the name");
  assert.ok(page.includes("Khamim Zarkasyi"), "name should still exist in the profile card");
});

test("kalimat penjelas yang ditandai owner sudah dihapus", () => {
  const gone = [
    "Yang dipajang di sini",
    "Perintah di bawah ini mengeluarkan daftar project",
    "Empat project yang tumbuh dari ngopi",
    "Enam kebiasaan yang aku rawat seperti koleksi galeri",
    "Foto asli, jepretan random Khamim",
    "Foto asli, goes pagi",
    "Menangkap yang terlewat",
    "Ritual roda di pagi sunyi",
    "Merawat diam",
    "Katedral kaca",
    "Kode sebagai kaligrafi",
    "Pahit yang menyalakan ide",
  ];
  for (const s of gone) {
    assert.ok(!page.includes(s), `still present: ${s}`);
  }
  for (const title of ["Foto Hal Random", "Bersepeda", "Merawat Tanaman", "Ikan Hias & Aquarium", "Vibes Coding", "Ngopi + Nge-project"]) {
    assert.ok(!page.includes(title), `judul hobi seharusnya sudah hilang: ${title}`);
  }
  assert.ok(!/Hobi|hobi/.test(page), "sisa kata hobi masih ada di halaman");
});

test("footer yang ditandai owner sudah dihapus", () => {
  assert.ok(!page.includes("Made with ngopi & vibes coding wkwk"), "footer signature still present");
  assert.ok(!page.includes("© 2026 Khamim Zarkasyi"), "footer copyright still present");
  assert.ok(!page.includes("<footer"), "empty footer element left behind");
});

test("aksi kontak memakai label Kontak", () => {
  assert.ok(page.includes("Kontak"), "contact label missing");
  assert.ok(!page.includes("ngopi sambil ngobrol project"), "old contact label still present");
});
