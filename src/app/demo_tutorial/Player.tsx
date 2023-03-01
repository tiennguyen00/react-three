import { useAnimations, useGLTF } from "@react-three/drei"
import React, { useEffect } from "react"
import { Mesh } from "three"

enum AnimationType {
  Idle = "idle",
  Walk = "Walking",
  Run = "Running",
  Wave = "Wave",
  WalkingBack = "Walkign backwards",
}

const Player = () => {
  const model = useGLTF("/models/Character.glb")
  const { actions } = useAnimations(model.animations, model.scene)

  model.scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true
    }
  })

  console.log(actions)

  useEffect(() => {
    if (!actions) return

    actions[AnimationType.Run]!.play()
  }, [])

  return <primitive object={model.scene} />
}

export default Player
