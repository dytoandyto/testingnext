import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function AdminThemePage() {
  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Theme & Visual Design Tokens"
        description="Fine-tune colors, tactile border radiuses, typography pairings, and indie aesthetic presets."
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Active Theme Preset: Slate Obsidian & Amber</span>
        </div>

        <Card className="p-6 space-y-4">
          <p className="text-xs text-[var(--realm-text-secondary)]">
            Token engine connected to CSS variables (`--realm-*`). In Phase 6, color palette presets (Obsidian Slate, Ancient Parchment, Moss Canopy) will update directly through the database without code redeployments.
          </p>
        </Card>
      </main>
    </div>
  );
}
