import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for hydration/navigation
        await page.waitForLoadState('networkidle');
    });

    test('should show validation errors for empty submission', async ({ page }) => {
        // Scroll to contact section
        const contactSection = page.locator('#contact');
        await contactSection.scrollIntoViewIfNeeded();

        // Click submit without filling anything
        await page.getByRole('button', { name: /Send Message/i }).click();

        // Check for HTML5 validation or UI error messages
        // Since we intercept submission in React Hook Form, let's look for text errors
        await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
        await expect(page.getByText('Please enter a valid email address')).toBeVisible();
        await expect(page.getByText('Message is required')).toBeVisible();
    });

    test('should validate input length', async ({ page }) => {
        const contactSection = page.locator('#contact');
        await contactSection.scrollIntoViewIfNeeded();

        // Fill with long name
        await page.getByLabel('Name').fill('a'.repeat(101));
        await page.getByLabel('Message').fill('Test message');

        await page.getByRole('button', { name: /Send Message/i }).click();
        await expect(page.getByText('Name must be less than 100 characters')).toBeVisible();
    });

    test('should submit successfully with valid data', async ({ page }) => {
        // Mock the API response to avoid sending real emails
        await page.route('/api/contact', async route => {
            const json = { message: 'Message sent successfully' };
            await route.fulfill({ json });
        });

        const contactSection = page.locator('#contact');
        await contactSection.scrollIntoViewIfNeeded();

        await page.getByRole('textbox', { name: 'Name' }).fill('Playwright Tester');
        await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
        await page.getByRole('textbox', { name: 'Message' }).fill('This is a test message from Playwright.');

        await page.getByRole('button', { name: /Send Message/i }).click();

        // Expect success state
        await expect(page.getByRole('button', { name: /Message Sent!/i })).toBeVisible();
    });
});
