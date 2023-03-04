"use client";

import World from "@/components/enviroment/World";
import { OrbitControls } from "@react-three/drei";

const SelectChar = () => {
  return (
    <>
      <OrbitControls />

      {/* The enviroment */}
      <World />
    </>
  );
};

export default SelectChar;
