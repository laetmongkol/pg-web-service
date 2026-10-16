"use client"

import { useEffect } from "react"
import Lenis from "lenis"

import { stage } from "./stage-state"

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const smooth = (t: number) => t * t * (3 - 2 * t)
/** Share of each section the camera holds still before moving on to the next shot. */
const HOLD = 0.4

/**
 * Smooth scroll (Lenis) and the scroll → camera mapping. Sections are `[data-scene]` blocks in
 * tour order; `stage.section` becomes "index + eased progress to the next", measured from the
 * real DOM so copy length never desyncs the camera. Also feeds the pointer to the scene.
 */
export default function ScrollDirector() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -72 } })
    let tops: number[] = []

    const measure = () => {
      tops = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map(
        (el) => el.getBoundingClientRect().top + window.scrollY,
      )
    }
    const read = () => {
      if (!tops.length) return
      const y = window.scrollY + window.innerHeight * 0.45
      let i = 0
      while (i < tops.length - 1 && tops[i + 1]! <= y) i++
      const next = Math.min(i + 1, tops.length - 1)
      const raw = next > i ? clamp01((y - tops[i]!) / (tops[next]! - tops[i]!)) : 0
      stage.section = i + smooth(clamp01((raw - HOLD) / (1 - HOLD)))
      stage.active = raw > 0.7 ? next : i
      const max = document.documentElement.scrollHeight - window.innerHeight
      stage.progress = max > 0 ? clamp01(window.scrollY / max) : 0
    }
    const onResize = () => {
      measure()
      read()
    }
    const onPointer = (e: PointerEvent) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      stage.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)
    void document.fonts.ready.then(onResize)
    lenis.on("scroll", read)
    window.addEventListener("scroll", read, { passive: true })
    window.addEventListener("pointermove", onPointer, { passive: true })
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
      window.removeEventListener("pointermove", onPointer)
      lenis.destroy()
    }
  }, [])

  return null
}
