"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

import { assetPath } from "@/lib/asset-path"

import { SCENES, type SceneId } from "./scenes"
import { towerState } from "./tower-state"

export const PROPS_MODEL = assetPath("/models/pg-props-v1.glb")
const DRACO_PATH = assetPath("/draco/")
const GROUP = "pg-section-props"

/** Which prop (from design/3d/build_props.py) belongs to each section; the hero shows the tower. */
const PROP_OF: Partial<Record<SceneId, string>> = {
  about: "prop_about",
  services: "prop_services",
  why: "prop_why",
  ecosystem: "prop_ecosystem",
  process: "prop_process",
  "use-cases": "prop_cases",
  contact: "prop_contact",
}

/** Where the prop floats, in camera space: right of centre, in front of the building. */
const OFFSET = new THREE.Vector3(0.95, -0.05, -5)
const SCALE = 0.74
/** Base turn per prop so each shows its best side. */
const FACING: Record<string, number> = { prop_contact: -0.5, prop_why: -0.35, prop_ecosystem: 0 }

const smooth = (t: number) => t * t * (3 - 2 * t)

/** Soft night-blue disc with a warm rim, so the prop reads against the busy room behind it. */
const haloVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const haloFragment = /* glsl */ `
uniform float uOpacity;
varying vec2 vUv;
void main() {
  float d = distance(vUv, vec2(0.5)) * 2.0;
  float core = 1.0 - smoothstep(0.0, 0.92, d);
  float rim = smoothstep(0.55, 0.78, d) * (1.0 - smoothstep(0.78, 1.0, d));
  vec3 col = mix(vec3(0.03, 0.05, 0.13), vec3(1.0, 0.45, 0.3), rim * 0.6);
  gl_FragColor = vec4(col, (core * 0.82 + rim * 0.35) * uOpacity);
}
`

/**
 * The object that illustrates the section being read — a mini tower for About, modules for
 * Services, a shield for Why PG… It rides in front of the camera on the right of the screen,
 * turning slowly, and swaps (shrink out / grow in) as the camera moves to the next floor.
 */
export default function SectionProps() {
  const { scene } = useGLTF(PROPS_MODEL, DRACO_PATH)
  const group = useRef<THREE.Group>(null)
  const halo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: haloVertex,
        fragmentShader: haloFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uOpacity: { value: 0 } },
      }),
    [],
  )

  useEffect(() => {
    const g = group.current
    if (!g) return
    const added: THREE.Object3D[] = []
    SCENES.forEach((id, i) => {
      const name = PROP_OF[id]
      const src = name ? scene.getObjectByName(name) : undefined
      if (!src) return
      const obj = src.clone()
      obj.position.set(0, 0, 0)
      obj.userData.section = i
      obj.userData.facing = FACING[name!] ?? 0.4
      obj.visible = false
      obj.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return
        // Own materials per prop: two props fade at once during a swap.
        const mat = (o.material as THREE.MeshStandardMaterial).clone()
        o.material = mat
        mat.flatShading = true
        if (mat.name === "p_coral") {
          mat.emissive = new THREE.Color("#ff6946")
          mat.emissiveIntensity = 1.1
        } else if (mat.name === "p_gold") {
          mat.emissive = new THREE.Color("#f2c27b")
          mat.emissiveIntensity = 0.7
        } else if (mat.name === "p_glow") {
          mat.emissive = new THREE.Color("#ffe2b8")
          mat.emissiveIntensity = 2
        }
        mat.needsUpdate = true
      })
      g.add(obj)
      added.push(obj)
    })
    return () => {
      for (const o of added) g.remove(o)
    }
  }, [scene])

  // Reached through the frame state (like the camera) so per-frame mutation stays outside React.
  useFrame((state) => {
    const g = state.scene.getObjectByName(GROUP)
    if (!g) return
    const cam = state.camera
    g.position.copy(OFFSET).applyQuaternion(cam.quaternion).add(cam.position)
    g.quaternion.copy(cam.quaternion)

    const { a, b, t } = towerState
    const time = state.clock.elapsedTime
    let shown = 0
    for (const obj of g.children) {
      const i = obj.userData.section as number | undefined
      if (i === undefined) continue
      // Hand-over in two halves so two props never share the spot: the old one leaves during
      // the first half of the move, the new one arrives during the second.
      const w = a === b ? (i === a ? 1 : 0) : i === a ? 1 - Math.min(1, t * 2) : i === b ? Math.max(0, t * 2 - 1) : 0
      shown = Math.max(shown, w)
      obj.visible = w > 0.01
      if (!obj.visible) continue
      const s = smooth(w)
      obj.scale.setScalar(SCALE * (0.6 + 0.4 * s))
      // Leaving props drift up, arriving props rise from below.
      const drift = i === a && a !== b ? 0.6 : -0.6
      obj.position.set(0, Math.sin(time * 1.1 + i) * 0.06 + (1 - s) * drift, 0)
      obj.rotation.set(0.12, (obj.userData.facing as number) + Math.sin(time * 0.35 + i) * 0.45, 0)
      obj.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          const m = o.material as THREE.Material
          m.transparent = s < 1
          m.opacity = s
        }
      })
    }
    const h = g.getObjectByName("pg-prop-halo") as THREE.Mesh | undefined
    if (h) (h.material as THREE.ShaderMaterial).uniforms.uOpacity!.value = smooth(shown)
  })

  return (
    <group ref={group} name={GROUP}>
      <mesh name="pg-prop-halo" position={[0, 0, -1.6]} material={halo} renderOrder={-1}>
        <planeGeometry args={[4.4, 4.4]} />
      </mesh>
      <pointLight position={[2.5, 2.5, 2]} intensity={30} distance={12} color="#ffe6c8" />
      <pointLight position={[-2.5, -0.5, 0.5]} intensity={8} distance={10} color="#ff7a55" />
      <pointLight position={[0, 1.5, -3]} intensity={6} distance={10} color="#7f8fff" />
    </group>
  )
}

useGLTF.preload(PROPS_MODEL, DRACO_PATH)
