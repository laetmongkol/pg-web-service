// Single source for the brand identity used by metadata, JSON-LD, robots and sitemap.
export const SITE = {
  name: "PG Solution",
  description:
    "PG Solution develops software for trading technology, AI marketing and business operations.",
  url: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3008").replace(/\/+$/, ""),
} as const
