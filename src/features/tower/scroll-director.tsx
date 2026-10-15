"use client"

import { useEffect } from "react"
import Lenis from "lenis"

import { towerState } from "./tower-state"

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const smooth = (t: number) => t * t * (3 - 2 * t)

/** Share of a section spent holding still before the camera starts for the next one. */
const HOLD = 0.45

/**
 * Maps page scroll to the camera. Sections are ordinary blocks (`[data-scene]`); while a
 * section fills the middle of the screen the camera holds on its floor, then glides to the next
 * floor as the following section comes up. Measured from the real DOM, so copy length never
 * desyncs the camera.
 */
export default function ScrollDirector() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, anchors: { offset: -64 } })
    let tops: number[] = []

    const measure = () => {
      tops = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map(
        (el) => el.getBoundingClientRect().top + window.scrollY,
      )
    }

    const read = () => {
      if (!tops.length) return
      const y = window.scrollY + window.innerHeight * 0.5
      let i = 0
      while (i < tops.length - 1 && tops[i + 1]! <= y) i++
      const next = Math.min(i + 1, tops.length - 1)
      const span = next > i ? tops[next]! - tops[i]! : 1
      const raw = next > i ? clamp01((y - tops[i]!) / span) : 0
      towerState.a = i
      towerState.b = next
      towerState.t = smooth(clamp01((raw - HOLD) / (1 - HOLD)))
      towerState.active = raw > 0.75 ? next : i
      const max = document.documentElement.scrollHeight - window.innerHeight
      towerState.progress = max > 0 ? clamp01(window.scrollY / max) : 0
    }

    const onResize = () => {
      measure()
      read()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)
    void document.fonts.ready.then(onResize)
    lenis.on("scroll", read)
    window.addEventListener("scroll", read, { passive: true })
    onResize()

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("scroll", read)
      lenis.destroy()
    }
  }, [])

  return null
}
