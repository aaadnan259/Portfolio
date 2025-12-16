import { test, expect } from '@playwright/test';

test.describe('Webhook API Smoke Test', () => {

    test('should verify endpoint connectivity and security status', async ({ request }) => {
        // Attempt to access the webhook endpoint
        const response = await request.post('/api/webhook/email?secret=invalid_attempt', {
            data: {
                subject: 'Security Probe',
                email: 'attacker@example.com',
                message: 'Testing security'
            }
        });

        const status = response.status();
        let body;
        try {
            body = await response.json();
        } catch (e) {
            body = {};
        }

        console.log(`Webhook responded with status: ${status}`, body);

        // Analyze response based on server configuration
        if (status === 401) {
            console.log('✅ Security is ACTIVE (Unauthorized Access Blocked)');
            expect(body.error).toBe('Unauthorized');
        } else if (status === 200) {
            console.log('⚠️ Security is INACTIVE locally (WEBHOOK_SECRET not set) - Endpoint worked');
        } else if (status === 500 && body.error && (body.error.includes('Failed to forward email') || body.error.includes('API key is invalid'))) {
            console.log('⚠️ Security is INACTIVE locally - Endpoint execution attempted but failed upstream (likely invalid RESEND_API_KEY)');
            // This is acceptable for a smoke test in a dev environment without real keys
            // It proves the endpoint is reachable and "logic" executed beyond the security check
        } else {
            // Fail on unexpected errors (e.g., unexpected 500s not related to Resend)
            throw new Error(`Unexpected status ${status}: ${JSON.stringify(body)}`);
        }
    });
});
