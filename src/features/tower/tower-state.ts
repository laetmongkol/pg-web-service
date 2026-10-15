/**
 * Shared, render-free state between the DOM scroll director and the R3F camera rig.
 * Written every scroll frame, read every render frame — never through React state, so scrolling
 * does not re-render anything.
 */
export type PoseKey = { chapter: number; kind: "in" | "out" }

export const towerState = {
  from: { chapter: 0, kind: "in" } as PoseKey,
  to: { chapter: 0, kind: "in" } as PoseKey,
  /** 0..1 eased progress between `from` and `to` */
  t: 0,
  /** chapter the reader is currently inside (for the depth gauge) */
  active: 0,
}

export const CHAPTER_COUNT = 8

export const CHAPTER_IDS = [
  "top",
  "services",
  "capability",
  "principles",
  "process",
  "ecosystem",
  "use-cases",
  "contact",
] as const
