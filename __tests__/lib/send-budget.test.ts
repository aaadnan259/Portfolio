import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Send budget (in-memory)", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("allows sends up to the daily limit, then blocks", async () => {
        process.env.MAX_WEBHOOK_EMAILS_PER_DAY = "2";
        const { consumeSendBudget } = await import("../../src/lib/send-budget");

        expect(await consumeSendBudget("webhook")).toEqual({ success: true });
        expect(await consumeSendBudget("webhook")).toEqual({ success: true });
        expect(await consumeSendBudget("webhook")).toEqual({ success: false });
    });

    it("tracks each route separately", async () => {
        process.env.MAX_WEBHOOK_EMAILS_PER_DAY = "0";
        const { consumeSendBudget } = await import("../../src/lib/send-budget");

        expect(await consumeSendBudget("webhook")).toEqual({ success: false });
        expect(await consumeSendBudget("contact")).toEqual({ success: true });
    });
});
