"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { recordAuditLog } from "@/lib/audit";
import { createContentRevision } from "@/lib/revisions";
import { revalidatePath, updateTag } from "next/cache";
import { ExperienceFormSchema, type ExperienceFormData } from "@/schemas";

export async function getExperiencesAdminAction() {
  await requireAdminSession();

  const experiences = await db.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
    include: {
      translations: true,
    },
  });

  return experiences;
}

export async function getExperienceByIdAdminAction(id: string) {
  await requireAdminSession();

  const exp = await db.experience.findUnique({
    where: { id },
    include: { translations: true },
  });

  if (!exp) return null;

  const enTranslation = exp.translations.find((t) => t.locale === "en") || {
    role: "",
    description: "",
    highlightsJson: [],
  };
  const idTranslation = exp.translations.find((t) => t.locale === "id") || {
    role: "",
    description: "",
    highlightsJson: [],
  };

  return {
    experienceId: exp.id,
    startDate: exp.startDate.toISOString().split("T")[0],
    endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : "",
    isCurrent: exp.isCurrent,
    organization: exp.organization,
    location: exp.location,
    order: exp.order,
    status: exp.status,
    en: {
      role: enTranslation.role,
      description: enTranslation.description,
      highlights: Array.isArray(enTranslation.highlightsJson)
        ? (enTranslation.highlightsJson as string[])
        : [],
    },
    id: {
      role: idTranslation.role,
      description: idTranslation.description,
      highlights: Array.isArray(idTranslation.highlightsJson)
        ? (idTranslation.highlightsJson as string[])
        : [],
    },
  };
}

export async function createExperienceAction(input: ExperienceFormData) {
  const admin = await requireAdminSession();
  const validated = ExperienceFormSchema.parse(input);

  const start = new Date(validated.startDate);
  const end = validated.isCurrent || !validated.endDate ? null : new Date(validated.endDate);

  const created = await db.$transaction(async (tx) => {
    const exp = await tx.experience.create({
      data: {
        startDate: start,
        endDate: end,
        isCurrent: validated.isCurrent,
        organization: validated.organization,
        location: validated.location,
        order: validated.order,
        status: validated.status,
      },
    });

    await tx.experienceTranslation.createMany({
      data: [
        {
          experienceId: exp.id,
          locale: "en",
          role: validated.en.role,
          description: validated.en.description,
          highlightsJson: validated.en.highlights,
        },
        {
          experienceId: exp.id,
          locale: "id",
          role: validated.id.role,
          description: validated.id.description,
          highlightsJson: validated.id.highlights,
        },
      ],
    });

    return exp;
  });

  await createContentRevision({
    entityType: "Experience",
    entityId: created.id,
    snapshot: {
      experience: {
        startDate: start.toISOString(),
        endDate: end ? end.toISOString() : null,
        isCurrent: validated.isCurrent,
        organization: validated.organization,
        location: validated.location,
        order: validated.order,
        status: validated.status,
      },
      translations: [
        { locale: "en", ...validated.en, highlightsJson: validated.en.highlights },
        { locale: "id", ...validated.id, highlightsJson: validated.id.highlights },
      ],
    },
    authorId: admin.id,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "CREATE_EXPERIENCE",
    entityType: "Experience",
    entityId: created.id,
    details: {
      organization: created.organization,
      status: created.status,
    },
  });

  updateTag("experiences");
  revalidatePath("/[locale]/experience", "page");

  return { success: true, experience: created };
}

export async function updateExperienceAction(id: string, input: ExperienceFormData) {
  const admin = await requireAdminSession();
  const validated = ExperienceFormSchema.parse(input);

  const start = new Date(validated.startDate);
  const end = validated.isCurrent || !validated.endDate ? null : new Date(validated.endDate);

  const updated = await db.$transaction(async (tx) => {
    const exp = await tx.experience.update({
      where: { id },
      data: {
        startDate: start,
        endDate: end,
        isCurrent: validated.isCurrent,
        organization: validated.organization,
        location: validated.location,
        order: validated.order,
        status: validated.status,
      },
    });

    await tx.experienceTranslation.upsert({
      where: { experienceId_locale: { experienceId: id, locale: "en" } },
      create: {
        experienceId: id,
        locale: "en",
        role: validated.en.role,
        description: validated.en.description,
        highlightsJson: validated.en.highlights,
      },
      update: {
        role: validated.en.role,
        description: validated.en.description,
        highlightsJson: validated.en.highlights,
      },
    });

    await tx.experienceTranslation.upsert({
      where: { experienceId_locale: { experienceId: id, locale: "id" } },
      create: {
        experienceId: id,
        locale: "id",
        role: validated.id.role,
        description: validated.id.description,
        highlightsJson: validated.id.highlights,
      },
      update: {
        role: validated.id.role,
        description: validated.id.description,
        highlightsJson: validated.id.highlights,
      },
    });

    return exp;
  });

  await createContentRevision({
    entityType: "Experience",
    entityId: updated.id,
    snapshot: {
      experience: {
        startDate: start.toISOString(),
        endDate: end ? end.toISOString() : null,
        isCurrent: validated.isCurrent,
        organization: validated.organization,
        location: validated.location,
        order: validated.order,
        status: validated.status,
      },
      translations: [
        { locale: "en", ...validated.en, highlightsJson: validated.en.highlights },
        { locale: "id", ...validated.id, highlightsJson: validated.id.highlights },
      ],
    },
    authorId: admin.id,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "UPDATE_EXPERIENCE",
    entityType: "Experience",
    entityId: updated.id,
    details: {
      organization: updated.organization,
      status: updated.status,
    },
  });

  updateTag("experiences");
  revalidatePath("/[locale]/experience", "page");

  return { success: true, experience: updated };
}

export async function setExperienceStatusAction(
  id: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
) {
  const admin = await requireAdminSession();

  const exp = await db.experience.update({
    where: { id },
    data: { status },
  });

  await recordAuditLog({
    actorId: admin.id,
    action: status === "PUBLISHED" ? "PUBLISH_EXPERIENCE" : status === "ARCHIVED" ? "ARCHIVE_EXPERIENCE" : "UNPUBLISH_EXPERIENCE",
    entityType: "Experience",
    entityId: id,
    details: {
      organization: exp.organization,
      status,
    },
  });

  updateTag("experiences");
  revalidatePath("/[locale]/experience", "page");

  return { success: true, status: exp.status };
}

export async function deleteExperienceAction(id: string) {
  const admin = await requireAdminSession();

  const exp = await db.experience.findUnique({
    where: { id },
    select: { organization: true },
  });

  if (!exp) throw new Error("Experience not found");

  await db.experience.delete({ where: { id } });

  await recordAuditLog({
    actorId: admin.id,
    action: "DELETE_EXPERIENCE",
    entityType: "Experience",
    entityId: id,
    details: {
      organization: exp.organization,
    },
  });

  updateTag("experiences");
  revalidatePath("/[locale]/experience", "page");

  return { success: true, deletedId: id };
}
