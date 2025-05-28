import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@voiceai.example.com');
    await page.fill('input[name="password"]', 'securepassword123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('/dashboard');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.alert-error')).toContainText(
      'Invalid credentials'
    );
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=Logout');
    await page.waitForURL('/login');
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });
});