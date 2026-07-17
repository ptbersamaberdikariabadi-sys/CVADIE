import { test, expect } from '@playwright/test';

/**
 * /about — Halaman Tentang Kami (User)
 * Mengcover: hero, sejarah perusahaan, misi, tim manajemen, legalitas
 */
test.describe('Halaman About — Tampilan User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
  });

  test('halaman about berhasil dimuat', async ({ page }) => {
    await expect(page).toHaveURL('/about');
    await expect(page).toHaveTitle(/Tentang|About|ADIE/i);
  });

  test('heading utama halaman about tampil', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('section sejarah perusahaan tampil', async ({ page }) => {
    const historySection = page.locator('text=/sejarah/i').first().or(
      page.locator('text=/CV. Abadi Dewana/i').first()
    ).or(
      page.locator('text=/didirikan/i').first()
    );
    await expect(historySection.first()).toBeVisible({ timeout: 10000 });
  });

  test('section misi atau komitmen tampil', async ({ page }) => {
    const missionSection = page.locator('text=/misi/i').first().or(
      page.locator('text=/komitmen/i').first()
    );
    await expect(missionSection.first()).toBeVisible({ timeout: 10000 });
  });

  test('informasi kontak perusahaan tampil', async ({ page }) => {
    const contactSection = page.locator('text=/kontak/i').first().or(
      page.locator('text=/WhatsApp/i').first()
    ).or(
      page.locator('text=/0821/i').first()
    );
    await expect(contactSection.first()).toBeVisible({ timeout: 10000 });
  });

  test('navbar dan footer tersedia', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });
});
