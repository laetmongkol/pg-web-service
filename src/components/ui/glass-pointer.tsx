"use client"

import { useEffect } from "react"

/**
 * One delegated listener that points the sheen of whichever `.glass` card the pointer is over at
 * the pointer (--glass-x / --glass-y). Mouse/pen only, at most once per frame; renders nothing.
 */
export default function GlassPointer() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return
    let frame = 0
    let last: PointerEvent | null = null

    const paint = () => {
      frame = 0
      const e = last
      if (!e) return
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".glass")
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty("--glass-x", `${e.clientX - r.left}px`)
      card.style.setProperty("--glass-y", `${e.clientY - r.top}px`)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      last = e
      if (!frame) frame = requestAnimationFrame(paint)
    }

    document.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      document.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
