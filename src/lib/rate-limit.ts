import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

// In-memory fallback
const memoryStore = new Map<string, number>();

// Clean up memory store periodically to prevent leaks
if (process.env.NODE_ENV !== "test") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, timestamp] of memoryStore.entries()) {
            if (now - timestamp > 60000) {
                memoryStore.delete(key);
            }
        }
    }, 60000 * 5); // Clean up every 5 minutes
}

export async function checkRateLimit(ip: string): Promise<boolean> {
    const useRedis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

    if (useRedis) {
        try {
            const redis = Redis.fromEnv();
            const key = `rate-limit:contact:${ip}`;

            // Try to set the key if it doesn't exist, with an expiry of 60 seconds
            // "NX" means only set if not exists
            // "EX" means expire in seconds
            const result = await redis.set(key, "1", { nx: true, ex: 60 });

            // If result is "OK", the key was set (request allowed)
            // If result is null, the key already existed (request denied)
            return result === "OK";
        } catch (error) {
            logger.error("Rate limit error (Redis):", error);
            // Fallback to memory if Redis fails
            return checkMemoryRateLimit(ip);
        }
    }

    return checkMemoryRateLimit(ip);
}

function checkMemoryRateLimit(ip: string): boolean {
    const now = Date.now();

    if (memoryStore.has(ip)) {
        const lastRequest = memoryStore.get(ip) as number;
        if (now - lastRequest < 60000) {
            return false;
        }
    }

    // Update timestamp
    memoryStore.delete(ip);
    memoryStore.set(ip, now);

    return true;
}
