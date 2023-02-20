"use client";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { AnimationClip, AnimationMixer } from "three";

const DemoInuPage = () => {
  const models = useGLTF([
    "/models/inu/head.gltf",
    "/models/inu/cloth.gltf",
    "/models/inu/hands.gltf",
    "/models/inu/shoes.gltf",
    "/models/inu/pants.gltf",
  ]);
  const mixers: any = [];

  useEffect(() => {
    if (models.length) {
      models.map((model, i) => {
        const mixer = new AnimationMixer(model.scene);
        const clip = AnimationClip.findByName(models[i].animations, "animation_0");
        const action = mixer.clipAction(clip);
        action?.play();
        mixers.push(mixer);
      });
    }
  }, [models]);

  useFrame((_, delta) => {
    mixers.forEach((m: any) => {
      m.update(delta);
    });
  });

  return (
    <>
      <color attach="background" args={["#Affb8d"]} />
      <OrbitControls />
      <Environment preset="forest" />
      <group>
        {models.map((m, i) => (
          <primitive key={i} object={m.scene} scale={0.01} />
        ))}
      </group>
    </>
  );
};

export default DemoInuPage;
