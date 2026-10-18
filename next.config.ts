import type { NextConfig } from "next";

/**
 * Header keamanan. HSTS tidak ditulis di sini karena Vercel sudah memasangnya
 * di edge, dan menimpanya berisiko bikin domain terkunci kelamaan.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    // AVIF dulu, WebP sebagai cadangan: foto hobi turun jauh tanpa ubah kualitas asli.
    formats: ["image/avif", "image/webp"],
    // Next 16 menolak nilai `quality` di luar daftar ini dengan 400, jadi 68 harus didaftarkan
    // sebelum dipakai di page.tsx.
    qualities: [68, 75],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
