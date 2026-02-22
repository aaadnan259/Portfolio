import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockLimit = vi.fn();

vi.mock("@upstash/ratelimit", () => ({
    Ratelimit: class {
        static slidingWindow = vi.fn();
        limit = mockLimit;
    }
}));

vi.mock("@upstash/redis", () => ({
    Redis: class {
        constructor() { }
    }
}));

describe("Rate Limit Utility", () => {
    let checkRateLimit: any;
    const originalEnv = process.env;

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        process.env = { ...originalEnv };
        mockLimit.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    const getRateLimitModule = async () => {
        const module = await import("../../src/lib/rate-limit");
        return module.checkRateLimit;
    };

    describe("Upstash Strategy", () => {
        beforeEach(() => {
            process.env.UPSTASH_REDIS_REST_URL = "https://fake.url";
            process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";
        });

        it("should return true when Upstash allows the request", async () => {
            checkRateLimit = await getRateLimitModule();
            mockLimit.mockResolvedValueOnce({ success: true });

            const result = await checkRateLimit("1.1.1.1");
            expect(result).toEqual({ success: true });
            expect(mockLimit).toHaveBeenCalledWith("1.1.1.1");
        });

        it("should return false when Upstash blocks the request", async () => {
            checkRateLimit = await getRateLimitModule();
            mockLimit.mockResolvedValueOnce({ success: false });

            const result = await checkRateLimit("2.2.2.2");
            expect(result).toEqual({ success: false });
            expect(mockLimit).toHaveBeenCalledWith("2.2.2.2");
        });

        it("should fail open (return true) if Redis throws an error", async () => {
            checkRateLimit = await getRateLimitModule();
            mockLimit.mockRejectedValueOnce(new Error("Redis error"));

            const result = await checkRateLimit("3.3.3.3");
            expect(result).toEqual({ success: true });
        });
    });

    describe("LRU Cache Fallback", () => {
        beforeEach(() => {
            delete process.env.UPSTASH_REDIS_REST_URL;
            delete process.env.UPSTASH_REDIS_REST_TOKEN;
        });

        it("should allow first 3 requests and block the 4th", async () => {
            checkRateLimit = await getRateLimitModule();

            // Should not call Upstash
            expect(mockLimit).not.toHaveBeenCalled();

            let result = await checkRateLimit("10.0.0.1");
            expect(result).toEqual({ success: true });

            result = await checkRateLimit("10.0.0.1");
            expect(result).toEqual({ success: true });

            result = await checkRateLimit("10.0.0.1");
            expect(result).toEqual({ success: true });

            result = await checkRateLimit("10.0.0.1");
            expect(result).toEqual({ success: false }); // 4th request blocked
        });

        it("should track limits separately for different IPs", async () => {
            checkRateLimit = await getRateLimitModule();

            await checkRateLimit("10.0.0.2");
            await checkRateLimit("10.0.0.2");
            await checkRateLimit("10.0.0.2");
            const result1 = await checkRateLimit("10.0.0.2");
            expect(result1).toEqual({ success: false });

            const result2 = await checkRateLimit("10.0.0.3");
            expect(result2).toEqual({ success: true });
        });
    });
});
