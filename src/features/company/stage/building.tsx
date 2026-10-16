"use client"

import { useLayoutEffect } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

import { assetPath } from "@/lib/asset-path"

export const DRACO_PATH = assetPath("/draco/")
export const modelUrl = (slug: string) => assetPath(`/models/company/${slug}-v1.glb`)

export type Bounds = { radius: number; height: number; cx: number; cz: number }

/** Glass reads as glass only with something to reflect: tinted, very smooth, a little see-through. */
function toGlass(mat: THREE.MeshStandardMaterial) {
  mat.transparent = true
  mat.opacity = 0.5
  mat.roughness = 0.04
  mat.metalness = 0.85
  mat.envMapIntensity = 1.8
  mat.depthWrite = false
}

/**
 * The company's building from design/3d/company.blend (exported front-facing +Z, ground at y = 0).
 * One pass over the materials: shadows on, glass made reflective, emissive lights scaled by the
 * mood (offices glow at night, barely by day). Reports its bounds so the camera tour, fog, sun
 * and floating tokens all scale to it.
 */
export default function Building({
  url,
  glow,
  onBounds,
}: {
  url: string
  glow: number
  onBounds: (b: Bounds) => void
}) {
  const { scene } = useGLTF(url, DRACO_PATH)

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      const mat = obj.material as THREE.MeshStandardMaterial
      const glass = /glass/i.test(mat.name) || /glass/i.test(obj.name)
      obj.castShadow = !glass
      obj.receiveShadow = true
      if (glass) {
        toGlass(mat)
      } else {
        mat.envMapIntensity = 0.7
      }
      // Keep the exported strength so a re-run never compounds the multiplier.
      if (mat.userData.baseEmissive === undefined) mat.userData.baseEmissive = mat.emissiveIntensity
      if (mat.emissive && mat.emissive.getHex() !== 0) {
        mat.emissiveIntensity = (mat.userData.baseEmissive as number) * glow
      }
      mat.needsUpdate = true
    })

    // Bounds of the building itself: trees and paving are low, so take height from everything
    // but the footprint from meshes taller than a storey.
    const box = new THREE.Box3().setFromObject(scene)
    const core = new THREE.Box3()
    const tmp = new THREE.Box3()
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      tmp.setFromObject(obj)
      if (tmp.max.y - tmp.min.y > 3) core.union(tmp)
    })
    const footprint = core.isEmpty() ? box : core
    const size = footprint.getSize(new THREE.Vector3())
    const center = footprint.getCenter(new THREE.Vector3())
    onBounds({
      radius: Math.max(6, Math.hypot(size.x, size.z) / 2),
      height: Math.max(4, box.max.y),
      cx: center.x,
      cz: center.z,
    })
  }, [scene, glow, onBounds])

  return <primitive object={scene} />
}
