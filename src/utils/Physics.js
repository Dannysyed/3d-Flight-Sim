import * as THREE from "three";

export class Physics {
  constructor(state, setState) {
    this.state = state;
    this.setState = setState;
    this.gravity = 9.81;
    this.liftFactor = 0.25;
    this.dragFactor = 0.03;
    this.thrustFactor = 3000;
  }

  update(delta) {
    const { position, velocity, rotation, throttle, weight, maxSpeed } =
      this.state;
    const speed = new THREE.Vector3(...velocity).length();

    const quaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(...rotation, "YXZ")
    );
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);

    // Forces
    const thrust = forward.clone().multiplyScalar(throttle * this.thrustFactor);
    const lift = up
      .clone()
      .multiplyScalar(speed * speed * this.liftFactor * Math.cos(rotation[0]));
    const drag = new THREE.Vector3(...velocity)
      .normalize()
      .multiplyScalar(-speed * speed * this.dragFactor);
    const gravity = new THREE.Vector3(0, -this.gravity * weight, 0);

    const totalForce = thrust.add(lift).add(drag).add(gravity);
    const acceleration = totalForce.divideScalar(weight);
    const newVelocity = new THREE.Vector3(...velocity).add(
      acceleration.multiplyScalar(delta)
    );

    if (speed > maxSpeed) newVelocity.normalize().multiplyScalar(maxSpeed);
    if (speed < 20 && Math.abs(rotation[0]) > Math.PI / 4)
      newVelocity.multiplyScalar(0.95); // Stall

    const newPosition = new THREE.Vector3(...position).add(
      newVelocity.clone().multiplyScalar(delta)
    );
    if (newPosition.y < 10) {
      newPosition.y = 10;
      newVelocity.y = Math.max(0, newVelocity.y);
    }

    this.setState((prev) => ({
      ...prev,
      position: [newPosition.x, newPosition.y, newPosition.z],
      velocity: [newVelocity.x, newVelocity.y, newVelocity.z],
    }));
  }
}
