"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

export async function getAuditLogsAdminAction(limit = 100) {
  await requireAdminSession();

  return await db.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}
