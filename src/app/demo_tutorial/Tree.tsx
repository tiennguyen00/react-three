import * as THREE from "three"
import React, { useEffect, useRef, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

interface TreeProps {
  boundary: number
  count: number
}

type TreeType = {
  position: { x: number; z: number }
  box: number
}

function Tree({ boundary, count }: TreeProps) {
  const model = useLoader(GLTFLoader, "/models/tree.glb")
  const [trees, setTrees] = useState<TreeType[]>([])

  model.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
    }
  })

  const updatePosition = (treeArray: TreeType[], boundary: number) => {
    treeArray.forEach((tree, index) => {
      tree.position.x = Math.random() * 100
      tree.position.z = Math.random() * 100
    })
    setTrees(treeArray)
  }

  useEffect(() => {
    const tempTrees: TreeType[] = []
    for (let i = 0; i < count; i++) {
      tempTrees.push({
        position: { x: 0, z: 0 },
        box: 1,
      })
    }
    updatePosition(tempTrees, boundary)
  }, [boundary, count])

  return (
    <group rotation={[0, 4, 0]}>
      {trees.map((tree, index) => {
        return (
          <object3D key={index} position={[tree.position.x, 0, tree.position.z]}>
            <mesh scale={[tree.box, tree.box, tree.box]}>
              <boxGeometry />
              <meshBasicMaterial color="blue" wireframe />
            </mesh>
            <primitive object={model.scene.clone()} />
          </object3D>
        )
      })}
    </group>
  )
}

useGLTF.preload("/models/tree.glb")

export default Tree
