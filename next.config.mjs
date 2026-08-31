import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This app lives beside other lockfiles; pin the tracing root to itself so
  // Next doesn't infer a parent directory as the workspace root.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    // Site Images CMS: images up to 10MB, hero background video up to 20MB
    // (see src/lib/media-limits.js). Some serverless hosts cap request
    // bodies below Next's own configured limit — if a video upload fails
    // in production despite passing this cap, keep hero clips short
    // (a few seconds) and well-compressed rather than raising this further.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
