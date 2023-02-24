"use client";
import InuPart from "@/components/models/Inu";
import useAnimation, { dummyAnimationData } from "@/hooks/inu/useAnimation";
import useCamera from "@/hooks/inu/useCamera";
import useModel, { dummyData } from "@/hooks/inu/useModel";
import { OrbitControls, Environment, Plane } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls, folder } from "leva";
import { useEffect, useRef } from "react";
import { AnimationClip, AnimationMixer, Group } from "three";

const DemoInuPage = () => {
  const inuRef = useRef<Group>(null);
  const { camera } = useThree();
  const { selectBodyParts, curBody } = useModel();
  const { selectAnimation, curAnimation, changeCharacterState } = useAnimation();
  const { updateCameraTarget } = useCamera(camera);

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

  useFrame((_, delta) => {
    if (curBody && mixers.length === Object.keys(curBody).length) mixers.forEach((m) => m.update(delta));
    if (inuRef.current) {
      changeCharacterState(delta, inuRef.current);
      updateCameraTarget(delta, inuRef.current);
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
      <OrbitControls />
      <Environment preset="forest" />
      <Plane rotation={[(-Math.PI * 1) / 2, 0, 0]} args={[10, 10]}>
        <meshStandardMaterial color="blue" />
      </Plane>
      <group scale={0.01} ref={inuRef}>
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
