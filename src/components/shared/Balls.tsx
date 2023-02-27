import { Sphere, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { BallCollider, InstancedRigidBodies, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import { Vector3, MeshStandardMaterial } from "three";

const Balls = () => {
  const ballGLB = useGLTF("models/ball.glb");
  const count = 120;
  const {
    size: { width, height },
  } = useThree();

  const target = new Vector3();

  const intersectionPlane = useRef(null);
  const pusher = useRef(null);
  const bodies = useRef(null);

  const transforms = useMemo(() => {
    const result: any = [];

    Array.from(Array(count).keys()).forEach((i) => {
      result.push({
        position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
        rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
        scale: [0.6, 0.6, 0.6],
        key: i,
      });
    });

    return result;
  }, []);

  const options = useControls("balls", {
    restitution: { value: 0.5, min: 0, max: 1 },
    friction: { value: 0.5, min: 0, max: 1 },
    force: { value: 0.2, min: 0, max: 2 },
    roughness: { value: 0.17, min: 0, max: 1 },
    metalness: { value: 0.85, min: 0, max: 1 },
    damping: { value: 1, min: 0, max: 1 },
    envMapIntensity: { value: 2.5, min: 0, max: 5 },
  });

  const material = new MeshStandardMaterial({
    vertexColors: true,
    roughness: options.roughness,
    metalness: options.metalness,
    envMapIntensity: options.envMapIntensity,
  });

  useFrame((state) => {
    if (intersectionPlane.current) {
      (intersectionPlane.current as any).lookAt(state.camera.position);
    }

    if (pusher.current) {
      (pusher.current as any).setNextKinematicTranslation(target);
    }

    if (bodies.current) {
      (bodies.current as any).forEach((body: any) => {
        const bodyPosition = body.translation();
        const force = new Vector3();
        force.sub(bodyPosition).normalize().multiplyScalar(options.force);
        body.applyImpulse(force);
      });
    }
  });

  return (
    <>
      <mesh
        ref={intersectionPlane}
        scale={[(8.3 * width) / height, 8.3, 1]}
        onPointerMove={(e) => target.copy(e.point)}
      >
        <planeGeometry />
        <meshBasicMaterial wireframe />
      </mesh>

      <RigidBody ref={pusher} type="kinematicPosition" colliders="ball" restitution={0}>
        <Sphere />
      </RigidBody>

      <InstancedRigidBodies
        ref={bodies}
        instances={transforms}
        restitution={options.restitution}
        friction={options.friction}
        linearDamping={options.damping} // The linear damping coefficient of this rigid-body
        angularDamping={options.damping}
        colliders="ball"
      >
        <instancedMesh castShadow receiveShadow args={[(ballGLB as any)?.nodes.ball.geometry, material, count]} />
      </InstancedRigidBodies>
    </>
  );
};

export { Balls };
