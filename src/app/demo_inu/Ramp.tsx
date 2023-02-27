import { useLoader } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

function Ramp() {
  const result = useLoader(GLTFLoader, "/models/ramp.glb")

  const geometry = (result.scene.children[0] as any).geometry

  const vertices = geometry.attributes.position.array
  const indices = geometry.index.array

  return <RigidBody args={[vertices, indices]} mass={0} type="dynamic" />
}

export default Ramp
