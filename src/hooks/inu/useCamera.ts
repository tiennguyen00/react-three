import { Camera } from "@react-three/fiber";
import { Group, Vector3 } from "three";

const useCamera = (camera: Camera) => {
  const currentPosition = new Vector3();
  const currentLookAt = new Vector3();

  const updateCameraTarget = (delta: number, character: Group) => {
    const idealOffset = new Vector3(0, 3, -3);
    idealOffset.applyQuaternion(character.quaternion);
    idealOffset.add(character.position);

    const idealLookat = new Vector3(0, 10, 70);
    idealLookat.applyQuaternion(character.quaternion);
    idealLookat.add(character.position);

    const t = 1.0 - Math.pow(0.001, delta);

    currentPosition.lerp(idealOffset, 1);
    currentLookAt.lerp(idealLookat, t);

    camera.position.copy(currentPosition);

    camera.lookAt(character.position);
    camera.updateProjectionMatrix();
  };

  return {
    updateCameraTarget,
  };
};

export default useCamera;
