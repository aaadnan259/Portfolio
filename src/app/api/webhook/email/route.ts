import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/utils";

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!apiKey || !contactEmail) {
        console.error("Missing required environment variables");
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    // Check for Webhook Secret if configured
    if (webhookSecret) {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");

        if (secret !== webhookSecret) {
            console.warn("Unauthorized webhook attempt");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
    } else {
        console.warn("WEBHOOK_SECRET is not set. Endpoint is insecure.");
    }

    const resend = new Resend(apiKey);

    try {
        const body = await request.json();
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
            console.error("Resend error:", error);
            return NextResponse.json(
                { error: `Failed to forward email: ${error.message}` },
                { status: 500 }
            );
        }

        console.log("Email forwarded successfully:", data);
        return NextResponse.json(
            { message: "Email forwarded successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
