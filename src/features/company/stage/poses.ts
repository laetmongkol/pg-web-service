/**
 * Camera choreography, one shot per page section, relative to the building's own size so the
 * same tour fits a two-storey office and a tower.
 *
 * az: degrees around the building, 0 = straight at the front (+Z), increasing counter-clockwise
 *     seen from above; it only ever increases, so the camera walks round the model once.
 * el: degrees above the horizon. dist: multiples of the building radius.
 * ty: look-at height as a share of the building height.
 * side: which side the section's text sits on; the frustum shifts the building to the other.
 */
export type Pose = { az: number; el: number; dist: number; ty: number; side: "left" | "right" | "center" }

export const SECTION_IDS = [
  "top",
  "partners",
  "about",
  "pillars",
  "services",
  "showcase",
  "testimonials",
  "contact",
] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const POSES: Record<SectionId, Pose> = {
  top: { az: -24, el: 12, dist: 4.3, ty: 0.34, side: "left" },
  partners: { az: -48, el: 24, dist: 4.6, ty: 0.38, side: "left" },
  about: { az: 22, el: 9, dist: 3.6, ty: 0.36, side: "right" },
  pillars: { az: 70, el: 30, dist: 4.4, ty: 0.48, side: "right" },
  services: { az: 132, el: 16, dist: 4.5, ty: 0.46, side: "left" },
  showcase: { az: 196, el: 30, dist: 5.0, ty: 0.36, side: "right" },
  testimonials: { az: 262, el: 13, dist: 3.9, ty: 0.55, side: "left" },
  contact: { az: 330, el: 26, dist: 5.0, ty: 0.42, side: "right" },
}

/** Where the opening swoop starts: high overhead, isometric-ish, far out. */
export const INTRO_POSE: Pose = { az: -80, el: 64, dist: 6.5, ty: 0.1, side: "center" }

export const POSE_LIST: Pose[] = SECTION_IDS.map((id) => POSES[id])
