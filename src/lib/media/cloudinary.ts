import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface SignedUploadParams {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export const ALLOWED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
];

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Generates secure server-side signature for client-side direct upload to Cloudinary.
 */
export function generateCloudinarySignature(folder = "indie-realm/media"): SignedUploadParams {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  // Sort parameter keys alphabetically
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(`${sortedParams}${env.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  return {
    timestamp,
    signature,
    apiKey: env.CLOUDINARY_API_KEY || "",
    cloudName: env.CLOUDINARY_CLOUD_NAME || "",
    folder,
  };
}

/**
 * Validates Cloudinary notification or client-reported upload signature.
 */
export function verifyCloudinarySignature(
  params: Record<string, string | number>,
  expectedSignature: string
): boolean {
  if (!env.CLOUDINARY_API_SECRET) return false;

  // Filter out api_key, signature, and file fields
  const filtered = Object.keys(params)
    .filter((k) => k !== "signature" && k !== "api_key" && k !== "file")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const calculated = crypto
    .createHash("sha1")
    .update(`${filtered}${env.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  return calculated === expectedSignature;
}

/**
 * Deletes asset directly from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "video" = "image") {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary destruction error:", error);
    return null;
  }
}
