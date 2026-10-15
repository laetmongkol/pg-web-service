"use client"

import { useEffect, useRef } from "react"

import { CHAPTER_COUNT, CHAPTER_IDS, towerState } from "./tower-state"

/**
 * How deep into the tower the reader is: eight levels from the spire to the forge. A real
 * sequence, so the numbering carries information. Updated from the scroll state without
 * re-rendering React.
 */
export default function DepthGauge({ label }: { label: string }) {
  const marker = useRef<HTMLSpanElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let last = -1
    const tick = () => {
      const active = towerState.active
      if (active !== last && marker.current && count.current) {
        last = active
        marker.current.style.top = `${(active / (CHAPTER_COUNT - 1)) * 100}%`
        count.current.textContent = String(active + 1).padStart(2, "0")
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <nav aria-label={label} className="fixed top-1/2 right-6 z-20 flex -translate-y-1/2 flex-col items-center gap-4">
      <p className="font-mono text-[11px] text-stone">
        <span className="sr-only">{label} </span>
        <span ref={count}>01</span>
        <span className="text-muted"> / {String(CHAPTER_COUNT).padStart(2, "0")}</span>
      </p>
      <div className="relative h-56 w-px bg-ivory/20">
        <span ref={marker} className="absolute -left-[3.5px] top-0 block h-0 w-2 transition-[top] duration-500">
          <span className="block size-2 -translate-y-1 bg-coral" />
        </span>
        {CHAPTER_IDS.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`${label} ${i + 1}`}
            className="absolute -left-2 block h-4 w-4 -translate-y-2"
            style={{ top: `${(i / (CHAPTER_COUNT - 1)) * 100}%` }}
          />
        ))}
      </div>
    </nav>
  )
}
