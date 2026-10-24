import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function AdminAuditLogsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Administrative Audit Logs"
        description="Immutable record of administrative logins, publications, edits, and deletions."
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[var(--realm-amber)]" />
          <span className="text-sm font-semibold">Security Audit Trail</span>
        </div>

        <Card className="p-6">
          <p className="text-xs text-[var(--realm-text-secondary)]">
            Audit logging table initialized. Sensitive mutations are tracked with timestamp, hashed actor ID, action type, and target entity.
          </p>
        </Card>
      </main>
    </div>
  );
}
