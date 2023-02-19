import { folder, useControls } from "leva";
import React from "react";
import { Gradient } from "../shared";

const World = () => {
  const options = useControls("World", {
    gradient: folder({
      startColor: {
        value: "#ff0000",
      },
      endColor: {
        value: "#0000ff",
      },
    }),
  });

  return (
    <>
      <Gradient options={options} />
    </>
  );
};

export default World;
