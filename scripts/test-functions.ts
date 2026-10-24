import "dotenv/config";
import { invokeHelloFunction, NEON_FUNCTION_HELLO_BASE_URL } from "../src/lib/functions";

async function testFunctions() {
  console.log("--------------------------------------------------");
  console.log("TESTING NEON FUNCTIONS");
  console.log("--------------------------------------------------");
  console.log(`[1] Calling Neon Function at: ${NEON_FUNCTION_HELLO_BASE_URL}...`);

  const result = await invokeHelloFunction();
  console.log(`[SUCCESS] Response status: ${result.status}`);
  console.log(`[SUCCESS] Response body: "${result.message}"`);

  if (!result.message.includes("Hello from Neon Functions")) {
    throw new Error(`Unexpected message: ${result.message}`);
  }

  console.log("--------------------------------------------------");
  console.log("NEON FUNCTIONS TEST PASSED 100%");
  console.log("--------------------------------------------------");
}

testFunctions().catch((err) => {
  console.error("Neon Functions test failed:", err);
  process.exit(1);
});
