import React from "react";
import { useGLTF } from "@react-three/drei";

function Aircraft({ state }) {
  const { scene } = useGLTF("/assets/models/plane.glb");

  return (
    <primitive
      object={scene}
      position={state.position}
      rotation={state.rotation}
      scale={[5, 5, 5]}
    />
  );
}

export default Aircraft;
