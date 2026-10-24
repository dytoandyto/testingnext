"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { recordAuditLog } from "@/lib/audit";
import {
  generateCloudinarySignature,
  deleteFromCloudinary,
  ALLOWED_FORMATS,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/media/cloudinary";
import { updateTag } from "next/cache";

const RegisterMediaSchema = z.object({
  publicId: z.string().min(1, "Public ID is required"),
  secureUrl: z.string().url("Valid secure URL is required"),
  format: z.string().min(1, "Format is required"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  bytes: z.number().int().positive(),
  altText: z.string().optional().default(""),
});

export async function getUploadSignatureAction(folder = "indie-realm/media") {
  await requireAdminSession();
  const signatureData = generateCloudinarySignature(folder);
  return { success: true, data: signatureData };
}

export async function registerMediaAssetAction(input: z.infer<typeof RegisterMediaSchema>) {
  const admin = await requireAdminSession();
  const validated = RegisterMediaSchema.parse(input);

  // Validate format and size
  const isVideo = validated.format === "mp4" || validated.format === "webm";
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

  if (validated.bytes > maxBytes) {
    throw new Error(`Asset exceeds maximum allowable size (${maxBytes / (1024 * 1024)}MB)`);
  }

  const asset = await db.mediaAsset.create({
    data: {
      publicId: validated.publicId,
      secureUrl: validated.secureUrl,
      format: validated.format,
      width: validated.width,
      height: validated.height,
      bytes: validated.bytes,
      altText: validated.altText || null,
    },
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "UPLOAD_MEDIA",
    entityType: "MediaAsset",
    entityId: asset.id,
    details: {
      publicId: asset.publicId,
      bytes: asset.bytes,
      format: asset.format,
    },
  });

  updateTag("media");
  return { success: true, data: asset };
}

export async function deleteMediaAssetAction(assetId: string) {
  const admin = await requireAdminSession();

  const asset = await db.mediaAsset.findUnique({
    where: { id: assetId },
    include: {
      projectMedia: {
        include: {
          project: {
            select: { id: true, slug: true, status: true },
          },
        },
      },
    },
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  // Protection: Protect assets still referenced by published or draft content!
  if (asset.projectMedia.length > 0) {
    const referencingSlugs = asset.projectMedia.map((pm) => pm.project.slug).join(", ");
    throw new Error(
      `Cannot delete asset: It is currently linked to ${asset.projectMedia.length} project(s) [${referencingSlugs}]. Remove all project attachments first.`
    );
  }

  // Safe to delete
  await deleteFromCloudinary(asset.publicId, asset.format === "mp4" || asset.format === "webm" ? "video" : "image");
  await db.mediaAsset.delete({ where: { id: assetId } });

  await recordAuditLog({
    actorId: admin.id,
    action: "DELETE_MEDIA",
    entityType: "MediaAsset",
    entityId: assetId,
    details: {
      publicId: asset.publicId,
    },
  });

  updateTag("media");
  return { success: true, deletedId: assetId };
}

export async function getMediaAssetsAdminAction() {
  await requireAdminSession();

  const assets = await db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { projectMedia: true },
      },
    },
  });

  return assets;
}
