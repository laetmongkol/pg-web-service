"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

import { assetPath } from "@/lib/asset-path"

import Movers from "./movers"
import SectionProps from "./section-props"
import { newSkyState, skyAt, skyFragment, skyVertex } from "./sky"
import { SCENES } from "./scenes"
import { towerState } from "./tower-state"

export const TOWER_MODEL = assetPath("/models/pg-tower-v6.glb")
const DRACO_PATH = assetPath("/draco/")

/** Floor heights in the model (Blender z → three y) where interior lights hang. */
const INTERIOR_LIGHTS = [4.5, 10.5, 19, 28.5, 34.5, 41]

type Path = {
  /** camera positions through every section's pose */
  curve: THREE.CatmullRomCurve3
  /** camera orientation per section */
  turns: THREE.Quaternion[]
}

function readPath(scene: THREE.Object3D): Path {
  const cams: THREE.Vector3[] = []
  const turns: THREE.Quaternion[] = []
  const m = new THREE.Matrix4()
  SCENES.forEach((_, i) => {
    const id = String(i).padStart(2, "0")
    const cam = scene.getObjectByName(`stop_${id}_cam`)
    const look = scene.getObjectByName(`stop_${id}_look`)
    if (!cam || !look) throw new Error(`pg-tower model is missing stop_${id}_cam/look`)
    const p = cam.getWorldPosition(new THREE.Vector3())
    const l = look.getWorldPosition(new THREE.Vector3())
    cams.push(p)
    turns.push(new THREE.Quaternion().setFromRotationMatrix(m.lookAt(p, l, THREE.Object3D.DEFAULT_UP)))
  })
  return { curve: new THREE.CatmullRomCurve3(cams, false, "centripetal"), turns }
}

interface TowerSceneProps {
  lite: boolean
  /** Shift the frustum so the subject sits right of the text column (desktop only). */
  offsetRatio: number
  onReady: () => void
}

export default function TowerScene({ lite, offsetRatio, onReady }: TowerSceneProps) {
  const { scene } = useGLTF(TOWER_MODEL, DRACO_PATH)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const sunLight = useRef<THREE.DirectionalLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const interior = useRef<THREE.Group>(null)
  const fog = useRef<THREE.Fog>(null)
  const snapped = useRef(false)
  const pos = useRef(new THREE.Vector3())
  const turn = useRef(new THREE.Quaternion())
  const tmp = useRef(new THREE.Vector3())
  const sky = useRef(newSkyState())
  const night = useRef(0)
  const windows = useRef<THREE.MeshStandardMaterial | null>(null)
  const lamps = useRef<THREE.MeshStandardMaterial | null>(null)

  const path = useMemo(() => readPath(scene), [scene])

  const skyMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uZenith: { value: new THREE.Color() },
          uHorizon: { value: new THREE.Color() },
          uSun: { value: new THREE.Color() },
          uSunDir: { value: new THREE.Vector3() },
        },
      }),
    [],
  )

  // One-time material pass: matte architectural-model look. Coral reads as a light source; glass
  // and lamps get an emissive channel the dusk turns up.
  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      const mat = obj.material as THREE.MeshStandardMaterial
      mat.flatShading = true
      if (mat.name === "t_coral") {
        mat.emissive = new THREE.Color("#ff6946")
        mat.emissiveIntensity = 1.2
      }
      if (mat.name === "t_window") {
        mat.emissive = new THREE.Color("#ffb46b")
        mat.emissiveIntensity = 0
        windows.current = mat
      }
      if (mat.name === "t_light") {
        mat.emissive = new THREE.Color("#ffd9a8")
        mat.emissiveIntensity = 0.3
        lamps.current = mat
      }
      mat.needsUpdate = true
    })
    onReady()
  }, [scene, onReady])

  useEffect(() => {
    if (offsetRatio) {
      camera.setViewOffset(size.width, size.height, -size.width * offsetRatio, 0, size.width, size.height)
    } else {
      camera.clearViewOffset()
    }
  }, [camera, size, offsetRatio])

  useFrame((state, delta) => {
    const cam = state.camera as THREE.PerspectiveCamera
    const { a, b, t } = towerState

    // Position rides one smooth curve through every section's pose; orientation turns by slerp,
    // so the camera never flips between floors.
    const last = SCENES.length - 1
    path.curve.getPoint(Math.min(1, (a + (b - a) * t) / last), tmp.current)
    turn.current.copy(path.turns[a]!).slerp(path.turns[b]!, t)

    const k = snapped.current ? 1 - Math.exp(-delta * 6) : 1
    snapped.current = true
    pos.current.lerp(tmp.current, k)
    cam.position.copy(pos.current)
    cam.quaternion.slerp(turn.current, k)

    const s = skyAt(towerState.progress, sky.current)
    night.current = s.night
    skyMaterial.uniforms.uZenith!.value.copy(s.zenith)
    skyMaterial.uniforms.uHorizon!.value.copy(s.horizon)
    skyMaterial.uniforms.uSun!.value.copy(s.sun)
    skyMaterial.uniforms.uSunDir!.value.copy(s.sunDir)
    if (fog.current) fog.current.color.copy(s.horizon)
    if (sunLight.current) {
      sunLight.current.color.copy(s.sun)
      sunLight.current.intensity = s.sunPower
      sunLight.current.position.copy(s.sunDir).multiplyScalar(120)
    }
    if (hemi.current) {
      hemi.current.color.copy(s.zenith)
      hemi.current.intensity = 0.55 + 0.35 * (1 - s.night)
    }
    if (windows.current) windows.current.emissiveIntensity = s.night * 1.3
    if (lamps.current) lamps.current.emissiveIntensity = 0.3 + s.night * 2.4
    interior.current?.children.forEach((l) => {
      ;(l as THREE.PointLight).intensity = 40 + 70 * s.night
    })
  })

  return (
    <>
      <mesh material={skyMaterial} scale={600} renderOrder={-1}>
        <sphereGeometry args={[1, 32, 16]} />
      </mesh>
      <fog ref={fog} attach="fog" args={["#ffd7a3", 120, 520]} />
      <hemisphereLight ref={hemi} args={["#e9c9a0", "#5a4e48", 0.9]} />
      <directionalLight ref={sunLight} intensity={2} />
      <group ref={interior}>
        {(lite ? INTERIOR_LIGHTS.filter((_, i) => i % 2 === 0) : INTERIOR_LIGHTS).map((y) => (
          <pointLight key={y} position={[0, y, -1]} color="#ffd2a8" intensity={40} distance={26} decay={1.4} />
        ))}
      </group>
      <primitive object={scene} />
      <Movers scene={scene} lite={lite} />
      {/* Phones give the whole width to text, so the section objects are desktop-only. */}
      {!lite && <SectionProps />}
    </>
  )
}

useGLTF.preload(TOWER_MODEL, DRACO_PATH)
