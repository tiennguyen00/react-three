import { PublicApi, Triplet } from "@react-three/cannon";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { Group, Object3D, Quaternion, Vector3, Event, Euler, Matrix4 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export const dummyAnimationData = {
  "mixamo.com": "/models/inu/ani_mixamo.fbx",
  "mixamo2.com": "/models/inu/ani_mixamo2.fbx",
};

type AnimationKeysType = keyof typeof dummyAnimationData;

const loaderFBX = new FBXLoader();

const useAnimation = () => {
  const [curAnimation, setCurAnimation] = useState<{ name: string; data: Group }>();
  const animationsPool = useRef<any>({});
  const [_, getKeys] = useKeyboardControls();
  // For character state
  const velocity = new Vector3(0, 0, 0);
  const acceleration = new Vector3(1, 0.125, 20.0);
  const decceleration = new Vector3(-0.0005, -0.0001, -5.0);

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
  const changeCharacterState = (
    delta: number,
    collider: Object3D<Event>,
    api: PublicApi,
    posCollider: Triplet,
    velCollider: Triplet
  ) => {
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

    const controlObject = collider;
    const _Q = new Quaternion();
    const _A = new Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = acceleration.clone();

    if (run) {
      acc.multiplyScalar(1.1);
    }

    if (forward) {
      newVelocity.z += acc.z * delta;
      api.velocity.set(0, 0, newVelocity.z * 3);
    }
    if (backward) {
      newVelocity.z -= acc.z * delta;
      api.velocity.set(0, 0, newVelocity.z * 3);
    }
    if (leftward) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
      _R.multiply(_Q);

      const oldVelocity = new Vector3().fromArray([velCollider[0], velCollider[1], velCollider[2]]);
      const inverseRotation = new Vector3()
        .copy(new Vector3(collider.rotation.x, collider.rotation.y, collider.rotation.z))
        .multiplyScalar(-1);

      oldVelocity.applyQuaternion(
        new Quaternion().setFromEuler(new Euler(inverseRotation.x, inverseRotation.y, inverseRotation.z))
      );
      api.velocity.set(oldVelocity.x, oldVelocity.y, oldVelocity.z);
    }
    if (rightward) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
      _R.multiply(_Q);

      const oldVelocity = new Vector3().fromArray([velCollider[0], velCollider[1], velCollider[2]]);
      oldVelocity.applyQuaternion(_Q);
      api.velocity.copy(oldVelocity);

      // api.velocity.set(0, 0, 1);
    }
    if (run) {
      newVelocity.z = Math.max(0, newVelocity.z);
    }

    if (jump && posCollider[1] < 0.3) {
      api.velocity.set(0, 1.5, 0);
    }

    api.quaternion.copy(_R);
    controlObject.quaternion.copy(_R);

    // character.current.position.copy(controlObject.position);
    // const moveForward = new Vector3(0, 0, 1);
    // moveForward.applyQuaternion(controlObject.quaternion);
    // moveForward.normalize();

    // const sideways = new Vector3(0, 0, 1);
    // sideways.applyQuaternion(controlObject.quaternion);
    // sideways.normalize();

    // const jumpUp = new Vector3(0, 1, 0);
    // jumpUp.applyQuaternion(controlObject.quaternion);
    // jumpUp.normalize();

    // sideways.multiplyScalar(newVelocity.x * delta);
    // moveForward.multiplyScalar(newVelocity.z * delta);
    // jumpUp.multiplyScalar(newVelocity.y * delta);

    // controlObject.position.add(moveForward);
    // controlObject.position.add(sideways);
    // controlObject.position.add(jumpUp);
  };

  return {
    curAnimation,
    selectAnimation,
    changeCharacterState,
  };
};

export default useAnimation;
