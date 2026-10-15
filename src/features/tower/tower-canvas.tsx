"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"

import TowerScene from "./tower-scene"

interface TowerCanvasProps {
  lite: boolean
  offsetRatio: number
  onReady: () => void
}

export default function TowerCanvas({ lite, offsetRatio, onReady }: TowerCanvasProps) {
  return (
    <Canvas
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !lite, powerPreference: "high-performance" }}
      camera={{ fov: lite ? 62 : 52, near: 0.3, far: 1400, position: [-30, 3, 82] }}
    >
      <Suspense fallback={null}>
        <TowerScene lite={lite} offsetRatio={offsetRatio} onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
