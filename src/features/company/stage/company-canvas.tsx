"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"

import CompanyScene, { type CompanySceneProps } from "./company-scene"

export default function CompanyCanvas(props: CompanySceneProps) {
  return (
    <Canvas
      shadows
      dpr={props.lite ? [1, 1.5] : [1, 2]}
      // Pointer events come from the whole page, so the tokens react through the text overlay.
      eventSource={document.body}
      eventPrefix="client"
      gl={{ antialias: !props.lite, powerPreference: "high-performance" }}
      camera={{ fov: props.lite ? 46 : 32, near: 0.5, far: 6000, position: [0, 300, 300] }}
      // ACES is R3F's default tone mapping; each mood only sets how bright it runs.
      onCreated={({ gl }) => {
        gl.toneMappingExposure = props.mood.exposure
      }}
    >
      <Suspense fallback={null}>
        <CompanyScene {...props} />
      </Suspense>
    </Canvas>
  )
}
