import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Adnan Ashraf/);
});

test('navigation works', async ({ page }) => {
    await page.goto('/');

    // Check if the main content is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
});
