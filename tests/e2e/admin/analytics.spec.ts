import { test, expect } from '@playwright/test';
import { ADMIN_CREDENTIALS } from '../fixtures';

test.describe('Admin Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', ADMIN_CREDENTIALS.email);
    await page.fill('input[name="password"]', ADMIN_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test('should display call analytics', async ({ page }) => {
    await page.click('text=Analytics');
    await expect(page.locator('h1')).toHaveText('Call Analytics');
    
    // Verify charts are rendered
    await expect(page.locator('.call-volume-chart')).toBeVisible();
    await expect(page.locator('.duration-chart')).toBeVisible();
    
    // Test date filter
    await page.fill('input[name="startDate"]', '2023-01-01');
    await page.fill('input[name="endDate"]', '2023-01-31');
    await page.click('button:text("Apply Filter")');
    await expect(page.locator('.data-loading')).not.toBeVisible();
  });

  test('should export analytics data', async ({ page }) => {
    await page.click('text=Analytics');
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:text("Export CSV")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/analytics-.*\.csv/);
  });
});