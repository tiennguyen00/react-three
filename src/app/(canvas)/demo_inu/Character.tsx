import InuPart from "@/components/models/Inu";
import useAnimation, { dummyAnimationData } from "@/hooks/inu/useAnimation";
import useModel, { dummyData } from "@/hooks/inu/useModel";
import { Quad, Triplet, useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import React, { useEffect, useMemo, useRef } from "react";
import { AnimationClip, AnimationMixer, Quaternion, Vector3 } from "three";

interface CharacterProps {
  characterRef: React.MutableRefObject<any>;
  updateCameraTarget: (v: any, x: any, t: any) => void;
  thirdPerson: boolean;
}
const Character = ({ characterRef, thirdPerson, updateCameraTarget }: CharacterProps) => {
  const { selectBodyParts, curBody } = useModel();
  const mixers: AnimationMixer[] = useMemo(() => [], []);
  const { selectAnimation, curAnimation, changeCharacterState } = useAnimation();
  const posCollider = useRef<Triplet>();
  const quaCollider = useRef<Quad>();
  const rolCollider = useRef<Triplet>();

  // Add the collider shape for the character
  const [refCollider, apiCollider] = useBox(() => ({
    args: [0.25, 0.25, 0.25],
    type: "Dynamic",
    mass: 150,
    fixedRotation: true,
  }));

  useEffect(() => {
    apiCollider.position.subscribe((v) => {
      posCollider.current = v;
    });
    apiCollider.quaternion.subscribe((v) => {
      quaCollider.current = v;
    });
    apiCollider.rotation.subscribe((v) => {
      rolCollider.current = v;
    });
  }, []);

  useFrame((_, delta) => {
    if (!characterRef.current) return;
    if (!thirdPerson && posCollider.current && quaCollider.current) {
      updateCameraTarget(delta, posCollider.current, quaCollider.current);
    }
    if (curBody && mixers.length === Object.keys(curBody).length) mixers.forEach((m) => m.update(delta));

    // Moving the collider
    if (refCollider.current && posCollider.current && quaCollider.current && rolCollider.current) {
      changeCharacterState(delta, refCollider.current, apiCollider, posCollider.current, rolCollider.current);

      // Try to update the character pos following to the refCollider
      characterRef.current.position.copy(
        new Vector3(posCollider.current?.[0], posCollider.current?.[1] - 0.12, posCollider.current?.[2])
      );

      characterRef.current.quaternion.copy(new Quaternion().fromArray(quaCollider.current));
    }
  });

  useEffect(() => {
    if (curBody && curAnimation) {
      const models = Object.keys(curBody).map((i) => curBody[i]);
      models.forEach((m) => {
        const mixer = new AnimationMixer(m?.scene);
        const clip = AnimationClip.findByName(curAnimation?.data.animations, curAnimation?.data.animations[0].name);
        const action = mixer?.clipAction(clip);
        // action.play();

        mixers.push(mixer);
      });
    }

    return () => {
      mixers.forEach((m) => m.stopAllAction());
    };
  }, [curAnimation, curBody, mixers]);

  // Controls panel
  useControls({
    Body_Parts: folder({
      head: {
        value: "head_1",
        options: Object.keys(dummyData.head),
        onChange: (v) => {
          selectBodyParts("head", v);
        },
      },
      cloth: {
        value: "cloth_1",
        options: Object.keys(dummyData.cloth),
        onChange: (v) => {
          selectBodyParts("cloth", v);
        },
      },
      hands: {
        value: "hands_1",
        options: Object.keys(dummyData.hands),
        onChange: (v) => {
          selectBodyParts("hands", v);
        },
      },
      pants: {
        value: "pants_1",
        options: Object.keys(dummyData.pants),
        onChange: (v) => {
          selectBodyParts("pants", v);
        },
      },
      shoes: {
        value: "shoes_1",
        options: Object.keys(dummyData.shoes),
        onChange: (v) => {
          selectBodyParts("shoes", v);
        },
      },
    }),
    Animations: {
      value: "mixamo.com",
      options: Object.keys(dummyAnimationData),
      onChange: (v) => {
        selectAnimation(v);
      },
    },
  });
  return (
    <group scale={0.002} ref={characterRef}>
      <mesh ref={refCollider as any} />
      <InuPart data={curBody?.head} />
      <InuPart data={curBody?.hands} />
      <InuPart data={curBody?.pants} />
      <InuPart data={curBody?.cloth} />
      <InuPart data={curBody?.shoes} />
    </group>
  );
};

export default Character;
