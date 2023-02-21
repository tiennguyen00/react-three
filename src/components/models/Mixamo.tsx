"use client";
import { dummyData, useViewer } from "@/hooks/mixamo";
import { folder, useControls } from "leva";
import React, { useEffect } from "react";

const Mixamo = () => {
  const { selectBodyParts } = useViewer();
  const options = useControls({
    Body_Parts: folder({
      hair: {
        value: "maid",
        options: Object.keys(dummyData.hair),
      },
      clothes: {
        value: "maid_dress",
        options: Object.keys(dummyData.clothes),
      },
      face: {
        value: "saber",
        options: Object.keys(dummyData.face),
      },
    }),
  });

  useEffect(() => {
    selectBodyParts("hair", options.hair);
  }, [options.hair]);
  return <></>;
};
export default Mixamo;
