"use client"

import { useEffect, useRef } from "react"

import { SCENES } from "./scenes"
import { towerState } from "./tower-state"

/**
 * Where you are on the page: one mark per section, the current one lit, each a link. Sits in the
 * right margin, clear of the content column.
 */
export default function SectionRail({ label, names }: { label: string; names: Record<string, string> }) {
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    let raf = 0
    let last = -1
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const active = towerState.active
      if (active === last || !list.current) return
      last = active
      Array.from(list.current.children).forEach((li, i) => li.toggleAttribute("data-on", i === active))
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <nav aria-label={label} className="fixed top-1/2 right-5 z-20 -translate-y-1/2">
      <ol ref={list} className="flex flex-col gap-1">
        {SCENES.map((id) => (
          <li key={id} className="group">
            <a href={`#${id}`} className="flex items-center justify-end gap-3 py-1.5">
              <span className="pointer-events-none rounded-md bg-night-900/90 px-2 py-1 text-[12px] whitespace-nowrap text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 group-data-on:opacity-100">
                {names[id]}
              </span>
              <span className="block h-px w-4 bg-ivory/40 transition-all group-hover:w-6 group-data-on:w-8 group-data-on:bg-coral" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
