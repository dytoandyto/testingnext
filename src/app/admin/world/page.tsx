import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getWorldSceneAdminAction } from "@/actions/world-actions";
import { WorldSceneManager } from "@/components/admin/WorldSceneManager";

export const dynamic = "force-dynamic";

export default async function AdminWorldPage() {
  const scene = await getWorldSceneAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="3D World & Portal Configuration"
        description="Configure diorama coordinates, portal destination routes, ambient lighting, and atmospheric fog."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <WorldSceneManager initialScene={scene as any} />
      </main>
    </div>
  );
}
