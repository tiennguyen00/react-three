"use client";
import useInu, { dummyData, dummyAnimationData } from "@/app/demo_inu/useInu";
import InuPart from "@/components/models/Inu";
import { OrbitControls, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";
import { useEffect } from "react";
import { AnimationClip, AnimationMixer } from "three";

const DemoInuPage = () => {
  const { selectBodyParts, curBody, selectAnimation, curAnimation } = useInu();
  const mixers: AnimationMixer[] = [];

  useEffect(() => {
    if (curBody && curAnimation) {
      const models = Object.keys(curBody).map((i) => curBody[i]);
      models.forEach((m) => {
        const mixer = new AnimationMixer(m?.scene);
        const clip = AnimationClip.findByName(curAnimation?.data.animations, curAnimation?.data.animations[0].name);
        const action = mixer?.clipAction(clip);
        action.play();

        mixers.push(mixer);
      });
    }

    return () => {
      mixers.forEach((m) => m.stopAllAction());
    };
  }, [curAnimation, curBody]);

  useFrame((_, delta) => {
    if (curBody && mixers.length === Object.keys(curBody).length) mixers.forEach((m) => m.update(delta));
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
      <group scale={0.01}>
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
