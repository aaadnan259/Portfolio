import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mocks
const mocks = vi.hoisted(() => ({
    limit: vi.fn(),
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

const originalEnv = process.env;

describe("Rate Limit Utility", () => {
    let checkRateLimit: any;

    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        process.env = { ...originalEnv };
        mocks.limit.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    const importModule = async () => {
        const mod = await import("../../src/lib/rate-limit");
        return mod.checkRateLimit;
    };

    describe("Redis Strategy", () => {
        beforeEach(() => {
            process.env.UPSTASH_REDIS_REST_URL = "https://fake-redis.upstash.io";
            process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";
        });

        it("should use Upstash Ratelimit when env vars are present", async () => {
            checkRateLimit = await importModule();

            await checkRateLimit("1.2.3.4");
            expect(mocks.limit).toHaveBeenCalledWith("1.2.3.4");
        });

        it("should return success based on Ratelimit result", async () => {
            checkRateLimit = await importModule();

            mocks.limit.mockResolvedValueOnce({ success: true });
            let result = await checkRateLimit("1.2.3.4");
            expect(result).toEqual({ success: true });

            mocks.limit.mockResolvedValueOnce({ success: false });
            result = await checkRateLimit("1.2.3.4");
            expect(result).toEqual({ success: false });
        });

        it("should fallback (fail open) if Redis errors", async () => {
            checkRateLimit = await importModule();

            mocks.limit.mockRejectedValue(new Error("Redis error"));
            const result = await checkRateLimit("1.2.3.4");

            // Should return success: true to fail open
            expect(result).toEqual({ success: true });
        });
    });

    describe("In-Memory Fallback", () => {
        beforeEach(() => {
            delete process.env.UPSTASH_REDIS_REST_URL;
            delete process.env.UPSTASH_REDIS_REST_TOKEN;
            // Also unset KV_ vars just in case old code lingers (though I removed it)
            delete process.env.KV_REST_API_URL;
            delete process.env.KV_REST_API_TOKEN;
        });

        it("should allow first 3 requests and block the 4th", async () => {
            checkRateLimit = await importModule();

            expect(mocks.limit).not.toHaveBeenCalled();

            const ip = "10.0.0.1";
            expect(await checkRateLimit(ip)).toEqual({ success: true });
            expect(await checkRateLimit(ip)).toEqual({ success: true });
            expect(await checkRateLimit(ip)).toEqual({ success: true });

            // 4th request should fail (limit is 3)
            expect(await checkRateLimit(ip)).toEqual({ success: false });
        });

        it("should track limits separately for different IPs", async () => {
            checkRateLimit = await importModule();

            const ip1 = "10.0.0.1";
            const ip2 = "10.0.0.2";

            await checkRateLimit(ip1);
            await checkRateLimit(ip1);
            await checkRateLimit(ip1);
            expect(await checkRateLimit(ip1)).toEqual({ success: false });

            // ip2 should be fresh
            expect(await checkRateLimit(ip2)).toEqual({ success: true });
        });
    });
});
