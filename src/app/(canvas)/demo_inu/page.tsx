"use client";
import useCamera from "@/hooks/inu/useCamera";
import useFullScreen from "@/hooks/inu/useFullScreen";
import { useBox } from "@react-three/cannon";
import { OrbitControls, Environment, PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import Character from "./Character";
import Ground from "./Ground";
import Track from "./Track";

const DemoInuPage = () => {
  const inuRef = useRef<Group>(null);
  const isDrag = useRef(false);
  const orbitControlsRef = useRef(null);
  const { camera, gl } = useThree();
  const [thirdPerson, setThirdPerson] = useState(false);
  const pointerRef = useRef<any>(null);

  useFullScreen(gl);

  useEffect(() => {
    const keyDownPressHandler = (e: any) => {
      if (e.key === "t") {
        setThirdPerson(!thirdPerson);
      }
    };
    window.addEventListener("keydown", keyDownPressHandler);
    return () => window.removeEventListener("keydown", keyDownPressHandler);
  }, [thirdPerson]);

  const { updateCameraTarget } = useCamera(camera, orbitControlsRef.current, isDrag.current);

  const [ref, api] = useBox(() => ({
    type: "Static",
    args: [0.2, 0.2, 0.2],
    position: [0, 0, 1.5],
  }));

  return (
    <>
      <color attach="background" args={["#E6E6FA"]} />
      {thirdPerson ? (
        <PointerLockControls ref={pointerRef} />
      ) : (
        <OrbitControls ref={orbitControlsRef} enablePan={false} />
      )}
      <Environment preset="forest" />
      <Track />
      <Ground />
      <mesh ref={ref as any}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
      </mesh>
      <Character characterRef={inuRef} thirdPerson={thirdPerson} updateCameraTarget={updateCameraTarget} />
    </>
  );
};

export default DemoInuPage;
