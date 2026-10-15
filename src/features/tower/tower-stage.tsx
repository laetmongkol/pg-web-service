"use client"

import { useCallback, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

import { assetPath } from "@/lib/asset-path"
import cn from "@/lib/tw-merge"

import ScrollDirector from "./scroll-director"
import SectionRail from "./section-rail"
import { useIsDesktop, useQuality } from "./use-quality"

// three.js only runs in the browser; keep it out of the server bundle and the first paint.
const TowerCanvas = dynamic(() => import("./tower-canvas"), { ssr: false })

/**
 * The fixed 3D backdrop: the PG tower at night, filmed floor by floor as the sections scroll
 * past. Decorative (aria-hidden) — every word lives in the sections. Reduced motion or no WebGL
 * shows a Blender still instead.
 */
export default function TowerStage({ railLabel, railNames }: { railLabel: string; railNames: Record<string, string> }) {
  const quality = useQuality()
  const desktop = useIsDesktop()
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])

  const animated = quality === "full" || quality === "lite"

  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-10 bg-night-950">
        <Image
          src={assetPath("/images/tower-fallback.webp")}
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn("object-cover transition-opacity duration-700", animated && ready && "opacity-0")}
        />
        {animated && (
          <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-1000", ready && "opacity-100")}>
            <TowerCanvas lite={quality === "lite"} offsetRatio={desktop ? 0.2 : 0} onReady={onReady} />
          </div>
        )}
        {/* Legibility: the text column sits on a night-blue fade, the tower shows on the right. */}
        <div className="absolute inset-0 bg-night-950/70 lg:bg-[linear-gradient(90deg,rgb(7_11_28/0.94)_0%,rgb(7_11_28/0.82)_38%,rgb(7_11_28/0.15)_68%,rgb(7_11_28/0)_100%)]" />
      </div>
      {animated && <ScrollDirector />}
      {desktop && <SectionRail label={railLabel} names={railNames} />}
    </>
  )
}
