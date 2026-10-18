import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khamimzar.my.id"),
  title: {
    default: "Khamim Zarkasyi · Karya dan Hobi",
    template: "%s · Khamim Zarkasyi",
  },
  description:
    "Portfolio Khamim Zarkasyi: empat project live dan enam kebiasaan harian — foto hal random, bersepeda, tanaman, aquarium, coding, dan ngopi.",
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
      "Empat project yang sudah live dan enam kebiasaan harian, dipajang di satu konsol gelap.",
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

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

/** Data terstruktur supaya mesin pencari tahu ini halaman orang, bukan halaman toko. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://khamimzar.my.id/#person",
      name: "Khamim Zarkasyi",
      url: "https://khamimzar.my.id",
      email: "mailto:khamimzarrr@gmail.com",
      jobTitle: "Frontend Developer",
      knowsAbout: ["JavaScript", "TypeScript", "Next.js", "React"],
      sameAs: ["https://github.com/khamimzarr", "https://instagram.com/bukann_bapakmu"],
    },
    {
      "@type": "WebSite",
      "@id": "https://khamimzar.my.id/#website",
      url: "https://khamimzar.my.id",
      name: "Khamim Zarkasyi · Karya dan Hobi",
      inLanguage: "id-ID",
      publisher: { "@id": "https://khamimzar.my.id/#person" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#080808]">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: "<style>.reveal{opacity:1;transform:none}.terminal-live{display:none}</style>",
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
