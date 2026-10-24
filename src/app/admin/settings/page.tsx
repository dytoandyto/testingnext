import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Global Site Settings"
        description="Configure site title, metadata, fallback locale, analytics, and contact credentials."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">General System Properties</span>
        </div>

        <Card className="p-6">
          <p className="text-xs text-[var(--realm-text-secondary)]">
            Global site settings module initialized. Persisted in PostgreSQL `SiteSettings` table.
          </p>
        </Card>
      </main>
    </div>
  );
}
