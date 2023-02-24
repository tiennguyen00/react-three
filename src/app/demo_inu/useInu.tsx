import { useRef, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Group } from "three";

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
  "mixamo.com": "/models/inu/ani_mixamo.fbx",
  "mixamo2.com": "/models/inu/ani_mixamo2.fbx",
};

type AnimationKeysType = keyof typeof dummyAnimationData;

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);

const loaderFBX = new FBXLoader();

const useInu = () => {
  const [curBody, setCurBody] = useState<Record<string, GLTF>>();
  const [curAnimation, setCurAnimation] = useState<{ name: string; data: Group }>();

  const bodyPartsPool = useRef<any>({
    head: { name: null, data: null },
    cloth: { name: null, data: null },
    hands: { name: null, data: null },
    shoes: { name: null, data: null },
    pants: { name: null, data: null },
  });

  const animationsPool = useRef<any>({});

  const isLoadedBody = (type: KeysType, value: string) => {
    return value in bodyPartsPool.current[type];
  };
  const isLoadedAnimation = (type: AnimationKeysType) => {
    return type in animationsPool.current;
  };

  const partOnLoad = (type: KeysType, data: GLTF) => {
    setCurBody((prev) => ({
      ...prev,
      [type]: data,
    }));
  };

  const animationOnLoad = (type: string, data: Group) => {
    setCurAnimation({
      name: type,
      data,
    });
  };

  const selectBodyParts = (type: KeysType, value: string) => {
    const uri = dummyData[type][value];

    if (isLoadedBody(type, value)) {
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
      console.log("Same load animation");
      animationOnLoad(type, animationsPool.current[type]);
    } else {
      try {
        const startTime = performance.now();
        loaderFBX.load(
          uri,
          (fbx) => {
            animationsPool.current[type] = fbx;

            animationOnLoad(type, fbx);

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
    curBody,
    curAnimation,
    selectAnimation,
  };
};

export default useInu;
