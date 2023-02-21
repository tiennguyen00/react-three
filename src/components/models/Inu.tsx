import { useEffect, useRef } from "react";
import { Group } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const Inu = ({ data }: { data: GLTF }) => {
  console.log(data);
  useEffect(() => {
    return () => {
      // Clean up model
      if (data) {
        data.scene.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
        data.scene.remove();
      }
    };
  }, [data]);

  return (
    <group scale={0.01}>
      <primitive object={data?.scene ?? {}} />
    </group>
  );
};

export default Inu;
