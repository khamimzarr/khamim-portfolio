import type { MetadataRoute } from "next";

/** Sebelumnya /manifest.webmanifest masih 404, jadi ikon dan warna aplikasi belum terpasang. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khamim Zarkasyi · Karya",
    short_name: "Khamim Folio",
    description:
      "Portfolio Khamim Zarkasyi. Empat project Next.js yang sudah live, lengkap dengan tampilannya, kode sumber, dan catatan pengerjaannya.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    lang: "id",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
