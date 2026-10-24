import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getThemePresetsAdminAction } from "@/actions/theme-actions";
import { ThemeManager } from "@/components/admin/ThemeManager";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  const presets = await getThemePresetsAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Theme & Visual Design Tokens"
        description="Fine-tune colors, tactile border radiuses, typography pairings, and indie aesthetic presets."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <ThemeManager initialPresets={presets as any} />
      </main>
    </div>
  );
}
