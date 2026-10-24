"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { restoreContentRevision } from "@/lib/revisions";

export async function getRevisionsAdminAction(entityType?: string, entityId?: string) {
  await requireAdminSession();

  const where: any = {};
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;

  return await db.contentRevision.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function restoreRevisionAdminAction(revisionId: string) {
  const admin = await requireAdminSession();
  return await restoreContentRevision({ revisionId, actorId: admin.id });
}
