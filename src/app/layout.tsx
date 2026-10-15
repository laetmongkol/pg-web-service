import type { Metadata, Viewport } from "next"

import { SITE } from "@/shared/constants/site.constants"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
}

export const viewport: Viewport = {
  themeColor: "#242220",
}

// <html> lives in [locale]/layout so `lang` comes from the URL segment. Reading the locale here
// would resolve next-intl's request config before the segment sets it, pinning every page to th.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
