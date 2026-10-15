import { getTranslations, setRequestLocale } from "next-intl/server"

import type { Metadata } from "next"

import DesignTwo from "@/designs/v2/home"
import { routing } from "@/i18n/routing"
import { SITE } from "@/shared/constants/site.constants"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: {
      canonical: `${SITE.url}/${locale}/`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE.url}/${l}/`])),
    },
    openGraph: { title: t("title"), description: t("description"), siteName: SITE.name, locale },
  }
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <DesignTwo />
}
