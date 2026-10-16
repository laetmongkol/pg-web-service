"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import { useProgress } from "@react-three/drei"

import cn from "@/lib/tw-merge"

import { phaseStore } from "./stage-state"

export interface LoaderLabels {
  title: string
  files: string
  geometry: string
  shaders: string
  done: string
}

const R = 76

/**
 * The loading HUD. Three tracks fill in turn — files over the network (three.js loading manager),
 * geometry decoded, shaders compiled on the GPU — and the big number eases towards their weighted
 * sum. At 100% the overlay clears and the ring shrinks into the top of the timeline on the right
 * (the Timeline component takes over in the same spot), while the camera starts its swoop.
 */
export default function LoaderHud({ mark, labels }: { mark: string; labels: LoaderLabels }) {
  const { progress, loaded, total, active } = useProgress()
  const phase = useSyncExternalStore(phaseStore.subscribe, phaseStore.get, phaseStore.server)
  const number = useRef<HTMLSpanElement>(null)
  const shown = useRef(0)

  const files = progress / 100
  const geometry = phase === "loading" ? (active ? files * 0.9 : files) : 1
  const shaders = phase === "ready" || phase === "entered" ? 1 : phase === "compiling" ? 0.5 : 0
  const goal = Math.round((files * 0.6 + geometry * 0.25 + shaders * 0.15) * 100)
  const done = phase === "ready" || phase === "entered"

  // Ease the number towards the goal; written straight to the DOM, no re-render per frame.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      shown.current += (goal - shown.current) * 0.12
      if (Math.abs(goal - shown.current) < 0.4) shown.current = goal
      if (number.current) number.current.textContent = String(Math.round(shown.current))
      if (shown.current !== goal) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [goal])

  const tracks = [
    { label: labels.files, value: files, detail: total ? `${loaded}/${total}` : "" },
    { label: labels.geometry, value: geometry, detail: "" },
    { label: labels.shaders, value: shaders, detail: "" },
  ]

  return (
    <div
      aria-live="polite"
      aria-busy={!done}
      className={cn(
        "fixed inset-0 z-40 grid place-items-center bg-(--c-bg) transition-[opacity,visibility] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)]",
        done && "invisible opacity-0",
      )}
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "relative size-[184px] transition-transform duration-[900ms] ease-[cubic-bezier(0.7,0,0.2,1)]",
            // Hand-over: the ring travels to the timeline's slot (right edge, upper third) and shrinks.
            done && "translate-x-[calc(50vw-42px)] -translate-y-[calc(50vh-211px)] scale-[0.24]",
          )}
        >
          <svg viewBox="0 0 184 184" className="absolute inset-0 -rotate-90">
            <circle cx="92" cy="92" r={R} fill="none" stroke="var(--c-ink)" strokeOpacity="0.1" strokeWidth="2" />
            {tracks.map((t, i) => (
              <circle
                key={t.label}
                cx="92"
                cy="92"
                r={R - i * 9}
                fill="none"
                stroke={i === 0 ? "var(--c-primary)" : "var(--c-accent)"}
                strokeOpacity={i === 0 ? 1 : 0.75 - i * 0.15}
                strokeWidth={i === 0 ? 3 : 1.5}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * (R - i * 9)}`}
                strokeDashoffset={`${2 * Math.PI * (R - i * 9) * (1 - t.value)}`}
                className="transition-[stroke-dashoffset] duration-500 ease-out"
              />
            ))}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <p className="font-display text-[46px] leading-none font-semibold text-(--c-ink) tabular-nums">
              <span ref={number}>0</span>
              <span className="ml-0.5 align-top text-[16px] text-(--c-muted)">%</span>
            </p>
          </div>
        </div>

        <div className={cn("mt-8 w-[260px] transition-opacity duration-300", done && "opacity-0")}>
          <p className="text-center font-display text-[15px] font-semibold tracking-wide text-(--c-ink)">{mark}</p>
          <p className="mt-1 text-center text-[13px] text-(--c-muted)">{done ? labels.done : labels.title}</p>
          <ul className="mt-5 space-y-2">
            {tracks.map((t) => (
              <li key={t.label} className="grid grid-cols-[1fr_auto] items-center gap-3 text-[12px] text-(--c-muted)">
                <span>{t.label}</span>
                <span className="tabular-nums">{t.detail || `${Math.round(t.value * 100)}%`}</span>
                <span className="col-span-2 h-px overflow-hidden bg-(--c-ink)/10">
                  <span
                    className="block h-full origin-left bg-(--c-primary) transition-transform duration-500"
                    style={{ transform: `scaleX(${t.value})` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
