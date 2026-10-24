import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional().default("postgresql://localhost:5432/neondb"),
  DATABASE_URL_UNPOOLED: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
  NEON_BRANCH: z.string().optional(),
  NEON_AUTH_BASE_URL: z.string().url().optional(),
  NEON_AUTH_JWKS_URL: z.string().url().optional(),
  NEON_AUTH_COOKIE_SECRET: z.string().optional(),
  NEON_REALTIME_URL: z.string().optional(),
  NEON_REALTIME_SECRET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_ENDPOINT_URL_S3: z.string().url().optional(),
  AWS_REGION: z.string().optional().default("us-east-2"),
  NEON_STORAGE_BUCKET: z.string().optional().default("assets"),
  NEON_FUNCTION_HELLO_BASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(16).default("temporary-dev-auth-secret-32-chars-long"),
  AUTH_URL: z.string().url().optional().default("http://localhost:3000"),
  ADMIN_EMAIL: z.string().email().default("admin@indie-realm.io"),
  ADMIN_PASSWORD: z.string().min(8).default("TemporaryDevPassword123!"),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default("demo"),
  CLOUDINARY_API_KEY: z.string().optional().default("123456789"),
  CLOUDINARY_API_SECRET: z.string().optional().default("demo-secret"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
    DIRECT_URL: process.env.DIRECT_URL,
    NEON_BRANCH: process.env.NEON_BRANCH,
    NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL,
    NEON_AUTH_JWKS_URL: process.env.NEON_AUTH_JWKS_URL,
    NEON_AUTH_COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
    NEON_REALTIME_URL: process.env.NEON_REALTIME_URL,
    NEON_REALTIME_SECRET: process.env.NEON_REALTIME_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ENDPOINT_URL_S3: process.env.AWS_ENDPOINT_URL_S3,
    AWS_REGION: process.env.AWS_REGION,
    NEON_STORAGE_BUCKET: process.env.NEON_STORAGE_BUCKET,
    NEON_FUNCTION_HELLO_BASE_URL: process.env.NEON_FUNCTION_HELLO_BASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!result.success) {
    console.error("Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment configuration. Check logs for details.");
  }

  return result.data;
}

export const env = parseEnv();
