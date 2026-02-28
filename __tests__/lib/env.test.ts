import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
describe('envSchema validation', () => {
    let envSchema: typeof import('@/lib/env').envSchema;

    beforeAll(async () => {
        vi.stubEnv('RESEND_API_KEY', 'dummy');
        vi.stubEnv('CONTACT_EMAIL', 'dummy@example.com');
        const mod = await import('@/lib/env');
        envSchema = mod.envSchema;
    });

    afterAll(() => {
        vi.unstubAllEnvs();
    });
    it('should validate correctly with valid required vars', () => {
        const validEnv = {
            RESEND_API_KEY: 'test-key',
            CONTACT_EMAIL: 'test@example.com',
        };
        const result = envSchema.safeParse(validEnv);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.RESEND_API_KEY).toBe('test-key');
            expect(result.data.CONTACT_EMAIL).toBe('test@example.com');
        }
    });

    it('should handle optional vars', () => {
        const validEnv = {
            RESEND_API_KEY: 'test-key',
            CONTACT_EMAIL: 'test@example.com',
            WEBHOOK_SECRET: 'secret',
            NEXT_PUBLIC_SITE_URL: 'https://example.com',
        };
        const result = envSchema.safeParse(validEnv);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.WEBHOOK_SECRET).toBe('secret');
            expect(result.data.NEXT_PUBLIC_SITE_URL).toBe('https://example.com');
        }
    });

    it('should throw error when RESEND_API_KEY is missing', () => {
        const invalidEnv = {
            CONTACT_EMAIL: 'test@example.com',
        };
        const result = envSchema.safeParse(invalidEnv);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some(e => e.message === 'RESEND_API_KEY is required')).toBe(true);
        }
    });

    it('should throw error when CONTACT_EMAIL is missing', () => {
        const invalidEnv = {
            RESEND_API_KEY: 'test-key',
        };
        const result = envSchema.safeParse(invalidEnv);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some(e => e.message === 'A valid CONTACT_EMAIL is required')).toBe(true);
        }
    });

    it('should throw error when CONTACT_EMAIL is invalid', () => {
        const invalidEnv = {
            RESEND_API_KEY: 'test-key',
            CONTACT_EMAIL: 'not-an-email',
        };
        const result = envSchema.safeParse(invalidEnv);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some(e => e.message === 'A valid CONTACT_EMAIL is required')).toBe(true);
        }
    });

    it('should throw error when NEXT_PUBLIC_SITE_URL is invalid', () => {
        const invalidEnv = {
            RESEND_API_KEY: 'test-key',
            CONTACT_EMAIL: 'test@example.com',
            NEXT_PUBLIC_SITE_URL: 'not-a-url',
        };
        const result = envSchema.safeParse(invalidEnv);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some(e => e.message === 'A valid NEXT_PUBLIC_SITE_URL is required')).toBe(true);
        }
    });
});

describe('env module export', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('should pick up environment variables from process.env', async () => {
        vi.stubEnv('RESEND_API_KEY', 'module-test-key');
        vi.stubEnv('CONTACT_EMAIL', 'module@example.com');

        const { env } = await import('@/lib/env');
        expect(env.RESEND_API_KEY).toBe('module-test-key');
        expect(env.CONTACT_EMAIL).toBe('module@example.com');
    });

    it('should throw if required environment variables are missing on import', async () => {
        vi.stubEnv('RESEND_API_KEY', '');
        vi.stubEnv('CONTACT_EMAIL', '');

        await expect(import('@/lib/env')).rejects.toThrow();
    });
});
