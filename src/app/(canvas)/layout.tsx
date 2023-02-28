"use client"

import { Physics, Debug } from "@react-three/cannon"
import { KeyboardControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Perf } from "r3f-perf"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
        { name: "run", keys: ["Shift"] },
      ]}
    >
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 50,
          position: [0, 3, 3],
          frustumCulled: true,
        }}
      >
        <Physics gravity={[0, -2.6, 0]}>{children}</Physics>
        <Perf position="top-left" />
      </Canvas>
    </KeyboardControls>
  )
}
