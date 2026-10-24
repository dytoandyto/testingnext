import { db } from "../src/lib/db";

async function main() {
  const result = await db.$queryRaw`SELECT 1 as result, current_database()::text as db_name`;
  console.log("Postgres Query Result:", result);
  const userCount = await db.user.count();
  console.log("Current user count in Neon Postgres:", userCount);
  await db.$disconnect();
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
