"use client";
import Container from "@/components/Container";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <div className="w-screen h-screen ">
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 50,
          position: [10, 0, 0],
        }}
      >
        <Container />
      </Canvas>
    </div>
  );
}
