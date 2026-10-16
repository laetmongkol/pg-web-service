"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

import type { CompanyMood } from "@/companies/companies"
import { useIsDesktop, useQuality } from "@/features/tower/use-quality"
import { assetPath } from "@/lib/asset-path"
import cn from "@/lib/tw-merge"

import LoaderHud, { type LoaderLabels } from "./loader-hud"
import ScrollDirector from "./scroll-director"
import { resetStage } from "./stage-state"
import Timeline from "./timeline"

// three.js stays out of the server bundle and the first paint.
const CompanyCanvas = dynamic(() => import("./company-canvas"), { ssr: false })

interface CompanyStageProps {
  slug: string
  mark: string
  mood: CompanyMood
  primary: string
  loader: LoaderLabels
  timeline: { label: string; stops: { id: string; name: string }[] }
}

/**
 * The fixed 3D backdrop of a company page plus its HUD: loader → timeline, smooth scroll and the
 * scroll-to-camera mapping. Decorative (aria-hidden); every word lives in the sections. Reduced
 * motion or no WebGL shows the Blender still instead, with no loader.
 */
export default function CompanyStage({ slug, mark, mood, primary, loader, timeline }: CompanyStageProps) {
  const quality = useQuality()
  const desktop = useIsDesktop()
  const animated = quality === "full" || quality === "lite"
  // Fresh camera/loader state per company (child effects never read it before the model loads).
  useEffect(() => resetStage(), [slug])

  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-10 bg-(--c-bg)">
        {!animated && quality !== "pending" && (
          <Image
            src={assetPath(`/images/company/${slug}.webp`)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {animated && (
          <CompanyCanvas slug={slug} mood={mood} primary={primary} lite={quality === "lite"} offset={desktop ? 0.22 : 0} />
        )}
        {/* Legibility veil: strongest at the very top and bottom where nav and footer sit. */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            "bg-[linear-gradient(180deg,var(--c-veil)_0%,transparent_18%,transparent_78%,var(--c-veil)_100%)]",
          )}
        />
      </div>
      {animated && <ScrollDirector />}
      {animated && <LoaderHud mark={mark} labels={loader} />}
      {desktop && <Timeline label={timeline.label} stops={timeline.stops} />}
    </>
  )
}
