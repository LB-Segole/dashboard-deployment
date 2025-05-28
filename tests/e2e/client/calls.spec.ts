import { test, expect } from '@playwright/test';
import { USER_CREDENTIALS } from '../fixtures';

test.describe('Call Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_CREDENTIALS.email);
    await page.fill('input[name="password"]', USER_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    await page.click('text=Calls');
  });

  test('should initiate a call', async ({ page }) => {
    await page.fill('input[name="phoneNumber"]', '+1234567890');
    await page.click('button:text("Start Call")');
    
    await expect(page.locator('.call-status')).toContainText(
      'Connecting...',
      { timeout: 10000 }
    );
    
    // Verify call controls are visible
    await expect(page.locator('button:text("Mute")')).toBeVisible();
    await expect(page.locator('button:text("End Call")')).toBeVisible();
  });

  test('should display call history', async ({ page }) => {
    const calls = page.locator('.call-item');
    expect(await calls.count()).toBeGreaterThan(0);
    
    // Test filtering
    await page.click('button:text("Filter")');
    await page.click('text=Completed');
    await expect(calls.first()).toContainText('Completed');
  });
});