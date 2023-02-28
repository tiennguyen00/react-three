"use client"

import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Ground from "./Ground"
import Light from "./Light"
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
        <Tree boundary={50} count={20} />
        <OrbitControls />
        <Ground />
      </Canvas>
    </div>
  )
}

export default DemoTutorial
