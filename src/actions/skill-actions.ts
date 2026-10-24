"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { recordAuditLog } from "@/lib/audit";
import { revalidatePath, updateTag } from "next/cache";
import {
  CategoryFormSchema,
  SkillFormSchema,
  type CategoryFormData,
  type SkillFormData,
} from "@/schemas";

export async function getSkillCategoriesAdminAction() {
  await requireAdminSession();

  return await db.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      skills: {
        orderBy: [{ order: "asc" }, { proficiency: "desc" }],
      },
    },
  });
}

export async function createSkillCategoryAction(input: CategoryFormData) {
  const admin = await requireAdminSession();
  const validated = CategoryFormSchema.parse(input);

  const category = await db.skillCategory.create({
    data: validated,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "CREATE_SKILL_CATEGORY",
    entityType: "SkillCategory",
    entityId: category.id,
    details: { name: category.name },
  });

  updateTag("skills");
  revalidatePath("/[locale]/skills", "page");

  return { success: true, category };
}

export async function updateSkillCategoryAction(id: string, input: CategoryFormData) {
  const admin = await requireAdminSession();
  const validated = CategoryFormSchema.parse(input);

  const category = await db.skillCategory.update({
    where: { id },
    data: validated,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "UPDATE_SKILL_CATEGORY",
    entityType: "SkillCategory",
    entityId: category.id,
    details: { name: category.name },
  });

  updateTag("skills");
  revalidatePath("/[locale]/skills", "page");

  return { success: true, category };
}

export async function deleteSkillCategoryAction(id: string) {
  const admin = await requireAdminSession();

  const category = await db.skillCategory.delete({ where: { id } });

  await recordAuditLog({
    actorId: admin.id,
    action: "DELETE_SKILL_CATEGORY",
    entityType: "SkillCategory",
    entityId: id,
    details: { name: category.name },
  });

  updateTag("skills");
  revalidatePath("/[locale]/skills", "page");

  return { success: true, deletedId: id };
}

export async function createSkillAction(input: SkillFormData) {
  const admin = await requireAdminSession();
  const validated = SkillFormSchema.parse(input);

  const skill = await db.skill.create({
    data: validated,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "CREATE_SKILL",
    entityType: "Skill",
    entityId: skill.id,
    details: { name: skill.name, proficiency: skill.proficiency },
  });

  updateTag("skills");
  revalidatePath("/[locale]/skills", "page");

  return { success: true, skill };
}

export async function updateSkillAction(id: string, input: SkillFormData) {
  const admin = await requireAdminSession();
  const validated = SkillFormSchema.parse(input);

  const skill = await db.skill.update({
    where: { id },
    data: validated,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "UPDATE_SKILL",
    entityType: "Skill",
    entityId: skill.id,
    details: { name: skill.name, proficiency: skill.proficiency },
  });

  updateTag("skills");
  revalidatePath("/[locale]/skills", "page");

  return { success: true, skill };
}

export async function deleteSkillAction(id: string) {
  const admin = await requireAdminSession();

  const skill = await db.skill.delete({ where: { id } });

  await recordAuditLog({
    actorId: admin.id,
    action: "DELETE_SKILL",
    entityType: "Skill",
    entityId: id,
    details: { name: skill.name },
  });

  updateTag("skills");
  revalidatePath("/[locale]/skills", "page");

  return { success: true, deletedId: id };
}
