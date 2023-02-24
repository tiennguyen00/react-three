import { useEffect } from "react";
import { Mesh } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const InuPart = ({ data }: { data: GLTF | undefined }) => {
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
            } else mesh.material.dispose();
          }
        });

        data.scene.parent?.remove(data.scene);
        data.scene.remove();
      }
    };
  }, [data]);

  return <primitive object={data?.scene ?? {}} />;
};

export default InuPart;
