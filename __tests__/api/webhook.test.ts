import { expect, test, vi, beforeEach, describe } from 'vitest'
import { POST } from '@/app/api/webhook/email/route'
import { NextResponse } from 'next/server'

// Mock Resend
const mockSend = vi.fn()
vi.mock('resend', () => {
    return {
        Resend: class {
            emails: { send: any }
            constructor() {
                this.emails = {
                    send: mockSend
                }
            }
        }
    }
})

describe('Webhook API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.RESEND_API_KEY = 're_123'
        process.env.CONTACT_EMAIL = 'test@example.com'
        process.env.WEBHOOK_SECRET = 'super_secret'
    })

    test('should return 401 if secret is missing', async () => {
        const request = new Request('http://localhost:3000/api/webhook/email', {
            method: 'POST',
            body: JSON.stringify({ subject: 'Test' })
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('Unauthorized')
    })

    test('should return 401 if secret is incorrect', async () => {
        const request = new Request('http://localhost:3000/api/webhook/email?secret=wrong', {
            method: 'POST',
            body: JSON.stringify({ subject: 'Test' })
        })

        const response = await POST(request)
        expect(response.status).toBe(401)
    })

    test('should return 200 if secret is correct', async () => {
        mockSend.mockResolvedValueOnce({ data: { id: '123' }, error: null })

        const request = new Request('http://localhost:3000/api/webhook/email?secret=super_secret', {
            method: 'POST',
            body: JSON.stringify({
                subject: 'Valid Webhook',
                email: 'sender@example.com',
                message: 'Hello'
            })
        })

        const response = await POST(request)
        expect(response.status).toBe(200)
        expect(mockSend).toHaveBeenCalled()
    })

    test('should allow access if WEBHOOK_SECRET is not set (legacy/insecure mode)', async () => {
        delete process.env.WEBHOOK_SECRET
        mockSend.mockResolvedValueOnce({ data: { id: '123' }, error: null })

        const request = new Request('http://localhost:3000/api/webhook/email', {
            method: 'POST',
            body: JSON.stringify({ subject: 'No Secret Configured' })
        })

        const response = await POST(request)
        expect(response.status).toBe(200)
    })
})
