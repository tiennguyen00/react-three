import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const Inu = ({ data }: { data: GLTF }) => {
  useEffect(() => {
    return () => {
      // Clean up model
      if (data) {
        data.scene.traverse((child) => {
          if ((child as Mesh).isMesh) {
            const mesh = child as Mesh;

            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((e) => {
                e.dispose();
              });
            } else mesh.geometry.dispose();
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
