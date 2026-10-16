import { content as dms } from "./content/dms"
import { content as pgSolution } from "./content/pg-solution"
import { content as pipEvolution } from "./content/pip-evolution"
import { content as pipGroup } from "./content/pip-group"
import { content as sabaideeFinx } from "./content/sabaidee-finx"
import { content as sevenDays } from "./content/seven-days"
import { content as sriwilai } from "./content/sriwilai"

import type { CompanyContent, L } from "./types"

export type CompanySlug =
  | "pip-group"
  | "sriwilai"
  | "dms"
  | "seven-days"
  | "pip-evolution"
  | "pg-solution"
  | "sabaidee-finx"

/** Brand surface tokens. Written as CSS variables on the page wrapper; sections only read those. */
export interface CompanyTheme {
  mode: "light" | "dark"
  bg: string
  surface: string
  ink: string
  muted: string
  /** Brand colour: actions, accents, the loader ring. */
  primary: string
  /** Text drawn on `primary`. */
  onPrimary: string
  /** Second brand colour, used sparingly (rules, chart lines, hover). */
  accent: string
  /** Display face for headlines; body text always stays in the site sans. */
  display: "serif" | "kanit" | "plex" | "sans"
}

/** How the building is lit: sky, sun, fog and how much the windows glow. */
export interface CompanyMood {
  skyTop: string
  skyBottom: string
  fog: string
  /** Fog start/end as multiples of the building's radius, measured from the building (the camera sits 3–4 radii out). */
  fogRange: [number, number]
  ground: string
  sun: { color: string; intensity: number; azimuth: number; elevation: number }
  hemi: { sky: string; ground: string; intensity: number }
  /** Multiplier for emissive interior lights / LED strips (night moods glow more). */
  glow: number
  exposure: number
  /** Colours of the small floating brand tokens around the building. */
  tokens: string[]
}

export interface Company {
  slug: CompanySlug
  name: L
  /** Short wordmark for the nav and loader. */
  mark: string
  /** One line for the picker and metadata. */
  tagline: L
  theme: CompanyTheme
  mood: CompanyMood
  content: CompanyContent
}

