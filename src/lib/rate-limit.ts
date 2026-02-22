import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { LRUCache } from "lru-cache";
import { logger } from "@/lib/logger";

// Initialize rate limiter based on available environment variables
let checkRateLimit: (identifier: string) => Promise<{ success: boolean }>;

// Use Upstash Redis if available (Best for serverless/distributed)
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 requests per minute
        analytics: true,
    });

    checkRateLimit = async (identifier: string) => {
        try {
            const result = await ratelimit.limit(identifier);
            return { success: result.success };
        } catch (error) {
            logger.error("Rate limit error (Redis):", error);
            // Fail open if Redis is down, or closed?
            // Failing closed (blocking) is safer for security, but bad for UX.
            // Given this is a contact form, we might want to allow it if Redis fails temporarily.
            // But for now, let's treat error as success to avoid blocking legitimate users during outages.
            return { success: true };
        }
    };
} else {
    // Fallback to in-memory LRU Cache (Per-instance, ephemeral)
    // Warn only once or in logs
    if (process.env.NODE_ENV === "production") {
        logger.warn("UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not found. Falling back to in-memory rate limiting. This provides limited protection in serverless environments.");
    }

    const tokenCache = new LRUCache<string, number>({
        max: 500,
        ttl: 60000, // 1 minute window
        allowStale: false,
    });

    checkRateLimit = async (identifier: string) => {
        const tokenCount = (tokenCache.get(identifier) as number) || 0;
        const limit = 3; // 3 requests per minute

        if (tokenCount >= limit) {
            return { success: false };
        }

        tokenCache.set(identifier, tokenCount + 1);
        return { success: true };
    };
}

export { checkRateLimit };
