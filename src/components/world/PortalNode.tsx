"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { LocalizedPortal } from "@/services/public-queries";
import { sanitizePortalRoute } from "@/lib/world/validation";

interface PortalNodeProps {
  portal: LocalizedPortal;
  isSelected: boolean;
  onSelect: (portal: LocalizedPortal) => void;
}

export function PortalNode({ portal, isSelected, onSelect }: PortalNodeProps) {
  const [hovered, setHovered] = React.useState(false);
  const ringRef = React.useRef<THREE.Mesh>(null);
  const orbRef = React.useRef<THREE.Mesh>(null);

  // Animate portal floating rune ring and orb
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() + portal.order * 0.5;

    if (ringRef.current) {
      ringRef.current.rotation.z = elapsed * 0.8;
      const targetScale = hovered || isSelected ? 1.25 : 1.0;
      ringRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (orbRef.current) {
      orbRef.current.position.y = 1.1 + Math.sin(elapsed * 2.0) * 0.12;
    }
  });

  const safeRoute = sanitizePortalRoute(portal.targetRoute);

  const handleClick = (e: any) => {
    e.stopPropagation?.();
    onSelect(portal);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(portal);
    }
  };

  // Theme accent colors based on route
  const isChronicle = safeRoute.includes("about");
  const isExpeditions = safeRoute.includes("experience");
  const isMastery = safeRoute.includes("skill");
  const isBeacon = safeRoute.includes("contact");

  let runeColor = "#d99b38"; // Amber default (Creations)
  if (isExpeditions) runeColor = "#729c6f"; // Moss
  if (isChronicle) runeColor = "#c87d55"; // Clay
  if (isMastery) runeColor = "#5ea6b8"; // Cyan/Teal
  if (isBeacon) runeColor = "#e6a847"; // Gold

  return (
    <group
      position={[portal.posX, portal.posY + 0.4, portal.posZ]}
      rotation={[0, portal.rotY, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Stone Base Plinth */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 0.35, 6]} />
        <meshStandardMaterial
          color="#1b211f"
          roughness={0.7}
          metalness={0.2}
          flatShading
        />
      </mesh>

      {/* Stepped Stone Pedestal */}
      <mesh receiveShadow castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.65, 0.8, 0.2, 6]} />
        <meshStandardMaterial
          color="#252d2a"
          roughness={0.65}
          metalness={0.2}
          flatShading
        />
      </mesh>

      {/* Twin Stone Gate Pillars */}
      <mesh castShadow position={[-0.45, 0.8, 0]}>
        <boxGeometry args={[0.2, 1.0, 0.2]} />
        <meshStandardMaterial color="#1a201e" roughness={0.75} />
      </mesh>
      <mesh castShadow position={[0.45, 0.8, 0]}>
        <boxGeometry args={[0.2, 1.0, 0.2]} />
        <meshStandardMaterial color="#1a201e" roughness={0.75} />
      </mesh>

      {/* Rotating Glowing Rune Ring */}
      <mesh
        ref={ringRef}
        position={[0, 1.1, 0]}
        rotation={[0, 0, 0]}
      >
        <torusGeometry args={[0.45, 0.05, 12, 24]} />
        <meshStandardMaterial
          color={runeColor}
          emissive={runeColor}
          emissiveIntensity={hovered || isSelected ? 1.8 : 0.8}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Central Floating Spore Orb */}
      <mesh ref={orbRef} position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color={runeColor}
          emissive={runeColor}
          emissiveIntensity={hovered || isSelected ? 2.5 : 1.2}
        />
      </mesh>

      {/* Local Point Light for Atmospheric Emission */}
      <pointLight
        color={runeColor}
        intensity={hovered || isSelected ? 3.0 : 1.2}
        distance={4.5}
        decay={2}
        position={[0, 1.1, 0]}
      />

      {/* Accessible 3D HTML Badge Overlay */}
      <Html
        position={[0, 2.0, 0]}
        center
        distanceFactor={18}
        zIndexRange={[100, 0]}
      >
        <button
          type="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label={`Portal: ${portal.label}. Target: ${safeRoute}`}
          className={`pointer-events-auto flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-medium font-mono shadow-xl backdrop-blur-md transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--realm-amber)] ${
            hovered || isSelected
              ? "scale-110 border-[var(--realm-amber)] bg-[var(--realm-bg-surface)] text-[var(--realm-amber)] shadow-[0_0_15px_rgba(217,155,56,0.5)]"
              : "border-[var(--realm-border)] bg-[var(--realm-bg)]/85 text-[var(--realm-text-primary)] hover:border-[var(--realm-amber)]/60"
          }`}
        >
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: runeColor }} />
          <span>{portal.label}</span>
          <span className="text-[10px] text-[var(--realm-text-muted)] opacity-70">
            [{portal.posX.toFixed(0)}, {portal.posZ.toFixed(0)}]
          </span>
        </button>
      </Html>
    </group>
  );
}
