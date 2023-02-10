"use client";
import { Environment, OrbitControls } from "@react-three/drei";
import React from "react";
import { useControls } from "leva";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import { enviromentPreset } from "@/constants";
import Texts from "./Texts";
import Lights from "./Lights";

const Container = () => {
  const { enviroment } = useControls({
    enviroment: {
      value: "sunset",
      options: enviromentPreset,
    },
  });
  return (
    <>
      <Lights />
      <Environment background resolution={512} preset={enviroment as PresetsType} />
      <OrbitControls />
      <Texts />
    </>
  );
};

export default Container;
