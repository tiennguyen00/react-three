import { Triplet, useBox } from "@react-three/cannon"

const ColliderBox = ({ position, scale }: { position?: Triplet | undefined; scale?: any }) => {
  useBox(() => ({
    position,
    args: scale,
    type: "Static",
  }))

  return (
    <mesh position={position as any}>
      <boxGeometry args={scale} />
      <meshBasicMaterial transparent={true} opacity={0.25} />
    </mesh>
  )
}

export default ColliderBox
