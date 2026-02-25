import { test, expect } from '@playwright/test';

test.describe('Navigation User Journey', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the home page
        await page.goto('/');
    });

    test('Navbar renders all expected links', async ({ page }) => {
        const nav = page.locator('nav');
        await expect(nav).toBeVisible();

        const expectedLinks = ['Home', 'About', 'Experience', 'Projects', 'Contact'];

        // Check desktop links specifically to avoid mobile conflicts
        for (const linkText of expectedLinks) {
            // Find links in the desktop menu container
            await expect(page.locator(`.hidden.md\\:flex >> text=${linkText}`)).toBeVisible();
        }
    });

    test('Smooth scrolling navigation works', async ({ page }) => {
        // Click "Projects" link in desktop navbar
        await page.locator(`.hidden.md\\:flex >> text=Projects`).click();

        // Verify URL hash updated
        await expect(page).toHaveURL(/.*#projects/);

        // Verify the projects section is in the viewport (using its heading)
        const projectsHeading = page.getByRole('heading', { name: 'Featured Projects' });
        await expect(projectsHeading).toBeVisible();
        await expect(projectsHeading).toBeInViewport();
    });

    test('Mobile menu toggle opens and closes', async ({ page }) => {
        // Set viewport to a mobile size
        await page.setViewportSize({ width: 375, height: 667 });

        // The desktop menu should be hidden
        await expect(page.locator('.hidden.md\\:flex')).not.toBeVisible();

        // The mobile toggle button should be visible
        const toggleButton = page.getByRole('button', { name: /toggle mobile menu/i });
        await expect(toggleButton).toBeVisible();

        // Click to open
        await toggleButton.click();

        // Verify mobile menu container expands and links are visible
        const mobileMenu = page.locator('.md\\:hidden.bg-surface');
        await expect(mobileMenu).toBeVisible();

        // Verify a link exists in the mobile menu
        await expect(mobileMenu.locator('text=About')).toBeVisible();

        // Click a link to close the menu
        await mobileMenu.locator('text=About').click();

        // Verify menu closes
        await expect(mobileMenu).not.toBeVisible();

        // URL hash should update
        await expect(page).toHaveURL(/.*#about/);
    });

    test('All primary sections manifest in the DOM', async ({ page }) => {
        // Rather than extensive scrolling, just ensure the standard sections rendered securely
        const sections = ['#home', '#about', '#experience', '#projects', '#skills', '#contact'];
        for (const section of sections) {
            await expect(page.locator(section)).toBeAttached();
        }
    });
});
