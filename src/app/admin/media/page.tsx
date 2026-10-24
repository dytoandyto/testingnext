import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getMediaAssetsAdminAction } from "@/actions/media-actions";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const assets = await getMediaAssetsAdminAction();

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Media Vault Sanctuary"
        description="Securely upload, organize, and monitor asset references across projects with referential integrity protection."
      />

      <main className="flex-1 space-y-6 p-6 sm:p-8">
        <MediaLibrary initialAssets={assets as any} />
      </main>
    </div>
  );
}
