import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const display = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khamimzar.my.id"),
  title: {
    default: "KHAMIM ZARKASYI — Folio No. 01",
    template: "%s — Khamim Zarkasyi",
  },
  description:
    "Portfolio pribadi Khamim Zarkasyi — enam ritual harian: foto hal random, bersepeda, merawat tanaman & ikan hias, vibes coding, dan ngopi sambil ngerjain project.",
  keywords: [
    "Khamim Zarkasyi",
    "portfolio",
    "frontend developer",
    "developer",
    "Indonesia",
    "vibes coding",
  ],
  authors: [{ name: "Khamim Zarkasyi", url: "https://github.com/khamimzarr" }],
  creator: "Khamim Zarkasyi",
  publisher: "Khamim Zarkasyi",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "KHAMIM ZARKASYI — Folio No. 01",
    description:
      "A six-ritual portfolio — foto, sepeda, tanaman, aquarium, vibes coding & ngopi. Slate & lime, flat, no shadow.",
    url: "https://khamimzar.my.id",
    siteName: "Khamim Zarkasyi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og/og-cover.png", width: 1200, height: 630, alt: "KHAMIM ZARKASYI — Renaissance Folio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KHAMIM ZARKASYI — Folio No. 01",
    description:
      "A six-ritual portfolio — foto, sepeda, tanaman, aquarium, vibes coding & ngopi.",
    images: ["/og/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "wK2YTrRAtctmJjl8t_Ax28Aqo2yD7TTr9LGd4olm1gI",
  },
  alternates: {
    canonical: "https://khamimzar.my.id",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-canvas">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}