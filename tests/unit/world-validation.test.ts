import { describe, it, expect } from "vitest";
import {
  isValidPortalRoute,
  sanitizePortalRoute,
  validateSafeModelUrl,
  ALLOWED_PORTAL_ROUTES,
} from "@/lib/world/validation";

describe("World Scene Validation & Security Guard", () => {
  describe("isValidPortalRoute", () => {
    it("approves all standard allowed routes", () => {
      ALLOWED_PORTAL_ROUTES.forEach((route) => {
        expect(isValidPortalRoute(route)).toBe(true);
      });
      expect(isValidPortalRoute("/projects/interactive-3d-portfolio")).toBe(true);
    });

    it("rejects malicious, arbitrary, or protocol-injected routes", () => {
      expect(isValidPortalRoute("javascript:alert(1)")).toBe(false);
      expect(isValidPortalRoute("data:text/html,<script>alert(1)</script>")).toBe(false);
      expect(isValidPortalRoute("https://evil.com")).toBe(false);
      expect(isValidPortalRoute("//evil.com")).toBe(false);
      expect(isValidPortalRoute("/admin/secret")).toBe(false);
      expect(isValidPortalRoute("/malicious-route")).toBe(false);
      expect(isValidPortalRoute(null)).toBe(false);
      expect(isValidPortalRoute(123)).toBe(false);
    });
  });

  describe("sanitizePortalRoute", () => {
    it("returns valid routes unchanged", () => {
      expect(sanitizePortalRoute("/about")).toBe("/about");
      expect(sanitizePortalRoute("/projects")).toBe("/projects");
      expect(sanitizePortalRoute("/experience")).toBe("/experience");
      expect(sanitizePortalRoute("/skills")).toBe("/skills");
      expect(sanitizePortalRoute("/contact")).toBe("/contact");
    });

    it("falls back to '/projects' for invalid or dangerous targets", () => {
      expect(sanitizePortalRoute("javascript:void(0)")).toBe("/projects");
      expect(sanitizePortalRoute("https://untrusted.io")).toBe("/projects");
      expect(sanitizePortalRoute("/unknown-target")).toBe("/projects");
      expect(sanitizePortalRoute(undefined)).toBe("/projects");
    });
  });

  describe("validateSafeModelUrl", () => {
    it("permits trusted Cloudinary URLs and local asset paths", () => {
      expect(
        validateSafeModelUrl("https://res.cloudinary.com/sanctuary/model/upload/island.glb")
      ).toBe("https://res.cloudinary.com/sanctuary/model/upload/island.glb");
      expect(validateSafeModelUrl("/models/island.glb")).toBe("/models/island.glb");
      expect(validateSafeModelUrl("/assets/portal.glb")).toBe("/assets/portal.glb");
    });

    it("rejects untrusted external domains and insecure protocols", () => {
      expect(validateSafeModelUrl("http://insecure.com/model.glb")).toBeNull();
      expect(validateSafeModelUrl("https://sketchfab.com/model.glb")).toBeNull();
      expect(validateSafeModelUrl("javascript:evil()")).toBeNull();
      expect(validateSafeModelUrl(null)).toBeNull();
    });
  });
});
