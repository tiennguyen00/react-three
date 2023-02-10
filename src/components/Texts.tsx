import { useThree } from "@react-three/fiber";
import { Center, Text } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0x1b3984),
  toneMapped: false,
});

const Texts = () => {
  const {
    size: { width, height },
  } = useThree();
  const ratio = width / height;
  const scale = Math.min(1, ratio);

  return (
    <group position-y={1.5} scale={[scale, scale, scale]}>
      <Text
        font="./fonts/GreycliffCF-Heavy.woff"
        fontSize={1}
        rotation-y={Math.PI * 0.5}
        textAlign="center"
        material={material}
      >
        Hello
      </Text>

      <Text
        font="./fonts/GreycliffCF-Heavy.woff"
        fontSize={0.5}
        rotation-y={Math.PI * 0.5}
        position-y={-1.5}
        textAlign="center"
        material={material}
      >
        I am a programmer
      </Text>

      <Text
        font="./fonts/GreycliffCF-Heavy.woff"
        fontSize={1}
        rotation-y={Math.PI * 0.5}
        position-y={-3}
        textAlign="center"
        material={material}
        onClick={() => {
          window.open("https://threejs-journey.com/join/2022XMAS", "_blank");
        }}
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "default";
        }}
      >
        I have no life
      </Text>
    </group>
  );
};

export default Texts;
