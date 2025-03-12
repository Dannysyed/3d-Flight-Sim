import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise"; // Import ImprovedNoise

function Environment({ position }) {
  const terrainRef = React.useRef();
  const terrainSize = 10000;
  const terrainDetail = 256; // Increased detail for better terrain
  const terrainHeight = 500; // Increased height for more dramatic terrain

  // Generate terrain with noise - optimized and enhanced
  React.useEffect(() => {
    const geometry = new THREE.PlaneGeometry(
      terrainSize,
      terrainSize,
      terrainDetail,
      terrainDetail
    );
    const vertices = geometry.attributes.position.array;
    const noise = new ImprovedNoise();

    // Multi-octave noise for more natural terrain
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i] / 1000;
      const y = vertices[i + 1] / 1000;

      // Use multiple noise frequencies for more natural terrain
      let elevation = 0;
      elevation += noise.noise(x, y, 0) * 1.0;
      elevation += noise.noise(x * 2, y * 2, 0.5) * 0.5;
      elevation += noise.noise(x * 4, y * 4, 1.0) * 0.25;

      vertices[i + 2] = elevation * terrainHeight;
    }

    geometry.computeVertexNormals();
    terrainRef.current.geometry = geometry;

    // Dispose of geometry when component unmounts to prevent memory leaks
    return () => {
      geometry.dispose();
    };
  }, []);

  // Optimize frame updates with memoization
  const lastPosition = React.useRef([0, 0, 0]);

  useFrame(() => {
    const newX = Math.floor(position[0] / terrainSize) * terrainSize;
    const newZ = Math.floor(position[2] / terrainSize) * terrainSize;

    // Only update position when necessary
    if (newX !== lastPosition.current[0] || newZ !== lastPosition.current[2]) {
      terrainRef.current.position.x = newX;
      terrainRef.current.position.z = newZ;
      lastPosition.current = [newX, 0, newZ];
    }
  });

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -200, 0]}
        ref={terrainRef}
        receiveShadow
      >
        <meshStandardMaterial
          color={0x228833}
          roughness={0.9}
          metalness={0.1}
          flatShading={true}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[20000, 64, 64]} />
        <meshBasicMaterial color={0x87ceeb} side={THREE.BackSide} fog={false} />
      </mesh>
      {/* Add simple directional light for better terrain visualization */}
      <directionalLight
        position={[1000, 2000, 1000]}
        intensity={1.5}
        castShadow
      />
      <ambientLight intensity={0.5} />
    </>
  );
}

export default Environment;
