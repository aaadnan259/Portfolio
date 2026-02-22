import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { escapeHtml } from "@/lib/utils";

const rateLimit = new Map<string, number>();

const contactSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
});

export async function POST(request: Request) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
    const now = Date.now();

    if (rateLimit.has(ip)) {
        const lastRequest = rateLimit.get(ip) as number;
        if (now - lastRequest < 60000) { // 1 minute window
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }
    }

    // Use delete before set to ensure the key is moved to the end of the Map (most recent)
    // This allows us to use insertion order for efficient cleanup
    rateLimit.delete(ip);
    rateLimit.set(ip, now);

    // Optional: Cleanup old entries to prevent memory leaks
    if (rateLimit.size > 100) {
        const oneMinuteAgo = now - 60000;
        for (const [key, timestamp] of rateLimit.entries()) {
            if (timestamp < oneMinuteAgo) {
                rateLimit.delete(key);
            } else {
                // Since the Map is ordered by insertion time (LRU),
                // as soon as we hit a timestamp that is recent enough, we can stop.
                break;
            }
        }
    }

    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!apiKey || !contactEmail) {
        console.error("Missing required environment variables");
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
            console.error("Resend error:", error);
            return NextResponse.json(
                { error: `Failed to send email: ${error.message || JSON.stringify(error)}` },
                { status: 500 }
            );
        }

        console.log("Email sent successfully:", data);
        return NextResponse.json(
            { message: "Message sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing contact form:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
