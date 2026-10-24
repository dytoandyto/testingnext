import { db } from "@/lib/db";
import { requirePublishedOnly } from "@/lib/auth/guards";
import { env } from "@/lib/env";
import type { Metadata } from "next";

export interface LocalizedProject {
  id: string;
  slug: string;
  featured: boolean;
  order: number;
  repoUrl: string | null;
  liveUrl: string | null;
  title: string;
  summary: string;
  caseStudy: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  media: { url: string; altText: string; format: string }[];
  isFallbackLocale: boolean;
}

export interface LocalizedExperience {
  id: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  organization: string;
  location: string;
  order: number;
  role: string;
  description: string;
  highlights: string[];
  isFallbackLocale: boolean;
}

export interface LocalizedPortal {
  id: string;
  targetRoute: string;
  posX: number;
  posY: number;
  posZ: number;
  rotY: number;
  label: string;
  order: number;
}

export interface PublicSkillGroup {
  id: string;
  name: string;
  iconName: string;
  order: number;
  skills: {
    id: string;
    name: string;
    proficiency: number;
    order: number;
  }[];
}

/**
 * Resolves translation with explicit fallback rule:
 * Target locale -> "en" default -> first available -> empty strings
 */
function resolveProjectTranslation(
  translations: {
    locale: string;
    title: string;
    summary: string;
    caseStudy: string;
    metricsJson: any;
  }[],
  targetLocale: string
) {
  let matched = translations.find((t) => t.locale === targetLocale);
  let isFallback = false;

  if (!matched && targetLocale !== "en") {
    matched = translations.find((t) => t.locale === "en");
    if (matched) isFallback = true;
  }

  if (!matched && translations.length > 0) {
    matched = translations[0];
    isFallback = true;
  }

  return {
    title: matched?.title || "Untitled Project",
    summary: matched?.summary || "",
    caseStudy: matched?.caseStudy || "",
    metrics: Array.isArray(matched?.metricsJson)
      ? (matched?.metricsJson as { label: string; value: string }[])
      : [],
    isFallback,
  };
}

function resolveExperienceTranslation(
  translations: {
    locale: string;
    role: string;
    description: string;
    highlightsJson: any;
  }[],
  targetLocale: string
) {
  let matched = translations.find((t) => t.locale === targetLocale);
  let isFallback = false;

  if (!matched && targetLocale !== "en") {
    matched = translations.find((t) => t.locale === "en");
    if (matched) isFallback = true;
  }

  if (!matched && translations.length > 0) {
    matched = translations[0];
    isFallback = true;
  }

  return {
    role: matched?.role || "Untitled Role",
    description: matched?.description || "",
    highlights: Array.isArray(matched?.highlightsJson)
      ? (matched?.highlightsJson as string[])
      : [],
    isFallback,
  };
}

/**
 * Public Site Settings & Social Channels
 */
export async function getPublicSiteSettings() {
  try {
    let settings = await db.siteSettings.findUnique({
      where: { id: "global-settings" },
    });

    if (!settings) {
      settings = {
        id: "global-settings",
        siteTitle: "Indie Realm | Interactive 3D Portfolio CMS",
        metaDescription: "Interactive 3D indie game world portfolio and CMS.",
        defaultLocale: "en",
        contactEmail: "architect@realm.io",
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
        twitterUrl: "https://x.com",
        updatedAt: new Date(),
      };
    }

    return settings;
  } catch (error) {
    console.error("Failed to fetch public site settings:", error);
    return {
      siteTitle: "Indie Realm | Interactive 3D Portfolio CMS",
      metaDescription: "Interactive 3D indie game world portfolio and CMS.",
      defaultLocale: "en",
      contactEmail: "architect@realm.io",
      githubUrl: null,
      linkedinUrl: null,
      twitterUrl: null,
    };
  }
}

/**
 * Public 3D World Scene & Active Portals
 */
