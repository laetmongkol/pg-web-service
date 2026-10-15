/**
 * Page sections in reading order. Section N is filmed by the `stop_NN_cam` / `stop_NN_look`
 * empties written by design/3d/build_tower.py — keep both lists in the same order.
 */
export const SCENES = [
  "top",
  "about",
  "services",
  "why",
  "ecosystem",
  "process",
  "use-cases",
  "contact",
] as const

export type SceneId = (typeof SCENES)[number]
