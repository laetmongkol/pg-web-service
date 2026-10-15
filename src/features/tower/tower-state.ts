/**
 * Shared, render-free state between the scroll director, the R3F scene and the section rail.
 * Written every scroll frame and read every render frame — never through React state, so
 * scrolling re-renders nothing.
 */
export const towerState = {
  /** camera travels from scene `a` to scene `b` (equal while a section is being read) */
  a: 0,
  b: 0,
  /** eased 0..1 progress from a to b */
  t: 0,
  /** section nearest the middle of the screen */
  active: 0,
  /** 0..1 down the page — drives the sky from blue hour to night */
  progress: 0,
}
