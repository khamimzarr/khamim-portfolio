import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khamimzar.my.id"),
  title: {
    default: "Khamim Zarkasyi · Karya dan Hobi",
    template: "%s · Khamim Zarkasyi",
  },
  description:
    "Portfolio Khamim Zarkasyi. Empat project yang sudah live dan enam kebiasaan harian: foto hal random, bersepeda, merawat tanaman, aquarium, vibes coding, dan ngopi sambil ngerjain project.",
  keywords: [
    "Khamim Zarkasyi",
    "portfolio",
    "frontend developer",
    "Next.js",
    "Indonesia",
    "karya",
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
    title: "Khamim Zarkasyi · Karya dan Hobi",
    description:
      "Empat project yang sudah live dan enam kebiasaan harian, dipajang di satu panggung gelap.",
    url: "https://khamimzar.my.id",
    siteName: "Khamim Zarkasyi",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og/og-cover.png", width: 1200, height: 630, alt: "Khamim Zarkasyi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khamim Zarkasyi · Karya dan Hobi",
    description: "Empat project yang sudah live dan enam kebiasaan harian.",
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
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#000000]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
