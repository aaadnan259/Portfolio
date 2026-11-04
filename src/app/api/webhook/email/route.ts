import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/utils";
import { logger } from "@/lib/logger";
import crypto from "node:crypto";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";
import { consumeSendBudget } from "@/lib/send-budget";

const MAX_BODY_BYTES = 50_000;

// Prefer a header so the secret stays out of URLs (and out of access logs,
// browser history and screenshots). `?secret=` is still accepted for existing callers.
function getProvidedSecret(request: Request): string {
    const auth = request.headers.get("authorization");
    if (auth?.toLowerCase().startsWith("bearer ")) {
        return auth.slice(7).trim();
    }
    const header = request.headers.get("x-webhook-secret");
    if (header) return header;
    return new URL(request.url).searchParams.get("secret") || "";
}

export async function POST(request: Request) {
    const apiKey = env.RESEND_API_KEY;
    const contactEmail = env.CONTACT_EMAIL;
    const webhookSecret = env.WEBHOOK_SECRET;

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

    const secret = getProvidedSecret(request);

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

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
    const { success: withinRateLimit } = await checkRateLimit(`webhook:${ip}`);
    if (!withinRateLimit) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
        );
    }

    const resend = new Resend(apiKey);

    try {
        const rawText = await request.text();
        if (new TextEncoder().encode(rawText).length > MAX_BODY_BYTES) {
            return NextResponse.json(
                { error: "Payload too large" },
                { status: 413 }
            );
        }
        const body = JSON.parse(rawText);

        // Ignore Resend's own delivery-event callbacks (email.sent, email.delivered, ...).
        // Forwarding them sends a new email, which fires another event back here and
        // creates an infinite loop that burns the whole daily sending quota.
        if (typeof body?.type === "string" && body.type.startsWith("email.")) {
            logger.info(`Ignoring Resend event callback: ${body.type}`);
            return NextResponse.json(
                { message: "Event ignored" },
                { status: 200 }
            );
        }

        const { success: withinBudget } = await consumeSendBudget("webhook");
        if (!withinBudget) {
            logger.warn("Webhook daily send budget exhausted; not forwarding");
            return NextResponse.json(
                { error: "Daily forwarding limit reached" },
                { status: 429 }
            );
        }

        // Allow flexible payload structure, but look for common email fields
        const { subject, from, text, html, message, name, email } = body;

        // Sanitize inputs
        const safeSubject = escapeHtml(subject || "No Subject");
        const safeFrom = escapeHtml(from || email || "Unknown");
        const safeName = escapeHtml(name || "Unknown");

        // Prefer HTML, then Text, then Message, then JSON dump
        // IMPORTANT: We must escape the raw content before putting it into our container
        // If 'html' was provided, we treat it as potentially malicious and escape it,
        // effectively stripping its ability to execute, but preserving it as readable code/text.
        // OR: If we want to support sending Valid HTML, we would need a sophisticated sanitizer (DOMPurify).
        // For a secure default, we will ESCAPE everything.
        const rawBody = html || text || message || JSON.stringify(body, null, 2);
        const safeBodyContent = escapeHtml(rawBody).replace(/\n/g, '<br>');

        // Construct the email content
        const forwardSubject = safeSubject || `New Webhook Message from ${safeName}`;
        const forwardContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                    Webhook Email Forward
                </h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Original Sender:</strong> ${safeFrom}</p>
                    <p><strong>Subject:</strong> ${safeSubject}</p>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
                    <div style="background-color: white; padding: 15px; border-left: 4px solid #4F46E5;">
                        ${safeBodyContent}
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
                { error: "Failed to forward email" },
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
