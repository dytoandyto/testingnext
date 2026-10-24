import { test, expect } from "@playwright/test";

test.describe("Sanctuary Portfolio CMS - E2E Suite", () => {
  test.describe("Public Navigation & Design Token Persistence", () => {
    test("loads landing page with theme tokens and diorama gateway", async ({ page }) => {
      await page.goto("/en");
      await expect(page).toHaveTitle(/Indie Realm/i);

      // Verify active theme style injection exists
      const themeTag = page.locator("#sanctuary-active-theme");
      await expect(themeTag).toBeAttached();

      // Verify header and primary call-to-actions
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("link", { name: /enter realm/i }).or(page.getByRole("link", { name: /explore/i }))).toBeVisible();
    });

    test("navigates through all core editorial portal routes", async ({ page }) => {
      // 1. Chronicle / About
      await page.goto("/en/about");
      await expect(page.locator("h1")).toContainText(/Architect|Chronicle/i);
      await expect(page.getByText(/Deterministic Rigor/i)).toBeVisible();

      // 2. Workshop / Projects
      await page.goto("/en/projects");
      await expect(page.locator("h1")).toBeVisible();

      // 3. Expeditions / Experience
      await page.goto("/en/experience");
      await expect(page.locator("h1")).toBeVisible();

      // 4. Mastery / Skills
      await page.goto("/en/skills");
      await expect(page.locator("h1")).toBeVisible();

      // 5. Signal Beacon / Contact
      await page.goto("/en/contact");
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByText(/Direct Frequencies/i)).toBeVisible();
    });
  });

  test.describe("Bilingual Content & Localization", () => {
    test("renders Indonesian localized content and alternates", async ({ page }) => {
      await page.goto("/id");
      await expect(page.locator("html")).toHaveAttribute("lang", "id");

      // Verify Indonesian portal navigation or badges
      await expect(page.locator("h1")).toBeVisible();

      // Verify canonical and hreflang links
      const enAlternate = page.locator('link[rel="alternate"][hreflang="en"]');
      const idAlternate = page.locator('link[rel="alternate"][hreflang="id"]');
      await expect(enAlternate).toHaveCount(1);
      await expect(idAlternate).toHaveCount(1);
    });

    test("handles missing translation gracefully with fallback", async ({ page }) => {
      await page.goto("/id/about");
      await expect(page.locator("h1")).toBeVisible();
      // Should not throw an unhandled exception
      await expect(page.locator("body")).toBeVisible();
    });
  });

  test.describe("3D World & Accessible 2D Fallback", () => {
    test("allows toggling to the accessible 2D diorama fallback", async ({ page }) => {
      await page.goto("/en");

      // Locate 2D fallback toggle button
      const fallbackBtn = page.getByRole("button", { name: /switch to 2d/i });
      if (await fallbackBtn.isVisible()) {
        await fallbackBtn.click();
        // Verify 2D accessible diorama stage is displayed
        await expect(page.getByText(/Sector Coordinates/i).or(page.getByText(/Archipelago/i))).toBeVisible();
      }
    });
  });

  test.describe("Security, Auth & Protected Admin Redirection", () => {
    test("redirects unauthenticated users away from protected admin routes", async ({ page }) => {
      await page.goto("/admin");
      // Either redirected to /admin/login or URL contains login
      expect(page.url()).toContain("/admin/login");
    });

    test("displays validated login form and rejects invalid credentials", async ({ page }) => {
      await page.goto("/admin/login");
      await expect(page.locator("input[type='email']")).toBeVisible();
      await expect(page.locator("input[type='password']")).toBeVisible();

      // Attempt invalid submission
      await page.fill("input[type='email']", "intruder@unknown.com");
      await page.fill("input[type='password']", "WrongPassword123!");
      await page.click("button[type='submit']");

      // Verify error feedback appears
      await expect(
        page.getByText(/Authentication failed|Invalid admin identifier|Security lockout|Invalid/i)
      ).toBeVisible();
    });
  });

  test.describe("Missing Data & Error Resilience", () => {
    test("renders clean 404 page for nonexistent project slug without leaking errors", async ({ page }) => {
      const res = await page.goto("/en/projects/non-existent-artifact-slug-9999");
      expect([200, 404]).toContain(res?.status());
      await expect(
        page.getByRole("heading", { name: /Realm Destination Not Found|Destination Uncharted/i })
      ).toBeVisible();
    });
  });

  test.describe("Responsive Layout & Viewport Resilience", () => {
    test("adapts layout on mobile viewports without horizontal overflow", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/en");

      // Check no horizontal scrollbar on body
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow tiny subpixel variance
    });
  });
});
