"use client"
import { Debug, useBox } from "@react-three/cannon"
import { Environment } from "@react-three/drei"
import { Suspense, useRef } from "react"
import manny from "manny"
import ThirdPersonCharacterControls from "./lib"

const BASE_ANIMATIONS_PATH = "https://mannys-game.s3.amazonaws.com/third-person/animations"

const animationPaths = {
  idle: `${BASE_ANIMATIONS_PATH}/idle.glb`,
  walk: `${BASE_ANIMATIONS_PATH}/walk.glb`,
  run: `${BASE_ANIMATIONS_PATH}/run.glb`,
  jump: `${BASE_ANIMATIONS_PATH}/jump.glb`,
  landing: `${BASE_ANIMATIONS_PATH}/landing.glb`,
  inAir: `${BASE_ANIMATIONS_PATH}/falling_idle.glb`,
  backpedal: `${BASE_ANIMATIONS_PATH}/backpedal.glb`,
  turnLeft: `${BASE_ANIMATIONS_PATH}/turn_left.glb`,
  turnRight: `${BASE_ANIMATIONS_PATH}/turn_right.glb`,
  strafeLeft: `${BASE_ANIMATIONS_PATH}/strafe_left.glb`,
  strafeRight: `${BASE_ANIMATIONS_PATH}/strafe_right.glb`,
}

const ThirdPersonCharacter = () => {
  const mannyObj = manny()

  return (
    <ThirdPersonCharacterControls
      cameraOptions={{
        yOffset: 1.6,
        minDistance: 0.6,
        maxDistance: 7,
        collisionFilterMask: 2,
      }}
      characterObj={mannyObj}
      animationPaths={animationPaths}
      onLoad={() => {
        console.log("loaded")
      }}
    />
  )
}

function Lighting() {
  return (
    <>
      <hemisphereLight skyColor={0xffffff} groundColor={0x444444} position={[0, 0, 0]} />
      <directionalLight color={0xffffff} intensity={0.25} castShadow position={[0, 200, 100]} />
    </>
  )
}

function Floor() {
  const [ref] = useBox(
    () => ({
      type: "Static",
      args: [25, 0.2, 25],
      mass: 0,
      material: {
        friction: 0,
        name: "floor",
      },
      collisionFilterGroup: 2,
    }),
    useRef<any>(null)
  )
  return (
    <group>
      <mesh ref={ref}>
        <boxGeometry name="floor-box" />
        <meshPhongMaterial opacity={0} transparent />
      </mesh>
      <gridHelper args={[25, 25]} />
    </group>
  )
}

function Wall({ args, ...props }) {
  const [ref] = useBox(
    () => ({
      type: "Static",
      args,
      mass: 0,
      material: {
        friction: 0.3,
        name: "wall",
      },
      collisionFilterGroup: 2,
      ...props,
    }),
    useRef<any>(null)
  )
  return (
    <mesh receiveShadow ref={ref} {...props}>
      <boxGeometry args={args} />
      <meshPhongMaterial color="white" opacity={0.8} transparent />
    </mesh>
  )
}

const DemoInuPage = () => {
  return (
    <>
      <color attach="background" args={["#E6E6FA"]} />
      <Suspense fallback={null}>
        <ThirdPersonCharacter />
      </Suspense>
      <Wall args={[25, 3, 0.2]} position={[0, 1.4, -12.6]} />
      <Wall args={[25, 3, 0.2]} position={[0, 1.4, 12.6]} />
      <Wall args={[25, 3, 0.2]} rotation={[0, -Math.PI / 2, 0]} position={[12.6, 1.4, 0]} />
      <Wall args={[25, 3, 0.2]} rotation={[0, -Math.PI / 2, 0]} position={[-12.6, 1.4, 0]} />
      <Floor />
      <Lighting />
      <Environment preset="forest" />
    </>
  )
}

export default DemoInuPage
