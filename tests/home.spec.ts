import { test, expect } from '@playwright/test';

test.describe('Rodriguez Construction site', () => {
  test('homepage loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore 404s for legacy/missing assets already broken on the live site.
        if (!text.includes('Failed to load resource')) errors.push(text);
      }
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/Rodriguez Construction/);
    expect(errors).toEqual([]);
  });

  test('contact form shows success message on submit', async ({ page }) => {
    await page.goto('/');

    await page.route('https://formspree.io/f/mnjneelv', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    const form = page.locator('#contact-form');
    await form.locator('input[name="name"]').fill('Test User');
    await form.locator('input[name="email"]').fill('test@example.com');
    await form.locator('textarea[name="message"]').fill('This is a test message.');

    await form.locator('button[type="submit"]').click();

    const alert = page.locator('[data-form-alert]');
    await expect(alert).toContainText('Thanks for reaching out!');

    await expect(form.locator('input[name="name"]')).toHaveValue('');
  });

  test('contact form shows error message on failed submit', async ({ page }) => {
    await page.goto('/');

    await page.route('https://formspree.io/f/mnjneelv', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email address is invalid' }),
      });
    });

    const form = page.locator('#contact-form');
    await form.locator('input[name="name"]').fill('Test User');
    await form.locator('input[name="email"]').fill('invalid@example.com');
    await form.locator('textarea[name="message"]').fill('This is a test message.');

    await form.locator('button[type="submit"]').click();

    const alert = page.locator('[data-form-alert]');
    await expect(alert).toContainText('Email address is invalid');
  });
});
