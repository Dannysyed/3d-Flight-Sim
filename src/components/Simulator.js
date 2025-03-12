import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Aircraft from "./Aircraft";
import Environment from "./Environment";
import Controls from "./Controls";
import HUD from "./HUD";
import { Physics } from "../utils/Physics";
import { Howl } from "howler";

function Simulator() {
  const [aircraftState, setAircraftState] = useState({
    position: [0, 400, 0],
    velocity: [0, 0, 50],
    rotation: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    throttle: 0.5,
    maxSpeed: 200,
    weight: 1000,
  });

  const physics = useRef(new Physics(aircraftState, setAircraftState));
  const cameraRef = useRef();
  const [cameraMode, setCameraMode] = useState("chase");

  // Audio setup
  const engineSound = useRef(
    new Howl({ src: ["/assets/sounds/engine.mp3"], loop: true, volume: 0.5 })
  );
  const windSound = useRef(
    new Howl({ src: ["/assets/sounds/wind.mp3"], loop: true, volume: 0.3 })
  );
  engineSound.current.play();

  return (
    <>
      <Canvas
        camera={{ position: [0, 410, -50], fov: 75, near: 0.1, far: 20000 }}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[100, 100, 100]} intensity={1} />
        <Aircraft state={aircraftState} />
        <Environment position={aircraftState.position} />
        <Controls
          physics={physics.current}
          camera={cameraRef.current}
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
          windSound={windSound.current}
        />
        {/* Remove OrbitControls for production; useful for debugging */}
        <OrbitControls />
      </Canvas>
      <HUD state={aircraftState} />
      <div className="controls-info">
        WASD: Pitch/Roll | QE: Yaw | Space/Z: Throttle | C: Camera Mode
      </div>
    </>
  );
}

export default Simulator;
