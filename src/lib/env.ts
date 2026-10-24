import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional().default("postgresql://localhost:5432/neondb"),
  DIRECT_URL: z.string().url().optional(),
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
    DIRECT_URL: process.env.DIRECT_URL,
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
