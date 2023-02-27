"use client";
import InuPart from "@/components/models/Inu";
import useAnimation, { dummyAnimationData } from "@/hooks/inu/useAnimation";
import useCamera from "@/hooks/inu/useCamera";
import useFullScreen from "@/hooks/inu/useFullScreen";
import useModel, { dummyData } from "@/hooks/inu/useModel";
import { useBox, useSphere } from "@react-three/cannon";
import { OrbitControls, Environment, PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { AnimationClip, AnimationMixer, Camera, Group, Vector3 } from "three";
import Ground from "./Ground";
import Track from "./Track";

const DemoInuPage = () => {
  const inuRef = useRef<Group>(null);
  const isDrag = useRef(false);
  const orbitControlsRef = useRef(null);
  const { camera, gl } = useThree();
  const { selectBodyParts, curBody } = useModel();
  const [thirdPerson, setThirdPerson] = useState(false);
  const pointerRef = useRef<any>(null);
  const [_, getKeys] = useKeyboardControls();

  useFullScreen(gl);

  useEffect(() => {
    const keyDownPressHandler = (e: any) => {
      if (e.key === "t") {
        setThirdPerson(!thirdPerson);
      }
    };
    window.addEventListener("keydown", keyDownPressHandler);
    return () => window.removeEventListener("keydown", keyDownPressHandler);
  }, [thirdPerson]);

  const { selectAnimation, curAnimation, changeCharacterState } = useAnimation();
  const { updateCameraTarget } = useCamera(camera, orbitControlsRef.current, isDrag.current);
  const mixers: AnimationMixer[] = [];

  useEffect(() => {
    if (curBody && curAnimation) {
      const models = Object.keys(curBody).map((i) => curBody[i]);
      models.forEach((m) => {
        const mixer = new AnimationMixer(m?.scene);
        const clip = AnimationClip.findByName(curAnimation?.data.animations, curAnimation?.data.animations[0].name);
        const action = mixer?.clipAction(clip);
        // action.play();

        mixers.push(mixer);
      });
    }

    return () => {
      mixers.forEach((m) => m.stopAllAction());
    };
  }, [curAnimation, curBody]);

  // Add the collider shape for the character
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [0.2, 0.3, 0.2],
  }));

  useFrame((_, delta) => {
    if (curBody && mixers.length === Object.keys(curBody).length) mixers.forEach((m) => m.update(delta));
    if (inuRef.current) {
      changeCharacterState(delta, inuRef.current, api);

      api.position.set(inuRef.current.position.x, inuRef.current.position.y + 0.2, inuRef.current.position.z);

      if (!thirdPerson) {
        updateCameraTarget(delta, inuRef.current);
        return;
      }
      if (!pointerRef.current || !pointerRef.current?.isLocked) return;
      const frontVector = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
      const sideVector = new Vector3(-1, 0, 0).applyQuaternion(camera.quaternion).normalize();
      const moveDirection = new Vector3();
      const { forward, backward, left, right } = getKeys();
      if (forward) moveDirection.add(frontVector);
      if (backward) moveDirection.add(frontVector);
      if (left) moveDirection.add(sideVector);
      if (right) moveDirection.add(sideVector);
      if (moveDirection.length() > 0) {
        moveDirection.normalize().multiplyScalar(2);
        camera.position.add(moveDirection.multiplyScalar(0.5));
      }
    }
  });

  // Controls panel
  useControls({
    Body_Parts: folder({
      head: {
        value: "head_1",
        options: Object.keys(dummyData.head),
        onChange: (v) => {
          selectBodyParts("head", v);
        },
      },
      cloth: {
        value: "cloth_1",
        options: Object.keys(dummyData.cloth),
        onChange: (v) => {
          selectBodyParts("cloth", v);
        },
      },
      hands: {
        value: "hands_1",
        options: Object.keys(dummyData.hands),
        onChange: (v) => {
          selectBodyParts("hands", v);
        },
      },
      pants: {
        value: "pants_1",
        options: Object.keys(dummyData.pants),
        onChange: (v) => {
          selectBodyParts("pants", v);
        },
      },
      shoes: {
        value: "shoes_1",
        options: Object.keys(dummyData.shoes),
        onChange: (v) => {
          selectBodyParts("shoes", v);
        },
      },
    }),
    Animations: {
      value: "mixamo.com",
      options: Object.keys(dummyAnimationData),
      onChange: (v) => {
        selectAnimation(v);
      },
    },
  });
  return (
    <>
      <color attach="background" args={["#E6E6FA"]} />
      {thirdPerson ? (
        <PointerLockControls ref={pointerRef} />
      ) : (
        <OrbitControls ref={orbitControlsRef} enablePan={false} />
      )}
      <Environment preset="forest" />
      <group>
        <Track />
        <Ground />
      </group>
      <group scale={0.002} ref={inuRef}>
        <mesh ref={ref as any} />
        <InuPart data={curBody?.head} />
        <InuPart data={curBody?.hands} />
        <InuPart data={curBody?.pants} />
        <InuPart data={curBody?.cloth} />
        <InuPart data={curBody?.shoes} />
      </group>
    </>
  );
};

export default DemoInuPage;
