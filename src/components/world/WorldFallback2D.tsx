"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Compass,
  Boxes,
  Scroll,
  Layers,
  Sparkles,
  Radio,
  ArrowRight,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { sanitizePortalRoute } from "@/lib/world/validation";
import type { LocalizedPortal } from "@/services/public-queries";

interface WorldFallback2DProps {
  sceneName: string;
  portals: LocalizedPortal[];
  isUnsupportedWebGL?: boolean;
  onRetryWebGL?: () => void;
}

function getPortalIcon(route: string) {
  if (route.includes("project")) return Boxes;
  if (route.includes("about")) return Scroll;
  if (route.includes("experience")) return Layers;
  if (route.includes("skill")) return Sparkles;
  if (route.includes("contact")) return Radio;
  return Compass;
}

export function WorldFallback2D({
  sceneName,
  portals,
  isUnsupportedWebGL = false,
  onRetryWebGL,
}: WorldFallback2DProps) {
  return (
    <div
      role="region"
      aria-label="2D Accessible Diorama Stage"
      className="relative flex flex-col items-center justify-center rounded-xl border border-[var(--realm-border)] bg-[var(--realm-bg-card)] p-6 sm:p-10 shadow-xl overflow-hidden"
    >
      {/* Subtle Background Ambience */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[var(--realm-amber)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[var(--realm-moss)]/15 blur-3xl" />

      {/* Notice Header */}
      <div className="relative z-10 w-full mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--realm-border)]/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--realm-moss-bright)]" />
            <h3 className="font-serif text-lg font-semibold text-[var(--realm-text-primary)]">
              {sceneName} • 2D Accessible Diorama
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--realm-text-secondary)]">
            High-contrast, keyboard-accessible portal index with verifiable spatial coordinates.
          </p>
        </div>

        {isUnsupportedWebGL ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-[var(--realm-clay)]/40 text-[var(--realm-clay)] text-xs gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>WebGL Inactive / Standard Mode</span>
            </Badge>
            {onRetryWebGL && (
              <Button variant="ghost" size="sm" onClick={onRetryWebGL} className="text-xs font-mono">
                Retry 3D
              </Button>
            )}
          </div>
        ) : (
          <Badge variant="moss" className="font-mono text-xs gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            <span>ACCESSIBLE 2D MODE</span>
          </Badge>
        )}
      </div>

      {/* Grid of Portals */}
      <div className="relative z-10 w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portals.map((portal) => {
          const safeRoute = sanitizePortalRoute(portal.targetRoute);
          const Icon = getPortalIcon(safeRoute);

          return (
            <Link
              key={portal.id}
              href={safeRoute as any}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--realm-amber)] rounded-xl"
            >
              <Card className="h-full transition-all duration-300 group-hover:border-[var(--realm-amber)] group-hover:bg-[var(--realm-bg-surface)]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--realm-border)] bg-[var(--realm-bg)] text-[var(--realm-amber)] transition-transform group-hover:scale-110">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-[10px] text-[var(--realm-amber)] bg-[var(--realm-bg)] px-2 py-0.5 rounded border border-[var(--realm-border)]/60">
                      [{portal.posX.toFixed(0)}, {portal.posY.toFixed(0)}, {portal.posZ.toFixed(0)}]
                    </span>
                  </div>
                  <CardTitle className="text-base font-serif group-hover:text-[var(--realm-amber)] transition-colors">
                    {portal.label}
                  </CardTitle>
                  <CardDescription className="font-mono text-[11px] text-[var(--realm-text-muted)]">
                    Target: {safeRoute}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-1 font-mono text-xs font-semibold text-[var(--realm-amber)] transition-transform group-hover:translate-x-1">
                    <span>Venture Through Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
