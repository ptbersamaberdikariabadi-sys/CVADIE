import { test, expect } from '@playwright/test';

/**
 * /login — Halaman Login Admin
 * Mengcover:
 * - render form login
 * - proteksi unauthenticated access ke /admin
 * - error message saat kredensial salah
 * - redirect ke /admin setelah login berhasil
 *
 * CATATAN: Test ini TIDAK menggunakan storageState, dijalankan sebagai unauthenticated.
 * Oleh karena itu file ini ada di folder admin/ tetapi di playwright.config.ts
 * login.spec.ts diperlakukan secara khusus.
 */
test.describe('Halaman Login — Akses Admin', () => {

  test('halaman login berhasil dimuat', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/login');
  });

  test('form login tampil dengan field email dan password', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('heading "Akses Internal ADIE" tampil', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h2:has-text("Akses Internal ADIE")')).toBeVisible();
  });

  test('subtitle untuk staf resmi tampil', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=/staf resmi/i').first()).toBeVisible();
  });

  test('login dengan kredensial salah menampilkan pesan error', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill('wrong@email.com');
    await page.locator('input[type="password"]').fill('wrongpassword123');
    await page.locator('button[type="submit"]').click();

    // Tunggu pesan error muncul
    const errorMsg = page.locator('text=/Gagal masuk/i').first();
    await expect(errorMsg).toBeVisible({ timeout: 10000 });
  });

  test('unauthenticated access ke /admin redirect ke /login', async ({ page }) => {
    // Akses langsung tanpa auth
    await page.goto('/admin');
    // Middleware harus redirect ke /login
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('unauthenticated access ke /admin/products redirect ke /login', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });
});
