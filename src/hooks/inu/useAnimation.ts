import { useCallback, useEffect, useRef, useState } from "react"
import { Group, Quaternion, Vector3 } from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

export const dummyAnimationData = {
  "mixamo.com": "/models/inu/ani_mixamo.fbx",
  "mixamo2.com": "/models/inu/ani_mixamo2.fbx",
}

type AnimationKeysType = keyof typeof dummyAnimationData
type KeyboardControls = "forward" | "backward" | "left" | "right" | "run" | "jump"

const loaderFBX = new FBXLoader()

let activeAnimation: Record<KeyboardControls, boolean> = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
  jump: false,
}

const useAnimation = () => {
  const [curAnimation, setCurAnimation] = useState<{ name: string; data: Group }>()
  const animationsPool = useRef<any>({})

  // For character state
  const velocity = new Vector3(0, 0, 0)
  const acceleration = new Vector3(1, 0.125, 20.0)
  const decceleration = new Vector3(-0.0005, -0.0001, -5.0)

  // =======================

  const isLoadedAnimation = (type: AnimationKeysType) => {
    return type in animationsPool.current
  }

  const animationOnLoad = (type: string, data: Group) => {
    setCurAnimation({
      name: type,
      data,
    })
  }

  const selectAnimation = (type: AnimationKeysType) => {
    const uri = dummyAnimationData[type]
    if (isLoadedAnimation(type)) {
      console.log("Same load animation")
      animationOnLoad(type, animationsPool.current[type])
    } else {
      try {
        const startTime = performance.now()
        loaderFBX.load(
          uri,
          (fbx) => {
            animationsPool.current[type] = fbx

            animationOnLoad(type, fbx)

            const endTime = performance.now()
            const loadTime = (endTime - startTime) / 1000
            console.log(`Model ${type} loaded in ${loadTime.toFixed(2)} seconds.`)
          },
          undefined,
          (err) => {
            console.error(err)
          }
        )
      } catch (err) {
        console.error("Something went wrong while load model: ", err)
      }
    }
  }

  const handleKeyPress = useCallback((event: any) => {
    switch (event.keyCode) {
      case 87 || 38: //w or arrowup
        activeAnimation.forward = true
        break
      case 65 || 37: //a or arrowleft
        activeAnimation.left = true
        break
      case 83 || 40: //s or arrowdown
        activeAnimation.backward = true
        break
      case 68 || 39: // d or arrowright
        activeAnimation.right = true
        break
      case 32: //spacebar
        activeAnimation.jump = true
        break
      case 16: // shift
        activeAnimation.run = true
        break
    }
  }, [])

  // movement
  const changeCharacterState = (delta: number, character: Group) => {
    const newVelocity = velocity
    const frameDecceleration = new Vector3(
      newVelocity.x * decceleration.x,
      newVelocity.y * decceleration.y,
      newVelocity.z * decceleration.z
    )
    frameDecceleration.multiplyScalar(delta)
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z))

    newVelocity.add(frameDecceleration)

    const controlObject = character
    const _Q = new Quaternion()
    const _A = new Vector3()
    const _R = controlObject.quaternion.clone()

    const acc = acceleration.clone()
    if (activeAnimation.run) {
      acc.multiplyScalar(2.0)
    }

    if (activeAnimation.forward) {
      newVelocity.z += acc.z * delta
    }
    if (activeAnimation.backward) {
      newVelocity.z -= acc.z * delta
    }
    if (activeAnimation.left) {
      _A.set(0, 1, 0)
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y)
      _R.multiply(_Q)
    }
    if (activeAnimation.right) {
      _A.set(0, 1, 0)
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y)
      _R.multiply(_Q)
    }
    if (activeAnimation.run) {
      newVelocity.z = Math.max(0, newVelocity.z)
    }

    if (activeAnimation.jump && Math.abs(velocity.y) < 0.01) {
      newVelocity.y += 0.001
      controlObject.position.y += 0.1
    }

    controlObject.quaternion.copy(_R)

    const oldPosition = new Vector3()
    oldPosition.copy(controlObject.position)

    const forward = new Vector3(0, 0, 1)
    forward.applyQuaternion(controlObject.quaternion)
    forward.normalize()

    const sideways = new Vector3(1, 0, 0)
    sideways.applyQuaternion(controlObject.quaternion)
    sideways.normalize()

    sideways.multiplyScalar(newVelocity.x * delta)
    forward.multiplyScalar(newVelocity.z * delta)

    controlObject.position.add(forward)
    controlObject.position.add(sideways)

    character.position.copy(controlObject.position)
    // console.log(controlObject.position);
  }

  const handleKeyUp = useCallback((event: any) => {
    switch (event.keyCode) {
      case 87 || 38: //w or arrowup
        activeAnimation.forward = false
        break
      case 65 || 37: //a or arrowleft
        activeAnimation.left = false
        break
      case 83 || 40: //s or arrowdown
        activeAnimation.backward = false
        break
      case 68 || 39: // d or arrowright
        activeAnimation.right = false
        break
      case 32: //spacebar
        activeAnimation.jump = false
        break
      case 16: // shift
        activeAnimation.run = false
        break
    }
  }, [])
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("keyup", handleKeyUp)
    }
  })

  return {
    curAnimation,
    selectAnimation,
    handleKeyPress,
    handleKeyUp,
    changeCharacterState,
  }
}

export default useAnimation
