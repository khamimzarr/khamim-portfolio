import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const davinci = Playfair_Display({
  variable: "--font-davinci",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const helveticaNow = Inter({
  variable: "--font-helvetica-now",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KHAMIM ZARKASYI — Renaissance Folio",
  description:
    "Portfolio pribadi Khamim Zarkasyi — Foto hal random, bersepeda, merawat tanaman & ikan hias, vibes coding, ngopi sambil mengerjakan project. Dibuai dalam estetika Renaissance gallery on putty paper.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "KHAMIM ZARKASYI — Renaissance Folio",
    description:
      "A Renaissance gallery portfolio — warm putty, ink black, classical souls.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${davinci.variable} ${helveticaNow.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#c4c3b6]">{children}</body>
    </html>
  );
}
