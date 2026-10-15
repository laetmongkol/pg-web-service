"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Sparkles, useGLTF } from "@react-three/drei"
import * as THREE from "three"

import { assetPath } from "@/lib/asset-path"

import ChamberProps, { type ChamberAnchor } from "./chamber-props"
import { CHAPTER_COUNT, type PoseKey, towerState } from "./tower-state"

export const TOWER_MODEL = assetPath("/models/pg-tower-v1b.glb")
const DRACO_PATH = assetPath("/draco/")

/** Warm dungeon night: soot-dark air, torchlight. */
const SOOT = new THREE.Color("#140d09")
/** Ground level of the model (Blender z = -44): below it the camera sits inside the shaft. */
const GROUND_Y = -44

/** Cylindrical camera pose around the tower axis. */
type Pose = { theta: number; radius: number; y: number; targetY: number }

function readPoses(scene: THREE.Object3D): Record<"in" | "out", Pose[]> {
  const inPoses: Pose[] = []
  const outPoses: Pose[] = []
  const v = new THREE.Vector3()
  for (let i = 0; i < CHAPTER_COUNT; i++) {
    const cam = scene.getObjectByName(`cam_${i}`)
    const tgt = scene.getObjectByName(`tgt_${i}`)
    if (!cam || !tgt) throw new Error(`pg-tower.glb is missing cam_${i}/tgt_${i}`)
    cam.getWorldPosition(v)
    const theta = Math.atan2(v.z, v.x)
    const radius = Math.hypot(v.x, v.z)
    const y = v.y
    const targetY = tgt.getWorldPosition(v).y
    const underground = y < GROUND_Y
    inPoses.push({ theta, radius: radius + 3, y, targetY })
    outPoses.push({
      theta,
      radius: underground ? 14.5 : 30,
      y: y + (underground ? 3 : 7),
      targetY: targetY - 1,
    })
  }
  // Hero: the spire top with its brazier, seen from outside.
  inPoses[0] = { theta: inPoses[0]!.theta - 0.35, radius: 34, y: inPoses[0]!.y + 9, targetY: inPoses[0]!.targetY - 1 }
  return { in: inPoses, out: outPoses }
}

/** Where each chamber's prop floats: its look-at point, and which way its doorway faces. */
function readAnchors(scene: THREE.Object3D): ChamberAnchor[] {
  const anchors: ChamberAnchor[] = []
  const v = new THREE.Vector3()
  for (let i = 0; i < CHAPTER_COUNT; i++) {
    scene.getObjectByName(`cam_${i}`)!.getWorldPosition(v)
    const theta = Math.atan2(v.z, v.x)
    anchors.push({ position: scene.getObjectByName(`tgt_${i}`)!.getWorldPosition(new THREE.Vector3()), theta })
  }
  return anchors
}

const lerp = THREE.MathUtils.lerp

function lerpAngle(a: number, b: number, t: number) {
  const d = Math.atan2(Math.sin(b - a), Math.cos(b - a))
  return a + d * t
}

interface TowerSceneProps {
  lite: boolean
  /** Shift the frustum so the chamber sits right of the text column (desktop only). */
  offsetRatio: number
  onReady: () => void
}

