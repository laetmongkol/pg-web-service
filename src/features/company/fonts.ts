import { IBM_Plex_Sans_Thai, Kanit, Noto_Serif_Thai } from "next/font/google"

import type { CompanyTheme } from "@/companies/companies"

// Display faces for the company pages only (imported by those routes, so the rest of the site
// never downloads them). Body text stays in Anuphan everywhere.
const serif = Noto_Serif_Thai({
  variable: "--font-company-serif",
  subsets: ["latin", "thai"],
  weight: ["500", "600", "700"],
  display: "swap",
})
const kanit = Kanit({
  variable: "--font-company-kanit",
  subsets: ["latin", "thai"],
  weight: ["500", "600", "700"],
  display: "swap",
})
const plex = IBM_Plex_Sans_Thai({
  variable: "--font-company-plex",
  subsets: ["latin", "thai"],
  weight: ["500", "600", "700"],
  display: "swap",
})

const FACES = {
  serif: { className: serif.variable, family: "var(--font-company-serif)" },
  kanit: { className: kanit.variable, family: "var(--font-company-kanit)" },
  plex: { className: plex.variable, family: "var(--font-company-plex)" },
  sans: { className: "", family: "var(--font-anuphan)" },
} as const

/** Class that loads the display face, and the CSS value for `--c-display`. */
export const displayFont = (display: CompanyTheme["display"]) => FACES[display]

/** Every display face, for the picker page which previews all companies at once. */
export const ALL_DISPLAY_CLASSES = [serif.variable, kanit.variable, plex.variable].join(" ")
