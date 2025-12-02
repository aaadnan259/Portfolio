import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error("RESEND_API_KEY is missing");
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    const resend = new Resend(apiKey);

    try {
        const body = await request.json();
        // Allow flexible payload structure, but look for common email fields
        const { subject, from, text, html, message, name, email } = body;

        // Construct the email content
        const forwardSubject = subject || `New Webhook Message from ${name || "Unknown"}`;
        const forwardContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                    Webhook Email Forward
                </h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Original Sender:</strong> ${from || email || "Unknown"}</p>
                    <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
                    <div style="background-color: white; padding: 15px; border-left: 4px solid #4F46E5;">
                        ${html || (text || message || JSON.stringify(body, null, 2)).replace(/\n/g, '<br>')}
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
            to: process.env.CONTACT_EMAIL || "aaadnan259@gmail.com",
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
