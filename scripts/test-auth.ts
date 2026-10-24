import "dotenv/config";
import { fetchNeonAuthJwks, checkNeonAuthHealth, NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL } from "../src/lib/neon-auth";

async function testNeonAuth() {
  console.log("--------------------------------------------------");
  console.log("TESTING NEON AUTH SERVICE");
  console.log("--------------------------------------------------");

  console.log(`[1] Verifying Neon Auth Base URL: ${NEON_AUTH_BASE_URL}...`);
  const health = await checkNeonAuthHealth();
  console.log(`[SUCCESS] Base URL reachable (HTTP ${health.status})`);

  console.log(`[2] Fetching JWKS public keys from: ${NEON_AUTH_JWKS_URL}...`);
  const jwks = await fetchNeonAuthJwks();
  console.log(`[SUCCESS] JWKS retrieved successfully! Found keys:`, jwks.keys ? jwks.keys.length : Object.keys(jwks));

  console.log("--------------------------------------------------");
  console.log("NEON AUTH TEST PASSED 100%");
  console.log("--------------------------------------------------");
}

testNeonAuth().catch((err) => {
  console.error("Neon Auth test failed:", err);
  process.exit(1);
});
