"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import type { Bounds } from "./building"
import { INTRO_POSE, POSE_LIST, type Pose } from "./poses"
import { phaseStore, setPhase, stage } from "./stage-state"

const DEG = Math.PI / 180
const INTRO_SECONDS = 2.6
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

const sideShift = (p: Pose) => (p.side === "left" ? -1 : p.side === "right" ? 1 : 0)

function mix(a: Pose, b: Pose, t: number) {
  return {
    az: a.az + (b.az - a.az) * t,
    el: a.el + (b.el - a.el) * t,
    dist: a.dist + (b.dist - a.dist) * t,
    ty: a.ty + (b.ty - a.ty) * t,
    shift: sideShift(a) + (sideShift(b) - sideShift(a)) * t,
  }
}

/**
 * Flies the camera. Before the model is ready it hangs high over the site, turning slowly; once
 * the loader hands over it swoops down to the hero shot, then follows the scroll section by
 * section (POSES), nudged by the pointer. The frustum is shifted sideways so the building sits
 * opposite each section's text.
 */
export default function CameraRig({ bounds, offset }: { bounds: Bounds; offset: number }) {
  const introStart = useRef<number | null>(null)
  const target = useRef(new THREE.Vector3())
  const shift = useRef(0)
  const snapped = useRef(false)

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera
    const time = state.clock.elapsedTime
    const phase = phaseStore.get()

    // Intro swoop progress.
    if (phase === "ready" || phase === "entered") {
      if (introStart.current === null) introStart.current = time
      const k = Math.min(1, (time - introStart.current) / INTRO_SECONDS)
      stage.intro = easeInOut(k)
      if (k >= 1 && phase === "ready") setPhase("entered")
    }

    // Scroll pose.
    const i = Math.min(Math.floor(stage.section), POSE_LIST.length - 1)
    const j = Math.min(i + 1, POSE_LIST.length - 1)
    const scroll = mix(POSE_LIST[i]!, POSE_LIST[j]!, stage.section - i)
    // While loading, drift round the overhead start so the scene is alive behind the HUD.
    const idle: Pose = { ...INTRO_POSE, az: INTRO_POSE.az + time * 4 }
    const p = mix(idle, { ...scroll, side: "center" }, stage.intro)
    // A left-hand text column (shift -1) pushes the picture right, and vice versa.
    const shiftGoal = scroll.shift * stage.intro

    const az = (p.az + stage.pointer.x * 2.5) * DEG
    const el = (p.el + stage.pointer.y * 1.5) * DEG
    const d = bounds.radius * p.dist
    const goal = new THREE.Vector3(
      bounds.cx + Math.sin(az) * Math.cos(el) * d,
      bounds.height * p.ty + Math.sin(el) * d,
      bounds.cz + Math.cos(az) * Math.cos(el) * d,
    )
    const look = new THREE.Vector3(bounds.cx, bounds.height * p.ty, bounds.cz)

    const k = snapped.current ? 1 - Math.exp(-delta * 4) : 1
    snapped.current = true
    cam.position.lerp(goal, k)
    target.current.lerp(look, k)
    cam.lookAt(target.current)

    // Building opposite the text: shift the frustum (desktop only, `offset` is 0 on phones).
    shift.current = THREE.MathUtils.damp(shift.current, shiftGoal, 4, delta)
    const { width, height } = state.size
    if (offset && Math.abs(shift.current) > 0.001) {
      cam.setViewOffset(width, height, width * offset * shift.current, 0, width, height)
    } else if (cam.view) {
      cam.clearViewOffset()
    }
  })

  return null
}
