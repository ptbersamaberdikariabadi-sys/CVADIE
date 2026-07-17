import { test, expect } from '@playwright/test';

/**
 * /services — Halaman Layanan (User)
 * Mengcover: render halaman, konten layanan, navigasi
 */
test.describe('Halaman Services — Tampilan User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
  });

  test('halaman services berhasil dimuat', async ({ page }) => {
    await expect(page).toHaveURL('/services');
  });

  test('heading halaman services tampil', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('konten layanan tampil', async ({ page }) => {
    // Cari konten yang umum ada di halaman layanan
    const serviceContent = page.locator('text=/layanan/i').first().or(
      page.locator('text=/pengadaan/i').first()
    ).or(
      page.locator('text=/industrial/i').first()
    );
    await expect(serviceContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('navbar dan footer tersedia', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });

  test('link ke halaman RFQ tersedia di halaman layanan', async ({ page }) => {
    // Halaman services seharusnya ada CTA ke RFQ
    const rfqLink = page.locator('a[href="/rfq"]').first().or(
      page.locator('text=/RFQ/i').first()
    );
    await expect(rfqLink.first()).toBeVisible({ timeout: 10000 });
  });
});
