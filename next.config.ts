import createNextIntlPlugin from "next-intl/plugin"

import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  // Pin the workspace root to this project; sibling services under the parent dir otherwise make
  // Turbopack infer the parent as root, which breaks `tailwindcss` resolution in CSS imports.
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        // The tower model is versioned by filename; let browsers keep it.
        source: "/models/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
