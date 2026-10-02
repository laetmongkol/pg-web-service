import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

// Points to our i18n/request.ts where getRequestConfig is defined.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const appServiceOrigin = (
  process.env.APP_SERVICE_ORIGIN ?? "http://localhost:8091"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Sibling services under the parent dir
  // (api-app-service, pip-group-holding-traffic-tracking-api) otherwise make Turbopack infer the
  // parent as root, which breaks `tailwindcss` resolution in CSS imports.
  turbopack: {
    root: process.cwd(),
  },
  // `experimental.authInterrupts` was enabled only for app/unauthorized.tsx and app/forbidden.tsx,
  // which the console used. Both are gone with it.
  images: {
    // Bypass Vercel's Image Optimization for our backend images: it flattens
    // transparent PNGs onto a black matte in production. The custom loader routes
    // them through api-app-service's sharp pipeline (webp, alpha preserved)
    // instead; everything else passes through untouched. See src/lib/media/image-loader.ts.
    loader: "custom",
    loaderFile: "./src/lib/media/image-loader.ts",
    // Next's defaults are 8 device widths (up to 3840) + 8 image sizes, so one <img>
    // could ask the backend for 8-16 distinct variants. These two lists must stay
    // identical to ALLOWED_WIDTHS in api-app-service src/modules/image/image.service.ts,
    // which snaps any other width up to the nearest entry.
    // Note: Next only filters this list when `sizes` contains a `vw` unit; a px-only
    // `sizes` still receives deviceSizes + imageSizes in full.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  async rewrites() {
    return {
      // `/sitemap.xml` must serve the sitemap INDEX, but app/sitemap.ts (which uses
      // generateSitemaps) already owns that route name — a second handler there is a build error.
      // beforeFiles runs ahead of app routes, so the index route answers the canonical URL while
      // the children stay at /sitemap/{id}.xml. Google Search Console keeps its existing entry.
      beforeFiles: [
        { source: "/sitemap.xml", destination: "/sitemap-index.xml" },
      ],
      afterFiles: [
        { source: "/api/app/:path*", destination: `${appServiceOrigin}/api/app/:path*` },
      ],
      fallback: [],
    };
  },
};

export default withNextIntl(nextConfig);
