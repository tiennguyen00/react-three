import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface BodyPartsType {
  clothes: Record<string, string>;
  hair: Record<string, string>;
  face: Record<string, string>;
  instrument: Record<string, string>;
}
type KeysType = keyof BodyPartsType;

export const dummyData: BodyPartsType = {
  clothes: {
    maid_dress: "models/mixamo/saber-dress-mixamo/saber-dress.gltf",
    suit: "models/mixamo/saber-suit/saber-suit.gltf",
  },
  hair: {
    maid: "models/mixamo/saber-maid-hair-mixamo/saber-maid-hair.gltf",
    lily: "models/mixamo/saber-lily-hair-sub-skeleton/saber-lily-hair-sub-skeleton.gltf",
  },
  face: {
    saber: "models/mixamo/saber-face/saber-face.gltf",
    eriri: "models/mixamo/saber-face/eriri-face-test.gltf",
  },

  instrument: {},
};

const useMixamo = () => {
  const accessories = useRef<any>({
    clothes: {},
    hair: {},
    face: {},
    instrument: {},
  });

  const curAccessories = useRef<Record<string, { name: string | null; gltf: GLTF | null }>>({
    clothes: {
      name: null,
      gltf: null,
    },
    hair: { name: null, gltf: null },
    face: { name: null, gltf: null },
    instrument: { name: null, gltf: null },
  });

  const isLoaded = (key: KeysType, value: string) => {
    return value in accessories.current[key];
  };

  return {
    isLoaded,
    accessories,
    curAccessories,
  };
};

const useViewer = () => {
  const { scene } = useThree();
  const [skeletonMixer, setSkeletonMixer] = useState(null);
  const [skinMixer, setSkinMixer] = useState([]);
  const { isLoaded, curAccessories, accessories } = useMixamo();

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
  loader.setDRACOLoader(dracoLoader);

  const partOnLoad = (key: KeysType, value: string, data?: any) => {
    const cur = curAccessories.current[key];
    console.log(cur, accessories);
    if (value === cur.name) {
      console.log("Same load: ", value, cur.name);
      return;
    }

    // remove current replaced
    if (cur.gltf?.scene) {
      cur.gltf.scene.parent?.remove(cur.gltf.scene);
      if (cur.gltf.scene.children) {
        console.log("Has attach child (sub skeleton or rigid bind)");
        // cur.scene.parent?.remove(cur.scene.children)
      }
    }

    // update current new part file
  };

  const selectBodyParts = (key: KeysType, value: string, uri?: string) => {
    if (!uri) uri = dummyData[key][value];
    if (isLoaded(key, value)) {
      partOnLoad(key, value);
    } else {
      loader.load(
        uri,
        (gltf) => {
          accessories.current[key][value] = {
            gltf,
          };
          partOnLoad(key, value, gltf);
          console.log("Load successfully: ", value);
        },
        (xhr) => {
          console.warn("Loading: ", xhr.loaded);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  const cleanUp = () => {
    if (skeletonMixer) {
      (skeletonMixer as any).stopAllAction();
      setSkeletonMixer(null);
    }
    if (skinMixer) {
      skinMixer.forEach((i) => (i as any).stopAllAction());
      setSkinMixer([]);
    }
    if (scene) {
      scene.children.forEach((i) => scene.remove(i));
    }
  };

  return {
    cleanUp,
    selectBodyParts,
  };
};

export { useMixamo, useViewer };
