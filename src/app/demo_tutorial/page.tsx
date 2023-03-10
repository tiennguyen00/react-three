"use client"

import { Debug, Physics } from "@react-three/cannon"
import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Ground from "./Ground"
import Light from "./Light"
import Player from "./Player"
import Tree from "./Tree"

const DemoTutorial = () => {
  return (
    <div
      style={{
        background: "#3a3a3a",
        height: "100%",
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [0, 10, 0],
        }}
      >
        <Stats />
        <axesHelper args={[2]} />
        <gridHelper args={[10, 10]} />
        <Light />
        <Physics gravity={[0, -9.8, 0]}>
          <Debug>
            <Tree boundary={100} count={20} />
            <Player />
            <Ground />
          </Debug>
        </Physics>
      </Canvas>
    </div>
  )
}

export default DemoTutorial
