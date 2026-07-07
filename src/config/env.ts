import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(9091),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  BASE_URL: z.string().url().default("http://localhost:9091"),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  UPLOAD_ALLOWED_MIME: z.string().default("image/jpeg,image/png,image/webp"),
  CHATBOT_ALLOWED_MIME: z.string().default("application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"),
  UPLOAD_MAX_FILE_SIZE: z.coerce.number().default(5242880), // 5MB
  UPLOADS_PATH: z.string().default("uploads"),
  INITIAL_ADMIN_EMAIL: z.string().email(),
  INITIAL_ADMIN_PASSWORD: z.string().min(6),
  COOKIE_DOMAIN: z.string().default("localhost"),
  ALLOWED_ORIGINS: z.string().transform((val) => val.split(",")),
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
export type Env = z.infer<typeof envSchema>;
