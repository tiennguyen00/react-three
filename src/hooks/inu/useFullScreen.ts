import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const node = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(document.fullscreenElement === node.current)
    }
    document.addEventListener("fullscreenchange", handleChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleChange)
    }
  }, [])

  const handleFullScreen = useCallback(() => {
    try {
      if (!node.current) return
      if (document.fullscreenElement === node.current) {
        return document.exitFullscreen()
      }
      return node.current.requestFullscreen()
    } catch (error) {}
  }, [])

  const exitFullScreen = useCallback(() => {
    try {
      if (document.fullscreenElement === node.current) {
        return document.exitFullscreen()
      }
    } catch (error) {}
  }, [])

  return useMemo(
    () => ({
      isFullScreen,
      node,
      handleFullScreen,
      exitFullScreen,
    }),
    [isFullScreen, handleFullScreen, exitFullScreen]
  )
}

export default useFullScreen
