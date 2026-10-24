import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateCloudinarySignature,
  verifyCloudinarySignature,
  ALLOWED_FORMATS,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/media/cloudinary";
import { deleteMediaAssetAction } from "@/actions/media-actions";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

vi.mock("@/lib/auth/guards", () => ({
  requireAdminSession: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    mediaAsset: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}));

describe("CMS Media Security & Integrity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates deterministic SHA-1 signatures for authorized uploads", () => {
    const sigData = generateCloudinarySignature("test-folder");

    expect(sigData).toHaveProperty("timestamp");
    expect(sigData).toHaveProperty("signature");
    expect(sigData.folder).toBe("test-folder");
    expect(typeof sigData.signature).toBe("string");
    expect(sigData.signature.length).toBe(40); // 40-char SHA1 hex
  });

  it("accurately verifies signatures from client uploads", () => {
    // Generate valid signature using same helper
    const sigData = generateCloudinarySignature("indie-realm/media");
    const isValid = verifyCloudinarySignature(
      { folder: "indie-realm/media", timestamp: sigData.timestamp },
      sigData.signature
    );

    expect(isValid).toBe(true);

    // Tampered params should fail verification
    const isInvalid = verifyCloudinarySignature(
      { folder: "hacked-folder", timestamp: sigData.timestamp },
      sigData.signature
    );
    expect(isInvalid).toBe(false);
  });

  it("enforces strict size and MIME type standards", () => {
    expect(ALLOWED_FORMATS).toContain("image/webp");
    expect(ALLOWED_FORMATS).toContain("image/png");
    expect(ALLOWED_FORMATS).toContain("video/mp4");
    expect(MAX_IMAGE_BYTES).toBe(10 * 1024 * 1024);
    expect(MAX_VIDEO_BYTES).toBe(50 * 1024 * 1024);
  });

  it("blocks deletion of media assets referenced by projects", async () => {
    (requireAdminSession as any).mockResolvedValue({ id: "admin_1", role: "ADMIN" });

    // Mock asset with active project reference
    (db.mediaAsset.findUnique as any).mockResolvedValue({
      id: "asset_123",
      publicId: "portfolio/hero",
      format: "webp",
      projectMedia: [
        {
          id: "pm_1",
          project: { id: "p1", slug: "indie-portfolio", status: "PUBLISHED" },
        },
      ],
    });

    await expect(deleteMediaAssetAction("asset_123")).rejects.toThrow(
      /Cannot delete asset: It is currently linked to 1 project/
    );

    expect(db.mediaAsset.delete).not.toHaveBeenCalled();
  });

  it("permits deletion when media asset is unreferenced", async () => {
    (requireAdminSession as any).mockResolvedValue({ id: "admin_1", role: "ADMIN" });

    (db.mediaAsset.findUnique as any).mockResolvedValue({
      id: "asset_unlinked",
      publicId: "portfolio/old_draft",
      format: "jpg",
      projectMedia: [],
    });
    (db.mediaAsset.delete as any).mockResolvedValue({ id: "asset_unlinked" });

    const result = await deleteMediaAssetAction("asset_unlinked");
    expect(result).toEqual({ success: true, deletedId: "asset_unlinked" });
    expect(db.mediaAsset.delete).toHaveBeenCalledWith({ where: { id: "asset_unlinked" } });
  });
});
