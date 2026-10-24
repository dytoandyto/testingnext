import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPublicFeaturedProjects,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicExperiences,
  getPublicSkillCategories,
  getPublicSiteSettings,
  generatePublicMetadata,
} from "@/services/public-queries";
import { db } from "@/lib/db";

vi.mock("@/lib/db", () => ({
  db: {
    project: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    experience: {
      findMany: vi.fn(),
    },
    skillCategory: {
      findMany: vi.fn(),
    },
    siteSettings: {
      findUnique: vi.fn(),
    },
    worldScene: {
      findFirst: vi.fn(),
    },
  },
}));

describe("Public Queries & Translation Fallback Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPublicFeaturedProjects", () => {
    it("returns published featured projects with requested locale translation", async () => {
      const mockProject = {
        id: "proj-1",
        slug: "indie-3d-diorama",
        featured: true,
        order: 1,
        repoUrl: "https://github.com/test/repo",
        liveUrl: "https://demo.io",
        tags: [{ name: "Three.js" }, { name: "TypeScript" }],
        media: [
          {
            caption: "Primary View",
            mediaAsset: {
              secureUrl: "https://res.cloudinary.com/demo/image.webp",
              altText: "Diorama Scene",
              format: "webp",
            },
          },
        ],
        translations: [
          {
            locale: "en",
            title: "Indie 3D Diorama",
            summary: "English summary",
            caseStudy: "English case study",
            metricsJson: [{ label: "FPS", value: "60" }],
          },
          {
            locale: "id",
            title: "Diorama 3D Indie",
            summary: "Ringkasan Bahasa Indonesia",
            caseStudy: "Studi kasus Bahasa Indonesia",
            metricsJson: [{ label: "FPS", value: "60" }],
          },
        ],
      };

      vi.mocked(db.project.findMany).mockResolvedValueOnce([mockProject as any]);

      const results = await getPublicFeaturedProjects("id");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Diorama 3D Indie");
      expect(results[0].summary).toBe("Ringkasan Bahasa Indonesia");
      expect(results[0].isFallbackLocale).toBe(false);
      expect(results[0].tags).toEqual(["Three.js", "TypeScript"]);
      expect(results[0].media[0].url).toBe("https://res.cloudinary.com/demo/image.webp");
    });

    it("falls back to English when target locale translation is missing and flags isFallbackLocale", async () => {
      const mockProject = {
        id: "proj-2",
        slug: "ray-tracer",
        featured: true,
        order: 2,
        repoUrl: null,
        liveUrl: null,
        tags: [],
        media: [],
        translations: [
          {
            locale: "en",
            title: "Software Ray Tracer",
            summary: "CPU-based ray tracing engine.",
            caseStudy: "Deep dive into BVH tree construction.",
            metricsJson: [],
          },
        ],
      };

      vi.mocked(db.project.findMany).mockResolvedValueOnce([mockProject as any]);

      const results = await getPublicFeaturedProjects("id");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Software Ray Tracer");
      expect(results[0].isFallbackLocale).toBe(true);
    });

    it("handles database exceptions gracefully and returns empty array", async () => {
      vi.mocked(db.project.findMany).mockRejectedValueOnce(new Error("DB connection failure"));

      const results = await getPublicFeaturedProjects("en");
      expect(results).toEqual([]);
    });
  });

  describe("getPublicProjects", () => {
    it("returns all published projects", async () => {
      vi.mocked(db.project.findMany).mockResolvedValueOnce([
        {
          id: "p1",
          slug: "test-slug",
          featured: false,
          order: 1,
          repoUrl: null,
          liveUrl: null,
          tags: [],
          media: [],
          translations: [{ locale: "en", title: "Test", summary: "Summary", caseStudy: "Case", metricsJson: [] }],
        } as any,
      ]);

      const projects = await getPublicProjects("en");
      expect(projects).toHaveLength(1);
      expect(projects[0].slug).toBe("test-slug");
    });
  });

  describe("getPublicSiteSettings", () => {
    it("returns configured settings or default fallback", async () => {
      vi.mocked(db.siteSettings.findUnique).mockResolvedValueOnce({
        id: "global-settings",
        siteTitle: "Custom Title",
        metaDescription: "Custom Desc",
        defaultLocale: "en",
        contactEmail: "custom@realm.io",
        githubUrl: null,
        linkedinUrl: null,
        twitterUrl: null,
        updatedAt: new Date(),
      });

      const settings = await getPublicSiteSettings();
      expect(settings.siteTitle).toBe("Custom Title");
    });
  });

  describe("getPublicProjectBySlug", () => {
    it("returns null when project is not found or is in draft status", async () => {
      vi.mocked(db.project.findFirst).mockResolvedValueOnce(null);

      const result = await getPublicProjectBySlug("secret-draft", "en");
      expect(result).toBeNull();
    });

    it("returns formatted project case study when published", async () => {
      const mockProject = {
        id: "proj-3",
        slug: "procedural-world",
        featured: false,
        order: 3,
        repoUrl: "https://github.com/test/world",
        liveUrl: null,
        tags: [{ name: "Procedural Generation" }],
        media: [],
        translations: [
          {
            locale: "en",
            title: "Procedural World Generator",
            summary: "Voxel terrain synthesis algorithm.",
            caseStudy: "Perlin noise and marching cubes pipeline implementation.",
            metricsJson: [{ label: "Chunks/sec", value: "128" }],
          },
        ],
      };

      vi.mocked(db.project.findFirst).mockResolvedValueOnce(mockProject as any);

      const result = await getPublicProjectBySlug("procedural-world", "en");
      expect(result).not.toBeNull();
      expect(result?.title).toBe("Procedural World Generator");
      expect(result?.metrics).toEqual([{ label: "Chunks/sec", value: "128" }]);
    });
  });

  describe("getPublicExperiences", () => {
    it("resolves experiences with fallback and highlights array", async () => {
      const mockExp = {
        id: "exp-1",
        startDate: new Date("2024-01-01"),
        endDate: null,
        isCurrent: true,
        organization: "Sanctuary Labs",
        location: "Remote",
        order: 1,
        translations: [
          {
            locale: "en",
            role: "Principal 3D Architect",
            description: "Directing spatial web engine design.",
            highlightsJson: ["Architected micro-frontend canvas", "Optimized WebGL draw calls by 45%"],
          },
        ],
      };

      vi.mocked(db.experience.findMany).mockResolvedValueOnce([mockExp as any]);

      const results = await getPublicExperiences("en");
      expect(results).toHaveLength(1);
      expect(results[0].role).toBe("Principal 3D Architect");
      expect(results[0].highlights).toHaveLength(2);
      expect(results[0].isCurrent).toBe(true);
    });
  });

  describe("getPublicSkillCategories", () => {
    it("groups skills under categories with proficiencies", async () => {
      const mockCategory = {
        id: "cat-1",
        name: "Spatial & Graphics",
        iconName: "Globe",
        order: 1,
        skills: [
          { id: "sk-1", name: "Three.js", proficiency: 95, order: 1 },
          { id: "sk-2", name: "GLSL / Shaders", proficiency: 88, order: 2 },
        ],
      };

      vi.mocked(db.skillCategory.findMany).mockResolvedValueOnce([mockCategory as any]);

      const categories = await getPublicSkillCategories();
      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe("Spatial & Graphics");
      expect(categories[0].skills).toHaveLength(2);
      expect(categories[0].skills[0].proficiency).toBe(95);
    });
  });

  describe("SEO & Alternate Hreflang Metadata Generation", () => {
    it("generates correct canonical, alternates, and Open Graph metadata", () => {
      const metadata = generatePublicMetadata({
        locale: "en",
        path: "/projects",
        title: "Creations & Workshop",
        description: "Explore all published indie projects.",
      });

      expect(metadata.title).toBe("Creations & Workshop");
      expect(metadata.openGraph?.title).toBe("Creations & Workshop | Indie Realm");
      expect(metadata.description).toBe("Explore all published indie projects.");
      expect(metadata.alternates?.canonical).toContain("/en/projects");
      expect(metadata.alternates?.languages?.["en"]).toContain("/en/projects");
      expect(metadata.alternates?.languages?.["id"]).toContain("/id/projects");
      expect(metadata.openGraph?.locale).toBe("en_US");
    });

    it("formats Indonesian locale tag as id_ID in Open Graph metadata", () => {
      const metadata = generatePublicMetadata({
        locale: "id",
        path: "/about",
        title: "Tentang",
      });

      expect(metadata.alternates?.canonical).toContain("/id/about");
      expect(metadata.openGraph?.locale).toBe("id_ID");
    });
  });
});
