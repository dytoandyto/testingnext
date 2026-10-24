import { z } from "zod";

// -----------------------------------------------------------------------------
// Projects Schemas
// -----------------------------------------------------------------------------

export const MetricItemSchema = z.object({
  label: z.string().min(1, "Metric label is required"),
  value: z.string().min(1, "Metric value is required"),
});

export const ProjectTranslationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  caseStudy: z.string().min(20, "Case study must be at least 20 characters"),
  metrics: z.array(MetricItemSchema).optional().default([]),
});

export const ProjectFormSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  repoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  mediaIds: z.array(z.string()).default([]),
  en: ProjectTranslationSchema,
  id: ProjectTranslationSchema,
});

export type ProjectFormData = z.infer<typeof ProjectFormSchema>;

// -----------------------------------------------------------------------------
// Experience Schemas
// -----------------------------------------------------------------------------

export const ExperienceTranslationSchema = z.object({
  role: z.string().min(2, "Role must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  highlights: z.array(z.string()).default([]),
});

export const ExperienceFormSchema = z.object({
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  isCurrent: z.boolean().default(false),
  organization: z.string().min(2, "Organization is required"),
  location: z.string().min(2, "Location is required"),
  order: z.coerce.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  en: ExperienceTranslationSchema,
  id: ExperienceTranslationSchema,
});

export type ExperienceFormData = z.infer<typeof ExperienceFormSchema>;

// -----------------------------------------------------------------------------
// Skill Schemas
// -----------------------------------------------------------------------------

export const CategoryFormSchema = z.object({
  name: z.string().min(2, "Category name is required"),
  iconName: z.string().default("Globe"),
  order: z.coerce.number().int().default(0),
});

export const SkillFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Skill name is required"),
  proficiency: z.coerce.number().min(0).max(100).default(80),
  order: z.coerce.number().int().default(0),
});

export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
export type SkillFormData = z.infer<typeof SkillFormSchema>;

// -----------------------------------------------------------------------------
// Theme Schemas
// -----------------------------------------------------------------------------

const HexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid 6-character hex color (e.g. #0d131a)");

export const ThemePresetFormSchema = z.object({
  name: z.string().min(2, "Theme name is required"),
  bgPrimary: HexColor,
  bgSurface: HexColor,
  bgCard: HexColor,
  border: HexColor,
  amber: HexColor,
  moss: HexColor,
  clay: HexColor,
  parchment: HexColor,
});

export type ThemePresetFormData = z.infer<typeof ThemePresetFormSchema>;

// -----------------------------------------------------------------------------
// Site Settings Schemas
// -----------------------------------------------------------------------------

export const SiteSettingsFormSchema = z.object({
  siteTitle: z.string().min(2, "Site title is required"),
  metaDescription: z.string().min(10, "Meta description is required"),
  defaultLocale: z.enum(["en", "id"]).default("en"),
  contactEmail: z.string().email("Must be a valid email"),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type SiteSettingsFormData = z.infer<typeof SiteSettingsFormSchema>;

// -----------------------------------------------------------------------------
// 3D World Scene & Portal Schemas
// -----------------------------------------------------------------------------

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

export type WorldSceneFormData = z.infer<typeof WorldSceneFormSchema>;
export type WorldPortalFormData = z.infer<typeof WorldPortalFormSchema>;