export async function getPublicWorldScene(locale: string) {
  try {
    const scene = await db.worldScene.findFirst({
      where: { isDefault: true },
      include: {
        portals: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!scene) return null;

    const portals: LocalizedPortal[] = scene.portals.map((p) => ({
      id: p.id,
      targetRoute: p.targetRoute,
      posX: p.posX,
      posY: p.posY,
      posZ: p.posZ,
      rotY: p.rotY,
      label: locale === "id" ? p.labelId || p.labelEn : p.labelEn || p.labelId,
      order: p.order,
    }));

    return {
      ...scene,
      portals,
    };
  } catch (error) {
    console.error("Failed to query public world scene:", error);
    return null;
  }
}

/**
 * Public Featured Projects (PUBLISHED only)
 */
export async function getPublicFeaturedProjects(locale: string): Promise<LocalizedProject[]> {
  try {
    const projects = await db.project.findMany({
      where: requirePublishedOnly({ featured: true }),
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

    return projects.map((p) => {
      const { title, summary, caseStudy, metrics, isFallback } = resolveProjectTranslation(
        p.translations,
        locale
      );

      return {
        id: p.id,
        slug: p.slug,
        featured: p.featured,
        order: p.order,
        repoUrl: p.repoUrl,
        liveUrl: p.liveUrl,
        title,
        summary,
        caseStudy,
        metrics,
        tags: p.tags.map((t) => t.name),
        media: p.media.map((m) => ({
          url: m.mediaAsset.secureUrl,
          altText: m.caption || m.mediaAsset.altText || title,
          format: m.mediaAsset.format,
        })),
        isFallbackLocale: isFallback,
      };
    });
  } catch (error) {
    console.error("Failed to fetch public featured projects:", error);
    return [];
  }
}

/**
 * Public All Projects (PUBLISHED only)
 */
export async function getPublicProjects(locale: string): Promise<LocalizedProject[]> {
  try {
    const projects = await db.project.findMany({
      where: requirePublishedOnly(),
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

    return projects.map((p) => {
      const { title, summary, caseStudy, metrics, isFallback } = resolveProjectTranslation(
        p.translations,
        locale
      );

      return {
        id: p.id,
        slug: p.slug,
        featured: p.featured,
        order: p.order,
        repoUrl: p.repoUrl,
        liveUrl: p.liveUrl,
        title,
        summary,
        caseStudy,
        metrics,
        tags: p.tags.map((t) => t.name),
        media: p.media.map((m) => ({
          url: m.mediaAsset.secureUrl,
          altText: m.caption || m.mediaAsset.altText || title,
          format: m.mediaAsset.format,
        })),
        isFallbackLocale: isFallback,
      };
    });
  } catch (error) {
    console.error("Failed to fetch public projects:", error);
    return [];
  }
}

/**
 * Public Single Project by Slug (PUBLISHED only)
 * Returns null if not found or DRAFT/ARCHIVED.
 */
export async function getPublicProjectBySlug(
  slug: string,
  locale: string
): Promise<LocalizedProject | null> {
  try {
    const project = await db.project.findFirst({
      where: requirePublishedOnly({ slug }),
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

    const { title, summary, caseStudy, metrics, isFallback } = resolveProjectTranslation(
      project.translations,
      locale
    );

    return {
      id: project.id,
      slug: project.slug,
      featured: project.featured,
      order: project.order,
      repoUrl: project.repoUrl,
      liveUrl: project.liveUrl,
      title,
      summary,
      caseStudy,
      metrics,
      tags: project.tags.map((t) => t.name),
      media: project.media.map((m) => ({
        url: m.mediaAsset.secureUrl,
        altText: m.caption || m.mediaAsset.altText || title,
        format: m.mediaAsset.format,
      })),
      isFallbackLocale: isFallback,
    };
  } catch (error) {
    console.error(`Failed to fetch public project slug ${slug}:`, error);
    return null;
  }
}

/**
 * Public Experiences (PUBLISHED only)
 */
export async function getPublicExperiences(locale: string): Promise<LocalizedExperience[]> {
  try {
    const experiences = await db.experience.findMany({
      where: requirePublishedOnly(),
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
      include: {
        translations: true,
      },
    });

    return experiences.map((exp) => {
      const { role, description, highlights, isFallback } = resolveExperienceTranslation(
        exp.translations,
        locale
      );

      return {
        id: exp.id,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        organization: exp.organization,
        location: exp.location,
        order: exp.order,
        role,
        description,
        highlights,
        isFallbackLocale: isFallback,
      };
    });
  } catch (error) {
    console.error("Failed to query public experiences:", error);
    return [];
  }
}

/**
 * Public Skills grouped by category
 */
export async function getPublicSkillCategories(): Promise<PublicSkillGroup[]> {
  try {
    const categories = await db.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        skills: {
          orderBy: [{ order: "asc" }, { proficiency: "desc" }],
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      iconName: cat.iconName,
      order: cat.order,
      skills: cat.skills.map((s) => ({
        id: s.id,
        name: s.name,
        proficiency: s.proficiency,
        order: s.order,
      })),
    }));
  } catch (error) {
    console.error("Failed to query public skills:", error);
    return [];
  }
}

/**
 * Generates SEO metadata with canonical, alternate hreflangs, and Open Graph tags
 */
export function generatePublicMetadata({
  locale,
  path = "",
  title,
  description,
  ogImage,
}: {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
  ogImage?: string;
}): Metadata {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const defaultTitle = "Indie Realm | Interactive 3D Portfolio CMS";
  const defaultDesc = "A handcrafted interactive 3D indie game diorama portfolio.";

  const pageTitle = title || defaultTitle;
  const ogTitle = path === "/" || !path ? defaultTitle : `${pageTitle} | Indie Realm`;
  const finalDesc = description || defaultDesc;

  return {
    title: pageTitle,
    description: finalDesc,
    alternates: {
      canonical: `${baseUrl}/${locale}${normalizedPath === "/" ? "" : normalizedPath}`,
      languages: {
        en: `${baseUrl}/en${normalizedPath === "/" ? "" : normalizedPath}`,
        id: `${baseUrl}/id${normalizedPath === "/" ? "" : normalizedPath}`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: finalDesc,
      url: `${baseUrl}/${locale}${normalizedPath === "/" ? "" : normalizedPath}`,
      siteName: "Indie Realm Portfolio",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: finalDesc,
    },
  };
}
