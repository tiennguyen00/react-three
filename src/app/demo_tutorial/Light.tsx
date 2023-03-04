import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";

const Light = () => {
  const hemisphereRef = useRef<THREE.HemisphereLight>(null);
  const directionRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (hemisphereRef.current) {
      hemisphereRef.current.color.setHSL(0.6, 1, 0.6);
      hemisphereRef.current.groundColor.setHSL(0.095, 1, 0.75);
    }
    if (directionRef.current) {
      directionRef.current.position.set(-100, 100, 100);
      directionRef.current.target.position.set(0, 0, 0);
      directionRef.current.castShadow = true;
      directionRef.current.shadow.bias = -0.001;
      directionRef.current.shadow.mapSize.width = 2048;
      directionRef.current.shadow.mapSize.height = 2048;
      directionRef.current.shadow.camera.near = 0.5;
      directionRef.current.shadow.camera.far = 500.0;
      directionRef.current.shadow.camera.left = 300;
      directionRef.current.shadow.camera.right = -300;
      directionRef.current.shadow.camera.top = 300;
      directionRef.current.shadow.camera.bottom = -300;
    }
  }, []);

  // useHelper(!!directionRef ? (directionRef as any) : undefined, THREE.DirectionalLightHelper);

  return (
    <>
      <hemisphereLight ref={hemisphereRef} args={[0xffffff, 0xfffffff, 0.6]} />
      <directionalLight ref={directionRef} args={[0xffffff, 1.0]} />
      <ambientLight intensity={0.1} />
    </>
  );
};

export default Light;
