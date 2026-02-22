import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mocks
const mocks = vi.hoisted(() => ({
    send: vi.fn(),
    limit: vi.fn(),
}));

vi.mock("resend", () => ({
    Resend: class {
        emails = {
            send: mocks.send
        }
    }
}));

vi.mock("@upstash/ratelimit", () => ({
    Ratelimit: class {
        static slidingWindow = vi.fn();
        limit = mocks.limit;
    }
}));

vi.mock("@upstash/redis", () => ({
    Redis: class {
        constructor() {}
    }
}));

// We need to manage process.env carefully
const originalEnv = process.env;

describe("Contact API Rate Limiting", () => {
    let POST: any;

    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        process.env = { ...originalEnv };
        // Default mocks
        mocks.send.mockResolvedValue({ data: { id: "123" }, error: null });
        mocks.limit.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    const importRoute = async () => {
        const module = await import("../../src/app/api/contact/route");
        return module.POST;
    };

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

    describe("Upstash Rate Limiting", () => {
        beforeEach(() => {
            process.env.UPSTASH_REDIS_REST_URL = "https://mock-redis.upstash.io";
            process.env.UPSTASH_REDIS_REST_TOKEN = "mock-token";
            process.env.RESEND_API_KEY = "re_123";
            process.env.CONTACT_EMAIL = "admin@example.com";
        });

        it("should use Upstash Ratelimit when env vars are present", async () => {
            POST = await importRoute();

            mocks.limit.mockResolvedValueOnce({ success: true });

            const response = await POST(createRequest("1.2.3.4"));
            expect(response.status).toBe(200);
            expect(mocks.limit).toHaveBeenCalledWith("1.2.3.4");
        });

        it("should return 429 when Upstash limits the request", async () => {
            POST = await importRoute();

            mocks.limit.mockResolvedValueOnce({ success: false });

            const response = await POST(createRequest("1.2.3.4"));
            const data = await response.json();

            expect(response.status).toBe(429);
            expect(data.error).toBe("Too many requests. Please try again later.");
        });
    });

    describe("In-Memory Fallback", () => {
        beforeEach(() => {
            delete process.env.UPSTASH_REDIS_REST_URL;
            delete process.env.UPSTASH_REDIS_REST_TOKEN;
            process.env.RESEND_API_KEY = "re_123";
            process.env.CONTACT_EMAIL = "admin@example.com";
        });

        it("should use in-memory rate limiting when Upstash env vars are missing", async () => {
            POST = await importRoute();

            // Should not call Upstash
            expect(mocks.limit).not.toHaveBeenCalled();

            // 1st request
            let response = await POST(createRequest("10.0.0.1"));
            expect(response.status).toBe(200);

            // 2nd request
            response = await POST(createRequest("10.0.0.1"));
            expect(response.status).toBe(200);

            // 3rd request
            response = await POST(createRequest("10.0.0.1"));
            expect(response.status).toBe(200);

            // 4th request (Limit exceeded)
            response = await POST(createRequest("10.0.0.1"));
            expect(response.status).toBe(429);

            const data = await response.json();
            expect(data.error).toBe("Too many requests. Please try again later.");
        });

        it("should track limits separately for different IPs", async () => {
            POST = await importRoute();

            // Consume limit for IP 1
            await POST(createRequest("10.0.0.2"));
            await POST(createRequest("10.0.0.2"));
            await POST(createRequest("10.0.0.2"));
            const res1 = await POST(createRequest("10.0.0.2"));
            expect(res1.status).toBe(429);

            // IP 2 should still be fresh
            const res2 = await POST(createRequest("10.0.0.3"));
            expect(res2.status).toBe(200);
        });
    });
});
