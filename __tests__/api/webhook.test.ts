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

const limits = vi.hoisted(() => ({
    checkRateLimit: vi.fn().mockResolvedValue({ success: true }),
    consumeSendBudget: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/rate-limit', () => ({ checkRateLimit: limits.checkRateLimit }));
vi.mock('@/lib/send-budget', () => ({ consumeSendBudget: limits.consumeSendBudget }));

import { env } from '@/lib/env';

// Mock env
vi.mock('@/lib/env', () => ({
    env: {
        RESEND_API_KEY: 're_123456789',
        WEBHOOK_SECRET: 'test_secret',
        CONTACT_EMAIL: 'test@example.com',
    }
}));

describe('Webhook API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset our mocked env for each test
        env.RESEND_API_KEY = 're_123456789';
        env.WEBHOOK_SECRET = 'test_secret';
        env.CONTACT_EMAIL = 'test@example.com';
        limits.checkRateLimit.mockResolvedValue({ success: true });
        limits.consumeSendBudget.mockResolvedValue({ success: true });
    });

    afterEach(() => {

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
        expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
            to: 'test@example.com',
        }));
    });

    it('should ignore Resend event callbacks to avoid a send loop', async () => {
        const req = new Request('http://localhost:3000/api/webhook/email?secret=test_secret', {
            method: 'POST',
            body: JSON.stringify({
                type: 'email.sent',
                created_at: '2026-11-03T11:39:11.029Z',
                data: { subject: '[Webhook] No Subject', to: ['test@example.com'] },
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('should return 500 if CONTACT_EMAIL is missing', async () => {
        delete (env as Partial<NodeJS.ProcessEnv>).CONTACT_EMAIL;

        const req = new Request('http://localhost:3000/api/webhook/email?secret=test_secret', {
            method: 'POST',
            body: JSON.stringify({
                subject: 'Test Subject',
                email: 'test@example.com',
                message: 'Test Message',
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data.error).toBe("Server configuration error");
    });

    it('should return 401 if WEBHOOK_SECRET is not configured', async () => {
        const originalSecret = process.env.WEBHOOK_SECRET;
        delete process.env.WEBHOOK_SECRET;
        try {
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
        } finally {
            process.env.WEBHOOK_SECRET = originalSecret;
        }
    });

    const validPayload = JSON.stringify({ subject: 'Hi', email: 'a@example.com', message: 'Hello' });

    it('should accept the secret as a Bearer token header', async () => {
        const req = new Request('http://localhost:3000/api/webhook/email', {
            method: 'POST',
            headers: { authorization: 'Bearer test_secret' },
            body: validPayload,
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        expect(mockSend).toHaveBeenCalled();
    });

    it('should accept the secret as an x-webhook-secret header', async () => {
        const req = new Request('http://localhost:3000/api/webhook/email', {
            method: 'POST',
            headers: { 'x-webhook-secret': 'test_secret' },
            body: validPayload,
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
    });

    it('should reject a wrong Bearer token', async () => {
        const req = new Request('http://localhost:3000/api/webhook/email', {
            method: 'POST',
            headers: { authorization: 'Bearer nope' },
            body: validPayload,
        });

        const res = await POST(req);
        expect(res.status).toBe(401);
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('should return 429 when the caller is rate limited', async () => {
        limits.checkRateLimit.mockResolvedValueOnce({ success: false });
        const req = new Request('http://localhost:3000/api/webhook/email?secret=test_secret', {
            method: 'POST',
            body: validPayload,
        });

        const res = await POST(req);
        expect(res.status).toBe(429);
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('should stop forwarding once the daily send budget is used up', async () => {
        limits.consumeSendBudget.mockResolvedValueOnce({ success: false });
        const req = new Request('http://localhost:3000/api/webhook/email?secret=test_secret', {
            method: 'POST',
            body: validPayload,
        });

        const res = await POST(req);
        expect(res.status).toBe(429);
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('should return 413 for oversized payloads', async () => {
        const req = new Request('http://localhost:3000/api/webhook/email?secret=test_secret', {
            method: 'POST',
            body: JSON.stringify({ message: 'x'.repeat(60_000) }),
        });

        const res = await POST(req);
        expect(res.status).toBe(413);
        expect(mockSend).not.toHaveBeenCalled();
    });
});
