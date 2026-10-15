"use client"

import { useCallback, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

import { assetPath } from "@/lib/asset-path"
import cn from "@/lib/tw-merge"

import DepthGauge from "./depth-gauge"
import ScrollDirector from "./scroll-director"
import { useIsDesktop, useQuality } from "@/features/tower/use-quality"

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
      <div aria-hidden className="fixed inset-0 -z-10 bg-[#140d09]">
        <Image
          src={assetPath("/images/tower-fallback-v1b.webp")}
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
        {/* Legibility: text sits on a soot-dark fade on the left, the tower shows on the right. */}
        <div className="absolute inset-0 bg-[#120b08]/60 lg:bg-[linear-gradient(90deg,rgb(18_11_8/0.92)_0%,rgb(18_11_8/0.72)_38%,rgb(18_11_8/0.1)_68%,rgb(18_11_8/0)_100%)]" />
      </div>
      {animated && <ScrollDirector />}
      {animated && desktop && <DepthGauge label={depthLabel} />}
    </>
  )
}