export const COMPANIES: Company[] = [
  {
    slug: "pip-group",
    name: { th: "พีไอพี กรุ๊ป โฮลดิ้ง", en: "PIP Group Holdings" },
    mark: "PIP GROUP",
    tagline: {
      th: "บริษัทแม่ของกลุ่ม เชื่อมเทคโนโลยี การบริหาร และการพาณิชย์",
      en: "The group's holding company: technology, management and commerce",
    },
    theme: {
      mode: "light",
      bg: "#f4efe7",
      surface: "#ffffff",
      ink: "#14213d",
      muted: "#5e6678",
      primary: "#c98e3f",
      onPrimary: "#14213d",
      accent: "#1e3a64",
      display: "serif",
    },
    mood: {
      skyTop: "#d9c9ad",
      skyBottom: "#f6efe4",
      fog: "#efe5d6",
      fogRange: [2.6, 7],
      ground: "#e6dccb",
      sun: { color: "#ffe2b5", intensity: 2.6, azimuth: 35, elevation: 38 },
      hemi: { sky: "#fff4e2", ground: "#b9a07a", intensity: 1.1 },
      glow: 0.8,
      exposure: 1.05,
      tokens: ["#c98e3f", "#e8c27e", "#1e3a64", "#ffffff"],
    },
    content: pipGroup,
  },
  {
    slug: "sriwilai",
    name: { th: "ศรีวิไล แบงค์คอก", en: "Sriwilai Bangkok" },
    mark: "SRIWILAI",
    tagline: { th: "ที่ปรึกษาธุรกิจและเอเจนซีการตลาด", en: "Business consulting and marketing agency" },
    theme: {
      mode: "light",
      bg: "#eeede9",
      surface: "#fbfbf9",
      ink: "#2b2b2b",
      muted: "#77766f",
      primary: "#45443d",
      onPrimary: "#f4f3ef",
      accent: "#a8a196",
      display: "serif",
    },
    mood: {
      skyTop: "#c9cbcd",
      skyBottom: "#f1f0ec",
      fog: "#e7e6e1",
      fogRange: [2.4, 6.5],
      ground: "#dcdad4",
      sun: { color: "#fff8ee", intensity: 2.2, azimuth: -40, elevation: 46 },
      hemi: { sky: "#ffffff", ground: "#a9a59b", intensity: 1.2 },
      glow: 0.6,
      exposure: 1.05,
      tokens: ["#cfc9be", "#ffffff", "#45443d", "#b5afa5"],
    },
    content: sriwilai,
  },
  {
    slug: "dms",
    name: { th: "ดีเอ็มเอส อินฟินิตี้", en: "DMS Infinite" },
    mark: "DMS INFINITE",
    tagline: { th: "ที่ปรึกษาธุรกิจ การตลาด ไอที และซอฟต์แวร์", en: "Business, marketing, IT and software partner" },
    theme: {
      mode: "dark",
      bg: "#141414",
      surface: "#1e1e1e",
      ink: "#ffffff",
      muted: "#9a9a9a",
      primary: "#ffe100",
      onPrimary: "#141414",
      accent: "#f5a623",
      display: "kanit",
    },
    mood: {
      skyTop: "#050505",
      skyBottom: "#2a2412",
      fog: "#16140d",
      fogRange: [2.2, 6],
      ground: "#1b1a16",
      sun: { color: "#ffd98a", intensity: 1.6, azimuth: 60, elevation: 30 },
      hemi: { sky: "#6b6450", ground: "#1a1812", intensity: 1.15 },
      glow: 2.2,
      exposure: 1.1,
      tokens: ["#ffe100", "#f5a623", "#ffffff", "#ffe100"],
    },
    content: dms,
  },
  {
    slug: "seven-days",
    name: { th: "เซเว่นเดย์ อคาเดมี่", en: "7Days Academy" },
    mark: "7DAYS",
    tagline: { th: "สถาบันสอนเทรดและพัฒนาซอฟต์แวร์สำหรับเทรดเดอร์", en: "Trading education and software for traders" },
    theme: {
      mode: "dark",
      bg: "#000000",
      surface: "#101410",
      ink: "#ffffff",
      muted: "#9ca3af",
      primary: "#00e64d",
      onPrimary: "#000000",
      accent: "#3dff6e",
      display: "kanit",
    },
    mood: {
      skyTop: "#000000",
      skyBottom: "#06210f",
      fog: "#020a05",
      fogRange: [2.2, 6],
      ground: "#0b0f0c",
      sun: { color: "#d6ffe2", intensity: 1.5, azimuth: -50, elevation: 34 },
      hemi: { sky: "#4d6b56", ground: "#0b130e", intensity: 1.15 },
      glow: 2.6,
      exposure: 1.1,
      tokens: ["#00e64d", "#3dff6e", "#ffffff", "#0fa83a"],
    },
    content: sevenDays,
  },
  {
    slug: "pip-evolution",
    name: { th: "พิพ อีโวลูชั่น", en: "PIP Evolution" },
    mark: "PIP EVOLUTION",
    tagline: { th: "ซอฟต์แวร์ ระบบเทรดอัตโนมัติ และ FinTech", en: "Software, automated trading and FinTech" },
    theme: {
      mode: "dark",
      bg: "#0a3058",
      surface: "#0f4c81",
      ink: "#f5f7fb",
      muted: "#a9bdd6",
      primary: "#2d7fd3",
      onPrimary: "#ffffff",
      accent: "#9db3cc",
      display: "plex",
    },
    mood: {
      skyTop: "#0b2a4d",
      skyBottom: "#5d86b5",
      fog: "#24486f",
      fogRange: [2.4, 6.5],
      ground: "#1d3754",
      sun: { color: "#ffd2a6", intensity: 2, azimuth: 70, elevation: 14 },
      hemi: { sky: "#b3cdec", ground: "#1b3554", intensity: 1.15 },
      glow: 1.6,
      exposure: 1.05,
      tokens: ["#2d7fd3", "#9db3cc", "#ffffff", "#5fa8ff"],
    },
    content: pipEvolution,
  },
  {
    slug: "pg-solution",
    name: { th: "พีจี โซลูชั่น", en: "PG Solution" },
    mark: "PG SOLUTION",
    tagline: { th: "ซอฟต์แวร์เทรด การตลาดด้วย AI และระบบธุรกิจ", en: "Trading software, AI marketing and business systems" },
    theme: {
      mode: "dark",
      bg: "#070b1c",
      surface: "#0f1530",
      ink: "#f5f1e8",
      muted: "#aeb7d6",
      primary: "#ff6946",
      onPrimary: "#070b1c",
      accent: "#f2c27b",
      display: "sans",
    },
    mood: {
      skyTop: "#070b1c",
      skyBottom: "#2a3466",
      fog: "#111833",
      fogRange: [2.4, 6.5],
      ground: "#151a2e",
      sun: { color: "#b8c4ff", intensity: 1.6, azimuth: 40, elevation: 32 },
      hemi: { sky: "#6c7bbd", ground: "#141a33", intensity: 1.15 },
      glow: 2,
      exposure: 1.1,
      tokens: ["#ff6946", "#f2c27b", "#f5f1e8", "#7f8fff"],
    },
    content: pgSolution,
  },
  {
    slug: "sabaidee-finx",
    name: { th: "สบายดี ฟินซ์", en: "Sabaidee Finx" },
    mark: "SABAIDEE FINX",
    tagline: { th: "เทคโนโลยีการเงินและระบบชำระเงินดิจิทัล", en: "Financial technology and digital payments" },
    theme: {
      mode: "dark",
      bg: "#130e22",
      surface: "#1d1634",
      ink: "#f4f1ff",
      muted: "#a79fc4",
      primary: "#8b5cf6",
      onPrimary: "#ffffff",
      accent: "#c4b5fd",
      display: "plex",
    },
    mood: {
      skyTop: "#120c24",
      skyBottom: "#5a3f8f",
      fog: "#2a1f45",
      fogRange: [2.4, 6.5],
      ground: "#1c1630",
      sun: { color: "#ffc9e8", intensity: 1.7, azimuth: -60, elevation: 16 },
      hemi: { sky: "#b9a3e6", ground: "#1e1638", intensity: 1.1 },
      glow: 1.8,
      exposure: 1.05,
      tokens: ["#8b5cf6", "#c4b5fd", "#ffffff", "#f0abfc"],
    },
    content: sabaideeFinx,
  },
]

export const COMPANY_SLUGS = COMPANIES.map((c) => c.slug)

export function getCompany(slug: string): Company | undefined {
  return COMPANIES.find((c) => c.slug === slug)
}

/** Pick the string for a locale (Thai is the fallback). */
export const pick = (l: L, locale: string) => (locale === "en" ? l.en : l.th)
