"use client"
import useCamera from "@/hooks/inu/useCamera"
import useFullScreen from "@/hooks/inu/useFullScreen"
import { OrbitControls, Environment, PointerLockControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group } from "three"
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
    }
  })

  return (
    <>
      <color attach="background" args={["#E6E6FA"]} />
      {thirdPerson ? (
        <PointerLockControls ref={pointerRef} />
      ) : (
        <OrbitControls ref={orbitControlsRef} enablePan={false} />
      )}
      <Environment preset="forest" />
      <Track />
      <Ground />
      <Character characterRef={inuRef} />
    </>
  )
}

export default DemoInuPage
