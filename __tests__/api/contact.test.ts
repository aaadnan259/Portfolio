import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../../src/app/api/contact/route";


// Mock Resend
const mocks = vi.hoisted(() => ({
    send: vi.fn(),
}));

vi.mock("resend", () => ({
    Resend: class {
        emails = {
            send: mocks.send
        }
    }
}));

// Mock process.env
const originalEnv = process.env;

describe("Contact API", () => {
    let ipCounter = 1;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env = {
            ...originalEnv,
            RESEND_API_KEY: "re_12345678",
            CONTACT_EMAIL: "admin@example.com"
        };
    });

    it("should return 200 for valid input and sanitize HTML", async () => {
        mocks.send.mockResolvedValue({ data: { id: "123" }, error: null });

        const request = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": `127.0.0.${ipCounter++}` },
            body: JSON.stringify({
                name: "<script>alert('xss')</script>John",
                email: "john@example.com",
                message: "<b>Hello</b> world"
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe("Message sent successfully");

        // Verify sanitization in email payload
        const sendCall = mocks.send.mock.calls[0][0];
        expect(sendCall.html).toContain("&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;John");
        expect(sendCall.html).toContain("&lt;b&gt;Hello&lt;/b&gt; world");
        expect(sendCall.to).toBe("admin@example.com");
    });

    it("should return 400 for invalid email", async () => {
        const request = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": `127.0.0.${ipCounter++}` },
            body: JSON.stringify({
                name: "John Doe",
                email: "invalid-email",
                message: "Hello world"
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Invalid email address");
        expect(mocks.send).not.toHaveBeenCalled();
    });

    it("should return 400 for missing name", async () => {
        const request = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": `127.0.0.${ipCounter++}` },
            body: JSON.stringify({
                email: "john@example.com",
                message: "Hello world"
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toContain("expected string, received undefined");
        expect(mocks.send).not.toHaveBeenCalled();
    });

    it("should return 400 for missing message", async () => {
        const request = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": `127.0.0.${ipCounter++}` },
            body: JSON.stringify({
                name: "John Doe",
                email: "john@example.com"
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toContain("expected string, received undefined");
        expect(mocks.send).not.toHaveBeenCalled();
    });

    it("should return 400 for message exceeding 5000 characters", async () => {
        const longString = "a".repeat(5001);
        const request = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": `127.0.0.${ipCounter++}` },
            body: JSON.stringify({
                name: "John Doe",
                email: "safe@example.com",
                message: longString
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Message is too long");
    });

    it("should return 400 for name exceeding 100 characters", async () => {
        const longName = "a".repeat(101);
        const request = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": `127.0.0.${ipCounter++}` },
            body: JSON.stringify({
                name: longName,
                email: "safe@example.com",
                message: "Hello"
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Name is too long");
    });

    it("should return 500 when environment variables are missing", async () => {
        const originalApiKey = process.env.RESEND_API_KEY;
        const originalContactEmail = process.env.CONTACT_EMAIL;

        process.env.RESEND_API_KEY = "";
        process.env.CONTACT_EMAIL = "";

        try {
            const request = new Request("http://localhost/api/contact", {
                method: "POST",
                headers: { "x-forwarded-for": `127.0.0.${ipCounter++}` },
                body: JSON.stringify({
                    name: "John Doe",
                    email: "john@example.com",
                    message: "Hello world"
                })
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe("Server configuration error");
        } finally {
            process.env.RESEND_API_KEY = originalApiKey;
            process.env.CONTACT_EMAIL = originalContactEmail;
        }
    });

    it("should return 500 when Resend returns an error", async () => {
        mocks.send.mockResolvedValue({ data: null, error: { message: "Simulated Resend error" } });

        const request = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": `127.0.0.${ipCounter++}` },
            body: JSON.stringify({
                name: "John Doe",
                email: "john@example.com",
                message: "Hello world"
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe("Failed to send email: Simulated Resend error");
    });

    it("should return 429 when rate limit is exceeded", async () => {
        const ip = "127.0.0.255";
        const requestOpts = {
            method: "POST",
            headers: { "x-forwarded-for": ip },
            body: JSON.stringify({
                name: "John Doe",
                email: "john@example.com",
                message: "Hello world"
            })
        };

        mocks.send.mockResolvedValue({ data: { id: "123" }, error: null });

        // First 3 requests should succeed
        const response1 = await POST(new Request("http://localhost/api/contact", requestOpts));
        expect(response1.status).toBe(200);

        const response2 = await POST(new Request("http://localhost/api/contact", requestOpts));
        expect(response2.status).toBe(200);

        const response3 = await POST(new Request("http://localhost/api/contact", requestOpts));
        expect(response3.status).toBe(200);

        // 4th request should fail with 429
        const response4 = await POST(new Request("http://localhost/api/contact", requestOpts));
        const data4 = await response4.json();

        expect(response4.status).toBe(429);
        expect(data4.error).toBe("Too many requests. Please try again later.");
    });
});
