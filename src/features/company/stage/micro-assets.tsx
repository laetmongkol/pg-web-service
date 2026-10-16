"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"

import type { Bounds } from "./building"
import { stage } from "./stage-state"

const GROUP = "pg-micro-assets"
const PER_KIND = 16

/** Deterministic noise so the arrangement is the same on every visit (and on the server build). */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

type Token = { r: number; a: number; y: number; size: number; spin: number; bob: number; lift: number }

function scatter(seed: number, b: Bounds): Token[] {
  const rand = rng(seed)
  return Array.from({ length: PER_KIND }, () => ({
    r: b.radius * (1.2 + rand() * 0.95),
    a: rand() * Math.PI * 2,
    y: b.height * (0.08 + rand() * 1.15),
    size: b.radius * (0.035 + rand() * 0.035),
    spin: (rand() - 0.5) * 0.8,
    bob: rand() * Math.PI * 2,
    lift: 0.15 + rand() * 0.45,
  }))
}

const dummy = new THREE.Object3D()

/**
 * The small things around the building: brand-coloured coins, cubes and glowing rings orbiting
 * slowly in a loose shell, plus three glass badges. They lean with the pointer, rise as the page
 * scrolls, and the one under the pointer swells for a moment.
 */
export default function MicroAssets({
  bounds,
  colors,
  primary,
  glow,
}: {
  bounds: Bounds
  colors: string[]
  primary: string
  glow: number
}) {
  const coins = useRef<THREE.InstancedMesh>(null)
  const cubes = useRef<THREE.InstancedMesh>(null)
  const rings = useRef<THREE.InstancedMesh>(null)
  const hover = useRef<{ mesh: THREE.InstancedMesh | null; id: number; t: number }>({ mesh: null, id: -1, t: 0 })

  const sets = useMemo(() => [scatter(11, bounds), scatter(29, bounds), scatter(53, bounds)], [bounds])
  const geo = useMemo(
    () => ({
      coin: new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32),
      cube: new THREE.BoxGeometry(0.62, 0.62, 0.62),
      ring: new THREE.TorusGeometry(0.42, 0.08, 12, 40),
    }),
    [],
  )
  const mats = useMemo(
    () => ({
      solid: new THREE.MeshStandardMaterial({ metalness: 0.65, roughness: 0.28, envMapIntensity: 1.4 }),
      ring: new THREE.MeshStandardMaterial({
        color: primary,
        emissive: new THREE.Color(primary),
        emissiveIntensity: 0.6 * glow,
        metalness: 0.4,
        roughness: 0.3,
      }),
    }),
    [primary, glow],
  )

  useLayoutEffect(() => {
    const c = new THREE.Color()
    ;[coins.current, cubes.current].forEach((mesh, k) => {
      if (!mesh) return
      for (let i = 0; i < PER_KIND; i++) mesh.setColorAt(i, c.set(colors[(i + k) % colors.length]!))
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    })
  }, [colors])

  useLayoutEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose())
      Object.values(mats).forEach((m) => m.dispose())
    },
    [geo, mats],
  )

  useFrame((state, delta) => {
    const g = state.scene.getObjectByName(GROUP)
    if (!g) return
    const time = state.clock.elapsedTime
    // Lean with the pointer (eased), so the shell feels like it has weight.
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, stage.pointer.x * 0.14, 3, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -stage.pointer.y * 0.05, 3, delta)
    g.position.set(bounds.cx, 0, bounds.cz)

    const h = hover.current
    h.t = Math.max(0, h.t - delta * 1.6)
    const meshes = [coins.current, cubes.current, rings.current]
    meshes.forEach((mesh, k) => {
      if (!mesh) return
      const set = sets[k]!
      for (let i = 0; i < set.length; i++) {
        const p = set[i]!
        const a = p.a + time * 0.05 * (k % 2 ? 1 : -1)
        const y = p.y + Math.sin(time * 0.8 + p.bob) * bounds.height * 0.02 + stage.progress * bounds.height * p.lift
        const swell = h.mesh === mesh && h.id === i ? 1 + h.t * 0.9 : 1
        dummy.position.set(Math.cos(a) * p.r, y, Math.sin(a) * p.r)
        dummy.rotation.set(time * p.spin + p.bob, time * p.spin * 1.3, k === 2 ? Math.PI / 2.4 : 0)
        dummy.scale.setScalar(p.size * swell * (k === 2 ? 1.3 : 1))
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    })
  })

  const onHover = (e: ThreeEvent<PointerEvent>) => {
    if (e.instanceId === undefined) return
    hover.current = { mesh: e.object as THREE.InstancedMesh, id: e.instanceId, t: 1 }
  }

  const badgeW = bounds.radius * 0.36
  const badges = [
    { a: 0.55, y: 0.95, r: 1.25 },
    { a: 2.4, y: 0.62, r: 1.35 },
    { a: 4.1, y: 1.08, r: 1.3 },
  ]

  return (
    <group name={GROUP}>
      <instancedMesh ref={coins} args={[geo.coin, mats.solid, PER_KIND]} castShadow onPointerMove={onHover} />
      <instancedMesh ref={cubes} args={[geo.cube, mats.solid, PER_KIND]} castShadow onPointerMove={onHover} />
      <instancedMesh ref={rings} args={[geo.ring, mats.ring, PER_KIND]} onPointerMove={onHover} />
      {badges.map((b, i) => (
        <group
          key={i}
          position={[Math.cos(b.a) * bounds.radius * b.r, bounds.height * b.y, Math.sin(b.a) * bounds.radius * b.r]}
          rotation={[0, -b.a + Math.PI / 2, 0]}
        >
          <RoundedBox args={[badgeW, badgeW * 0.58, badgeW * 0.04]} radius={badgeW * 0.06} smoothness={3}>
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.28}
              roughness={0.08}
              metalness={0.3}
              envMapIntensity={2}
              depthWrite={false}
            />
          </RoundedBox>
          <mesh position={[-badgeW * 0.3, badgeW * 0.12, badgeW * 0.03]}>
            <boxGeometry args={[badgeW * 0.22, badgeW * 0.05, badgeW * 0.01]} />
            <meshStandardMaterial color={primary} emissive={primary} emissiveIntensity={1.2 * glow} />
          </mesh>
          {[0, 1, 2].map((row) => (
            <mesh key={row} position={[-badgeW * 0.08 + row * 0.02, -badgeW * (0.02 + row * 0.08), badgeW * 0.03]}>
              <boxGeometry args={[badgeW * (0.66 - row * 0.14), badgeW * 0.03, badgeW * 0.01]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.55} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
