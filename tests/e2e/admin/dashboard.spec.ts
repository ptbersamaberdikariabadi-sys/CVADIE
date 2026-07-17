import { test, expect } from '@playwright/test';

/**
 * /admin — Dashboard Admin
 * Mengcover: sidebar navigasi, metric cards, header, logout button
 * Menggunakan storageState dari globalSetup (admin sudah login)
 */
test.describe('Admin Dashboard — /admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test('admin berhasil mengakses dashboard (tidak redirect ke login)', async ({ page }) => {
    // Jika auth gagal → akan redirect ke /login
    const url = page.url();
    expect(url).toContain('/admin');
    expect(url).not.toContain('/login');
  });

  test('sidebar tampil dengan brand "ADIE ERP"', async ({ page }) => {
    await expect(page.locator('text="ADIE ERP"')).toBeVisible();
  });

  test('sidebar memiliki semua menu navigasi', async ({ page }) => {
    // Scope ke aside agar tidak bentrok dengan h1 header yang juga menampilkan nama halaman
    const sidebar = page.locator('aside').first();
    await expect(sidebar.locator('text="Ikhtisar"')).toBeVisible();
    await expect(sidebar.locator('text="Prospek RFQ"')).toBeVisible();
    await expect(sidebar.locator('text="Katalog Produk"')).toBeVisible();
    await expect(sidebar.locator('text="Profil CMS"')).toBeVisible();
    await expect(sidebar.locator('text="Pengaturan"')).toBeVisible();
  });

  test('header halaman menampilkan judul "Ikhtisar"', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await expect(header).toContainText('Ikhtisar');
  });

  test('tombol Keluar (logout) tersedia di sidebar', async ({ page }) => {
    await expect(page.locator('text="Keluar"')).toBeVisible();
  });

  test('metric card "Total Prospek (RFQ)" tampil', async ({ page }) => {
    await expect(page.locator('text="Total Prospek (RFQ)"')).toBeVisible();
  });

  test('metric card "Total Produk Aktif" tampil', async ({ page }) => {
    await expect(page.locator('text="Total Produk Aktif"')).toBeVisible();
  });

  test('metric card "Estimasi Konversi" tampil', async ({ page }) => {
    await expect(page.locator('text="Estimasi Konversi"')).toBeVisible();
  });

  test('section Aktivitas Terkini tampil di dashboard', async ({ page }) => {
    await expect(page.locator('text="Aktivitas Terkini"')).toBeVisible();
  });

  test('navigasi ke Prospek RFQ dari sidebar berfungsi', async ({ page }) => {
    await page.locator('text="Prospek RFQ"').click();
    await page.waitForURL('**/admin/rfq');
    expect(page.url()).toContain('/admin/rfq');
  });

  test('navigasi ke Katalog Produk dari sidebar berfungsi', async ({ page }) => {
    await page.locator('text="Katalog Produk"').click();
    await page.waitForURL('**/admin/products');
    expect(page.url()).toContain('/admin/products');
  });
});
