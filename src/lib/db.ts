import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  // If running with a valid Neon connection string, use the serverless Neon driver adapter
  if (connectionString && connectionString.includes("neon.tech")) {
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  // Standard PrismaClient instance (local development, migrations, or testing)
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}
