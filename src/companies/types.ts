/** A string in both site languages. */
export type L = { th: string; en: string }

/** Icons the sections can draw (mapped to lucide icons in the UI). */
export type IconKey =
  | "strategy"
  | "megaphone"
  | "sparkles"
  | "pen"
  | "cloud"
  | "bulb"
  | "code"
  | "cubes"
  | "headset"
  | "cap"
  | "chart"
  | "shield"
  | "users"
  | "globe"
  | "coins"
  | "rocket"
  | "handshake"
  | "target"
  | "book"
  | "layers"

export type Stat = { value: string; label: L }

/**
 * Everything a company landing page says, in page order. Every company fills the same shape so
 * one set of section components renders all of them; the theme decides how it looks.
 */
export interface CompanyContent {
  hero: {
    eyebrow: L
    /** Headline; `accent` is a substring of it drawn in the brand colour. */
    title: L
    accent?: L
    lead: L
    primaryCta: L
    secondaryCta: L
  }
  partners: { label: L; title: L; lead?: L; names: string[]; stat?: Stat }
  about: { label: L; title: L; body: L; stats: Stat[]; quote?: L }
  /** Mission / why us / approach / values — 3 or 4 short pillars. */
  pillars: { label: L; title: L; lead?: L; items: { title: L; body: L }[] }
  services: { label: L; title: L; lead: L; items: { name: L; body: L; icon: IconKey; tag?: string }[] }
  /** Projects / software / courses / group companies — 3 to 6 cards. */
  showcase: {
    label: L
    title: L
    lead?: L
    items: { title: L; body: L; tags?: string[]; metric?: Stat; href?: string }[]
  }
  testimonials: { label: L; title: L; lead?: L; items: { quote: L; name: L; role: L }[] }
  cta: { label: L; title: L; lead: L; button: L }
  contact: { address: L; email: string; phone?: string }
  footer: { blurb: L; note?: L }
}
