import createNextIntlPlugin from "next-intl/plugin"

import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

// Static export for GitHub Pages. A project site is served from /<repo-name>, so the build sets
// NEXT_PUBLIC_BASE_PATH (see .github/workflows/deploy-pages.yml); local dev leaves it empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // GitHub Pages serves folders as /th/index.html — trailing slashes keep links resolving.
  trailingSlash: true,
  // No image server on Pages; assets are already sized and compressed.
  images: { unoptimized: true },
  // Pin the workspace root to this project; sibling services under the parent dir otherwise make
  // Turbopack infer the parent as root, which breaks `tailwindcss` resolution in CSS imports.
  turbopack: {
    root: process.cwd(),
  },
}

export default withNextIntl(nextConfig)
