"use client"

import { useEffect } from "react"
import Lenis from "lenis"

import { type PoseKey, towerState } from "./tower-state"

const smooth = (t: number) => t * t * (3 - 2 * t)

type Keyframe = { y: number; pose: PoseKey }

/**
 * Maps page scroll to the camera path. Every chapter body produces four keyframes:
 *   enters viewport → zoom in (out → in), reading → hold (in), leaves → zoom out (in → out).
 * The empty spacer between two bodies becomes the orbit-and-descend move (out_i → out_i+1).
 * Positions come from the real DOM, so copy length never desyncs the camera.
 */
function buildKeyframes(): Keyframe[] {
  const vh = window.innerHeight
  const bodies = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter-body]"))
  const frames: Keyframe[] = []

  bodies.forEach((el, i) => {
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const bottom = rect.bottom + window.scrollY
    const last = i === bodies.length - 1

    if (i === 0) {
      frames.push({ y: 0, pose: { chapter: 0, kind: "in" } })
    } else {
      frames.push({ y: top - vh * 0.95, pose: { chapter: i, kind: "out" } })
      frames.push({ y: top - vh * 0.25, pose: { chapter: i, kind: "in" } })
    }
    if (last) return
    const holdEnd = Math.max(bottom - vh * 0.75, top - vh * 0.2)
    frames.push({ y: holdEnd, pose: { chapter: i, kind: "in" } })
    frames.push({ y: Math.max(bottom - vh * 0.1, holdEnd + 1), pose: { chapter: i, kind: "out" } })
  })
  return frames.sort((a, b) => a.y - b.y)
}

function apply(frames: Keyframe[], y: number) {
  if (!frames.length) return
  let k = 0
  while (k < frames.length - 1 && frames[k + 1]!.y <= y) k++
  const a = frames[k]!
  const b = frames[Math.min(k + 1, frames.length - 1)]!
  const span = b.y - a.y
  const raw = span > 0 ? Math.min(1, Math.max(0, (y - a.y) / span)) : 1
  towerState.from = a.pose
  towerState.to = b.pose
  towerState.t = smooth(raw)
  towerState.active = raw < 0.5 ? a.pose.chapter : b.pose.chapter
}

export default function ScrollDirector() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, anchors: { offset: -72 } })
    let frames = buildKeyframes()

    const onResize = () => {
      frames = buildKeyframes()
      apply(frames, window.scrollY)
    }
    // Native scroll too: anchor jumps, restored scroll on reload and keyboard paging do not
    // always pass through Lenis.
    const onNativeScroll = () => apply(frames, window.scrollY)
    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)
    window.addEventListener("scroll", onNativeScroll, { passive: true })
    lenis.on("scroll", () => apply(frames, lenis.scroll))
    // Web fonts change line breaks (Thai especially), which moves every chapter.
    void document.fonts.ready.then(onResize)
    apply(frames, window.scrollY)

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("scroll", onNativeScroll)
      lenis.destroy()
    }
  }, [])

  return null
}
