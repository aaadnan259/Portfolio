import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { LRUCache } from "lru-cache";
import { escapeHtml } from "@/lib/utils";
import { logger } from "@/lib/logger";

// Initialize rate limiter based on available environment variables
let checkRateLimit: (identifier: string) => Promise<{ success: boolean }>;

// Use Upstash Redis if available (Best for serverless/distributed)
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 requests per minute
        analytics: true,
    });

    checkRateLimit = async (identifier: string) => {
        try {
            const result = await ratelimit.limit(identifier);
            return { success: result.success };
        } catch (error) {
            logger.error("Rate limit error:", error);
            // Fail open if Redis is down, or closed?
            // Failing closed (blocking) is safer for security, but bad for UX.
            // Given this is a contact form, we might want to allow it if Redis fails temporarily.
            // But for now, let's treat error as success to avoid blocking legitimate users during outages.
            return { success: true };
        }
    };
} else {
    // Fallback to in-memory LRU Cache (Per-instance, ephemeral)
    // Warn only once or in logs
    if (process.env.NODE_ENV === "production") {
        logger.warn("UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not found. Falling back to in-memory rate limiting. This provides limited protection in serverless environments.");
    }

    const tokenCache = new LRUCache<string, number>({
        max: 500,
        ttl: 60000, // 1 minute window
        allowStale: false,
    });

    checkRateLimit = async (identifier: string) => {
        const tokenCount = (tokenCache.get(identifier) as number) || 0;
        const limit = 3; // 3 requests per minute

        if (tokenCount >= limit) {
            return { success: false };
        }

        tokenCache.set(identifier, tokenCount + 1);
        return { success: true };
    };
}

const contactSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
});

export async function POST(request: Request) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    // Check rate limit
    const { success } = await checkRateLimit(ip);
    if (!success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!apiKey || !contactEmail) {
        logger.error("Missing required environment variables");
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    const resend = new Resend(apiKey);

    try {
        const body = await request.json();

        // Validate input using Zod
        const result = contactSchema.safeParse(body);

        if (!result.success) {
            // Return the first error message
            const errorMessage = result.error.issues[0].message;
            return NextResponse.json(
                { error: errorMessage },
                { status: 400 }
            );
        }

        const { name, email, message } = result.data;

        // Sanitize inputs for HTML context
        const safeName = escapeHtml(name);
        const safeMessage = escapeHtml(message);

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: contactEmail,
            subject: `New Contact Form Submission from ${safeName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Name:</strong> ${safeName}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 10px 0;"><strong>Message:</strong></p>
                        <div style="background-color: white; padding: 15px; border-left: 4px solid #4F46E5; margin-top: 10px;">
                            ${safeMessage.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This message was sent from your portfolio contact form.
                    </p>
                </div>
            `,
            text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        if (error) {
            logger.error("Resend error:", error);
            return NextResponse.json(
                { error: `Failed to send email: ${error.message || JSON.stringify(error)}` },
                { status: 500 }
            );
        }

        logger.info("Email sent successfully:", data);
        return NextResponse.json(
            { message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        logger.error("Error processing contact form:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
