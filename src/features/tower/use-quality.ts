"use client"

import { useSyncExternalStore } from "react"

export type Quality = "pending" | "static" | "lite" | "full"

const REDUCED = "(prefers-reduced-motion: reduce)"
const SMALL = "(max-width: 767px), (pointer: coarse)"

let webgl: boolean | null = null
function hasWebGL(): boolean {
  if (webgl === null) {
    try {
      const canvas = document.createElement("canvas")
      webgl = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"))
    } catch {
      webgl = false
    }
  }
  return webgl
}

function subscribe(onChange: () => void) {
  const queries = [REDUCED, SMALL].map((q) => window.matchMedia(q))
  queries.forEach((q) => q.addEventListener("change", onChange))
  return () => queries.forEach((q) => q.removeEventListener("change", onChange))
}

function snapshot(): Quality {
  if (window.matchMedia(REDUCED).matches || !hasWebGL()) return "static"
  return window.matchMedia(SMALL).matches ? "lite" : "full"
}

/** full = desktop 3D, lite = phone 3D (lower DPR, no particles), static = rendered still. */
export function useQuality(): Quality {
  return useSyncExternalStore(subscribe, snapshot, () => "pending")
}

const DESKTOP = "(min-width: 1024px)"
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const q = window.matchMedia(DESKTOP)
      q.addEventListener("change", cb)
      return () => q.removeEventListener("change", cb)
    },
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  )
}
