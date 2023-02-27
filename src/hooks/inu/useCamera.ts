import { Camera } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Group, Vector3 } from "three"

const useCamera = (camera: Camera, orbitControlsRef: any, isDrag: boolean) => {
  const currentPosition = useRef(new Vector3())

  const updateCameraTarget = (delta: number, character: Group) => {
    if (!isDrag) {
      const idealOffset = new Vector3(0, 2, -2)
      idealOffset.applyQuaternion(character.quaternion)
      idealOffset.add(character.position)

      const idealLookat = new Vector3(0, 10, 70)
      idealLookat.applyQuaternion(character.quaternion)
      idealLookat.add(character.position)

      const t = 1.0 - Math.pow(0.001, delta)

      currentPosition.current.lerp(idealOffset, t)

      camera.position.copy(currentPosition.current)
    } else {
      currentPosition.current = camera.position
      orbitControlsRef.target = character.position
    }

    camera.lookAt(character.position.x, character.position.y + 1.5, character.position.z)
    camera.updateProjectionMatrix()
  }

  const handleMouseDown = () => {
    isDrag = true
  }
  const handleMouseUp = () => {
    isDrag = false
  }

  // const handleMouseMove

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  })

  return {
    updateCameraTarget,
  }
}

export default useCamera
