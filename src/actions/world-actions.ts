"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { recordAuditLog } from "@/lib/audit";
import { createContentRevision } from "@/lib/revisions";
import { revalidatePath, updateTag } from "next/cache";

export const WorldSceneFormSchema = z.object({
  name: z.string().min(2, "Scene name is required"),
  fogColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  fogDensity: z.coerce.number().min(0).max(0.1),
  ambientLightColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  ambientLightIntensity: z.coerce.number().min(0).max(5),
  sunLightColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  sunLightIntensity: z.coerce.number().min(0).max(5),
  bloomIntensity: z.coerce.number().min(0).max(2),
});

export const WorldPortalFormSchema = z.object({
  sceneId: z.string().min(1, "Scene ID is required"),
  targetRoute: z.string().min(1, "Target route is required"),
  posX: z.coerce.number(),
  posY: z.coerce.number(),
  posZ: z.coerce.number(),
  rotY: z.coerce.number().default(0),
  labelEn: z.string().min(1, "English label is required"),
  labelId: z.string().min(1, "Indonesian label is required"),
  active: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export async function getWorldSceneAdminAction() {
  await requireAdminSession();

  let scene = await db.worldScene.findFirst({
    where: { isDefault: true },
    include: {
      portals: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!scene) {
    scene = await db.worldScene.create({
      data: {
        id: "default-scene",
        name: "Astral Archipelago",
        isDefault: true,
        fogColor: "#0d131a",
        fogDensity: 0.015,
        ambientLightColor: "#d99b38",
        ambientLightIntensity: 0.6,
        sunLightColor: "#ffffff",
        sunLightIntensity: 1.2,
        bloomIntensity: 0.4,
      },
      include: { portals: true },
    });
  }

  return scene;
}

export async function updateWorldSceneAction(id: string, input: z.infer<typeof WorldSceneFormSchema>) {
  const admin = await requireAdminSession();
  const validated = WorldSceneFormSchema.parse(input);

  const scene = await db.worldScene.update({
    where: { id },
    data: validated,
    include: { portals: true },
  });

  await createContentRevision({
    entityType: "WorldScene",
    entityId: id,
    snapshot: {
      scene: validated,
      portals: scene.portals,
    },
    authorId: admin.id,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "UPDATE_WORLD_SCENE",
    entityType: "WorldScene",
    entityId: id,
    details: { name: scene.name },
  });

  updateTag("world-scene");
  revalidatePath("/[locale]", "page");

  return { success: true, scene };
}

export async function createWorldPortalAction(input: z.infer<typeof WorldPortalFormSchema>) {
  const admin = await requireAdminSession();
  const validated = WorldPortalFormSchema.parse(input);

  const portal = await db.worldPortal.create({
    data: validated,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "CREATE_WORLD_PORTAL",
    entityType: "WorldPortal",
    entityId: portal.id,
    details: {
      targetRoute: portal.targetRoute,
      labelEn: portal.labelEn,
    },
  });

  updateTag("world-scene");
  revalidatePath("/[locale]", "page");

  return { success: true, portal };
}

export async function updateWorldPortalAction(id: string, input: z.infer<typeof WorldPortalFormSchema>) {
  const admin = await requireAdminSession();
  const validated = WorldPortalFormSchema.parse(input);

  const portal = await db.worldPortal.update({
    where: { id },
    data: validated,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "UPDATE_WORLD_PORTAL",
    entityType: "WorldPortal",
    entityId: portal.id,
    details: {
      targetRoute: portal.targetRoute,
      labelEn: portal.labelEn,
    },
  });

  updateTag("world-scene");
  revalidatePath("/[locale]", "page");

  return { success: true, portal };
}

export async function deleteWorldPortalAction(id: string) {
  const admin = await requireAdminSession();

  const portal = await db.worldPortal.delete({ where: { id } });

  await recordAuditLog({
    actorId: admin.id,
    action: "DELETE_WORLD_PORTAL",
    entityType: "WorldPortal",
    entityId: id,
    details: {
      targetRoute: portal.targetRoute,
      labelEn: portal.labelEn,
    },
  });

  updateTag("world-scene");
  revalidatePath("/[locale]", "page");

  return { success: true, deletedId: id };
}
