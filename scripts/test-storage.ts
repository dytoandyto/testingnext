import "dotenv/config";
import {
  uploadObject,
  getObject,
  listBucketObjects,
  getPresignedDownloadUrl,
  deleteObject,
} from "../src/lib/storage";

async function testStorage() {
  console.log("--------------------------------------------------");
  console.log("TESTING NEON OBJECT STORAGE (S3-COMPATIBLE)");
  console.log("--------------------------------------------------");

  const testKey = `test-${Date.now()}.txt`;
  const testContent = "Hello from Neon Object Storage in Indie Realm Portfolio!";

  console.log(`[1] Uploading test object: ${testKey}...`);
  await uploadObject(testKey, testContent, "text/plain");
  console.log("[SUCCESS] Object uploaded.");

  console.log("[2] Reading back object...");
  const downloaded = await getObject(testKey);
  const text = downloaded.buffer.toString("utf-8");
  console.log(`[SUCCESS] Read back content: "${text}"`);
  if (text !== testContent) {
    throw new Error(`Content mismatch! Expected "${testContent}", got "${text}"`);
  }

  console.log("[3] Generating presigned download URL...");
  const presignedUrl = await getPresignedDownloadUrl(testKey, 60);
  console.log(`[SUCCESS] Presigned URL: ${presignedUrl}`);

  console.log("[4] Listing bucket contents...");
  const objects = await listBucketObjects();
  console.log(`[SUCCESS] Found ${objects.length} object(s) in bucket.`);

  console.log("[5] Cleaning up test object...");
  await deleteObject(testKey);
  console.log("[SUCCESS] Cleaned up test object.");

  console.log("--------------------------------------------------");
  console.log("NEON OBJECT STORAGE TEST PASSED 100%");
  console.log("--------------------------------------------------");
}

testStorage().catch((err) => {
  console.error("Storage test failed:", err);
  process.exit(1);
});
