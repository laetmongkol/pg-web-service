"use client"

import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Traffic around the block. The model carries one template per car (`car_*`), parked
 * off-stage; this clones them and drives them every frame.
 *
 * Street ring from design/3d/build_tower.py (ROAD_X 52, ROAD_Y0 −46, ROAD_Y1 34, in Blender
 * x/y). In three: x stays, z = −y, so the ring spans x −52..52 and z −34..46.
 */
const RING = { x0: -52, x1: 52, z0: -34, z1: 46 }
const LANE = 2.2
const CARS = ["car_sedan", "car_suv", "car_taxi", "car_stone"]
const GROUP = "pg-movers"

/** Point on the ring's perimeter at distance d (clockwise seen from above), with heading. */
function onRing(d: number, inset: number, out: THREE.Vector3): number {
  const x0 = RING.x0 + inset
  const x1 = RING.x1 - inset
  const z0 = RING.z0 + inset
  const z1 = RING.z1 - inset
  const w = x1 - x0
  const h = z1 - z0
  const per = 2 * (w + h)
  let s = ((d % per) + per) % per
  if (s < w) return out.set(x0 + s, 0, z1), 0
  s -= w
  if (s < h) return out.set(x1, 0, z1 - s), Math.PI / 2
  s -= h
  if (s < w) return out.set(x1 - s, 0, z0), Math.PI
  s -= w
  return out.set(x0, 0, z0 + s), -Math.PI / 2
}

type Car = { offset: number; speed: number; inner: boolean }

export default function Movers({ scene, lite }: { scene: THREE.Object3D; lite: boolean }) {
  const group = useRef<THREE.Group>(null)

  // Clone the templates once; each clone carries its route in userData.
  useEffect(() => {
    const g = group.current
    if (!g) return
    const find = (names: string[]) => names.map((n) => scene.getObjectByName(n)).filter(Boolean) as THREE.Object3D[]
    const carTemplates = find(CARS)
    // The parked templates stay in the GLB but must not be drawn.
    for (const tpl of carTemplates) tpl.visible = false

    const spawn = (tpl: THREE.Object3D, route: Car) => {
      const obj = tpl.clone()
      obj.position.set(0, 0, 0)
      obj.visible = true
      obj.userData.route = route
      g.add(obj)
    }
    if (carTemplates.length) {
      for (let i = 0; i < (lite ? 5 : 12); i++) {
        spawn(carTemplates[i % carTemplates.length]!, { offset: i * 37.3, speed: 7 + (i % 3) * 1.6, inner: i % 2 === 1 })
      }
    }
    return () => {
      g.clear()
    }
  }, [scene, lite])

  // Objects are reached through the frame state (like the camera), so per-frame mutation stays
  // outside React's data flow.
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const g = state.scene.getObjectByName(GROUP)
    if (!g) return
    for (const obj of g.children) {
      const r = obj.userData.route as Car | undefined
      if (!r) continue
      // Outer lane runs clockwise, inner lane the other way.
      const heading = onRing(r.offset + time * r.speed * (r.inner ? -1 : 1), r.inner ? LANE : -LANE, obj.position)
      // Cars are modelled facing +X; rotation.y = θ turns +X towards (cos θ, 0, −sin θ).
      obj.rotation.y = heading + (r.inner ? Math.PI : 0)
    }
  })

  return <group ref={group} name={GROUP} />
}
