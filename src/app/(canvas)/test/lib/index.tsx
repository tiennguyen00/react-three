import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useThirdPersonAnimations,
  useThirdPersonCameraControls,
  useInputEventManager,
  useKeyboardMouseMovement,
  useInputMovementRotation,
  useCharacterState,
  useCapsuleCollider,
  useRay,
} from "./hooks";
import { inputControlsType } from "./hooks/useCharacterState";
import { Triplet } from "@react-three/cannon";
import { Group } from "three";

const ThirdPersonCharacterControls = ({
  cameraOptions = {},
  characterObj,
  characterProps = {},
  animationPaths = {},
  onLoad,
}: {
  cameraOptions?: {
    yOffset?: number;
    minDistance?: number;
    maxDistance?: number;
    collisionFilterMask?: number;
  };
  characterObj: any;
  characterProps?: {
    radius?: number;
    velocity?: React.MutableRefObject<number>;
  };
  animationPaths?: {
    idle?: string;
    walk?: string;
    run?: string;
    jump?: string;
    landing?: string;
    inAir?: string;
  };
  onLoad: () => void;
}) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  // set up refs that influence character and camera position
  const collider = useCapsuleCollider(characterProps.radius);
  const [position, setPosition] = useState<Triplet>([0, 0, 0]);
  const modelRef = useRef<Group>(null);
  const cameraContainer = useRef(new THREE.Object3D());
  const rayVector = useRef(new THREE.Vector3());
  const ray = useRay({ rayVector, position, collisionFilterMask: { ...cameraOptions } });

  // get character state based on user inputs + collider position + animations
  const inputManager = useInputEventManager(domElement as any);
  const inputs = useKeyboardMouseMovement({ inputManager }) as inputControlsType;
  const controls = useThirdPersonCameraControls({
    camera,
    domElement,
    target: modelRef.current,
    inputManager,
    cameraOptions,
    cameraContainer,
  }) as any;
  const { actions, mixer } = useThirdPersonAnimations({ characterObj, animationPaths, onLoad });
  const { animation, isMoving } = useCharacterState(inputs, position, mixer!);

  // subscribe to collider velocity/position changes
  const charVelocity = characterProps.velocity?.current ?? 4;
  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    collider.velocity.subscribe((v) => {
      velocity.current = v;
    });

    collider.position.subscribe((p) => {
      // position is set on collider so we copy it to model
      modelRef.current?.position.set(...p);
      // setState with position to  useCharacterState
      setPosition(p);
    });
  }, []);
  const { model, movement } = useInputMovementRotation(inputs);

  useFrame(() => {
    let newRotation = new THREE.Euler();
    let xVelocity = 0;
    let zVelocity = 0;
    if (!modelRef.current) return;

    const { quaternion } = modelRef.current;

    if (isMoving) {
      // first rotate the model group
      modelRef.current.rotateY(model.direction * -0.05);
      newRotation = characterObj.rotation.clone();
      newRotation.y = model.rotation;

      const mtx = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);
      movement.applyMatrix4(mtx);

      // then apply velocity to collider influenced by model groups rotation
      const baseVelocity = inputs.down ? charVelocity / 2 : charVelocity;
      xVelocity = movement.x * baseVelocity;
      zVelocity = movement.z * baseVelocity;
    }

    collider.velocity.set(0, velocity.current[1], zVelocity);

    // after applying x/z velocity, apply y velocity if user has jumped while grounded
    const isGrounded = Math.abs(parseInt(velocity.current[1].toFixed(2))) === 0;
    if (animation === "jump" && isGrounded) {
      collider.velocity.set(velocity.current[0], 8, velocity.current[2]);
    }

    // rotate character model inside model group
    const newQuat = new THREE.Quaternion().setFromEuler(newRotation);
    characterObj.quaternion.slerp(newQuat, 0.1);

    // quaternion is set on model group so we copy it to collider
    collider.quaternion.copy(quaternion);
    // check camera raycast collision and pass that to controls to
    cameraContainer.current.getWorldPosition(rayVector.current);
    controls?.update(ray);
  });

  // Transition to new animation when loaded
  useEffect(() => {
    actions?.[animation]?.reset().fadeIn(0.2).play();
    return () => {
      actions?.[animation]?.fadeOut(0.2);
    };
  }, [animation, actions]);

  return (
    <group ref={modelRef} rotation={[0, Math.PI, 0]} {...characterProps}>
      <Suspense fallback={null}>
        <primitive object={characterObj} dispose={null} />
      </Suspense>
    </group>
  );
};

export default ThirdPersonCharacterControls;
