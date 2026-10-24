/**
 * World Scene Portal Route & Model Validation Security Module
 * Enforces strict routing boundaries and prevents arbitrary remote execution / open redirects.
 */

export const ALLOWED_PORTAL_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/experience",
  "/skills",
  "/contact",
] as const;

export type AllowedPortalRoute = (typeof ALLOWED_PORTAL_ROUTES)[number];

const SAFE_ROUTE_REGEX = /^\/(about|projects|experience|skills|contact)(\/[a-z0-9-_]+)?$/i;

/**
 * Validates whether a portal target route is a known internal route.
 * Rejects external protocols, data URLs, javascript:, and unknown routes.
 */
export function isValidPortalRoute(route: unknown): boolean {
  if (typeof route !== "string") return false;
  const trimmed = route.trim();
  if (trimmed === "/" || trimmed === "") return true;

  // Strict check against allowed route prefix or regex
  return SAFE_ROUTE_REGEX.test(trimmed);
}

/**
 * Sanitizes a target route. If the route does not pass validation,
 * returns the safe default fallback route ('/projects').
 */
export function sanitizePortalRoute(route: unknown): string {
  if (typeof route !== "string") return "/projects";
  const trimmed = route.trim();
  if (isValidPortalRoute(trimmed)) {
    return trimmed;
  }
  return "/projects";
}

/**
 * Validates model asset URLs from CMS configuration.
 * Only permits secure Cloudinary assets or local relative assets.
 * Rejects remote untrusted CDNs, http:, and script protocols.
 */
export function validateSafeModelUrl(url: unknown): string | null {
  if (typeof url !== "string" || !url.trim()) return null;
  const trimmed = url.trim();

  // Permitted local asset paths
  if (trimmed.startsWith("/models/") || trimmed.startsWith("/assets/")) {
    return trimmed;
  }

  // Permitted secure Cloudinary CDN
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" && parsed.hostname === "res.cloudinary.com") {
      return trimmed;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Helper to detect WebGL support in browser environment safely.
 */
export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
