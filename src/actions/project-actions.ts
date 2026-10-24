"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { recordAuditLog } from "@/lib/audit";
import { createContentRevision } from "@/lib/revisions";
import { revalidatePath, updateTag } from "next/cache";
import { ProjectFormSchema, type ProjectFormData } from "@/schemas";

export async function getProjectsAdminAction() {
  await requireAdminSession();

  const projects = await db.project.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    include: {
      translations: true,
      tags: true,
      media: {
        include: { mediaAsset: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return projects;
}

export async function getProjectByIdAdminAction(id: string) {
  await requireAdminSession();

  const project = await db.project.findUnique({
    where: { id },
    include: {
      translations: true,
      tags: true,
      media: {
        include: { mediaAsset: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!project) return null;

  const enTranslation = project.translations.find((t) => t.locale === "en") || {
    title: "",
    summary: "",
    caseStudy: "",
    metricsJson: [],
  };
  const idTranslation = project.translations.find((t) => t.locale === "id") || {
    title: "",
    summary: "",
    caseStudy: "",
    metricsJson: [],
  };

  return {
    projectId: project.id,
    slug: project.slug,
    featured: project.featured,
    order: project.order,
    status: project.status,
    repoUrl: project.repoUrl || "",
    liveUrl: project.liveUrl || "",
    tags: project.tags.map((t) => t.name),
    mediaIds: project.media.map((m) => m.mediaAssetId),
    en: {
      title: enTranslation.title,
      summary: enTranslation.summary,
      caseStudy: enTranslation.caseStudy,
      metrics: Array.isArray(enTranslation.metricsJson)
        ? (enTranslation.metricsJson as { label: string; value: string }[])
        : [],
    },
    id: {
      title: idTranslation.title,
      summary: idTranslation.summary,
      caseStudy: idTranslation.caseStudy,
      metrics: Array.isArray(idTranslation.metricsJson)
        ? (idTranslation.metricsJson as { label: string; value: string }[])
        : [],
    },
  };
}

export async function createProjectAction(input: ProjectFormData) {
  const admin = await requireAdminSession();
  const validated = ProjectFormSchema.parse(input);

  // Check slug uniqueness
  const existing = await db.project.findUnique({
    where: { slug: validated.slug },
  });
  if (existing) {
    throw new Error(`Project with slug "${validated.slug}" already exists`);
  }

  const created = await db.$transaction(async (tx) => {
    // 1. Create base project
    const project = await tx.project.create({
      data: {
        slug: validated.slug,
        featured: validated.featured,
        order: validated.order,
        status: validated.status,
        repoUrl: validated.repoUrl || null,
        liveUrl: validated.liveUrl || null,
      },
    });

    // 2. Create translations
    await tx.projectTranslation.createMany({
      data: [
        {
          projectId: project.id,
          locale: "en",
          title: validated.en.title,
          summary: validated.en.summary,
          caseStudy: validated.en.caseStudy,
          metricsJson: validated.en.metrics ?? [],
        },
        {
          projectId: project.id,
          locale: "id",
          title: validated.id.title,
          summary: validated.id.summary,
          caseStudy: validated.id.caseStudy,
          metricsJson: validated.id.metrics ?? [],
        },
      ],
    });

    // 3. Create tags
    if (validated.tags.length > 0) {
      await tx.projectTag.createMany({
        data: validated.tags.map((name) => ({
          projectId: project.id,
          name: name.trim(),
        })),
      });
    }

    // 4. Create project media associations
    if (validated.mediaIds.length > 0) {
      await tx.projectMedia.createMany({
        data: validated.mediaIds.map((mediaAssetId, index) => ({
          projectId: project.id,
          mediaAssetId,
          order: index,
        })),
      });
    }

    return project;
  });

  // Snapshot for revisions
  await createContentRevision({
    entityType: "Project",
    entityId: created.id,
    snapshot: {
      project: {
        slug: validated.slug,
        featured: validated.featured,
        order: validated.order,
        status: validated.status,
        repoUrl: validated.repoUrl,
        liveUrl: validated.liveUrl,
      },
      translations: [
        { locale: "en", ...validated.en, metricsJson: validated.en.metrics },
        { locale: "id", ...validated.id, metricsJson: validated.id.metrics },
      ],
      tags: validated.tags,
    },
    authorId: admin.id,
  });

  // Audit Log
  await recordAuditLog({
    actorId: admin.id,
    action: "CREATE_PROJECT",
    entityType: "Project",
    entityId: created.id,
    details: {
      slug: created.slug,
      status: created.status,
    },
  });

  updateTag("projects");
  revalidatePath("/[locale]/projects", "page");
  revalidatePath(`/[locale]/projects/${created.slug}`, "page");

  return { success: true, project: created };
}

export async function updateProjectAction(id: string, input: ProjectFormData) {
  const admin = await requireAdminSession();
  const validated = ProjectFormSchema.parse(input);

  // Check slug uniqueness conflict
  const existing = await db.project.findFirst({
    where: { slug: validated.slug, NOT: { id } },
  });
  if (existing) {
    throw new Error(`Project with slug "${validated.slug}" already belongs to another project`);
  }

  const updated = await db.$transaction(async (tx) => {
    // 1. Update project base
    const project = await tx.project.update({
      where: { id },
      data: {
        slug: validated.slug,
        featured: validated.featured,
        order: validated.order,
        status: validated.status,
        repoUrl: validated.repoUrl || null,
        liveUrl: validated.liveUrl || null,
      },
    });

    // 2. Upsert translations
    await tx.projectTranslation.upsert({
      where: { projectId_locale: { projectId: id, locale: "en" } },
      create: {
        projectId: id,
        locale: "en",
        title: validated.en.title,
        summary: validated.en.summary,
        caseStudy: validated.en.caseStudy,
        metricsJson: validated.en.metrics ?? [],
      },
      update: {
        title: validated.en.title,
        summary: validated.en.summary,
        caseStudy: validated.en.caseStudy,
        metricsJson: validated.en.metrics ?? [],
      },
    });

    await tx.projectTranslation.upsert({
      where: { projectId_locale: { projectId: id, locale: "id" } },
      create: {
        projectId: id,
        locale: "id",
        title: validated.id.title,
        summary: validated.id.summary,
        caseStudy: validated.id.caseStudy,
        metricsJson: validated.id.metrics ?? [],
      },
      update: {
        title: validated.id.title,
        summary: validated.id.summary,
        caseStudy: validated.id.caseStudy,
        metricsJson: validated.id.metrics ?? [],
      },
    });

    // 3. Replace tags
    await tx.projectTag.deleteMany({ where: { projectId: id } });
    if (validated.tags.length > 0) {
      await tx.projectTag.createMany({
        data: validated.tags.map((name) => ({
          projectId: id,
          name: name.trim(),
        })),
      });
    }

    // 4. Replace media associations
    await tx.projectMedia.deleteMany({ where: { projectId: id } });
    if (validated.mediaIds.length > 0) {
      await tx.projectMedia.createMany({
        data: validated.mediaIds.map((mediaAssetId, index) => ({
          projectId: id,
          mediaAssetId,
          order: index,
        })),
      });
    }

    return project;
  });

  // Create point-in-time revision
  await createContentRevision({
    entityType: "Project",
    entityId: updated.id,
    snapshot: {
      project: {
        slug: validated.slug,
        featured: validated.featured,
        order: validated.order,
        status: validated.status,
        repoUrl: validated.repoUrl,
        liveUrl: validated.liveUrl,
      },
      translations: [
        { locale: "en", ...validated.en, metricsJson: validated.en.metrics },
        { locale: "id", ...validated.id, metricsJson: validated.id.metrics },
      ],
      tags: validated.tags,
    },
    authorId: admin.id,
  });

  // Audit log
  await recordAuditLog({
    actorId: admin.id,
    action: "UPDATE_PROJECT",
    entityType: "Project",
    entityId: updated.id,
    details: {
      slug: updated.slug,
      status: updated.status,
    },
  });

  updateTag("projects");
  revalidatePath("/[locale]/projects", "page");
  revalidatePath(`/[locale]/projects/${updated.slug}`, "page");

  return { success: true, project: updated };
}

export async function setProjectStatusAction(id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  const admin = await requireAdminSession();

  const project = await db.project.update({
    where: { id },
    data: { status },
  });

  await recordAuditLog({
    actorId: admin.id,
    action: status === "PUBLISHED" ? "PUBLISH_PROJECT" : status === "ARCHIVED" ? "ARCHIVE_PROJECT" : "UNPUBLISH_PROJECT",
    entityType: "Project",
    entityId: id,
    details: {
      slug: project.slug,
      newStatus: status,
    },
  });

  updateTag("projects");
  revalidatePath("/[locale]/projects", "page");
  revalidatePath(`/[locale]/projects/${project.slug}`, "page");

  return { success: true, status: project.status };
}

export async function deleteProjectAction(id: string) {
  const admin = await requireAdminSession();

  const project = await db.project.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!project) throw new Error("Project not found");

  await db.project.delete({ where: { id } });

  await recordAuditLog({
    actorId: admin.id,
    action: "DELETE_PROJECT",
    entityType: "Project",
    entityId: id,
    details: {
      slug: project.slug,
    },
  });

  updateTag("projects");
  revalidatePath("/[locale]/projects", "page");

  return { success: true, deletedId: id };
}
