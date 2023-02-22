"use client";
import useInu, { dummyData, dummyAnimationData } from "@/app/demo_inu/useInu";
import Inu from "@/components/models/Inu";
import { OrbitControls, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";
import { useEffect } from "react";
import { AnimationClip, AnimationMixer } from "three";

const DemoInuPage = () => {
  const { selectBodyParts, curModel, selectAnimation, curAnimation } = useInu();
  const mixers: any[] = [];

  useEffect(() => {
    if (curModel && curAnimation) {
      const models = [curModel["head"], curModel["cloth"], curModel["hands"], curModel["pants"], curModel["shoes"]];
      models.forEach((m) => {
        if (m) {
          const mixer = new AnimationMixer(m?.scene);
          const clip = AnimationClip.findByName(curAnimation?.data.animations, "animation_0");
          const action = mixer?.clipAction(clip);
          action.play();

          mixers.push(mixer);
        }
      });
    }

    return () => {
      mixers.forEach((m) => m.stopAllAction());
    };
  }, [curAnimation, curModel]);

  useFrame((_, delta) => {
    if (mixers) mixers.forEach((m) => m.update(delta));
  });

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
      value: "animation_0",
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
        <Inu data={curModel?.head as any} />
        <Inu data={curModel?.hands as any} />
        <Inu data={curModel?.pants as any} />
        <Inu data={curModel?.cloth as any} />
        <Inu data={curModel?.shoes as any} />
      </group>
    </>
  );
};

export default DemoInuPage;
