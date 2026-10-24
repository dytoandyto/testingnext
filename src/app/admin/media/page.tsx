import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, CloudUpload, ShieldCheck } from "lucide-react";

export default function AdminMediaPage() {
  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Cloudinary Media Sanctuary"
        description="Securely upload, organize, and monitor asset references across projects and 3D textures."
      />

      <main className="p-6 sm:p-8 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-[var(--realm-amber)]" />
            <span className="text-sm font-semibold">Media Assets</span>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5 font-mono text-xs">
            <CloudUpload className="h-4 w-4" />
            <span>Upload New Asset</span>
          </Button>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--realm-moss-bright)]">
            <ShieldCheck className="h-4 w-4" />
            <span>Server-Signed Direct Cloudinary Integration Architecture Ready</span>
          </div>
          <p className="text-xs text-[var(--realm-text-secondary)]">
            Zero direct client API secrets. Pre-signed upload signatures ensure strict MIME type, file size bounds, and asset verification before persistence in the PostgreSQL `MediaAsset` table.
          </p>
        </Card>
      </main>
    </div>
  );
}
