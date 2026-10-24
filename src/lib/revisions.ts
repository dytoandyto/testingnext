import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";
import { revalidatePath, updateTag } from "next/cache";

export async function createContentRevision({
  entityType,
  entityId,
  snapshot,
  authorId,
}: {
  entityType: string;
  entityId: string;
  snapshot: Record<string, unknown>;
  authorId?: string;
}) {
  try {
    return await db.contentRevision.create({
      data: {
        entityType,
        entityId,
        snapshotJson: snapshot as any,
        authorId: authorId ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to create content revision:", error);
    return null;
  }
}

export async function restoreContentRevision({
  revisionId,
  actorId,
}: {
  revisionId: string;
  actorId: string;
}) {
  const revision = await db.contentRevision.findUnique({
    where: { id: revisionId },
  });

  if (!revision) {
    throw new Error(`Revision ${revisionId} not found`);
  }

  const snapshot = revision.snapshotJson as Record<string, any>;

  if (revision.entityType === "Project") {
    const { project, translations, tags } = snapshot;

    await db.$transaction(async (tx) => {
      // 1. Update project base record
      await tx.project.update({
        where: { id: revision.entityId },
        data: {
          slug: project.slug,
          featured: project.featured,
          order: project.order,
          status: project.status,
          repoUrl: project.repoUrl,
          liveUrl: project.liveUrl,
        },
      });

      // 2. Restore translations
      if (Array.isArray(translations)) {
        for (const t of translations) {
          await tx.projectTranslation.upsert({
            where: {
              projectId_locale: {
                projectId: revision.entityId,
                locale: t.locale,
              },
            },
            create: {
              projectId: revision.entityId,
              locale: t.locale,
              title: t.title,
              summary: t.summary,
              caseStudy: t.caseStudy,
              metricsJson: t.metricsJson ?? {},
            },
            update: {
              title: t.title,
              summary: t.summary,
              caseStudy: t.caseStudy,
              metricsJson: t.metricsJson ?? {},
            },
          });
        }
      }

      // 3. Restore tags
      if (Array.isArray(tags)) {
        await tx.projectTag.deleteMany({
          where: { projectId: revision.entityId },
        });
        if (tags.length > 0) {
          await tx.projectTag.createMany({
            data: tags.map((tagName: string) => ({
              projectId: revision.entityId,
              name: tagName,
            })),
          });
        }
      }
    });

    updateTag("projects");
    revalidatePath("/[locale]/projects", "page");
  } else if (revision.entityType === "Experience") {
    const { experience, translations } = snapshot;

    await db.$transaction(async (tx) => {
      await tx.experience.update({
        where: { id: revision.entityId },
        data: {
          startDate: new Date(experience.startDate),
          endDate: experience.endDate ? new Date(experience.endDate) : null,
          isCurrent: experience.isCurrent,
          organization: experience.organization,
          location: experience.location,
          order: experience.order,
          status: experience.status,
        },
      });

      if (Array.isArray(translations)) {
        for (const t of translations) {
          await tx.experienceTranslation.upsert({
            where: {
              experienceId_locale: {
                experienceId: revision.entityId,
                locale: t.locale,
              },
            },
            create: {
              experienceId: revision.entityId,
              locale: t.locale,
              role: t.role,
              description: t.description,
              highlightsJson: t.highlightsJson ?? [],
            },
            update: {
              role: t.role,
              description: t.description,
              highlightsJson: t.highlightsJson ?? [],
            },
          });
        }
      }
    });

    updateTag("experiences");
    revalidatePath("/[locale]/experience", "page");
  } else if (revision.entityType === "WorldScene") {
    const { scene, portals } = snapshot;

    await db.$transaction(async (tx) => {
      await tx.worldScene.update({
        where: { id: revision.entityId },
        data: {
          name: scene.name,
          fogColor: scene.fogColor,
          fogDensity: scene.fogDensity,
          ambientLightColor: scene.ambientLightColor,
          ambientLightIntensity: scene.ambientLightIntensity,
          sunLightColor: scene.sunLightColor,
          sunLightIntensity: scene.sunLightIntensity,
          bloomIntensity: scene.bloomIntensity,
        },
      });

      if (Array.isArray(portals)) {
        await tx.worldPortal.deleteMany({
          where: { sceneId: revision.entityId },
        });
        if (portals.length > 0) {
          await tx.worldPortal.createMany({
            data: portals.map((p: any) => ({
              sceneId: revision.entityId,
              targetRoute: p.targetRoute,
              posX: p.posX,
              posY: p.posY,
              posZ: p.posZ,
              rotY: p.rotY ?? 0.0,
              labelEn: p.labelEn,
              labelId: p.labelId,
              active: p.active ?? true,
              order: p.order ?? 0,
            })),
          });
        }
      }
    });

    updateTag("world-scene");
    revalidatePath("/[locale]", "page");
  } else if (revision.entityType === "SiteSettings") {
    const { siteSettings } = snapshot;
    await db.siteSettings.update({
      where: { id: revision.entityId },
      data: siteSettings,
    });
    updateTag("settings");
    revalidatePath("/[locale]", "layout");
  }

  // Record audit log
  await recordAuditLog({
    actorId,
    action: "RESTORE_REVISION",
    entityType: revision.entityType,
    entityId: revision.entityId,
    details: {
      revisionId,
      createdAt: revision.createdAt,
    },
  });

  return { success: true, entityType: revision.entityType, entityId: revision.entityId };
}
