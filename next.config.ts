import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
// Extract origin only (strip path)
const apiOrigin = new URL(apiUrl).origin;

const securityHeaders = [
  // Prevents the page from being embedded in iframes (clickjacking)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Stops browsers from MIME-sniffing the content type
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Controls how much referrer info is sent
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restricts browser features not used by the app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Forces HTTPS once deployed (ignored by HTTP in dev)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline for styles; tighten with nonces in production
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Images from self + Unsplash
      `img-src 'self' data: https://images.unsplash.com`,
      // API calls only to the configured backend origin
      `connect-src 'self' ${apiOrigin}`,
      // Scripts: self only (Next.js 13+ App Router doesn't need unsafe-eval in prod)
      "script-src 'self' 'unsafe-inline'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Produces a minimal self-contained server in .next/standalone/ — ideal for Docker
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
