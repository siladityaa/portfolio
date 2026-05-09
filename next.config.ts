import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB which rejects most image uploads. Bumped to 15MB so
      // the CMS image uploader (capped at 10MB on the client, plus base64
      // overhead of ~33%) goes through cleanly.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
