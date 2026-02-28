import { z } from "zod";

export const envSchema = z.object({
    RESEND_API_KEY: z.string({ message: "RESEND_API_KEY is required" }).min(1, "RESEND_API_KEY is required"),
    CONTACT_EMAIL: z.string({ message: "A valid CONTACT_EMAIL is required" }).email("A valid CONTACT_EMAIL is required"),
    WEBHOOK_SECRET: z.string().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url("A valid NEXT_PUBLIC_SITE_URL is required").optional(),
});

// Skip env validation during build phase to prevent Vercel build errors
const isBuild = process.env.npm_lifecycle_event === "build";

export const env = isBuild
    ? (process.env as unknown as z.infer<typeof envSchema>)
    : envSchema.parse(process.env);
