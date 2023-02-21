"use client";
import Mixamo from "@/components/models/Mixamo";
import { OrbitControls } from "@react-three/drei";
import React from "react";

const DemoMixamoPage = () => {
  return (
    <>
      <color attach="background" args={["#E6E6FA"]} />
      <OrbitControls />
      <Mixamo />
    </>
  );
};

export default DemoMixamoPage;
