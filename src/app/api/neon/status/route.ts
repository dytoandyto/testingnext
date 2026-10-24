import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listBucketObjects } from "@/lib/storage";
import { invokeHelloFunction } from "@/lib/functions";
import { sealSiteSettingsQuery } from "@/lib/realtime";
import { fetchNeonAuthJwks } from "@/lib/neon-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Neon Postgres
  try {
    const rawResult = await db.$queryRaw<Array<{ db_name: string }>>`SELECT current_database()::text as db_name`;
    const userCount = await db.user.count();
    results.postgres = {
      status: "healthy",
      database: rawResult[0]?.db_name || "neondb",
      userCount,
      driver: "@prisma/adapter-neon (serverless connection pool)",
    };
  } catch (error) {
    results.postgres = {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // 2. Neon Object Storage
  try {
    const objects = await listBucketObjects();
    results.objectStorage = {
      status: "healthy",
      bucket: process.env.NEON_STORAGE_BUCKET || "assets",
      objectsCount: objects.length,
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
    };
  } catch (error) {
    results.objectStorage = {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // 3. Neon Functions
  try {
    const fnResponse = await invokeHelloFunction();
    results.functions = {
      status: "healthy",
      response: fnResponse.message.trim(),
      httpStatus: fnResponse.status,
      url: process.env.NEON_FUNCTION_HELLO_BASE_URL,
    };
  } catch (error) {
    results.functions = {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // 4. Neon Realtime
  try {
    const sealed = await sealSiteSettingsQuery();
    results.realtime = {
      status: "healthy",
      sealedQueryFingerprint: sealed.queryFingerprint,
      expiresAt: new Date(sealed.expiresAt).toISOString(),
      url: process.env.NEON_REALTIME_URL,
    };
  } catch (error) {
    results.realtime = {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // 5. Neon Auth
  try {
    const jwks = await fetchNeonAuthJwks();
    results.auth = {
      status: "healthy",
      jwksKeyCount: jwks.keys ? jwks.keys.length : 0,
      baseUrl: process.env.NEON_AUTH_BASE_URL,
    };
  } catch (error) {
    results.auth = {
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Overall health assessment
  const allHealthy = Object.values(results).every(
    (s) => typeof s === "object" && s !== null && (s as { status?: string }).status === "healthy"
  );

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      allServicesOperational: allHealthy,
      services: results,
    },
    { status: allHealthy ? 200 : 500 }
  );
}
