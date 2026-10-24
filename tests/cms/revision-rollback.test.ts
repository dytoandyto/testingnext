import { describe, it, expect, vi, beforeEach } from "vitest";
import { restoreContentRevision } from "@/lib/revisions";
import { db } from "@/lib/db";
import { updateTag } from "next/cache";

vi.mock("@/lib/db", () => ({
  db: {
    contentRevision: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  updateTag: vi.fn(),
}));

describe("Content Revision History & Safe Restore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws an error when revision record is missing", async () => {
    (db.contentRevision.findUnique as any).mockResolvedValue(null);

    await expect(
      restoreContentRevision({ revisionId: "rev_nonexistent", actorId: "admin_1" })
    ).rejects.toThrow("Revision rev_nonexistent not found");
  });

  it("safely restores Project snapshot inside transaction", async () => {
    const mockSnapshot = {
      project: {
        slug: "restored-portal",
        featured: true,
        order: 2,
        status: "PUBLISHED",
        repoUrl: "https://github.com/...",
        liveUrl: "https://demo.io",
      },
      translations: [
        {
          locale: "en",
          title: "Restored English Title",
          summary: "Restored English Summary",
          caseStudy: "Restored English Case Study Deep Dive",
          metricsJson: [{ label: "Speed", value: "100" }],
        },
      ],
      tags: ["TypeScript", "Next.js"],
    };

    (db.contentRevision.findUnique as any).mockResolvedValue({
      id: "rev_001",
      entityType: "Project",
      entityId: "proj_123",
      snapshotJson: mockSnapshot,
      createdAt: new Date(),
    });

    // Mock transaction implementation
    const txMock = {
      project: { update: vi.fn() },
      projectTranslation: { upsert: vi.fn() },
      projectTag: { deleteMany: vi.fn(), createMany: vi.fn() },
    };
    (db.$transaction as any).mockImplementation(async (callback: any) => {
      return await callback(txMock);
    });

    const result = await restoreContentRevision({ revisionId: "rev_001", actorId: "admin_1" });

    expect(result).toEqual({ success: true, entityType: "Project", entityId: "proj_123" });
    expect(txMock.project.update).toHaveBeenCalledWith({
      where: { id: "proj_123" },
      data: mockSnapshot.project,
    });
    expect(txMock.projectTranslation.upsert).toHaveBeenCalled();
    expect(updateTag).toHaveBeenCalledWith("projects");
  });
});
