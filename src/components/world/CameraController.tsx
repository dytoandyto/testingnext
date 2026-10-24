"use client";

import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import type { LocalizedPortal } from "@/services/public-queries";

interface CameraControllerProps {
  targetPortal: LocalizedPortal | null;
  resetTrigger: number;
  prefersReducedMotion: boolean;
  onNavigationComplete: (portal: LocalizedPortal) => void;
}

const DEFAULT_CAMERA_POS = new THREE.Vector3(13, 11, 13);
const DEFAULT_TARGET_POS = new THREE.Vector3(0, 0.8, 0);

export function CameraController({
  targetPortal,
  resetTrigger,
  prefersReducedMotion,
  onNavigationComplete,
}: CameraControllerProps) {
  const controlsRef = React.useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Navigation flight state stored in ref to prevent re-renders
  const flightRef = React.useRef<{
    isFlying: boolean;
    startTime: number;
    destinationCamera: THREE.Vector3;
    destinationTarget: THREE.Vector3;
    portal: LocalizedPortal | null;
  }>({
    isFlying: false,
    startTime: 0,
    destinationCamera: DEFAULT_CAMERA_POS.clone(),
    destinationTarget: DEFAULT_TARGET_POS.clone(),
    portal: null,
  });

  // Reset Camera Trigger
  React.useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      if (prefersReducedMotion) {
        camera.position.copy(DEFAULT_CAMERA_POS);
        controlsRef.current.target.copy(DEFAULT_TARGET_POS);
        controlsRef.current.update();
      } else {
        flightRef.current = {
          isFlying: true,
          startTime: performance.now(),
          destinationCamera: DEFAULT_CAMERA_POS.clone(),
          destinationTarget: DEFAULT_TARGET_POS.clone(),
          portal: null,
        };
      }
    }
  }, [resetTrigger, camera, prefersReducedMotion]);

  // Target Portal Flight Trigger
  React.useEffect(() => {
    if (!targetPortal) return;

    if (prefersReducedMotion) {
      // Immediate transit without camera lerp
      onNavigationComplete(targetPortal);
      return;
    }

    // Calculate focused camera angle toward portal
    const targetVector = new THREE.Vector3(
      targetPortal.posX,
      targetPortal.posY + 1.1,
      targetPortal.posZ
    );

    // Position camera slightly offset from portal
    const offsetVector = new THREE.Vector3(
      targetPortal.posX * 1.4 + 2.0,
      targetPortal.posY + 3.0,
      targetPortal.posZ * 1.4 + 2.0
    );

    flightRef.current = {
      isFlying: true,
      startTime: performance.now(),
      destinationCamera: offsetVector,
      destinationTarget: targetVector,
      portal: targetPortal,
    };
  }, [targetPortal, prefersReducedMotion, onNavigationComplete]);

  // Frame-by-frame camera animation without React state updates
  useFrame(() => {
    if (!flightRef.current.isFlying || !controlsRef.current) return;

    const { destinationCamera, destinationTarget, startTime, portal } = flightRef.current;
    const elapsed = (performance.now() - startTime) / 1000;
    const duration = 0.8; // 800ms flight

    const t = Math.min(elapsed / duration, 1.0);
    // Smooth cubic ease-out
    const ease = 1 - Math.pow(1 - t, 3);

    camera.position.lerp(destinationCamera, ease * 0.15);
    controlsRef.current.target.lerp(destinationTarget, ease * 0.15);
    controlsRef.current.update();

    if (t >= 0.98) {
      flightRef.current.isFlying = false;
      if (portal) {
        onNavigationComplete(portal);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      minDistance={7}
      maxDistance={25}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.15}
    />
  );
}
