import * as React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Sanctuary CMS | Indie Realm Management",
  description: "Administrative dashboard for the Indie Realm 3D Portfolio CMS.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--realm-bg)] text-[var(--realm-text-primary)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
