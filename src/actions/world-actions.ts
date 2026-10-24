"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { recordAuditLog } from "@/lib/audit";
import { createContentRevision } from "@/lib/revisions";
import { revalidatePath, updateTag } from "next/cache";
import {
  WorldSceneFormSchema,
  WorldPortalFormSchema,
  type WorldSceneFormData,
  type WorldPortalFormData,
} from "@/schemas";

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

export async function updateWorldSceneAction(id: string, input: WorldSceneFormData) {
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

export async function createWorldPortalAction(input: WorldPortalFormData) {
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

export async function updateWorldPortalAction(id: string, input: WorldPortalFormData) {
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