export default function TowerScene({ lite, offsetRatio, onReady }: TowerSceneProps) {
  const { scene } = useGLTF(TOWER_MODEL, DRACO_PATH)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const keyLight = useRef<THREE.PointLight>(null)
  const fillLight = useRef<THREE.PointLight>(null)
  const snapped = useRef(false)
  const flames = useRef<THREE.MeshStandardMaterial | null>(null)

  const poses = useMemo(() => readPoses(scene), [scene])
  const anchors = useMemo<ChamberAnchor[]>(() => readAnchors(scene), [scene])

  // One-time material pass: matte stone; fire, window slits and lava glow.
  useEffect(() => {
    const stray: THREE.Object3D[] = []
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      if (!/^(Ch\d|Env)_/.test(obj.name)) {
        stray.push(obj)
        return
      }
      const mat = obj.material as THREE.MeshStandardMaterial
      mat.flatShading = true
      const glow: Record<string, [string, number]> = {
        d_flame: ["#ff9a45", 2.6],
        d_window: ["#ff9a4a", 1.4],
        d_lava: ["#ff5a1f", 2.2],
      }
      const g = glow[mat.name]
      if (g) {
        mat.emissive = new THREE.Color(g[0])
        mat.emissiveIntensity = g[1]
        if (mat.name === "d_flame") flames.current = mat
      }
      mat.needsUpdate = true
    })
    stray.forEach((obj) => obj.removeFromParent())
    onReady()
  }, [scene, onReady])

  useEffect(() => {
    if (offsetRatio) {
      camera.setViewOffset(size.width, size.height, -size.width * offsetRatio, 0, size.width, size.height)
    } else {
      camera.clearViewOffset()
    }
  }, [camera, size, offsetRatio])

  const target = useRef(new THREE.Vector3())
  const pose = (k: PoseKey) => poses[k.kind][k.chapter]!

  useFrame((state, delta) => {
    const cam = state.camera
    const a = pose(towerState.from)
    const b = pose(towerState.to)
    const t = towerState.t
    // Orbit moves swing round first and descend after, so the camera spirals instead of cutting.
    const isOrbit = towerState.from.chapter !== towerState.to.chapter
    const tAngle = isOrbit ? Math.min(1, t * 1.25) : t
    const tHeight = isOrbit ? Math.max(0, t * 1.15 - 0.15) : t

    const theta = lerpAngle(a.theta, b.theta, tAngle)
    const radius = lerp(a.radius, b.radius, t)
    const y = lerp(a.y, b.y, tHeight)
    const targetY = lerp(a.targetY, b.targetY, tHeight)

    // Damped follow: Lenis already smooths scroll, this only removes stepping on fast flicks.
    // First frame snaps, so the page never opens on a camera flying in from the origin.
    const k = snapped.current ? 1 - Math.exp(-delta * 6) : 1
    snapped.current = true
    cam.position.x = lerp(cam.position.x, Math.cos(theta) * radius, k)
    cam.position.z = lerp(cam.position.z, Math.sin(theta) * radius, k)
    cam.position.y = lerp(cam.position.y, y, k)
    target.current.y = lerp(target.current.y, targetY, k)
    cam.lookAt(target.current)

    // Torchlight rides with the chamber being looked into, and everything that burns flickers.
    const time = state.clock.elapsedTime
    const flicker = 0.82 + Math.sin(time * 7.3) * 0.08 + Math.sin(time * 13.1 + 1.7) * 0.06 + Math.sin(time * 23.7) * 0.04
    if (keyLight.current) {
      keyLight.current.position.set(Math.cos(theta) * 4.0, targetY + 2.2, Math.sin(theta) * 4.0)
      keyLight.current.intensity = 95 * flicker
    }
    if (fillLight.current) {
      fillLight.current.position.set(Math.cos(theta + Math.PI) * 2.5, targetY + 1.2, Math.sin(theta + Math.PI) * 2.5)
      fillLight.current.intensity = 45 * (1.6 - flicker)
    }
    if (flames.current) flames.current.emissiveIntensity = 2.6 * flicker
  })

  return (
    <>
      <color attach="background" args={[SOOT]} />
      <fog attach="fog" args={[SOOT, 30, 85]} />
      <hemisphereLight args={["#a87a58", "#3a2618", 1.25]} />
      <ambientLight color="#ffd2a8" intensity={0.35} />
      <directionalLight position={[18, 40, 12]} intensity={1.0} color="#ffcf9c" />
      <pointLight ref={keyLight} color="#ff9d55" intensity={95} distance={22} decay={1.4} />
      <pointLight ref={fillLight} color="#ff7a3a" intensity={45} distance={14} decay={1.5} />
      <primitive object={scene} />
      <ChamberProps anchors={anchors} />
      {!lite && (
        <Sparkles count={110} scale={[26, 90, 26]} position={[0, -35, 0]} size={2.6} speed={0.35} opacity={0.7} color="#ffb070" />
      )}
    </>
  )
}

useGLTF.preload(TOWER_MODEL, DRACO_PATH)
