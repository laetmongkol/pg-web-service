import { Fragment } from "react"
import { Toaster } from "react-hot-toast"
import { getTranslations } from "next-intl/server"

import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import GlassPointer from "@/components/ui/glass-pointer"
import TowerStage from "@/designs/v1/tower/tower-stage"
import About from "@/features/sections/about"
import Contact from "@/features/sections/contact"
import Ecosystem from "@/features/sections/ecosystem"
import Hero from "@/features/sections/hero"
import Process from "@/features/sections/process"
import Services from "@/features/sections/services"
import UseCases from "@/features/sections/use-cases"
import Why from "@/features/sections/why"

/** Chamber order down the dungeon: spire → library → rune hall → armory → alchemy → stair → treasury → forge. */
const SECTIONS = [Hero, About, Services, Why, Ecosystem, Process, UseCases, Contact]

/**
 * Design 1 — the stone dungeon tower. Same sections and copy as design 2, recoloured by the
 * `theme-dungeon` palette; between sections the camera zooms out of one chamber, spirals down and
 * into the next (the spacers give it the scroll room to do that).
 */
export default async function DesignOne() {
  const nav = await getTranslations("v1.nav")

  return (
    <div className="theme-dungeon">
      <Navbar languagePath="/design/1" />
      <TowerStage depthLabel={nav("depth")} />
      <main className="relative">
        {SECTIONS.map((Section, i) => (
          <Fragment key={i}>
            {i > 0 && <div aria-hidden className="h-screen motion-reduce:h-0" />}
            <Section />
          </Fragment>
        ))}
      </main>
      <Footer />
      <GlassPointer />
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#1c130e", color: "#f3e4c8", borderRadius: 12, fontSize: 15 } }}
      />
    </div>
  )
}
