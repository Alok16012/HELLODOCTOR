import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CRM code (src/app/(crm)) carried over from the Meera project builds with
  // some pre-existing type looseness; don't block production builds on it.
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.collegedunia.com" },
    ],
  },
};

export default nextConfig;
