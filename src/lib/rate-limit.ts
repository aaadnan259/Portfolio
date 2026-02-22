import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { LRUCache } from "lru-cache";
import { logger } from "@/lib/logger";

let ratelimitInstance: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimitInstance = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 requests per minute
        analytics: true,
    });
} else {
    if (process.env.NODE_ENV === "production") {
        logger.warn("UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not found. Falling back to in-memory rate limiting. This provides limited protection in serverless environments.");
    }
}

const tokenCache = new LRUCache<string, number>({
    max: 500,
    ttl: 60000, // 1 minute window
    allowStale: false,
});

export async function checkRateLimit(ip: string): Promise<boolean> {
    if (ratelimitInstance) {
        try {
            const { success } = await ratelimitInstance.limit(ip);
            return success;
        } catch (error) {
            logger.error("Rate limit error:", error);
            // Fail open if Redis is down, or closed?
            // Failing closed (blocking) is safer for security, but bad for UX.
            // Given this is a contact form, we might want to allow it if Redis fails temporarily.
            // But for now, let's treat error as success to avoid blocking legitimate users during outages.
            return true;
        }
    }

    // Fallback to in-memory LRU Cache
    const tokenCount = (tokenCache.get(ip) as number) || 0;
    const limit = 3;

    if (tokenCount >= limit) {
        return false;
    }

    tokenCache.set(ip, tokenCount + 1);
    return true;
}
