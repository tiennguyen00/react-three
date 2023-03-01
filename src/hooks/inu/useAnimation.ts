import { PublicApi, Triplet } from "@react-three/cannon";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { Group, Object3D, Quaternion, Vector3, Event, Euler, Matrix4, MathUtils } from "three";
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
    rolCollider: Triplet
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

    const euler = new Euler(rolCollider[0], rolCollider[1], rolCollider[2]);
    const degreeY = MathUtils.radToDeg(euler.y);
    const degreeX = MathUtils.radToDeg(euler.x);

    const test = new Vector3(
      Math.sin((degreeY * Math.PI) / 180) * 8,
      0,
      Math.cos((degreeY * Math.PI) / 180) * 8 * (degreeX === -180 ? -1 : 1)
    );

    if (run) {
      test.multiplyScalar(1.5);
    }

    if (forward) {
      api.velocity.set(test.x, test.y, test.z);
    }
    if (backward) {
      api.velocity.set(-test.x, -test.y, -test.z);
    }
    if (leftward) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (rightward) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (run) {
      newVelocity.z = Math.max(0, newVelocity.z);
    }

    // if (jump && posCollider[1] < 0.3) {
    //   api.velocity.set(0, 1.5, 0);
    // }

    api.quaternion.copy(_R);
    controlObject.quaternion.copy(_R);

    // api.quaternion.set(rolCollider[0], rolCollider[1], rolCollider[2], 1);

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

    // collider.position.add(moveForward);
    // collider.position.add(sideways);
    // collider.position.add(jumpUp);
  };

  return {
    curAnimation,
    selectAnimation,
    changeCharacterState,
  };
};

export default useAnimation;
