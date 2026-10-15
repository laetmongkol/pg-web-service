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
      camera={{ fov: lite ? 50 : 38, near: 0.5, far: 160, position: [20, 5, 20] }}
    >
      <Suspense fallback={null}>
        <TowerScene lite={lite} offsetRatio={offsetRatio} onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
