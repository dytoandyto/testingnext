"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth/guards";
import { recordAuditLog } from "@/lib/audit";
import { createContentRevision } from "@/lib/revisions";
import { revalidatePath, updateTag } from "next/cache";
import { SiteSettingsFormSchema, type SiteSettingsFormData } from "@/schemas";

export async function getSiteSettingsAdminAction() {
  await requireAdminSession();

  let settings = await db.siteSettings.findUnique({
    where: { id: "global-settings" },
  });

  if (!settings) {
    settings = await db.siteSettings.create({
      data: {
        id: "global-settings",
        siteTitle: "Indie Realm | Interactive 3D Portfolio CMS",
        metaDescription: "Interactive 3D indie game world portfolio and CMS.",
        defaultLocale: "en",
        contactEmail: "architect@realm.io",
      },
    });
  }

  return settings;
}

export async function updateSiteSettingsAction(input: SiteSettingsFormData) {
  const admin = await requireAdminSession();
  const validated = SiteSettingsFormSchema.parse(input);

  const updated = await db.siteSettings.upsert({
    where: { id: "global-settings" },
    update: {
      siteTitle: validated.siteTitle,
      metaDescription: validated.metaDescription,
      defaultLocale: validated.defaultLocale,
      contactEmail: validated.contactEmail,
      githubUrl: validated.githubUrl || null,
      linkedinUrl: validated.linkedinUrl || null,
      twitterUrl: validated.twitterUrl || null,
    },
    create: {
      id: "global-settings",
      siteTitle: validated.siteTitle,
      metaDescription: validated.metaDescription,
      defaultLocale: validated.defaultLocale,
      contactEmail: validated.contactEmail,
      githubUrl: validated.githubUrl || null,
      linkedinUrl: validated.linkedinUrl || null,
      twitterUrl: validated.twitterUrl || null,
    },
  });

  await createContentRevision({
    entityType: "SiteSettings",
    entityId: "global-settings",
    snapshot: {
      siteSettings: validated,
    },
    authorId: admin.id,
  });

  await recordAuditLog({
    actorId: admin.id,
    action: "UPDATE_SITE_SETTINGS",
    entityType: "SiteSettings",
    entityId: "global-settings",
    details: {
      siteTitle: updated.siteTitle,
      contactEmail: updated.contactEmail,
    },
  });

  updateTag("settings");
  revalidatePath("/[locale]", "layout");

  return { success: true, settings: updated };
}
