import { z } from "zod";

const envSchema = z.object({
    RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
    CONTACT_EMAIL: z.string().email("A valid CONTACT_EMAIL is required"),
    WEBHOOK_SECRET: z.string().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url("A valid NEXT_PUBLIC_SITE_URL is required").optional(),
});

export const env = envSchema.parse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
