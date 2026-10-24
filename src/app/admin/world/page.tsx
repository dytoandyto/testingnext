import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Plus } from "lucide-react";

export default function AdminWorldPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="3D World & Portal Configuration"
        description="Configure diorama coordinates, portal destination routes, ambient lighting, and atmospheric fog."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[var(--realm-amber)]" />
            <span className="text-sm font-semibold">Active Portals & Island Nodes</span>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5 font-mono text-xs">
            <Plus className="h-4 w-4" />
            <span>Add Portal Node</span>
          </Button>
        </div>

        <Card className="space-y-4 p-6">
          <p className="text-xs text-[var(--realm-text-secondary)]">
            World scene configuration module initialized. Portals map coordinates `[x, y, z]` and
            localized destination labels strictly through the PostgreSQL `WorldPortal` table without
            executing untrusted scripts.
          </p>
        </Card>
      </main>
    </div>
  );
}
