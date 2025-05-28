import { test, expect } from '@playwright/test';
import { ADMIN_CREDENTIALS } from '../fixtures';

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', ADMIN_CREDENTIALS.email);
    await page.fill('input[name="password"]', ADMIN_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    await page.click('text=Users');
  });

  test('should list users', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('User Management');
    const users = page.locator('.user-row');
    expect(await users.count()).toBeGreaterThan(0);
  });

  test('should create new user', async ({ page }) => {
    await page.click('text=Add User');
    await page.fill('input[name="email"]', 'test+new@voiceai.example.com');
    await page.fill('input[name="name"]', 'Test User');
    await page.selectOption('select[name="role"]', { label: 'Agent' });
    await page.click('button:text("Save")');
    
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should edit user', async ({ page }) => {
    const userRow = page.locator('.user-row').first();
    await userRow.locator('button:text("Edit")').click();
    await page.fill('input[name="name"]', 'Updated Name');
    await page.click('button:text("Save")');
    
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(userRow.locator('text=Updated Name')).toBeVisible();
  });
});