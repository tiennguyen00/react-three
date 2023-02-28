import { useHelper } from "@react-three/drei"
import { useRef } from "react"
import { DirectionalLightHelper } from "three"

const Light = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useHelper(lightRef, DirectionalLightHelper, 0.5, "hotpink")

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={lightRef}
        position={[0, 10, 10]}
        castShadow
        shadow-mapSize-height={1000}
        shadow-mapSize-width={1000}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  )
}

export default Light
