import { test, expect } from '@playwright/test';
import { ADMIN_CREDENTIALS } from '../fixtures';

test.describe('Admin Dashboard', () => {
  test('should login and display dashboard', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page).toHaveTitle('VoiceAI - Admin Login');
    
    await page.fill('input[name="email"]', ADMIN_CREDENTIALS.email);
    await page.fill('input[name="password"]', ADMIN_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    
    await page.waitForURL('/admin/dashboard');
    await expect(page.locator('h1')).toHaveText('Dashboard Overview');
    
    // Verify stats cards
    const stats = page.locator('.stat-card');
    await expect(stats).toHaveCount(4);
    await expect(stats.first()).toContainText('Active Calls');
  });

  test('should display recent activity', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page.locator('.activity-feed')).toBeVisible();
    const activities = page.locator('.activity-item');
    expect(await activities.count()).toBeGreaterThan(0);
  });
});