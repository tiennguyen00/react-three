"use client";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <div className="w-screen h-screen">
          <Canvas
            camera={{
              fov: 45,
              near: 0.1,
              far: 50,
              position: [0, 3, 3],
            }}
          >
            <axesHelper />
            <Perf position="top-left" />
            {children}
          </Canvas>
        </div>
      </body>
    </html>
  );
}
