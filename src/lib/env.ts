import { z } from "zod";

export const envSchema = z.object({
    RESEND_API_KEY: z.string({ required_error: "RESEND_API_KEY is required" }).min(1, "RESEND_API_KEY is required"),
    CONTACT_EMAIL: z.string({ required_error: "A valid CONTACT_EMAIL is required" }).email("A valid CONTACT_EMAIL is required"),
    WEBHOOK_SECRET: z.string().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url("A valid NEXT_PUBLIC_SITE_URL is required").optional(),
});

export const env = envSchema.parse(process.env);
