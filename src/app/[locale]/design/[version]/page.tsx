import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"

import type { Metadata } from "next"

import DesignOne from "@/designs/v1/home"
import DesignTwo from "@/designs/v2/home"
import { routing } from "@/i18n/routing"
import { SITE } from "@/shared/constants/site.constants"

/** Side-by-side design versions: 1 = the first version on the repo, 2 = the current site. */
const VERSIONS = ["1", "2"] as const

interface PageProps {
  params: Promise<{ locale: string; version: string }>
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => VERSIONS.map((version) => ({ locale, version })))
}
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, version } = await params
  const t = await getTranslations({ locale, namespace: "meta" })
  return {
    title: { absolute: `${t("title")} (design ${version})` },
    description: t("description"),
    // Comparison copies of the home page: keep them out of search results.
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE.url}/${locale}/` },
  }
}

export default async function DesignPage({ params }: PageProps) {
  const { locale, version } = await params
  setRequestLocale(locale)
  if (version === "1") return <DesignOne />
  if (version === "2") return <DesignTwo languagePath="/design/2" />
  notFound()
}
