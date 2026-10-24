import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getSiteSettingsAdminAction } from "@/actions/settings-actions";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Global Site & SEO Settings"
        description="Configure site title, metadata, fallback locale, analytics, and contact credentials."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <SettingsManager initialSettings={settings as any} />
      </main>
    </div>
  );
}
