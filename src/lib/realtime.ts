import { createRealtime, rawSql } from "@neon/realtime/server";

export const NEON_REALTIME_URL =
  process.env.NEON_REALTIME_URL ||
  "wss://ep-billowing-bonus-b4b3fj4v.rt.c-6.us-east-2.aws.neon.tech/";

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET || "nrt_live_placeholder",
  db: "neondb",
});

export async function sealProjectsQuery(status: string = "PUBLISHED") {
  const query = rawSql(
    `SELECT id, slug, featured, "order", status, created_at, updated_at FROM projects WHERE status = $1 ORDER BY "order" ASC`,
    [status]
  );
  return await realtime.seal({ query });
}

export async function sealSiteSettingsQuery() {
  const query = rawSql(
    `SELECT id, "siteTitle", "metaDescription", "defaultLocale", "contactEmail" FROM site_settings WHERE id = $1`,
    ["global-settings"]
  );
  return await realtime.seal({ query });
}
