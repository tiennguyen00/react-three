"use client"
import useCamera from "@/hooks/inu/useCamera"
import useFullScreen from "@/hooks/inu/useFullScreen"
import { OrbitControls, Environment, PointerLockControls, useKeyboardControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group, Vector3 } from "three"
import Character from "./Character"
import Ground from "./Ground"
import Track from "./Track"

const DemoInuPage = () => {
  const inuRef = useRef<Group>(null)
  const isDrag = useRef(false)
  const orbitControlsRef = useRef(null)
  const { camera, gl } = useThree()
  const [thirdPerson, setThirdPerson] = useState(false)
  const pointerRef = useRef<any>(null)
  const [_, getKeys] = useKeyboardControls()

  useFullScreen(gl)

  useEffect(() => {
    const keyDownPressHandler = (e: any) => {
      if (e.key === "t") {
        setThirdPerson(!thirdPerson)
      }
    }
    window.addEventListener("keydown", keyDownPressHandler)
    return () => window.removeEventListener("keydown", keyDownPressHandler)
  }, [thirdPerson])

  const { updateCameraTarget } = useCamera(camera, orbitControlsRef.current, isDrag.current)

  useFrame((_, delta) => {
    if (inuRef.current) {
      if (!thirdPerson) {
        updateCameraTarget(delta, inuRef.current)
        return
      }
      if (!pointerRef.current || !pointerRef.current?.isLocked) return
      const direction = new Vector3()
      const frontVector = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize()
      const sideVector = new Vector3(-1, 0, 0).applyQuaternion(camera.quaternion).normalize()
      const moveDirection = new Vector3()
      const { forward, backward, left, right } = getKeys()
      if (forward) moveDirection.add(frontVector)
      if (backward) moveDirection.add(frontVector)
      if (left) moveDirection.add(sideVector)
      if (right) moveDirection.add(sideVector)
      if (moveDirection.length() > 0) {
        moveDirection.normalize().multiplyScalar(0.5)
        camera.position.add(moveDirection.multiplyScalar(0.5))
      }
    }
  })

  return (
    <>
      <color attach="background" args={["#E6E6FA"]} />
      {thirdPerson ? <PointerLockControls ref={pointerRef} /> : <OrbitControls ref={orbitControlsRef} />}
      <Environment preset="forest" />
      <group scale={[5, 5, 5]}>
        <Track />
        <Ground />
      </group>
      <Character characterRef={inuRef} />
    </>
  )
}

export default DemoInuPage
