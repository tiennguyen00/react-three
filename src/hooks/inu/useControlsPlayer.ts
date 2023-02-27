import { useCallback, useEffect } from "react"
type KeyboardControls = "forward" | "backward" | "left" | "right" | "run" | "jump" | "mode"

let activeAnimation: Record<KeyboardControls, boolean> = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
  jump: false,
  mode: false,
}

const useControlsPlayer = () => {
  const handleKeyPress = useCallback((event: any) => {
    switch (event.keyCode) {
      case 87 || 38: //w or arrowup
        activeAnimation.forward = true
        break
      case 65 || 37: //a or arrowleft
        activeAnimation.left = true
        break
      case 83 || 40: //s or arrowdown
        activeAnimation.backward = true
        break
      case 68 || 39: // d or arrowright
        activeAnimation.right = true
        break
      case 32: //spacebar
        activeAnimation.jump = true
        break
      case 16: // shift
        activeAnimation.run = true
        break
      case 67: // c
        activeAnimation.mode = !activeAnimation.mode
    }
  }, [])

  const handleKeyUp = useCallback((event: any) => {
    switch (event.keyCode) {
      case 87 || 38: //w or arrowup
        activeAnimation.forward = false
        break
      case 65 || 37: //a or arrowleft
        activeAnimation.left = false
        break
      case 83 || 40: //s or arrowdown
        activeAnimation.backward = false
        break
      case 68 || 39: // d or arrowright
        activeAnimation.right = false
        break
      case 32: //spacebar
        activeAnimation.jump = false
        break
      case 16: // shift
        activeAnimation.run = false
        break
    }
  }, [])
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("keyup", handleKeyUp)
    }
  })

  return activeAnimation
}

export default useControlsPlayer
