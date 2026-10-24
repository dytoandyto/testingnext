"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { recordAuditLog } from "@/lib/audit";
import { revalidatePath, updateTag } from "next/cache";
import { ThemePresetFormSchema, type ThemePresetFormData } from "@/schemas";

export async function getThemePresetsAdminAction() {
  await requireAdminSession();

  return await db.themePreset.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function createThemePresetAction(input: ThemePresetFormData) {
  const admin = await requireAdminSession();
  const validated = ThemePresetFormSchema.parse(input);

  const preset = await db.themePreset.create({
    data: {
      ...validated,
      active: false,
    },
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "CREATE_THEME_PRESET",
    entityType: "ThemePreset",
    entityId: preset.id,
    details: { name: preset.name },
  });

  updateTag("theme");
  return { success: true, preset };
}

export async function updateThemePresetAction(id: string, input: ThemePresetFormData) {
  const admin = await requireAdminSession();
  const validated = ThemePresetFormSchema.parse(input);

  const preset = await db.themePreset.update({
    where: { id },
    data: validated,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "UPDATE_THEME_PRESET",
    entityType: "ThemePreset",
    entityId: preset.id,
    details: { name: preset.name },
  });

  updateTag("theme");
  revalidatePath("/[locale]", "layout");

  return { success: true, preset };
}

export async function activateThemePresetAction(id: string) {
  const admin = await requireAdminSession();

  await db.$transaction([
    db.themePreset.updateMany({ data: { active: false } }),
    db.themePreset.update({
      where: { id },
      data: { active: true },
    }),
  ]);

  const activePreset = await db.themePreset.findUnique({ where: { id } });

  await recordAuditLog({
    actorId: admin.id,
    action: "ACTIVATE_THEME_PRESET",
    entityType: "ThemePreset",
    entityId: id,
    details: { name: activePreset?.name },
  });

  updateTag("theme");
  revalidatePath("/[locale]", "layout");

  return { success: true, activeId: id };
}

export async function deleteThemePresetAction(id: string) {
  const admin = await requireAdminSession();

  const preset = await db.themePreset.findUnique({ where: { id } });
  if (!preset) throw new Error("Theme preset not found");
  if (preset.active) throw new Error("Cannot delete an active theme preset");

  await db.themePreset.delete({ where: { id } });

  await recordAuditLog({
    actorId: admin.id,
    action: "DELETE_THEME_PRESET",
    entityType: "ThemePreset",
    entityId: id,
    details: { name: preset.name },
  });

  updateTag("theme");
  return { success: true, deletedId: id };
}
