import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectFormSchema, setProjectStatusAction } from "@/actions/project-actions";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";

vi.mock("@/lib/auth/guards", () => ({
  requireAdminSession: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    project: {
      update: vi.fn(),
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

describe("CMS Project CRUD & Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates compliant project authoring payloads", () => {
    const validData = {
      slug: "interactive-3d-portal",
      featured: true,
      order: 1,
      status: "DRAFT" as const,
      repoUrl: "https://github.com/architect/portal",
      liveUrl: "https://realm.io/demo",
      tags: ["Three.js", "React 19"],
      mediaIds: [],
      en: {
        title: "Interactive 3D Portal",
        summary: "A stylized diorama navigation system for web portfolios.",
        caseStudy: "Comprehensive architectural deep dive covering Three.js instancing and post-processing pipelines.",
        metrics: [{ label: "FPS", value: "60" }],
      },
      id: {
        title: "Portal 3D Interaktif",
        summary: "Sistem navigasi diorama bergaya untuk portofolio web.",
        caseStudy: "Pembahasan mendalam arsitektur teknis mencakup instancing Three.js dan alur pasca-pemrosesan.",
        metrics: [{ label: "FPS", value: "60" }],
      },
    };

    const parsed = ProjectFormSchema.parse(validData);
    expect(parsed.slug).toBe("interactive-3d-portal");
    expect(parsed.en.metrics).toHaveLength(1);
    expect(parsed.tags).toContain("Three.js");
  });

  it("rejects invalid slugs with uppercase or special characters", () => {
    const invalidSlugData = {
      slug: "Invalid_Slug!#",
      featured: false,
      order: 0,
      status: "DRAFT" as const,
      en: { title: "Title", summary: "Summary at least 10 chars", caseStudy: "Case study at least 20 chars" },
      id: { title: "Judul", summary: "Ringkasan setidaknya 10 kar", caseStudy: "Studi kasus setidaknya 20 kar" },
    };

    expect(() => ProjectFormSchema.parse(invalidSlugData)).toThrow();
  });

  it("executes publication status transitions with audit trails", async () => {
    (requireAdminSession as any).mockResolvedValue({ id: "admin_1", role: "ADMIN" });
    (db.project.update as any).mockResolvedValue({ id: "proj_1", slug: "voxel-engine", status: "PUBLISHED" });

    const result = await setProjectStatusAction("proj_1", "PUBLISHED");

    expect(result).toEqual({ success: true, status: "PUBLISHED" });
    expect(db.project.update).toHaveBeenCalledWith({
      where: { id: "proj_1" },
      data: { status: "PUBLISHED" },
    });
  });

  it("blocks unauthenticated users from mutating project status", async () => {
    (requireAdminSession as any).mockRejectedValue(new Error("Unauthorized"));

    await expect(setProjectStatusAction("proj_1", "PUBLISHED")).rejects.toThrow("Unauthorized");
  });
});
