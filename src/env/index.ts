import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number(),
	DATABASE_URL: z.string(),
	NODE_ENV: z.enum(["DEV", "PRODUCTION", "TEST"]).default("PRODUCTION"),
});

export const env = envSchema.parse(process.env);
