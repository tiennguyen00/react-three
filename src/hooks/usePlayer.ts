import { useEffect, useState } from "react"
const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
  ShiftLeft: "sprint",
}
export const usePlayer = () => {
  const [input, setInput] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  })

  const findKey = (code: string) => keys[code as keyof typeof keys]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = findKey(event.code)
      if (key) setInput((input) => ({ ...input, [key]: true }))
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = findKey(event.code)
      if (key) setInput((input) => ({ ...input, [key]: false }))
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return input
}
