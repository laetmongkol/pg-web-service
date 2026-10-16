import { setRequestLocale } from "next-intl/server"

import type { Metadata } from "next"

import DesignPicker from "@/features/picker/design-picker"
import { routing } from "@/i18n/routing"
import { SITE } from "@/shared/constants/site.constants"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const title = locale === "en" ? "PIP Group — all designs" : "PIP Group — รวมทุกดีไซน์"
  return {
    title: { absolute: title },
    description:
      locale === "en"
        ? "Every page built so far: the seven PIP Group company sites and the PG Solution design experiments."
        : "รวมทุกหน้าที่ทำไว้ หน้าบริษัทในเครือ PIP Group ทั้ง 7 แห่ง และดีไซน์ทดลองของ PG Solution",
    alternates: {
      canonical: `${SITE.url}/${locale}/`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE.url}/${l}/`])),
    },
  }
}

/** Home: a picker for every design, so each one is a click away. */
export default async function Home({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DesignPicker locale={locale} />
}
