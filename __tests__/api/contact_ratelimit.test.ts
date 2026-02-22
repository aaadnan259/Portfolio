import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock Resend globally
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

describe("Contact API Rate Limiting", () => {
    let POST: any;

    beforeEach(async () => {
        vi.resetModules();
        vi.useFakeTimers();

        // Set necessary env vars
        process.env.RESEND_API_KEY = "test_key";
        process.env.CONTACT_EMAIL = "test@example.com";

        // Re-import the module to get a fresh instance of rateLimit map
        const mod = await import("../../src/app/api/contact/route");
        POST = mod.POST;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it("should allow first request and block subsequent requests from same IP within window", async () => {
        mocks.send.mockResolvedValue({ data: { id: "123" }, error: null });

        const req1 = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": "1.2.3.4" },
            body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hello" })
        });

        const res1 = await POST(req1);
        expect(res1.status).toBe(200);

        // Immediate subsequent request
        const req2 = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": "1.2.3.4" },
            body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hello" })
        });

        const res2 = await POST(req2);
        expect(res2.status).toBe(429);
        const data2 = await res2.json();
        expect(data2.error).toBe("Too many requests. Please try again later.");
    });

    it("should allow request after window expires", async () => {
         mocks.send.mockResolvedValue({ data: { id: "123" }, error: null });

        // Initial request
        const req1 = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": "1.2.3.5" },
            body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hello" })
        });
        await POST(req1);

        // Advance time by 60 seconds + 1ms
        vi.advanceTimersByTime(60001);

        // Subsequent request
        const req2 = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": "1.2.3.5" },
            body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hello" })
        });

        const res2 = await POST(req2);
        expect(res2.status).toBe(200);
    });

    it("should treat different IPs independently", async () => {
        mocks.send.mockResolvedValue({ data: { id: "123" }, error: null });

        // Request from IP A
        const reqA = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": "10.0.0.1" },
            body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hello" })
        });
        const resA = await POST(reqA);
        expect(resA.status).toBe(200);

        // Request from IP B (should succeed even if A is rate limited)
        const reqB = new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": "10.0.0.2" },
            body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hello" })
        });
        const resB = await POST(reqB);
        expect(resB.status).toBe(200);
    });
});
