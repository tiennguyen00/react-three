import React, { useLayoutEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import * as THREE from "three";
import { usePlane } from "@react-three/cannon";

const Ground: React.FC = () => {
  const noise2D = createNoise2D();

  const terrain = useRef<THREE.PlaneGeometry>(null!);

  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  // useLayoutEffect(() => {
  //   const pos = terrain.current.getAttribute('position');
  //   const pa = pos.array;

  //   const hVerts = terrain.current.parameters.heightSegments + 1;
  //   const wVerts = terrain.current.parameters.widthSegments + 1;

  //   for (let j = 0; j < hVerts; j++) {
  //     for (let i = 0; i < wVerts; i++) {
  //       const ex = Math.random() * 1.3;
  //       pa[3 * (j * wVerts + i) + 2] =
  //         (noise2D(i / 100, j / 100) +
  //           noise2D((i + 200) / 100, j / 50) * Math.pow(ex, 1) +
  //           noise2D((i + 400) / 50, j / 25) * Math.pow(ex, 2) +
  //           noise2D((i + 600) / 25, j / 12.5) * Math.pow(ex, 3) +
  //           +(noise2D((i + 800) / 6.25, j / 6.25) * Math.pow(ex, 4))) /
  //         2;
  //     }
  //   }

  //   pos.needsUpdate = true;

  //   terrain.current.computeVertexNormals();
  // });

  return (
    <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry attach="geometry" args={[1000, 1000, 250, 250]} ref={terrain} />

      <meshPhongMaterial attach="material" color="#69b581" />
    </mesh>
  );
};

export default Ground;
