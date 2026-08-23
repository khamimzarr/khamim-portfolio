import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  metadataBase: new URL("https://khamim-portfolio.vercel.app"),
  title: {
    default: "KHAMIM ZARKASYI — Renaissance Folio",
    template: "%s — Khamim Zarkasyi",
  },
  description:
    "Portfolio pribadi Khamim Zarkasyi — foto hal random, bersepeda, merawat tanaman & ikan hias, vibes coding, ngopi sambil ngerjain project. Renaissance gallery on putty paper.",
  keywords: [
    "Khamim Zarkasyi",
    "portfolio",
    "frontend developer",
    "Renaissance",
    "putty",
    "Indonesia",
    "vibes coding",
  ],
  authors: [{ name: "Khamim Zarkasyi", url: "https://github.com/khamimzarr" }],
  creator: "Khamim Zarkasyi",
  publisher: "Khamim Zarkasyi",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "KHAMIM ZARKASYI — Renaissance Folio",
    description:
      "A Renaissance gallery portfolio — warm putty, ink black, classical souls. Foto, sepeda, tanaman, aquarium, vibes coding & ngopi.",
    url: "https://khamim-portfolio.vercel.app",
    siteName: "Khamim Zarkasyi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og/og-cover.png", width: 1200, height: 630, alt: "KHAMIM ZARKASYI — Renaissance Folio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KHAMIM ZARKASYI — Renaissance Folio",
    description:
      "A Renaissance gallery portfolio — warm putty, ink black, classical souls.",
    images: ["/og/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${davinci.variable} ${helveticaNow.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#c4c3b6]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}