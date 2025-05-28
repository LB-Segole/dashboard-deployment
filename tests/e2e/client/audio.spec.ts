import { test, expect } from '@playwright/test';
import { USER_CREDENTIALS } from '../fixtures';

test.describe('Audio Processing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_CREDENTIALS.email);
    await page.fill('input[name="password"]', USER_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    await page.click('text=Audio Tools');
  });

  test('should upload and process audio', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Upload Audio');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/sample.wav');
    
    await expect(page.locator('text=Processing...')).toBeVisible();
    await expect(page.locator('text=Processing complete')).toBeVisible({
      timeout: 30000
    });
    
    await expect(page.locator('.audio-player')).toBeVisible();
    await expect(page.locator('.transcript')).toContainText('Hello');
  });

  test('should display audio metrics', async ({ page }) => {
    await page.click('text=Sample Analysis');
    await expect(page.locator('.metrics-container')).toBeVisible();
    await expect(page.locator('text=Duration:')).toBeVisible();
    await expect(page.locator('text=Speech Rate:')).toBeVisible();
  });
});