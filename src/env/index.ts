import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["dev", "production", "test"]).default("production"),
});

export const env = envSchema.parse(process.env);
