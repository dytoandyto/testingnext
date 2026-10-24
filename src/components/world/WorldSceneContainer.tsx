"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  RotateCcw,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";
import { WorldFallback2D } from "./WorldFallback2D";
import { detectWebGLSupport, sanitizePortalRoute } from "@/lib/world/validation";
import type { LocalizedPortal } from "@/services/public-queries";

// Dynamic import with ssr: false for Canvas
const WorldSceneCanvas = dynamic(() => import("./WorldSceneCanvas"), {
  ssr: false,
  loading: () => <WorldSceneLoadingState />,
});

interface WorldSceneContainerProps {
  sceneName?: string;
  fogColor?: string;
  fogDensity?: number;
  sunLightIntensity?: number;
  ambientLightIntensity?: number;
  sunLightColor?: string;
  ambientLightColor?: string;
  portals?: LocalizedPortal[];
}

function WorldSceneLoadingState() {
  return (
    <div className="flex h-full min-h-[460px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[var(--realm-border)] bg-[var(--realm-bg)]/90 p-8 text-center sm:min-h-[520px]">
      <div className="relative mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--realm-amber)]/40 bg-[var(--realm-bg-surface)] shadow-xl">
          <Compass className="h-8 w-8 animate-spin text-[var(--realm-amber)] [animation-duration:8s]" />
        </div>
        <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-[var(--realm-amber)]/10 blur-md" />
      </div>
      <h4 className="font-serif text-base text-[var(--realm-text-primary)]">
        Synchronizing Spatial Canvas
      </h4>
      <p className="mt-1 font-mono text-xs text-[var(--realm-text-muted)]">
        Compiling shaders & assembling archipelago diorama...
      </p>
    </div>
  );
}

const DEFAULT_PORTALS: LocalizedPortal[] = [
  { id: "p1", targetRoute: "/projects", posX: -4, posY: 0, posZ: 2, rotY: 0.5, label: "Workshop Creations", order: 1 },
  { id: "p2", targetRoute: "/about", posX: 0, posY: 0, posZ: 5, rotY: 0, label: "Chronicle Biography", order: 2 },
  { id: "p3", targetRoute: "/experience", posX: 4, posY: 0, posZ: 2, rotY: -0.5, label: "Expeditions", order: 3 },
  { id: "p4", targetRoute: "/skills", posX: -3, posY: 0, posZ: -3, rotY: 2.2, label: "Arcane Mastery", order: 4 },
  { id: "p5", targetRoute: "/contact", posX: 3, posY: 0, posZ: -3, rotY: -2.2, label: "Signal Beacon", order: 5 },
];

