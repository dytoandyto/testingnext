import { chromium } from "playwright";

const TARGET_ROUTES = [
  { name: "Landing (EN)", path: "/en" },
  { name: "Landing (ID)", path: "/id" },
  { name: "Chronicle / About", path: "/en/about" },
  { name: "Workshop / Projects", path: "/en/projects" },
  { name: "Signal Beacon / Contact", path: "/en/contact" },
  { name: "Sanctuary Login", path: "/admin/login" },
];

async function measureRoute(page, route) {
  const url = `http://localhost:3000${route.path}`;
  const start = performance.now();
  await page.goto(url, { waitUntil: "networkidle" });
  const loadDuration = performance.now() - start;

  // Extract Navigation and Web Vitals Timing
  const metrics = await page.evaluate(async () => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");
    const fcp = paint.find((p) => p.name === "first-contentful-paint")?.startTime || 0;

    // Accessibility Checks
    const imagesWithoutAlt = Array.from(document.querySelectorAll("img")).filter(
      (img) => !img.hasAttribute("alt") || img.getAttribute("alt").trim() === ""
    ).length;

    const buttonsWithoutAccessibleName = Array.from(document.querySelectorAll("button")).filter((btn) => {
      const text = btn.innerText || btn.getAttribute("aria-label") || btn.getAttribute("title");
      return !text || text.trim() === "";
    }).length;

    const inputsWithoutLabels = Array.from(document.querySelectorAll("input, select, textarea")).filter(
      (input) => {
        const id = input.id;
        const hasAriaLabel = input.hasAttribute("aria-label") || input.hasAttribute("aria-labelledby");
        const hasAssociatedLabel = id && document.querySelector(`label[for="${id}"]`);
        const isNestedInLabel = input.closest("label");
        const isHidden = input.type === "hidden";
        return !isHidden && !hasAriaLabel && !hasAssociatedLabel && !isNestedInLabel;
      }
    ).length;

    const landmarks = {
      hasMain: !!document.querySelector("main"),
      hasNav: !!document.querySelector("nav"),
      hasFooter: !!document.querySelector("footer"),
      h1Count: document.querySelectorAll("h1").length,
    };

    return {
      ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : 0,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0,
      loadComplete: nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0,
      fcp: Math.round(fcp),
      accessibility: {
        imagesWithoutAlt,
        buttonsWithoutAccessibleName,
        inputsWithoutLabels,
        landmarks,
      },
    };
  });

  return {
    ...route,
    durationMs: Math.round(loadDuration),
    ...metrics,
  };
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log("=== PERFORMANCE & ACCESSIBILITY AUDIT COMMENCED ===");
  const results = [];

  for (const route of TARGET_ROUTES) {
    try {
      const result = await measureRoute(page, route);
      results.push(result);
      console.log(`[PASS] ${route.name} (${route.path}) - TTFB: ${result.ttfb}ms | DCL: ${result.domContentLoaded}ms | FCP: ${result.fcp}ms | Load: ${result.durationMs}ms`);
    } catch (err) {
      console.error(`[FAIL] ${route.name}:`, err.message);
    }
  }

  // Mobile layout audit (iPhone 12 viewport 390x844)
  console.log("\n=== MOBILE VIEWPORT & RESPONSIVE AUDIT ===");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of TARGET_ROUTES.slice(0, 3)) {
    await page.goto(`http://localhost:3000${route.path}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`Mobile Viewport ${route.name} - Horizontal Overflow: ${overflow ? "FAIL (Detected)" : "PASS (Clean)"}`);
  }

  // Reduced motion audit
  console.log("\n=== REDUCED MOTION AUDIT ===");
  const reducedMotionContext = await browser.newContext({
    reducedMotion: "reduce",
  });
  const rmPage = await reducedMotionContext.newPage();
  await rmPage.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
  const prefersReduced = await rmPage.evaluate(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  console.log(`prefers-reduced-motion: reduce media match: ${prefersReduced ? "PASS" : "FAIL"}`);

  await browser.close();
  console.log("\nAudit Data JSON Output:");
  console.log(JSON.stringify(results, null, 2));
}

runAudit().catch(console.error);
