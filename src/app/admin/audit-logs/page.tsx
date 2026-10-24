import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAuditLogsAdminAction } from "@/actions/audit-actions";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogsAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Administrative Audit Logs"
        description="Immutable record of administrative logins, publications, edits, and deletions."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <AuditLogViewer initialLogs={logs as any} />
      </main>
    </div>
  );
}
