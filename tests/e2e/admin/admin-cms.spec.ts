import { test, expect } from '@playwright/test';

/**
 * /admin/cms — Halaman CMS Editor (Admin)
 * Mengcover: heading, deskripsi, editor form/fields
 * Menggunakan storageState dari globalSetup
 */
test.describe('Admin CMS Editor — /admin/cms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/cms');
    await page.waitForLoadState('networkidle');
  });

  test('halaman admin cms berhasil diakses', async ({ page }) => {
    expect(page.url()).toContain('/admin/cms');
    expect(page.url()).not.toContain('/login');
  });

  test('heading "Kustomisasi Halaman Publik" tampil', async ({ page }) => {
    await expect(page.locator('text="Kustomisasi Halaman Publik"')).toBeVisible();
  });

  test('deskripsi editor CMS tampil', async ({ page }) => {
    await expect(page.locator('text=/Ubah teks/i').first()).toBeVisible();
  });

  test('CMS editor form atau komponen editor tersedia', async ({ page }) => {
    // CmsEditor komponen harus merender sesuatu — form, textarea, atau card
    const editorEl = page.locator('form').first().or(
      page.locator('textarea').first()
    ).or(
      page.locator('[data-testid="cms-editor"]').first()
    ).or(
      page.locator('.space-y-6').first() // Wrapper class editor
    );
    await expect(editorEl.first()).toBeVisible({ timeout: 10000 });
  });

  test('konten CMS beranda bisa dilihat — setidaknya satu section tampil', async ({ page }) => {
    // Cari section yang diketahui ada di CMS
    const section = page.locator('text=/Beranda/i').first().or(
      page.locator('text=/Hero/i').first()
    ).or(
      page.locator('text=/Profil/i').first()
    );
    await expect(section.first()).toBeVisible({ timeout: 10000 });
  });

  test('sidebar navigasi tetap tampil', async ({ page }) => {
    const sidebar = page.locator('aside').first();
    await expect(sidebar.locator('text="ADIE ERP"')).toBeVisible();
    await expect(sidebar.locator('text="Profil CMS"')).toBeVisible();
  });

  test('header halaman menampilkan "Profil CMS"', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toContainText('Profil CMS');
  });
});
