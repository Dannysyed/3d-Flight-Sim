import React, { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Controls({ physics, camera, cameraMode, setCameraMode, windSound }) {
  const keys = React.useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => (keys.current[e.key.toLowerCase()] = true);
    const handleKeyUp = (e) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const { angularVelocity, throttle } = physics.state;

    // Controls
    if (keys.current["w"]) angularVelocity[0] -= 0.03;
    if (keys.current["s"]) angularVelocity[0] += 0.03;
    if (keys.current["a"]) angularVelocity[2] += 0.05;
    if (keys.current["d"]) angularVelocity[2] -= 0.05;
    if (keys.current["q"]) angularVelocity[1] += 0.02;
    if (keys.current["e"]) angularVelocity[1] -= 0.02;
    if (keys.current[" "])
      physics.setState((s) => ({
        ...s,
        throttle: Math.min(1, throttle + 0.01),
      }));
    if (keys.current["z"])
      physics.setState((s) => ({
        ...s,
        throttle: Math.max(0, throttle - 0.01),
      }));

    // Update rotation
    physics.setState((s) => ({
      ...s,
      rotation: [
        s.rotation[0] + angularVelocity[0] * delta,
        s.rotation[1] + angularVelocity[1] * delta,
        s.rotation[2] + angularVelocity[2] * delta,
      ],
      angularVelocity: angularVelocity.map((v) => v * 0.95),
    }));

    // Physics update
    physics.update(delta);

    // Camera
    const quaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(...physics.state.rotation, "YXZ")
    );
    if (keys.current["c"]) {
      setCameraMode(
        cameraMode === "chase"
          ? "cockpit"
          : cameraMode === "cockpit"
          ? "free"
          : "chase"
      );
      keys.current["c"] = false;
    }

    const position = new THREE.Vector3(...physics.state.position);
    if (cameraMode === "chase") {
      const offset = new THREE.Vector3(0, 10, -50).applyQuaternion(quaternion);
      camera.position.copy(position).add(offset);
      camera.lookAt(position);
    } else if (cameraMode === "cockpit") {
      const offset = new THREE.Vector3(0, 5, -5).applyQuaternion(quaternion);
      camera.position.copy(position).add(offset);
      camera.quaternion.copy(quaternion);
    }

    // Wind sound
    windSound.volume(
      Math.min(new THREE.Vector3(...physics.state.velocity).length() / 100, 1)
    );
  });

  return null;
}

export default Controls;