export function WorldSceneContainer({
  sceneName = "Astral Archipelago",
  fogColor = "#141817",
  fogDensity = 0.025,
  sunLightIntensity = 1.5,
  ambientLightIntensity = 0.85,
  sunLightColor = "#fff1d6",
  ambientLightColor = "#9bb4a8",
  portals = DEFAULT_PORTALS,
}: WorldSceneContainerProps) {
  const router = useRouter();

  // WebGL & Client Feature Detection initialized lazily
  const [hasWebGL, setHasWebGL] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return detectWebGLSupport();
  });
  const [is2DMode, setIs2DMode] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Scene state
  const [targetPortal, setTargetPortal] = React.useState<LocalizedPortal | null>(null);
  const [resetTrigger, setResetTrigger] = React.useState(0);
  const [isNavigating, setIsNavigating] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const activePortals = portals.length > 0 ? portals : DEFAULT_PORTALS;

  const handleSelectPortal = (portal: LocalizedPortal) => {
    setTargetPortal(portal);
    setIsNavigating(true);
  };

  const handleNavigationComplete = (portal: LocalizedPortal) => {
    const safeRoute = sanitizePortalRoute(portal.targetRoute);
    router.push(safeRoute as any);
  };

  const handleResetCamera = () => {
    setTargetPortal(null);
    setResetTrigger((prev) => prev + 1);
  };

  const toggleReducedMotion = () => {
    setPrefersReducedMotion((prev) => !prev);
  };

  const toggleMode = () => {
    setIs2DMode((prev) => !prev);
  };

  // If WebGL is confirmed unsupported or user toggled to 2D
  if (hasWebGL === false || is2DMode) {
    return (
      <div className="space-y-3">
        <WorldFallback2D
          sceneName={sceneName}
          portals={activePortals}
          isUnsupportedWebGL={hasWebGL === false}
          onRetryWebGL={hasWebGL === false ? () => setHasWebGL(detectWebGLSupport()) : undefined}
        />
        {hasWebGL !== false && (
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleMode}
              className="gap-1.5 font-mono text-xs"
            >
              <Compass className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
              <span>Enter 3D Spatial Diorama</span>
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] shadow-2xl">
      {/* Top HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <Badge variant="moss" className="font-mono text-xs shadow-md backdrop-blur-md bg-[var(--realm-bg-card)]/90">
            <span className="h-2 w-2 rounded-full animate-pulse bg-[var(--realm-moss-bright)] mr-1" />
            <span>{sceneName.toUpperCase()}</span>
          </Badge>
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--realm-text-muted)] bg-[var(--realm-bg)]/80 px-2 py-0.5 rounded border border-[var(--realm-border)]/50 backdrop-blur-sm">
            {activePortals.length} PORTALS ACTIVE
          </span>
        </div>

        {/* HUD Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Reset Camera */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetCamera}
            title="Reset Camera Angle"
            className="h-8 px-2.5 font-mono text-xs gap-1 shadow-md backdrop-blur-md bg-[var(--realm-bg-card)]/90"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
            <span className="hidden md:inline">Reset Angle</span>
          </Button>

          {/* Reduced Motion Toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleReducedMotion}
            title={prefersReducedMotion ? "Enable Camera Motion" : "Reduce Motion"}
            className={`h-8 px-2.5 font-mono text-xs gap-1 shadow-md backdrop-blur-md ${
              prefersReducedMotion
                ? "border-[var(--realm-amber)] text-[var(--realm-amber)] bg-[var(--realm-bg-surface)]"
                : "bg-[var(--realm-bg-card)]/90"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden md:inline">
              {prefersReducedMotion ? "Reduced Motion" : "Motion Active"}
            </span>
          </Button>

          {/* Switch to 2D Mode */}
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleMode}
            title="Switch to 2D Accessible View"
            className="h-8 px-2.5 font-mono text-xs gap-1 shadow-md backdrop-blur-md bg-[var(--realm-bg-card)]/90"
          >
            <Layers className="h-3.5 w-3.5 text-[var(--realm-amber)]" />
            <span>2D View</span>
          </Button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative h-[480px] w-full sm:h-[560px] lg:h-[620px]">
        <WorldSceneCanvas
          portals={activePortals}
          fogColor={fogColor}
          fogDensity={fogDensity}
          sunLightIntensity={sunLightIntensity}
          ambientLightIntensity={ambientLightIntensity}
          sunLightColor={sunLightColor}
          ambientLightColor={ambientLightColor}
          targetPortal={targetPortal}
          resetTrigger={resetTrigger}
          prefersReducedMotion={prefersReducedMotion}
          onSelectPortal={handleSelectPortal}
          onNavigationComplete={handleNavigationComplete}
          onError={() => setIs2DMode(true)}
        />
      </div>

      {/* Bottom HUD: Portal Quick Jump Pills & Interaction Hint */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col items-center gap-2 pointer-events-none">
        {/* Portal Pills */}
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-xl border border-[var(--realm-border)]/80 bg-[var(--realm-bg)]/85 shadow-lg backdrop-blur-md">
          {activePortals.map((p) => {
            const isTargeted = targetPortal?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPortal(p)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] transition-all duration-200 select-none ${
                  isTargeted
                    ? "border border-[var(--realm-amber)] bg-[var(--realm-bg-surface)] text-[var(--realm-amber)] font-semibold shadow-sm"
                    : "text-[var(--realm-text-secondary)] hover:text-[var(--realm-amber)] hover:bg-[var(--realm-bg-surface)]/60"
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[9px] opacity-60">
                  [{p.posX.toFixed(0)}, {p.posZ.toFixed(0)}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Helper Legend */}
        <p className="font-mono text-[10px] text-[var(--realm-text-muted)] bg-[var(--realm-bg)]/80 px-3 py-0.5 rounded-full border border-[var(--realm-border)]/50 backdrop-blur-sm">
          Orbit: Drag • Zoom: Scroll / Pinch • Travel: Click Portals or Quick Pills
        </p>
      </div>

      {/* Transit Vignette Transition */}
      <AnimatePresence>
        {isNavigating && targetPortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[var(--realm-bg)]/40 backdrop-blur-[2px]"
          >
            <div className="flex items-center gap-2 rounded-xl border border-[var(--realm-amber)] bg-[var(--realm-bg-surface)] px-4 py-2 font-mono text-xs text-[var(--realm-amber)] shadow-2xl">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Transiting to {targetPortal.label}...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
