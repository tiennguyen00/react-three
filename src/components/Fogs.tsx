import { useControls } from "leva";
import React from "react";

const Fogs = () => {
  const { backgroundColor, range } = useControls({
    backgroundColor: {
      value: "#ff9f91",
    },
    range: { value: [0.5, 25], min: 0, max: 30 },
  });
  return (
    <>
      <color args={[backgroundColor]} attach="background" />
      <fog attach="fog" color={backgroundColor} near={range[0]} far={range[1]} />
    </>
  );
};

export default Fogs;
