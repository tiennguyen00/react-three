import { usePlayer } from "@/hooks/usePlayer"
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import React, { useEffect, useRef } from "react"
import { Mesh, Quaternion, Vector3 } from "three"

enum AnimationType {
  Idle = "idle",
  Walk = "Walking",
  Run = "Running",
  Wave = "Wave",
  WalkingBack = "Walkign backwards",
}

let walkDirection = new Vector3()
let rotateAngle = new Vector3(0, 1, 0)
let rotateQuaternion = new Quaternion()
let cameraTarget = new Vector3()

const directionOffset = ({
  forward,
  backward,
  left,
  right,
}: {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}) => {
  let directionOffset = 0 //w

  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4 //w+a
    } else if (right) {
      directionOffset = -Math.PI / 4 //w+d
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2 //s+a
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2 //s+d
    } else {
      directionOffset = Math.PI //s
    }
  } else if (left) {
    directionOffset = Math.PI / 2 //a
  } else if (right) {
    directionOffset = -Math.PI / 2 //d
  }

  return directionOffset
}

const Player = () => {
  const { backward, forward, jump, left, right, sprint } = usePlayer()
  const model = useGLTF("/models/Character.glb")
  const { actions } = useAnimations(model.animations, model.scene)

  model.scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true
    }
  })

  const currentAction = useRef("")
  const orbitControls = useRef<any>(null)
  const { camera } = useThree()

  const updateCameraTarget = (moveX: number, moveZ: number) => {
    // move camera
    camera.position.x += moveX
    camera.position.z += moveZ

    // update camera target
    cameraTarget.x = model.scene.position.x
    cameraTarget.y = model.scene.position.y + 2
    cameraTarget.z = model.scene.position.z
    if (orbitControls.current) {
      orbitControls.current.target = cameraTarget
    }
  }

  useEffect(() => {
    if (!actions) return
    let action = ""
    if (forward || left || right || backward) {
      action = AnimationType.Walk
    } else if (jump) {
      action = AnimationType.Wave
    } else action = AnimationType.Idle

    if (action !== currentAction.current) {
      const nextAction = actions[action]
      const current = actions[currentAction.current]
      current?.fadeOut(0.2)
      nextAction?.reset().fadeIn(0.2).play()
      currentAction.current = action
    }
  }, [backward, forward, jump, left, right])

  useFrame((_, delta) => {
    if (currentAction.current === AnimationType.Walk) {
      // calculate towards camera direction
      let angleYCameraDirection = Math.atan2(
        camera.position.x - model.scene.position.x,
        camera.position.z - model.scene.position.z
      )
      // diagonal movement angle offset
      let directionOffsetValue = directionOffset({ forward, backward, left, right })

      //rotate model
      rotateQuaternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + directionOffsetValue)
      model.scene.quaternion.rotateTowards(rotateQuaternion, 0.2)

      // calculate direction
      camera.getWorldDirection(walkDirection)
      walkDirection.y = 0
      walkDirection.normalize()
      walkDirection.applyAxisAngle(rotateAngle, directionOffsetValue)

      // run/walk velocity
      const velocity = 5

      // move model and camera
      const moveX = walkDirection.x * velocity * delta
      const moveZ = walkDirection.z * velocity * delta
      model.scene.position.x += moveX
      model.scene.position.z += moveZ
      updateCameraTarget(moveX, moveZ)
    }
  })

  return (
    <>
      <OrbitControls maxPolarAngle={Math.PI / 2} ref={orbitControls as any} />
      <group
        onPointerOver={(e) => {
          e.stopPropagation()
          console.log("onPointerOver")
        }}
      >
        <primitive object={model.scene} />
      </group>
    </>
  )
}

export default Player
