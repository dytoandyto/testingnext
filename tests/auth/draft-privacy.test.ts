import { describe, it, expect } from "vitest";
import { requirePublishedOnly } from "@/lib/auth/guards";

interface MockDatabaseRecord {
  id: string;
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

describe("Draft Privacy & Publication Boundary", () => {
  const records: MockDatabaseRecord[] = [
    { id: "1", slug: "live-system", title: "Live System", status: "PUBLISHED" },
    { id: "2", slug: "unreleased-feature", title: "Unreleased Feature", status: "DRAFT" },
    { id: "3", slug: "old-archive", title: "Deprecated Architecture", status: "ARCHIVED" },
    { id: "4", slug: "live-engine", title: "Live Game Engine", status: "PUBLISHED" },
  ];

  it("filters out all non-published records in public queries", () => {
    const publicQueryFilter = requirePublishedOnly({});

    const publicResults = records.filter((r) => r.status === publicQueryFilter.status);

    expect(publicResults).toHaveLength(2);
    expect(publicResults.every((r) => r.status === "PUBLISHED")).toBe(true);

    const slugs = publicResults.map((r) => r.slug);
    expect(slugs).toContain("live-system");
    expect(slugs).toContain("live-engine");
    expect(slugs).not.toContain("unreleased-feature");
    expect(slugs).not.toContain("old-archive");
  });

  it("ensures draft items cannot be retrieved by slug using public query filter", () => {
    function findPublicBySlug(slug: string) {
      const filter = requirePublishedOnly({ slug });
      return records.find((r) => r.slug === filter.slug && r.status === filter.status) || null;
    }

    const draftItem = findPublicBySlug("unreleased-feature");
    expect(draftItem).toBeNull();

    const publishedItem = findPublicBySlug("live-system");
    expect(publishedItem).not.toBeNull();
    expect(publishedItem?.title).toBe("Live System");
  });
});
