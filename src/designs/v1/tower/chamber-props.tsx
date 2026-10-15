"use client"

import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

import { PROPS_MODEL } from "@/features/tower/section-props"
import { assetPath } from "@/lib/asset-path"

import { towerState } from "./tower-state"

const DRACO_PATH = assetPath("/draco/")
const GROUP = "pg-chamber-props"

/** Prop per chamber, in page order (chamber 0 is the spire brazier, which needs none). */
const PROP_OF = [null, "prop_about", "prop_services", "prop_why", "prop_ecosystem", "prop_process", "prop_cases", "prop_contact"]
const SCALE = 0.8
/** Height above the chamber's look-at point, and pull towards the doorway so it fronts the furniture. */
const LIFT = 0.9
const FORWARD = 1.6
/** The process chamber's spiral stair fills the middle (out to r = 3.5): float that prop in front of it. */
const FORWARD_OF: Partial<Record<number, number>> = { 5: 4.3 }

/** Props were built for the night theme; re-cut them in the dungeon's parchment, bronze and fire. */
const RETINT: Record<string, { color: string; emissive?: [string, number] }> = {
  p_ivory: { color: "#f0dcb4", emissive: ["#ffcf8f", 0.06] },
  p_navy: { color: "#6b4a2e" },
  p_deep: { color: "#2c2724" },
  p_coral: { color: "#e8501c", emissive: ["#ff4a10", 0.9] },
  p_gold: { color: "#d9a044", emissive: ["#e8902b", 0.5] },
  p_glow: { color: "#ffe2b8", emissive: ["#ffd9a0", 2.2] },
}

const RING_GEOMETRY = new THREE.RingGeometry(0.85, 1.0, 40)
const RING_MATERIAL = new THREE.MeshBasicMaterial({
  color: "#ff9a45",
  transparent: true,
  opacity: 0.6,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})

export interface ChamberAnchor {
  /** look-at point of the chamber, on the tower axis */
  position: THREE.Vector3
  /** angle of the chamber's doorway (where the camera stands) */
  theta: number
}

/**
 * The object that illustrates each section — a mini tower for About, modules for Services, a
 * shield for Why… — floats in the middle of its chamber, turning slowly over a warm glow.
 */
export default function ChamberProps({ anchors }: { anchors: ChamberAnchor[] }) {
  const { scene } = useGLTF(PROPS_MODEL, DRACO_PATH)
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    const g = group.current
    if (!g) return
    const added: THREE.Object3D[] = []
    anchors.forEach((anchor, i) => {
      const name = PROP_OF[i]
      const src = name ? scene.getObjectByName(name) : undefined
      if (!src) return
      const obj = src.clone()
      obj.userData.chamber = i
      const forward = FORWARD_OF[i] ?? FORWARD
      obj.userData.base = anchor.position
        .clone()
        .add(new THREE.Vector3(Math.cos(anchor.theta) * forward, LIFT, Math.sin(anchor.theta) * forward))
      // Face the doorway: the prop's front (-Z in its own space after export) towards the camera.
      obj.userData.facing = -anchor.theta + Math.PI / 2
      obj.scale.setScalar(SCALE)
      obj.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return
        const mat = (o.material as THREE.MeshStandardMaterial).clone()
        const tint = RETINT[mat.name]
        if (tint) {
          mat.color = new THREE.Color(tint.color)
          if (tint.emissive) {
            mat.emissive = new THREE.Color(tint.emissive[0])
            mat.emissiveIntensity = tint.emissive[1]
          }
        }
        mat.flatShading = true
        mat.needsUpdate = true
        o.material = mat
      })
      // A slow ember ring under the prop sells the float.
      const ring = new THREE.Mesh(RING_GEOMETRY, RING_MATERIAL.clone())
      ring.rotation.x = -Math.PI / 2
      obj.userData.ring = ring
      g.add(obj, ring)
      added.push(obj, ring)
    })
    return () => {
      for (const o of added) g.remove(o)
    }
  }, [scene, anchors])

  useFrame((state) => {
    const g = state.scene.getObjectByName(GROUP)
    if (!g) return
    const time = state.clock.elapsedTime
    let lit: THREE.Vector3 | null = null
    for (const obj of g.children) {
      const i = obj.userData.chamber as number | undefined
      if (i === undefined || !obj.userData.ring) continue
      // Only the chambers around the camera are worth drawing; the rest are lost in the fog.
      obj.visible = Math.abs(i - towerState.active) <= 1
      ;(obj.userData.ring as THREE.Mesh).visible = obj.visible
      if (!obj.visible) continue
      const base = obj.userData.base as THREE.Vector3
      obj.position.set(base.x, base.y + Math.sin(time * 1.1 + i) * 0.12, base.z)
      obj.rotation.set(0.1, (obj.userData.facing as number) + Math.sin(time * 0.35 + i) * 0.5, 0)
      const ring = obj.userData.ring as THREE.Mesh
      ring.position.set(base.x, base.y - 1.15, base.z)
      ring.rotation.z = time * 0.4
      ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(time * 2 + i) * 0.15
      if (i === towerState.active) lit = base
    }
    // One warm light picks out the prop of the chamber being read, so it stands off the stonework.
    const light = g.getObjectByName("pg-prop-light")
    if (light && lit) light.position.set(lit.x * 2.2, lit.y + 1.4, lit.z * 2.2)
  })

  return (
    <group ref={group} name={GROUP}>
      <pointLight name="pg-prop-light" color="#ffc68a" intensity={14} distance={8} decay={1.4} />
    </group>
  )
}
