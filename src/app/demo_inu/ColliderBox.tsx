import { RigidBody } from "@react-three/rapier"
import { Vector3 } from "three"

const ColliderBox = ({ position, scale }: { position?: Vector3 | number[]; scale?: any }) => {
  return (
    <RigidBody position={position as any}>
      <boxGeometry args={scale} />
      <meshBasicMaterial transparent={true} opacity={0.25} />
    </RigidBody>
  )
}

export default ColliderBox
