/**
 * Shared state between the DOM (scroll, pointer, loader HUD) and the R3F scene.
 *
 * Per-frame values (`section`, `pointer`, `intro`) are plain fields read in useFrame, never React
 * state, so scrolling re-renders nothing. The few one-off milestones the HUD shows (`phase`) go
 * through a tiny subscribe/snapshot pair for useSyncExternalStore.
 */
export type StagePhase = "loading" | "compiling" | "ready" | "entered"

export const stage = {
  /** Scroll position in sections: 2.4 = 40% of the way from section 2 to section 3. */
  section: 0,
  /** Section the reader is in (for the timeline). */
  active: 0,
  /** Whole-page scroll progress 0..1. */
  progress: 0,
  /** Pointer in -1..1 (x right, y up), eased in the scene. */
  pointer: { x: 0, y: 0 },
  /** Opening swoop 0..1 (overhead isometric → hero shot), driven by the camera rig. */
  intro: 0,
  /** Building bounds in world units, set once the model is in. */
  bounds: { radius: 20, height: 15, cx: 0, cz: 0 },
}

let phase: StagePhase = "loading"
const listeners = new Set<() => void>()

export function setPhase(next: StagePhase) {
  if (next === phase) return
  phase = next
  listeners.forEach((l) => l())
}

export const phaseStore = {
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  get: () => phase,
  server: (): StagePhase => "loading",
}

/** Reset between client navigations to another company. */
export function resetStage() {
  stage.section = 0
  stage.active = 0
  stage.progress = 0
  stage.intro = 0
  phase = "loading"
}
