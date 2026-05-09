import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB which rejects most image uploads. Bumped to 25MB so
      // the CMS image uploader (10MB raw → ~13MB base64) goes through with
      // headroom for retries / future video-or-gif uploads.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
