import { Toaster } from "react-hot-toast"
import { getTranslations, setRequestLocale } from "next-intl/server"

import type { Metadata } from "next"

import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import Capability from "@/features/story/capability"
import Contact from "@/features/story/contact"
import Ecosystem from "@/features/story/ecosystem"
import Hero from "@/features/story/hero"
import Principles from "@/features/story/principles"
import Process from "@/features/story/process"
import Services from "@/features/story/services"
import UseCases from "@/features/story/use-cases"
import TowerStage from "@/features/tower/tower-stage"
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
      canonical: `${SITE.url}/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE.url}/${l}`])),
    },
    openGraph: { title: t("title"), description: t("description"), siteName: SITE.name, locale },
  }
}

/**
 * The whole site is one descent through the PG tower: eight floors, spire to forge. Each floor
 * is a chapter of real HTML over the fixed 3D stage.
 */
export default async function Home({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const nav = await getTranslations("nav")

  return (
    <>
      <Navbar />
      <TowerStage depthLabel={nav("depth")} />
      <main className="relative">
        <Hero />
        <Services />
        <Capability />
        <Principles />
        <Process />
        <Ecosystem />
        <UseCases />
        <Contact />
      </main>
      <Footer />
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#242220", color: "#f5f1e8", borderRadius: 8, fontSize: 15 } }}
      />
    </>
  )
}
