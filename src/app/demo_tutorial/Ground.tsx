import { usePlane } from "@react-three/cannon"
import React from "react"

const Ground = () => {
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
  }))

  return (
    <mesh rotation-x={Math.PI * -0.5} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#458754" />
    </mesh>
  )
}

export default Ground
