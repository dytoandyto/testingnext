import { db } from "@/lib/db";
import { headers } from "next/headers";
import crypto from "crypto";

export async function recordAuditLog({
  actorId,
  action,
  entityType,
  entityId,
  details,
}: {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    let clientIp = "unknown";
    try {
      const headerList = await headers();
      clientIp =
        headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headerList.get("x-real-ip") ||
        "system";
    } catch {
      // In tests or outside request store
      clientIp = "local-context";
    }

    const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex").slice(0, 16);

    return await db.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId: entityId ?? null,
        ipHash,
        detailsJson: (details as any) ?? {},
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
    return null;
  }
}
