import * as THREE from "three"
import React, { useEffect, useRef, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useBox } from "@react-three/cannon"

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

  const boxIntersect = (
    minAx: number,
    minAz: number,
    maxAx: number,
    maxAz: number,
    minBx: number,
    minBz: number,
    maxBx: number,
    maxBz: number
  ) => {
    let aLeftOfB = maxAx < minBx
    let aRightOfB = minAx > maxBx
    let aAboveB = minAz > maxBz
    let aBelowB = maxAz < minBz
    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB)
  }

  const isOverlapping = (index: number, tree: TreeType, trees: TreeType[]) => {
    const minTargetX = tree.position.x - tree.box / 2
    const maxTargetX = tree.position.x + tree.box / 2
    const minTargetZ = tree.position.z - tree.box / 2
    const maxTargetZ = tree.position.z + tree.box / 2
    for (let i = 0; i < trees.length; i++) {
      let minChildX = trees[i].position.x - trees[i].box / 2
      let maxChildX = trees[i].position.x + trees[i].box / 2
      let minChildZ = trees[i].position.z - trees[i].box / 2
      let maxChildZ = trees[i].position.z + trees[i].box / 2
      if (
        boxIntersect(minTargetX, minTargetZ, maxTargetX, maxTargetZ, minChildX, minChildZ, maxChildX, maxChildZ) &&
        i !== index
      ) {
        return true
      }
    }
    return false
  }

  const newPosition = (box: number, boundary: number) => {
    return boundary / 2 - box / 2 - ((boundary - box) * Math.round(Math.random() * 100)) / 100
  }

  const updatePosition = (treeArray: TreeType[], boundary: number) => {
    treeArray.forEach((tree, index) => {
      do {
        tree.position.x = newPosition(tree.box, boundary)
        tree.position.z = newPosition(tree.box, boundary)
      } while (isOverlapping(index, tree, treeArray))
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
