import { Toaster } from "react-hot-toast"
import { getTranslations } from "next-intl/server"

import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import GlassPointer from "@/components/ui/glass-pointer"
import About from "@/features/sections/about"
import Contact from "@/features/sections/contact"
import Ecosystem from "@/features/sections/ecosystem"
import Hero from "@/features/sections/hero"
import Process from "@/features/sections/process"
import Services from "@/features/sections/services"
import UseCases from "@/features/sections/use-cases"
import Why from "@/features/sections/why"
import { SCENES } from "@/features/tower/scenes"
import TowerStage from "@/features/tower/tower-stage"

/**
 * Design 2 — the current site: sections over the PG tower at night, each filmed on its own floor,
 * with a 3D object per section on the right.
 */
export default async function DesignTwo({ languagePath = "" }: { languagePath?: string }) {
  const nav = await getTranslations("nav")
  const rail = await getTranslations("rail")
  const railNames = Object.fromEntries(SCENES.map((id) => [id, rail(id)]))

  return (
    <>
      <Navbar languagePath={languagePath} />
      <TowerStage railLabel={nav("rail")} railNames={railNames} />
      <main className="relative">
        <Hero />
        <About />
        <Services />
        <Why />
        <Ecosystem />
        <Process />
        <UseCases />
        <Contact />
      </main>
      <Footer />
      <GlassPointer />
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#0b1026", color: "#f5f1e8", borderRadius: 12, fontSize: 15 } }}
      />
    </>
  )
}
