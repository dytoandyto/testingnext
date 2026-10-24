import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getRevisionsAdminAction } from "@/actions/revision-actions";
import { RevisionManager } from "@/components/admin/RevisionManager";

export const dynamic = "force-dynamic";

export default async function AdminRevisionsPage() {
  const revisions = await getRevisionsAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Content Revisions & Rollback Engine"
        description="Inspect point-in-time entity snapshots and restore previous revisions with one click."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <RevisionManager initialRevisions={revisions as any} />
      </main>
    </div>
  );
}
