import React, { useRef } from "react";
import vertex from "raw-loader!@/glsl/gradient/vertex.glsl";
import fragment from "raw-loader!@/glsl/gradient/fragment.glsl";
import { Color } from "three";
import { extend, MaterialNode } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const GradientMaterial = shaderMaterial(
  {
    uStartColor: new Color("#ff0000"),
    uEndColor: new Color("#0000ff"),
  },
  vertex,
  fragment
);

extend({ GradientMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    gradientMaterial: MaterialNode<any, typeof GradientMaterial>;
  }
}

const Gradient = ({ options }: any) => {
  const gradientRef = useRef(null);

  return (
    <>
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[2, 2, 1, 1]} />
        <gradientMaterial
          ref={gradientRef}
          uStartColor={new Color(options.startColor)}
          uEndColor={new Color(options.endColor)}
        />
      </mesh>
    </>
  );
};

export { Gradient };
``;
