"use client"
import InuPart from "@/components/models/Inu"
import useAnimation, { dummyAnimationData } from "@/hooks/inu/useAnimation"
import useCamera from "@/hooks/inu/useCamera"
import useControlsPlayer from "@/hooks/inu/useControlsPlayer"
import useModel, { dummyData } from "@/hooks/inu/useModel"
import { OrbitControls, Environment, PointerLockControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { Debug, Physics, RigidBody } from "@react-three/rapier"
import { folder, useControls } from "leva"
import { useEffect, useRef } from "react"
import { AnimationClip, AnimationMixer, Group, Vector3 } from "three"
import Ground from "./Ground"
import Track from "./Track"

const DemoInuPage = () => {
  const inuRef = useRef<Group>(null)
  const isDrag = useRef(false)
  const orbitControlsRef = useRef(null)
  const { camera } = useThree()
  const { selectBodyParts, curBody } = useModel()

  const controlsPlayer = useControlsPlayer()

  const { selectAnimation, curAnimation, changeCharacterState } = useAnimation({ controlsPlayer })
  const { updateCameraTarget } = useCamera(camera, orbitControlsRef.current, isDrag.current)

  const mixers: AnimationMixer[] = []

  useEffect(() => {
    if (curBody && curAnimation) {
      const models = Object.keys(curBody).map((i) => curBody[i])
      models.forEach((m) => {
        const mixer = new AnimationMixer(m?.scene)
        const clip = AnimationClip.findByName(curAnimation?.data.animations, curAnimation?.data.animations[0].name)
        const action = mixer?.clipAction(clip)
        // action.play();

        mixers.push(mixer)
      })
    }

    return () => {
      mixers.forEach((m) => m.stopAllAction())
    }
  }, [curAnimation, curBody])

  useFrame((_, delta) => {
    if (curBody && mixers.length === Object.keys(curBody).length) mixers.forEach((m) => m.update(delta))
    if (inuRef.current) {
      changeCharacterState(delta, inuRef.current)
      if (!controlsPlayer.mode) {
        updateCameraTarget(delta, inuRef.current)
        return
      }
    }
  })

  // Controls panel
  useControls({
    Body_Parts: folder({
      head: {
        value: "head_1",
        options: Object.keys(dummyData.head),
        onChange: (v) => {
          selectBodyParts("head", v)
        },
      },
      cloth: {
        value: "cloth_1",
        options: Object.keys(dummyData.cloth),
        onChange: (v) => {
          selectBodyParts("cloth", v)
        },
      },
      hands: {
        value: "hands_1",
        options: Object.keys(dummyData.hands),
        onChange: (v) => {
          selectBodyParts("hands", v)
        },
      },
      pants: {
        value: "pants_1",
        options: Object.keys(dummyData.pants),
        onChange: (v) => {
          selectBodyParts("pants", v)
        },
      },
      shoes: {
        value: "shoes_1",
        options: Object.keys(dummyData.shoes),
        onChange: (v) => {
          selectBodyParts("shoes", v)
        },
      },
    }),
    Animations: {
      value: "mixamo.com",
      options: Object.keys(dummyAnimationData),
      onChange: (v) => {
        selectAnimation(v)
      },
    },
  })
  return (
    <Physics gravity={[0, -9.8, 0]}>
      <Debug />
      <color attach="background" args={["#E6E6FA"]} />
      {controlsPlayer.mode ? <OrbitControls ref={orbitControlsRef} /> : <PointerLockControls ref={orbitControlsRef} />}
      <Environment preset="forest" />
      <group scale={[5, 5, 5]}>
        <Track />
        <Ground />
      </group>
      <RigidBody type="dynamic">
        <group scale={0.01} ref={inuRef}>
          <InuPart data={curBody?.head} />
          <InuPart data={curBody?.hands} />
          <InuPart data={curBody?.pants} />
          <InuPart data={curBody?.cloth} />
          <InuPart data={curBody?.shoes} />
        </group>
      </RigidBody>
    </Physics>
  )
}

export default DemoInuPage
