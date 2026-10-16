import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { COMPANIES, pick } from "@/companies/companies"
import { ALL_DISPLAY_CLASSES, displayFont } from "@/features/company/fonts"
import { assetPath } from "@/lib/asset-path"
import cn from "@/lib/tw-merge"

const COPY = {
  th: {
    title: "เลือกหน้าที่อยากดู",
    lead: "รวมทุกดีไซน์ที่ทำไว้ในที่เดียว หน้าบริษัทในเครือ PIP Group ทั้ง 7 แห่ง แต่ละหน้าเดินชมอาคาร 3D ของบริษัทนั้นตามการเลื่อน และดีไซน์ทดลองของ PG Solution อีกสองแบบ",
    companies: "บริษัทในเครือ",
    companiesNote: "7 หน้า ตึกจาก company.blend",
    experiments: "ดีไซน์ทดลองของ PG Solution",
    experimentsNote: "หน้าเว็บ PG Solution ฉบับเต็ม สองแนวทาง",
    open: "เปิดหน้า",
    language: "Switch to English",
    languageShort: "EN",
    designs: [
      {
        href: "/design/2/",
        image: "/images/tower-fallback.webp",
        name: "Design 2 — ตึกกลางคืน",
        body: "ตึกหรูยามค่ำ กล้องไล่ลงทีละชั้น มีโมเดลประกอบแต่ละ section ทางขวา",
      },
      {
        href: "/design/1/",
        image: "/images/tower-fallback-v1b.webp",
        name: "Design 1 — หอคอยแสงคบไฟ",
        body: "หอคอยหินโทนอุ่น เดินลงทีละห้อง มีโมเดลลอยอยู่กลางห้องตามเนื้อหา",
      },
    ],
  },
  en: {
    title: "Pick a page to view",
    lead: "Every design in one place: the seven PIP Group company pages, each a scroll-driven walk round that company's 3D building, plus two experimental designs for PG Solution.",
    companies: "Group companies",
    companiesNote: "7 pages, buildings from company.blend",
    experiments: "PG Solution design experiments",
    experimentsNote: "The full PG Solution site, two directions",
    open: "Open page",
    language: "เปลี่ยนเป็นภาษาไทย",
    languageShort: "TH",
    designs: [
      {
        href: "/design/2/",
        image: "/images/tower-fallback.webp",
        name: "Design 2 — Night tower",
        body: "A luxury tower at night, filmed floor by floor, with a model for each section on the right.",
      },
      {
        href: "/design/1/",
        image: "/images/tower-fallback-v1b.webp",
        name: "Design 1 — Torch-lit tower",
        body: "A warm stone tower walked room by room, with a model floating in each chamber.",
      },
    ],
  },
} as const

/**
 * The home page: a directory of everything built so far. Company tiles carry each brand's own
 * colour and display face, so the picker already previews the page behind it.
 */
export default function DesignPicker({ locale }: { locale: string }) {
  const copy = locale === "en" ? COPY.en : COPY.th
  const other = locale === "en" ? "th" : "en"

  return (
    <div className={cn(ALL_DISPLAY_CLASSES, "min-h-svh bg-[#e9ebee] text-[#14171c]")}>
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 pt-6 md:px-12 lg:px-16">
        <p className="text-[15px] font-semibold tracking-[0.04em]">PIP GROUP</p>
        <a
          href={assetPath(`/${other}/`)}
          hrefLang={other}
          aria-label={copy.language}
          className="text-[13px] font-semibold underline-offset-4 hover:underline"
        >
          {copy.languageShort}
        </a>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-24 md:px-12 lg:px-16">
        <section aria-labelledby="picker-title" className="grid gap-6 pt-16 pb-14 md:grid-cols-[1.1fr_1fr] md:items-end md:pt-24">
          <h1 id="picker-title" className="text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.04] font-semibold tracking-[-0.01em]">
            {copy.title}
          </h1>
          <p className="max-w-[52ch] text-[17px] leading-[1.75] text-[#4b525e]">{copy.lead}</p>
        </section>

        <section aria-labelledby="companies-title">
          <div className="flex items-baseline justify-between gap-4 border-t border-[#14171c]/15 pt-5">
            <h2 id="companies-title" className="text-[20px] font-semibold">
              {copy.companies}
            </h2>
            <p className="text-[13px] text-[#5c6370]">{copy.companiesNote}</p>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {COMPANIES.map((co, i) => {
              const font = displayFont(co.theme.display)
              return (
                <li key={co.slug} className={cn(i === 0 && "sm:col-span-2 xl:col-span-2")}>
                  <Link
                    href={`/${locale}/${co.slug}/`}
                    className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_1px_0_rgb(20_23_28/0.06),0_24px_48px_-32px_rgb(20_23_28/0.4)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1"
                    style={{ ["--brand" as string]: co.theme.primary, ["--brand-bg" as string]: co.theme.bg }}
                  >
                    <div className={cn("relative overflow-hidden bg-(--brand-bg)", i === 0 ? "aspect-[16/8]" : "aspect-[16/10]")}>
                      <Image
                        src={assetPath(`/images/company/${co.slug}.webp`)}
                        alt=""
                        fill
                        sizes={i === 0 ? "(min-width: 1280px) 66vw, 100vw" : "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"}
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
                      />
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-(--brand)" />
                    </div>
                    <div className="flex flex-1 items-start justify-between gap-4 p-5 md:p-6">
                      <div>
                        <p className="text-[22px] leading-7 font-semibold" style={{ fontFamily: font.family }}>
                          {pick(co.name, locale)}
                        </p>
                        <p className="mt-1.5 text-[14px] leading-[1.6] text-[#5c6370]">{pick(co.tagline, locale)}</p>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#14171c]/15 transition-colors group-hover:border-transparent group-hover:bg-(--brand)">
                        <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />
                        <span className="sr-only">{copy.open}</span>
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="experiments-title" className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-t border-[#14171c]/15 pt-5">
            <h2 id="experiments-title" className="text-[20px] font-semibold">
              {copy.experiments}
            </h2>
            <p className="text-[13px] text-[#5c6370]">{copy.experimentsNote}</p>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {copy.designs.map((d) => (
              <li key={d.href}>
                <Link
                  href={`/${locale}${d.href}`}
                  className="group grid overflow-hidden rounded-[22px] bg-[#14171c] text-white sm:grid-cols-[1fr_1.1fr]"
                >
                  <div className="relative aspect-[4/3] sm:aspect-auto">
                    <Image src={assetPath(d.image)} alt="" fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-col p-6">
                    <p className="text-[20px] leading-7 font-semibold">{d.name}</p>
                    <p className="mt-2 text-[14px] leading-[1.65] text-white/70">{d.body}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-semibold">
                      {copy.open}
                      <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
