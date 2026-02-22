import { NextResponse } from "next/server";
import { Resend } from "resend";
import { processWebhookPayload } from "@/lib/email-processing";
import { logger } from "@/lib/logger";
import crypto from "node:crypto";

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!apiKey || !contactEmail) {
        logger.error("Missing required environment variables");
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    // Enforce Webhook Secret
    if (!webhookSecret) {
        logger.warn("WEBHOOK_SECRET is not set.");
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret") || "";

    // Use constant-time comparison to prevent timing attacks
    // We hash both strings to handle variable lengths safely with timingSafeEqual
    const secretHash = crypto.createHash("sha256").update(secret).digest();
    const webhookSecretHash = crypto.createHash("sha256").update(webhookSecret).digest();

    if (!crypto.timingSafeEqual(secretHash, webhookSecretHash)) {
        logger.warn("Unauthorized webhook attempt");
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const resend = new Resend(apiKey);

    try {
        const body = await request.json();

        // Extract and process payload using centralized logic
        const { subject, from, content } = processWebhookPayload(body);

        // Construct the email content
        const forwardSubject = subject;
        const forwardContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                    Webhook Email Forward
                </h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Original Sender:</strong> ${from}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
                    <div style="background-color: white; padding: 15px; border-left: 4px solid #4F46E5;">
                        ${content}
                    </div>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    Forwarded via Portfolio Webhook
                </p>
            </div>
        `;

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: "Portfolio Webhook <onboarding@resend.dev>",
            to: contactEmail,
            subject: `[Webhook] ${forwardSubject}`,
            html: forwardContent,
        });

        if (error) {
            logger.error("Resend error:", error);
            return NextResponse.json(
                { error: `Failed to forward email: ${error.message}` },
                { status: 500 }
            );
        }

        logger.info("Email forwarded successfully:", data);
        return NextResponse.json(
            { message: "Email forwarded successfully" },
            { status: 200 }
        );
    } catch (error) {
        logger.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
