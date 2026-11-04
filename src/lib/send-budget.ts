import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

/**
 * Daily circuit breaker on outgoing email, per route.
 *
 * Per-IP rate limits don't help when the caller is a single trusted service
 * (on Nov 3, 2026 a Resend webhook looped back into /api/webhook/email and burned
 * the whole 100/day Resend quota in seconds). Capping each route well below the
 * provider quota means a runaway route stops itself and leaves room for the others.
 */
export type SendBudgetKey = "contact" | "webhook";

const DEFAULT_DAILY_LIMITS: Record<SendBudgetKey, number> = {
    contact: 50,
    webhook: 20,
};

function dailyLimit(key: SendBudgetKey): number {
    const raw = process.env[`MAX_${key.toUpperCase()}_EMAILS_PER_DAY`];
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_DAILY_LIMITS[key];
}

const DAY_MS = 24 * 60 * 60 * 1000;

let consumeSendBudget: (key: SendBudgetKey) => Promise<{ success: boolean }>;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const limiters = new Map<SendBudgetKey, Ratelimit>();

    consumeSendBudget = async (key) => {
        let limiter = limiters.get(key);
        if (!limiter) {
            limiter = new Ratelimit({
                redis,
                limiter: Ratelimit.fixedWindow(dailyLimit(key), "1 d"),
                prefix: "send-budget",
            });
            limiters.set(key, limiter);
        }
        try {
            const result = await limiter.limit(key);
            return { success: result.success };
        } catch (error) {
            // Fail open: a Redis outage shouldn't take the contact form down.
            logger.error("Send budget error (Redis):", error);
            return { success: true };
        }
    };
} else {
    // Per-instance fallback. Weaker on serverless, but still stops a tight loop
    // hitting a warm instance.
    const counters = new Map<SendBudgetKey, { count: number; resetAt: number }>();

    consumeSendBudget = async (key) => {
        const now = Date.now();
        let entry = counters.get(key);
        if (!entry || now >= entry.resetAt) {
            entry = { count: 0, resetAt: now + DAY_MS };
            counters.set(key, entry);
        }
        if (entry.count >= dailyLimit(key)) {
            return { success: false };
        }
        entry.count += 1;
        return { success: true };
    };
}

export { consumeSendBudget };
