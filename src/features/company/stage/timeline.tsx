"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

import cn from "@/lib/tw-merge"

import { phaseStore, stage } from "./stage-state"

const R = 18
const C = 2 * Math.PI * R

/**
 * Where the loader ring ends up: a small ring at the top of the right edge showing how far down
 * the page you are, above one stop per section. Updated from the scroll state every frame by
 * writing to the DOM directly; the stops are ordinary anchor links.
 */
export default function Timeline({ label, stops }: { label: string; stops: { id: string; name: string }[] }) {
  const phase = useSyncExternalStore(phaseStore.subscribe, phaseStore.get, phaseStore.server)
  const ring = useRef<SVGCircleElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const shown = phase === "ready" || phase === "entered"

  useEffect(() => {
    let raf = 0
    let last = -1
    const tick = () => {
      ring.current?.setAttribute("stroke-dashoffset", String(C * (1 - stage.progress)))
      if (stage.active !== last && list.current) {
        last = stage.active
        Array.from(list.current.children).forEach((li, i) => {
          li.toggleAttribute("data-active", i === last)
          li.querySelector("a")?.setAttribute("aria-current", i === last ? "true" : "false")
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <nav
      aria-label={label}
      className={cn(
        "fixed top-[96px] right-5 z-20 hidden flex-col items-center opacity-0 transition-opacity delay-500 duration-500 lg:flex",
        shown && "opacity-100",
      )}
    >
      <svg viewBox="0 0 44 44" className="size-11 -rotate-90" aria-hidden>
        <circle cx="22" cy="22" r={R} fill="none" stroke="var(--c-ink)" strokeOpacity="0.15" strokeWidth="2" />
        <circle
          ref={ring}
          cx="22"
          cy="22"
          r={R}
          fill="none"
          stroke="var(--c-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <span aria-hidden className="mt-3 h-6 w-px bg-(--c-ink)/20" />
      <ol ref={list} className="flex flex-col items-end gap-3.5">
        {stops.map((s) => (
          <li key={s.id} className="group relative flex items-center">
            <a
              href={`#${s.id}`}
              className="flex items-center gap-3 py-0.5 text-[12px] text-(--c-muted) transition-colors hover:text-(--c-ink) group-data-active:text-(--c-ink)"
            >
              <span className="opacity-0 transition-opacity group-hover:opacity-100 group-data-active:opacity-100">
                {s.name}
              </span>
              <span className="size-1.5 rounded-full bg-(--c-ink)/35 transition-all group-data-active:size-2.5 group-data-active:bg-(--c-primary)" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
