import { useKeyboardControls } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Quaternion, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export const dummyAnimationData = {
  "mixamo.com": "/models/inu/ani_mixamo.fbx",
  "mixamo2.com": "/models/inu/ani_mixamo2.fbx",
};

type AnimationKeysType = keyof typeof dummyAnimationData;

const loaderFBX = new FBXLoader();

const useAnimation = (rigidBodyRef: any) => {
  const [curAnimation, setCurAnimation] = useState<{ name: string; data: Group }>();
  const animationsPool = useRef<any>({});
  const [_, getKeys] = useKeyboardControls();

  // For character state
  const velocity = new Vector3(0, 0, 0);
  const acceleration = new Vector3(0.125, 60.0, 20.0);
  const decceleration = new Vector3(-0.0005, -8.0, -5.0);

  // =======================

  const isLoadedAnimation = (type: AnimationKeysType) => {
    return type in animationsPool.current;
  };

  const animationOnLoad = (type: string, data: Group) => {
    setCurAnimation({
      name: type,
      data,
    });
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

  // movement
  const changeCharacterState = (delta: number, character: Group) => {
    const { backward, leftward, rightward, forward, jump, run } = getKeys();

    const newVelocity = velocity;
    const frameDecceleration = new Vector3(
      newVelocity.x * decceleration.x,
      newVelocity.y * decceleration.y,
      newVelocity.z * decceleration.z
    );
    frameDecceleration.multiplyScalar(delta);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z));

    newVelocity.add(frameDecceleration);

    const controlObject = character;
    const _Q = new Quaternion();
    const _A = new Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = acceleration.clone();
    if (run) {
      acc.multiplyScalar(2.0);
    }

    if (forward) {
      newVelocity.z += acc.z * delta;
    }
    if (backward) {
      newVelocity.z -= acc.z * delta;
    }
    if (jump) {
      // newVelocity.y += acc.y * delta;
      console.log("click");
      rigidBodyRef.applyImpulse({ x: 0, y: 2, z: 0 });
    }
    if (leftward) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.x);
      _R.multiply(_Q);
    }
    if (rightward) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.x);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new Vector3();
    oldPosition.copy(controlObject.position);

    const moveForward = new Vector3(0, 0, 1);
    moveForward.applyQuaternion(controlObject.quaternion);
    moveForward.normalize();

    const sideways = new Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    const jumpUp = new Vector3(0, 1, 0);
    jumpUp.applyQuaternion(controlObject.quaternion);
    jumpUp.normalize();

    sideways.multiplyScalar(newVelocity.x * delta);
    moveForward.multiplyScalar(newVelocity.z * delta);
    jumpUp.multiplyScalar(newVelocity.y * delta);

    controlObject.position.add(moveForward);
    controlObject.position.add(sideways);
    controlObject.position.add(jumpUp);

    character.position.copy(controlObject.position);
  };

  return {
    curAnimation,
    selectAnimation,
    changeCharacterState,
  };
};

export default useAnimation;
