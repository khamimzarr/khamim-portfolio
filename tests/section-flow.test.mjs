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

test("03 Routing memakai bahasa service map, bukan alur personal", () => {
  assert.ok(routing.includes('label="DOMAIN"'), "node masuk bukan DOMAIN");
  assert.ok(routing.includes('label="EDGE"'), "node perantara bukan EDGE");
  assert.ok(!routing.includes("vibes coding"), "sub-label lama masih ada");
  for (const p of PROJECTS) {
    assert.ok(routing.includes(p), `service ${p} hilang dari peta`);
  }
  assert.ok(/aria-label="Service map/.test(routing), "svg tidak punya label service map");
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
