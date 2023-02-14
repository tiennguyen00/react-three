"use client";
import { Environment, OrbitControls } from "@react-three/drei";
import React, { Suspense } from "react";
import { useControls } from "leva";
import { PresetsType } from "@react-three/drei/helpers/environment-assets";
import { enviromentPreset } from "@/constants";
import Texts from "./Texts";
import { Perf } from "r3f-perf";
import Lights from "./Lights";
import Fogs from "./Fogs";
import { Debug, Physics } from "@react-three/rapier";
import Balls from "./Balls";

const Container = () => {
  const { enviroment } = useControls({
    enviroment: {
      value: "sunset",
      options: enviromentPreset,
    },
  });
  return (
    <>
      <Perf position="top-left" />
      <Lights />
      <Fogs />
      <Environment background resolution={512} preset={enviroment as PresetsType} />
      <OrbitControls />

      <Suspense>
        <Physics gravity={[0, 0, 0]}>
          <Debug />
          <Balls />
        </Physics>
      </Suspense>
    </>
  );
};

export default Container;
