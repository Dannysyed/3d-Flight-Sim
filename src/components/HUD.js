import React from "react";
import * as THREE from "three";

function HUD({ state }) {
  const speed = new THREE.Vector3(...state.velocity).length();
  const altitude = state.position[1];
  const throttle = state.throttle * 100;

  return (
    <div className="hud">
      Speed: {Math.round(speed)} m/s
      <br />
      Altitude: {Math.round(altitude)} m<br />
      Throttle: {Math.round(throttle)}%
      <div id="speed-gauge" className="gauge">
        <div
          className="bar"
          style={{ width: `${(speed / state.maxSpeed) * 100}%` }}
        ></div>
      </div>
      <div id="altitude-gauge" className="gauge">
        <div
          className="bar"
          style={{ width: `${Math.min(altitude / 2000, 1) * 100}%` }}
        ></div>
      </div>
      <div id="throttle-gauge" className="gauge">
        <div className="bar" style={{ width: `${throttle}%` }}></div>
      </div>
    </div>
  );
}

export default HUD;
