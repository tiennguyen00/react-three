"use client"
import useFullScreen from "@/hooks/inu/useFullScreen"
import { Canvas } from "@react-three/fiber"
import { Perf } from "r3f-perf"
import { useEffect } from "react"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { node, exitFullScreen, handleFullScreen } = useFullScreen()

  useEffect(() => {
    if (!window) return
    window.addEventListener("keydown", (e) => {
      if (e.key === "f") {
        handleFullScreen()
      }
      if (e.key === "Escape") {
        exitFullScreen()
      }
    })

    return () => {
      exitFullScreen()
    }
  }, [])

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <div ref={node} className="w-screen h-screen">
          <Canvas
            camera={{
              fov: 75,
              near: 0.1,
              far: 50,
              position: [0, 4, 3],
              frustumCulled: true,
            }}
          >
            <axesHelper />
            <Perf position="top-left" />
            {children}
          </Canvas>
        </div>
      </body>
    </html>
  )
}
