"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { WorldDiorama } from "./WorldDiorama";
import type { LocalizedPortal } from "@/services/public-queries";

interface WorldSceneCanvasProps {
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
  onError?: (err: Error) => void;
}

interface CanvasErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: (err: Error) => void;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends React.Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Three.js Canvas rendering error:", error);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function WorldSceneCanvas({
  portals,
  fogColor,
  fogDensity,
  sunLightIntensity,
  ambientLightIntensity,
  sunLightColor,
  ambientLightColor,
  targetPortal,
  resetTrigger,
  prefersReducedMotion,
  onSelectPortal,
  onNavigationComplete,
  onError,
}: WorldSceneCanvasProps) {
  return (
    <CanvasErrorBoundary
      fallback={<div className="h-full w-full bg-[var(--realm-bg)]" />}
      onError={onError}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [13, 11, 13], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="h-full w-full select-none"
      >
        <WorldDiorama
          portals={portals}
          fogColor={fogColor}
          fogDensity={fogDensity}
          sunLightIntensity={sunLightIntensity}
          ambientLightIntensity={ambientLightIntensity}
          sunLightColor={sunLightColor}
          ambientLightColor={ambientLightColor}
          targetPortal={targetPortal}
          resetTrigger={resetTrigger}
          prefersReducedMotion={prefersReducedMotion}
          onSelectPortal={onSelectPortal}
          onNavigationComplete={onNavigationComplete}
        />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
