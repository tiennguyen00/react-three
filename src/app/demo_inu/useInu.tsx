import { useRef, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface BodyPartsType {
  head: Record<string, string>;
  cloth: Record<string, string>;
  hands: Record<string, string>;
  shoes: Record<string, string>;
  pants: Record<string, string>;
}
type KeysType = keyof BodyPartsType;

export const dummyData: BodyPartsType = {
  head: {
    head_1: "/models/inu/head.gltf",
    ball: "/models/football/scene.gltf",
  },
  cloth: {
    cloth_1: "/models/inu/cloth.gltf",
  },
  hands: {
    hands_1: "/models/inu/hands.gltf",
  },
  shoes: {
    shoes_1: "/models/inu/shoes.gltf",
  },
  pants: {
    pants_1: "/models/inu/pants.gltf",
  },
};

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

const useInu = () => {
  const [curModel, setCurModel] = useState<Record<string, GLTF>>();
  const bodyPartsPool = useRef<any>({
    head: { name: null, data: null },
    cloth: { name: null, data: null },
    hands: { name: null, data: null },
    shoes: { name: null, data: null },
    pants: { name: null, data: null },
  });

  const isLoaded = (type: KeysType, value: string) => {
    return value in bodyPartsPool.current[type];
  };

  const partOnLoad = (type: KeysType, value: string, data: GLTF) => {
    setCurModel((prev) => ({
      ...prev,
      [type]: data,
    }));
  };

  const selectBodyParts = (type: KeysType, value: string) => {
    const uri = dummyData[type][value];
    console.log("link GLTF: ", uri);

    if (isLoaded(type, value)) {
      console.log("Same load: ");
      partOnLoad(type, value, bodyPartsPool.current[type][value].data);
    } else {
      try {
        loader.load(
          uri,
          (gltf) => {
            bodyPartsPool.current[type][value] = {
              name: value,
              data: gltf,
            };

            partOnLoad(type, value, gltf);
            console.log("Load successfully: ", value);
          },
          (xhr) => {
            console.warn("Loading: ", xhr.loaded);
          },
          (err) => {
            console.error(err);
          }
        );
      } catch (err) {
        console.error("Something went wrong while load model: ", err);
      }
    }
  };

  return {
    bodyPartsPool,
    selectBodyParts,
    curModel,
  };
};

export default useInu;
