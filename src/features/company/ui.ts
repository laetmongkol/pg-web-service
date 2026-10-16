import type { SectionId } from "./stage/poses"

/** Interface words shared by every company page (the companies' own words live in content/). */
export const UI = {
  th: {
    skip: "ข้ามไปยังเนื้อหา",
    nav: { about: "เกี่ยวกับเรา", services: "บริการ", showcase: "ผลงาน", contact: "ติดต่อ" },
    allDesigns: "ทุกดีไซน์",
    language: "Switch to English",
    languageShort: "EN",
    scroll: "เลื่อนลงเพื่อเดินชมอาคาร",
    timeline: "ส่วนต่างๆ ของหน้า",
    stops: {
      top: "เริ่มต้น",
      partners: "พาร์ทเนอร์",
      about: "เกี่ยวกับเรา",
      pillars: "แนวคิด",
      services: "บริการ",
      showcase: "ผลงาน",
      testimonials: "รีวิว",
      contact: "ติดต่อ",
    } satisfies Record<SectionId, string>,
    loader: {
      title: "กำลังเตรียมอาคารให้พร้อม",
      files: "ดาวน์โหลดโมเดลและพื้นผิว",
      geometry: "ถอดรหัสรูปทรง",
      shaders: "เตรียม shader บนการ์ดจอ",
      done: "พร้อมแล้ว",
    },
    contact: { address: "ที่อยู่", email: "อีเมล", phone: "โทรศัพท์" },
    group: "บริษัทในเครือ PIP Group Holdings",
    rights: "สงวนลิขสิทธิ์",
    visit: "ดูหน้าบริษัท",
  },
  en: {
    skip: "Skip to content",
    nav: { about: "About", services: "Services", showcase: "Work", contact: "Contact" },
    allDesigns: "All designs",
    language: "เปลี่ยนเป็นภาษาไทย",
    languageShort: "TH",
    scroll: "Scroll to walk round the building",
    timeline: "Page sections",
    stops: {
      top: "Start",
      partners: "Partners",
      about: "About",
      pillars: "Approach",
      services: "Services",
      showcase: "Work",
      testimonials: "Reviews",
      contact: "Contact",
    } satisfies Record<SectionId, string>,
    loader: {
      title: "Getting the building ready",
      files: "Downloading model and textures",
      geometry: "Decoding geometry",
      shaders: "Compiling shaders on the GPU",
      done: "Ready",
    },
    contact: { address: "Address", email: "Email", phone: "Phone" },
    group: "A PIP Group Holdings company",
    rights: "All rights reserved.",
    visit: "Visit company",
  },
} as const

export type Ui = (typeof UI)["th"] | (typeof UI)["en"]
export const uiFor = (locale: string): Ui => (locale === "en" ? UI.en : UI.th)
