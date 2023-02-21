"use client";
import useInu, { dummyData } from "@/app/demo_inu/useInu";
import Inu from "@/components/models/Inu";
import { OrbitControls, Environment } from "@react-three/drei";
import { useControls, folder } from "leva";
import { useEffect } from "react";

const DemoInuPage = () => {
  const options = useControls({
    Body_Parts: folder({
      head: {
        value: "head_1",
        options: Object.keys(dummyData.head),
      },
      cloth: {
        value: "cloth_1",
        options: Object.keys(dummyData.cloth),
      },
      hands: {
        value: "hands_1",
        options: Object.keys(dummyData.hands),
      },
      pants: {
        value: "pants_1",
        options: Object.keys(dummyData.pants),
      },
      shoes: {
        value: "shoes_1",
        options: Object.keys(dummyData.shoes),
      },
    }),
  });
  const { selectBodyParts, curModel } = useInu();

  useEffect(() => {
    selectBodyParts("head", options.head);
    selectBodyParts("hands", options.hands);
    selectBodyParts("pants", options.pants);
    selectBodyParts("shoes", options.shoes);
    selectBodyParts("cloth", options.cloth);
  }, [options]);

  // const mixers: any = [];

  // useEffect(() => {
  //   if (models.length) {
  //     models.map((model, i) => {
  //       const mixer = new AnimationMixer(model.scene);
  //       const clip = AnimationClip.findByName(models[i].animations, "animation_0");
  //       const action = mixer.clipAction(clip);
  //       action?.play();
  //       mixers.push(mixer);
  //     });
  //   }
  // }, [models]);

  // useFrame((_, delta) => {
  //   mixers.forEach((m: any) => {
  //     m.update(delta);
  //   });
  // });

  return (
    <>
      <color attach="background" args={["#E6E6FA"]} />
      <OrbitControls />
      <Environment preset="forest" />
      <group>
        <Inu data={curModel?.head as any} />
        <Inu data={curModel?.hands as any} />
        <Inu data={curModel?.pants as any} />
        <Inu data={curModel?.cloth as any} />
        <Inu data={curModel?.shoes as any} />
      </group>
    </>
  );
};

export default DemoInuPage;
