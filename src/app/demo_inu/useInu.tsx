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
    head_2: "/models/inu/accessory.gltf",
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

export const dummyAnimationData = {
  animation_0: "/models/inu/anim_bone.gltf",
};

type AnimationKeysType = keyof typeof dummyAnimationData;

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

const useInu = () => {
  const [curModel, setCurModel] = useState<Record<string, GLTF>>();
  const [curAnimation, setCurAnimation] = useState<{ data: GLTF }>();

  const bodyPartsPool = useRef<any>({
    head: { name: null, data: null },
    cloth: { name: null, data: null },
    hands: { name: null, data: null },
    shoes: { name: null, data: null },
    pants: { name: null, data: null },
  });

  const animationPool = useRef<any>({});

  const isLoaded = (type: KeysType, value: string) => {
    return value in bodyPartsPool.current[type];
  };
  const isLoadedAnimation = (type: AnimationKeysType) => {
    return type in bodyPartsPool.current;
  };

  const partOnLoad = (type: KeysType, data: GLTF) => {
    setCurModel((prev) => ({
      ...prev,
      [type]: data,
    }));
  };

  const animationOnLoad = (data: GLTF) => {
    setCurAnimation({
      data,
    });
  };

  const selectBodyParts = (type: KeysType, value: string) => {
    const uri = dummyData[type][value];

    if (isLoaded(type, value)) {
      console.log("Same load ");
      partOnLoad(type, bodyPartsPool.current[type][value].data);
    } else {
      try {
        const startTime = performance.now();
        loader.load(
          uri,
          (gltf) => {
            bodyPartsPool.current[type][value] = {
              name: value,
              data: gltf,
            };

            partOnLoad(type, gltf);

            const endTime = performance.now();
            const loadTime = (endTime - startTime) / 1000;
            console.log(`Model ${value} loaded in ${loadTime.toFixed(2)} seconds.`);
          },
          undefined,
          (err) => {
            console.error(err);
          }
        );
      } catch (err) {
        console.error("Something went wrong while load model: ", err);
      }
    }
  };

  const selectAnimation = (type: AnimationKeysType) => {
    const uri = dummyAnimationData[type];
    if (isLoadedAnimation(type)) {
      console.log("Same load ");
      animationOnLoad(animationPool.current[type]);
    } else {
      try {
        const startTime = performance.now();
        loader.load(
          uri,
          (gltf) => {
            animationPool.current[type] = gltf;

            animationOnLoad(gltf);

            const endTime = performance.now();
            const loadTime = (endTime - startTime) / 1000;
            console.log(`Model ${type} loaded in ${loadTime.toFixed(2)} seconds.`);
          },
          undefined,
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
    curAnimation,
    selectAnimation,
  };
};

export default useInu;
