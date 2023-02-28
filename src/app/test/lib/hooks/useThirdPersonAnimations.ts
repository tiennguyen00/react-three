import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { useEffect, useState, useRef, useMemo } from "react"
import { AnimationMixer } from "three"
import { useFrame } from "@react-three/fiber"

const FBX_LOADER = new FBXLoader()
const GLTF_LOADER = new GLTFLoader()

async function asyncForEach({
  array,
  callback,
}: {
  array: any[]
  callback: (item: any, index: number, array: any[]) => Promise<void>
}) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function loadModelSync({ url, loader }: { url: string; loader: FBXLoader | GLTFLoader }) {
  return new Promise((resolve, reject) => {
    loader.load(url, (data) => resolve(data), undefined, reject)
  })
}

function useThirdPersonAnimations({
  characterObj,
  animationPaths = {},
  onLoad = () => {},
}: {
  characterObj: any
  animationPaths: any
  onLoad: () => void
}) {
  const ref = useRef()
  const [clips, setClips] = useState([] as any)
  const [actualRef, setRef] = useState(ref)
  const [mixer, setMixer] = useState<THREE.AnimationMixer>(new AnimationMixer(undefined as any))
  const lazyActions = useRef<any>({})
  const [animations, setAnimations] = useState({} as any)

  // set character obj + mixer for character
  useEffect(() => {
    if (characterObj) {
      setRef({ current: characterObj })
      setMixer(new AnimationMixer(undefined as any))
    }
  }, [characterObj.name])

  // load animations async initially
  useEffect(() => {
    const loadAnimations = async () => {
      const newAnimations = {} as any
      const keys = [
        "idle",
        "walk",
        "run",
        "jump",
        "landing",
        "inAir",
        "backpedal",
        "turnLeft",
        "turnRight",
        "strafeLeft",
        "strafeRight",
      ]
      await asyncForEach({
        array: keys,
        callback: async (key) => {
          const fileExt = animationPaths[key].split(".").pop()
          const loader = fileExt === "fbx" ? FBX_LOADER : GLTF_LOADER
          const model = await loadModelSync({
            url: animationPaths[key],
            loader,
          })
          newAnimations[key] = model
        },
      })
      setAnimations(newAnimations)
      onLoad()
    }

    loadAnimations()
  }, [])

  // set clips once animations are loaded
  useEffect(() => {
    const clipsToSet = [] as any

    Object.keys(animations).forEach((name) => {
      if (animations[name]?.animations?.length) {
        animations[name].animations[0].name = name
        clipsToSet.push(animations[name].animations[0])
      }
    })

    if (clips.length < clipsToSet.length) {
      setClips(clipsToSet)
    }
  }, [animations])

  const api = useMemo(() => {
    if (!mixer || !clips.length) {
      return {
        actions: {},
      }
    }
    const actions = {} as any
    clips.forEach((clip: any) =>
      Object.defineProperty(actions, clip.name, {
        enumerable: true,
        get() {
          if (actualRef.current) {
            lazyActions.current[clip.name] = mixer.clipAction(clip, actualRef.current)

            const clampers = ["jump", "landing"]
            if (clampers.includes(clip.name)) {
              lazyActions.current[clip.name].setLoop(2200) // 2200 = THREE.LoopOnce
              lazyActions.current[clip.name].clampWhenFinished = true
            }

            return lazyActions.current[clip.name]
          }

          return null
        },
      })
    )
    return {
      ref: actualRef,
      clips,
      actions,
      names: clips.map((c: any) => c.name),
      mixer,
    }
  }, [clips, characterObj.name, mixer])

  useEffect(() => {
    const currentRoot = actualRef.current
    return () => {
      // Clean up only when clips change, wipe out lazy actions and uncache clips
      lazyActions.current = {}
      Object.values(api.actions).forEach((action: any) => {
        if (currentRoot) {
          mixer?.uncacheAction(action, currentRoot)
        }
      })
    }
  }, [clips])

  useFrame((_, delta) => {
    mixer?.update(delta)
  })

  return api
}

export default useThirdPersonAnimations
