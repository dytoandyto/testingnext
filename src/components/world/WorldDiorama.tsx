"use client";

import * as React from "react";
import { FloatingIsland } from "./FloatingIsland";
import { PortalNode } from "./PortalNode";
import { SporeParticles } from "./SporeParticles";
import { CameraController } from "./CameraController";
import type { LocalizedPortal } from "@/services/public-queries";

interface WorldDioramaProps {
  portals: LocalizedPortal[];
  fogColor?: string;
  fogDensity?: number;
  sunLightIntensity?: number;
  ambientLightIntensity?: number;
  sunLightColor?: string;
  ambientLightColor?: string;
  targetPortal: LocalizedPortal | null;
  resetTrigger: number;
  prefersReducedMotion: boolean;
  onSelectPortal: (portal: LocalizedPortal) => void;
  onNavigationComplete: (portal: LocalizedPortal) => void;
}

export function WorldDiorama({
  portals,
  fogColor = "#141817",
  fogDensity = 0.025,
  sunLightIntensity = 1.5,
  ambientLightIntensity = 0.85,
  sunLightColor = "#fff1d6",
  ambientLightColor = "#9bb4a8",
  targetPortal,
  resetTrigger,
  prefersReducedMotion,
  onSelectPortal,
  onNavigationComplete,
}: WorldDioramaProps) {
  return (
    <>
      {/* Atmospheric Fog from CMS settings */}
      <fogExp2 attach="fog" args={[fogColor, fogDensity]} />

      {/* Atmospheric Ambient Lighting */}
      <ambientLight intensity={ambientLightIntensity} color={ambientLightColor} />

      {/* Warm Golden Sunlight */}
      <directionalLight
        position={[15, 20, 15]}
        intensity={sunLightIntensity}
        color={sunLightColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />

      {/* Cool Sky / Ground Hemisphere Light */}
      <hemisphereLight
        args={["#5a7566", "#1c2220", 0.6]}
      />

      {/* Central Floating Archipelago Island */}
      <FloatingIsland />

      {/* Interactive Portal Monoliths */}
      {portals.map((portal) => (
        <PortalNode
          key={portal.id}
          portal={portal}
          isSelected={targetPortal?.id === portal.id}
          onSelect={onSelectPortal}
        />
      ))}

      {/* Atmospheric Glowing Spores */}
      <SporeParticles count={70} />

      {/* Camera & Orbit Controller */}
      <CameraController
        targetPortal={targetPortal}
        resetTrigger={resetTrigger}
        prefersReducedMotion={prefersReducedMotion}
        onNavigationComplete={onNavigationComplete}
      />
    </>
  );
}
