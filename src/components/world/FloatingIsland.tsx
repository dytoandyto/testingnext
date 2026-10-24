"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FloatingIsland() {
  const monolithRef = React.useRef<THREE.Group>(null);
  const coreRef = React.useRef<THREE.Group>(null);

  // Animate central rune monolith and gentle island breathing
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (monolithRef.current) {
      monolithRef.current.rotation.y = elapsed * 0.35;
      monolithRef.current.position.y = 1.2 + Math.sin(elapsed * 1.2) * 0.15;
    }

    if (coreRef.current) {
      coreRef.current.position.y = Math.sin(elapsed * 0.6) * 0.08;
    }
  });

  return (
    <group ref={coreRef} position={[0, 0, 0]}>
      {/* Central Upper Grass Plateau */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[7.2, 6.8, 0.8, 8]} />
        <meshStandardMaterial
          color="#283628"
          roughness={0.8}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Stepped Terraces */}
      <mesh receiveShadow position={[0, -0.6, 0]}>
        <cylinderGeometry args={[7.8, 6.2, 0.7, 8]} />
        <meshStandardMaterial
          color="#1e2722"
          roughness={0.85}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Deep Slate Under-Rock Foundation */}
      <mesh receiveShadow castShadow position={[0, -2.2, 0]}>
        <coneGeometry args={[6.2, 3.2, 7]} />
        <meshStandardMaterial
          color="#141817"
          roughness={0.9}
          metalness={0.15}
          flatShading
        />
      </mesh>

      {/* Ancient Cobblestone Paths to Portals */}
      {/* Path to Workshop (North-West) */}
      <mesh position={[-2, 0.41, 1]} rotation={[-Math.PI / 2, 0, 0.4]} receiveShadow>
        <planeGeometry args={[1.2, 4]} />
        <meshStandardMaterial color="#2d3330" roughness={0.9} />
      </mesh>

      {/* Path to Chronicle (North) */}
      <mesh position={[0, 0.41, 2.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.2, 4.2]} />
        <meshStandardMaterial color="#2d3330" roughness={0.9} />
      </mesh>

      {/* Path to Expeditions (North-East) */}
      <mesh position={[2, 0.41, 1]} rotation={[-Math.PI / 2, 0, -0.4]} receiveShadow>
        <planeGeometry args={[1.2, 4]} />
        <meshStandardMaterial color="#2d3330" roughness={0.9} />
      </mesh>

      {/* Path to Mastery (South-West) */}
      <mesh position={[-1.5, 0.41, -1.5]} rotation={[-Math.PI / 2, 0, 2.3]} receiveShadow>
        <planeGeometry args={[1.2, 3.5]} />
        <meshStandardMaterial color="#2d3330" roughness={0.9} />
      </mesh>

      {/* Path to Beacon (South-East) */}
      <mesh position={[1.5, 0.41, -1.5]} rotation={[-Math.PI / 2, 0, -2.3]} receiveShadow>
        <planeGeometry args={[1.2, 3.5]} />
        <meshStandardMaterial color="#2d3330" roughness={0.9} />
      </mesh>

      {/* Central Ancient Compass Plinth */}
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.3, 8]} />
        <meshStandardMaterial color="#1a201e" roughness={0.7} />
      </mesh>

      {/* Rotating Floating Rune Monolith */}
      <group ref={monolithRef} position={[0, 1.2, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#d99b38"
            emissive="#d99b38"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>
        {/* Monolith Aura Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.04, 8, 24]} />
          <meshStandardMaterial
            color="#587d55"
            emissive="#729c6f"
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}
