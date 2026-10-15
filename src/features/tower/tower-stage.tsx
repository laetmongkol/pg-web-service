"use client"

import { useCallback, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

import { assetPath } from "@/lib/asset-path"
import cn from "@/lib/tw-merge"

import DepthGauge from "./depth-gauge"
import ScrollDirector from "./scroll-director"
import { useIsDesktop, useQuality } from "./use-quality"

// three.js only runs in the browser; keep it out of the server bundle and the first paint.
const TowerCanvas = dynamic(() => import("./tower-canvas"), { ssr: false })

/**
 * The fixed 3D backdrop the whole page scrolls over. Content stays in the DOM in reading order;
 * the canvas is decorative (aria-hidden) and falls back to a Blender still for reduced motion,
 * no WebGL, or before the model has loaded.
 */
export default function TowerStage({ depthLabel }: { depthLabel: string }) {
  const quality = useQuality()
  const desktop = useIsDesktop()
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])

  const animated = quality === "full" || quality === "lite"

  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-10 bg-ink">
        <Image
          src={assetPath("/images/tower-fallback.webp")}
          alt=""
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover object-[70%_center] opacity-60 transition-opacity duration-700",
            animated && ready && "opacity-0",
          )}
        />
        {animated && (
          <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-1000", ready && "opacity-100")}>
            <TowerCanvas lite={quality === "lite"} offsetRatio={desktop ? 0.2 : 0} onReady={onReady} />
          </div>
        )}
      </div>
      {animated && <ScrollDirector />}
      {animated && desktop && <DepthGauge label={depthLabel} />}
    </>
  )
}
