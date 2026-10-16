"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useThree } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import * as THREE from "three"

import type { CompanyMood } from "@/companies/companies"

import Building, { type Bounds, modelUrl } from "./building"
import CameraRig from "./camera-rig"
import MicroAssets from "./micro-assets"
import { setPhase, stage } from "./stage-state"

const DEG = Math.PI / 180
/** Typical camera distance in building radii; fog is measured beyond it so the model stays crisp. */
const CAMERA_RADII = 3

const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const skyFragment = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uBottom;
varying vec3 vDir;
void main() {
  float h = clamp(vDir.y * 1.6 + 0.12, 0.0, 1.0);
  gl_FragColor = vec4(mix(uBottom, uTop, pow(h, 0.8)), 1.0);
  #include <colorspace_fragment>
}
`

export interface CompanySceneProps {
  slug: string
  mood: CompanyMood
  primary: string
  lite: boolean
  offset: number
}

/**
 * Everything in the 3D world for one company: gradient sky and matching fog, a ground plane with
 * a glowing model-base ring, sun + sky light, studio reflections for the glass, the building,
 * the floating micro-assets and the camera rig. Sizes come from the building once it is loaded.
 */
export default function CompanyScene({ slug, mood, primary, lite, offset }: CompanySceneProps) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const onBounds = useCallback((b: Bounds) => setBounds(b), [])

  const sky = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { uTop: { value: new THREE.Color(mood.skyTop) }, uBottom: { value: new THREE.Color(mood.skyBottom) } },
      }),
    [mood.skyTop, mood.skyBottom],
  )

  // Model in → compile every shader up front, so the first swoop never hitches.
  useEffect(() => {
    if (!bounds) return
    stage.bounds = bounds
    setPhase("compiling")
    let cancelled = false
    void gl.compileAsync(scene, camera).then(() => {
      if (!cancelled) setPhase("ready")
    })
    return () => {
      cancelled = true
    }
  }, [bounds, gl, scene, camera])

  const r = bounds?.radius ?? 20
  const sun = mood.sun
  const sunPos: [number, number, number] = [
    Math.sin(sun.azimuth * DEG) * Math.cos(sun.elevation * DEG) * r * 3,
    Math.sin(sun.elevation * DEG) * r * 3,
    Math.cos(sun.azimuth * DEG) * Math.cos(sun.elevation * DEG) * r * 3,
  ]

  return (
    <>
      <fog attach="fog" args={[mood.fog, r * (CAMERA_RADII + mood.fogRange[0]), r * (CAMERA_RADII + mood.fogRange[1])]} />
      <mesh material={sky} scale={r * 30} renderOrder={-10}>
        <sphereGeometry args={[1, 32, 16]} />
      </mesh>

      <hemisphereLight args={[mood.hemi.sky, mood.hemi.ground, mood.hemi.intensity]} />
      <directionalLight
        position={sunPos}
        color={sun.color}
        intensity={sun.intensity}
        castShadow
        shadow-mapSize={lite ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-left={-r * 1.8}
        shadow-camera-right={r * 1.8}
        shadow-camera-top={r * 1.8}
        shadow-camera-bottom={-r * 1.8}
        shadow-camera-near={r * 0.5}
        shadow-camera-far={r * 6}
      />

      {/* Studio reflections only (not the background): soft panels the glass and metal pick up. */}
      <Environment resolution={lite ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color={mood.hemi.sky} position={[0, 6, -8]} scale={[18, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} color={sun.color} position={[9, 3, 4]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#ffffff" position={[-9, 2, 3]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer form="ring" intensity={2.4} color={primary} position={[0, 9, 0]} rotation-x={Math.PI / 2} scale={4} />
      </Environment>

      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[r * 22, 64]} />
        <meshStandardMaterial color={mood.ground} roughness={0.95} />
      </mesh>
      {bounds && (
        <mesh rotation-x={-Math.PI / 2} position={[bounds.cx, 0.03, bounds.cz]}>
          <ringGeometry args={[r * 1.72, r * 1.74, 128]} />
          <meshBasicMaterial color={primary} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      )}

      <Building url={modelUrl(slug)} glow={mood.glow} onBounds={onBounds} />
      {bounds && (
        <>
          <MicroAssets bounds={bounds} colors={mood.tokens} primary={primary} glow={mood.glow} />
          <CameraRig bounds={bounds} offset={offset} />
        </>
      )}
    </>
  )
}
