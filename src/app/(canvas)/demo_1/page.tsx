"use client";

import { Environment, OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { AnimationMixer } from "three";

const Demo1 = () => {
  const LittlesTokyo = useGLTF("/models/LittlestTokyo.glb");
  const modelAnim = useAnimations(LittlesTokyo.animations);
  const mixer = new AnimationMixer(LittlesTokyo.scene);
  const actions: any = [];

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  useEffect(() => {
    modelAnim.clips.forEach((clip) => {
      actions[clip.name] = mixer.clipAction(clip);
    });
    actions["Take 001"].play();
  }, []);

  return (
    <>
      <color attach="background" args={["#Affb8d"]} />
      <OrbitControls />
      <Environment preset="forest" />

      <primitive object={LittlesTokyo.scene} scale={0.01} position={[1, 1, 0]} />
    </>
  );
};

export default Demo1;
