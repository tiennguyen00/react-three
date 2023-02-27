"use client";
import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import React from "react";
import { sRGBEncoding } from "three";

const DemoPerrySmith = () => {
  const smithModel = useGLTF("/models/LeePerrySmith/LeePerrySmith.glb");
  const mapTexture = useTexture("/models/LeePerrySmith/color.jpg");
  mapTexture.encoding = sRGBEncoding;

  const normalTexture = useTexture("/models/LeePerrySmith/normal.jpg");

  console.log(mapTexture, normalTexture);

  return (
    <>
      <color attach="background" args={["#E6E6FA"]} />
      <OrbitControls />
      <Environment preset="city" />

      <primitive object={smithModel.scene}>
        <meshStandardMaterial attach="material" map={mapTexture} normalMap={normalTexture} />
      </primitive>
    </>
  );
};

export default DemoPerrySmith;
