import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  API_URL: z.string().default("http://localhost:3000/v1"),
  UPLOADS_DIR: z.string().default("uploads"),
  API_PREFIX: z.string().default("/v1"),
  QUERY_OFFSET: z.coerce.number().default(0),
  QUERY_LIMIT: z.coerce.number().default(50),
  DATABASE_NAME: z.string().default("myDb"),
  DATABASE_HOST: z.string().default("localhost"),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_PASSWORD_FILE: z.string().default("/run/secrets/db-password"),
  DATABASE_URL: z.string(),
  LOGIN_URL: z.string().default("http://192.168.100.73:3000/login"),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USERNAME: z.string(),
  EMAIL_PASSWORD: z.string(),
});

export type Env = z.infer<typeof envSchema>;
