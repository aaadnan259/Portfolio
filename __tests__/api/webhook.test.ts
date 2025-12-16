import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/webhook/email/route';

// Mock dependencies
const mockSend = vi.fn().mockResolvedValue({ id: 'mock_id' });

vi.mock('resend', () => {
    return {
        Resend: class {
            emails = {
                send: mockSend,
            };
        },
    };
});

// Mock environment variables
const ORIGINAL_ENV = process.env;

describe('Webhook API', () => {
    beforeEach(() => {
        vi.resetModules();
        process.env = { ...ORIGINAL_ENV };
        process.env.RESEND_API_KEY = 're_123456789';
        process.env.WEBHOOK_SECRET = 'test_secret';
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
    });

    it('should return 401 if missing secret', async () => {
        const req = new Request('http://localhost:3000/api/webhook/email', {
            method: 'POST',
            body: JSON.stringify({
                subject: 'Test Subject',
                email: 'test@example.com',
                message: 'Test Message',
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    it('should return 401 if secret is incorrect', async () => {
        const req = new Request('http://localhost:3000/api/webhook/email?secret=wrong_secret', {
            method: 'POST',
            body: JSON.stringify({
                subject: 'Test Subject',
                email: 'test@example.com',
                message: 'Test Message',
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    it('should return 200 if secret is correct', async () => {
        const req = new Request('http://localhost:3000/api/webhook/email?secret=test_secret', {
            method: 'POST',
            body: JSON.stringify({
                subject: 'Test Subject',
                email: 'test@example.com',
                message: 'Test Message',
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
    });
});
