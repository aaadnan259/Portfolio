import { test, expect } from '@playwright/test';

test.describe('Theme Toggle User Journey', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the home page
        await page.goto('/');

        // Ensure animation/hydration completes before assertions
        await page.waitForLoadState('networkidle');
    });

    test('Theme toggle cycles through modes', async ({ page }) => {
        // Locate the theme toggle button via its aria-label
        const themeToggleBtn = page.getByRole('button', { name: /toggle theme/i });
        await expect(themeToggleBtn).toBeVisible();

        // Check the HTML element's class attribute to determine the initial theme
        const html = page.locator('html');

        // Next-themes applies the 'light' or 'dark' class to the HTML element
        const initialTheme = await html.getAttribute('class') || '';

        // Provide a helper to determine expected opposite theme
        const isInitiallyDark = initialTheme.includes('dark');
        const expectedNewThemeClass = isInitiallyDark ? 'light' : 'dark';

        // Click the toggle button
        await themeToggleBtn.click();

        // Verify the HTML class updated to the opposite theme
        await expect(html).toHaveClass(new RegExp(expectedNewThemeClass));

        // Optional: verify the text or icon switched (SVG isn't easily assertable by text, so we trust the HTML class for next-themes functionality)
    });

    test('Theme persistence across navigation', async ({ page }) => {
        const html = page.locator('html');

        // Force set the theme to dark
        const themeToggleBtn = page.getByRole('button', { name: /toggle theme/i });

        // Switch until dark
        for (let i = 0; i < 3; i++) {
            const currentTheme = await html.getAttribute('class') || '';
            if (currentTheme.includes('dark')) break;
            await themeToggleBtn.click();
            await page.waitForTimeout(100);
        }

        await expect(html).toHaveClass(/dark/);

        // Navigate away and back using standard app navigation
        await page.getByRole('link', { name: 'Projects' }).first().click();
        await page.waitForURL(/.*#projects/);

        // Reload page to simulate returning visitor
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verify it remembered dark mode
        await expect(html).toHaveClass(/dark/);
    });
});
