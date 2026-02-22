import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkRateLimit } from "../../src/lib/rate-limit";
import { Redis } from "@upstash/redis";

vi.mock("@upstash/redis", () => ({
    Redis: {
        fromEnv: vi.fn()
    }
}));

// Mock Date.now
const realDateNow = Date.now.bind(global.Date);
const dateNowStub = vi.fn();

describe("Rate Limit Utility", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        vi.clearAllMocks();
        global.Date.now = dateNowStub;
        dateNowStub.mockReturnValue(1000000);
    });

    afterEach(() => {
        process.env = originalEnv;
        global.Date.now = realDateNow;
    });

    describe("In-Memory Fallback", () => {
        beforeEach(() => {
            delete process.env.KV_REST_API_URL;
            delete process.env.KV_REST_API_TOKEN;
        });

        it("should allow first request", async () => {
            const result = await checkRateLimit("1.1.1.1");
            expect(result).toBe(true);
        });

        it("should block second request within window", async () => {
            const ip = "2.2.2.2";
            await checkRateLimit(ip); // first allowed
            const result = await checkRateLimit(ip); // second denied
            expect(result).toBe(false);
        });

        it("should allow request after window expires", async () => {
            const ip = "3.3.3.3";
            await checkRateLimit(ip);

            // Advance time by 61 seconds
            dateNowStub.mockReturnValue(1000000 + 61000);

            const result = await checkRateLimit(ip);
            expect(result).toBe(true);
        });
    });

    describe("Redis Strategy", () => {
        let mockRedisSet: any;

        beforeEach(() => {
            process.env.KV_REST_API_URL = "https://fake.url";
            process.env.KV_REST_API_TOKEN = "fake-token";

            mockRedisSet = vi.fn();
            (Redis.fromEnv as any).mockReturnValue({
                set: mockRedisSet
            });
        });

        it("should use Redis when env vars are present", async () => {
            mockRedisSet.mockResolvedValue("OK");
            const result = await checkRateLimit("4.4.4.4");

            expect(Redis.fromEnv).toHaveBeenCalled();
            expect(mockRedisSet).toHaveBeenCalledWith(
                "rate-limit:contact:4.4.4.4",
                "1",
                { nx: true, ex: 60 }
            );
            expect(result).toBe(true);
        });

        it("should return false when Redis key already exists", async () => {
            mockRedisSet.mockResolvedValue(null);
            const result = await checkRateLimit("5.5.5.5");
            expect(result).toBe(false);
        });

        it("should fallback to memory if Redis fails", async () => {
            mockRedisSet.mockRejectedValue(new Error("Redis error"));

            // Should fall back to memory.
            // Using a fresh IP "6.6.6.6", memory check should return true.
            const result = await checkRateLimit("6.6.6.6");

            expect(result).toBe(true);
        });
    });
});
