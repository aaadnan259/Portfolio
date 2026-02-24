import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mocks
const mocks = vi.hoisted(() => ({
    send: vi.fn(),
    checkRateLimit: vi.fn(),
}));

vi.mock("resend", () => ({
    Resend: class {
        emails = {
            send: mocks.send
        }
    }
}));

// Mock the rate limit utility
vi.mock("@/lib/rate-limit", () => ({
    checkRateLimit: mocks.checkRateLimit
}));

const originalEnv = process.env;

describe("Contact API Rate Limiting Integration", () => {
    let POST: any;

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        process.env = { ...originalEnv };
        process.env.RESEND_API_KEY = "re_123";
        process.env.CONTACT_EMAIL = "admin@example.com";

        // Default: Rate limit allowed
        mocks.checkRateLimit.mockResolvedValue({ success: true });
        mocks.send.mockResolvedValue({ data: { id: "123" }, error: null });

        const mod = await import("../../src/app/api/contact/route");
        POST = mod.POST;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    const createRequest = (ip: string) => {
        return new Request("http://localhost/api/contact", {
            method: "POST",
            headers: { "x-forwarded-for": ip },
            body: JSON.stringify({
                name: "John Doe",
                email: "john@example.com",
                message: "Hello world"
            })
        });
    };

    it("should allow request when rate limit check succeeds", async () => {
        mocks.checkRateLimit.mockResolvedValue({ success: true });

        const response = await POST(createRequest("1.1.1.1"));

        expect(response.status).toBe(200);
        expect(mocks.checkRateLimit).toHaveBeenCalledWith("1.1.1.1");
        expect(mocks.send).toHaveBeenCalled();
    });

    it("should return 429 when rate limit check fails", async () => {
        mocks.checkRateLimit.mockResolvedValue({ success: false });

        const response = await POST(createRequest("2.2.2.2"));
        const data = await response.json();

        expect(response.status).toBe(429);
        expect(data.error).toBe("Too many requests. Please try again later.");
        expect(mocks.checkRateLimit).toHaveBeenCalledWith("2.2.2.2");
        expect(mocks.send).not.toHaveBeenCalled();
    });
});
