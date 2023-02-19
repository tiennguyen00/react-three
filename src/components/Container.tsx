"use client";
import { OrbitControls } from "@react-three/drei";
import React, { Suspense } from "react";
import { enviromentPreset } from "@/constants";
import { Perf } from "r3f-perf";
import { Debug, Physics } from "@react-three/rapier";
import { Balls, Fogs, Lights } from "./shared";
import World from "./enviroment/World";

const Container = () => {
  return (
    <>
      <Perf position="top-left" />
      <Lights />
      <Fogs />
      <World />
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
