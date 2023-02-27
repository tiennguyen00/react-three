import { useEffect } from "react";
import { WebGLRenderer } from "three";

const useFullScreen = (gl: WebGLRenderer) => {
  const handleFullScreen = (e: any) => {
    if (e.key === "f") {
      gl.domElement.requestFullscreen();
    }
    if (e.key === "Escape") {
      document.exitFullscreen();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleFullScreen);

    return () => {
      document.removeEventListener("keydown", handleFullScreen);
    };
  });
};

export default useFullScreen;
