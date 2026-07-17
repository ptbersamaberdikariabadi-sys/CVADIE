import { test, expect } from '@playwright/test';

/**
 * /admin/settings — Halaman Pengaturan (Admin)
 * Mengcover: profil admin, email, form ubah password, badge "Segera Hadir"
 * Menggunakan storageState dari globalSetup
 */
test.describe('Admin Pengaturan — /admin/settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
  });

  test('halaman settings berhasil diakses', async ({ page }) => {
    expect(page.url()).toContain('/admin/settings');
    expect(page.url()).not.toContain('/login');
  });

  test('heading "Pengaturan" tampil', async ({ page }) => {
    await expect(page.locator('h2:has-text("Pengaturan")')).toBeVisible();
  });

  test('deskripsi halaman pengaturan tampil', async ({ page }) => {
    await expect(page.locator('text=/Kelola informasi profil/i').first()).toBeVisible();
  });

  test('kartu profil admin tampil dengan label "Administrator"', async ({ page }) => {
    await expect(page.locator('text="Administrator"')).toBeVisible();
  });

  test('email admin yang sedang login tampil di profil', async ({ page }) => {
    // Email admin yang digunakan di test: abadidewana.ie@gmail.com
    const emailDisplay = page.locator('text=/abadidewana/i').first().or(
      page.locator('text=/@gmail.com/i').first()
    );
    await expect(emailDisplay.first()).toBeVisible({ timeout: 10000 });
  });

  test('badge "Akses Penuh" tampil di profil admin', async ({ page }) => {
    await expect(page.locator('text="Akses Penuh"')).toBeVisible();
  });

  test('section "Keamanan Akun" tampil', async ({ page }) => {
    await expect(page.locator('text="Keamanan Akun"')).toBeVisible();
  });

  test('field email login (disabled) tersedia di section keamanan', async ({ page }) => {
    const emailInput = page.locator('input[type="email"][disabled]').first();
    await expect(emailInput).toBeVisible();
    // Email harus ter-isi dengan email admin yang login
    const emailVal = await emailInput.inputValue();
    expect(emailVal).toContain('@');
  });

  test('form ubah kata sandi tampil', async ({ page }) => {
    await expect(page.locator('text="Ubah Kata Sandi"')).toBeVisible();
    const passwordInputs = page.locator('input[type="password"]');
    const count = await passwordInputs.count();
    expect(count).toBeGreaterThanOrEqual(2); // Minimal 2: baru + konfirmasi
  });

  test('tombol "Perbarui Kata Sandi" tersedia', async ({ page }) => {
    await expect(page.locator('button:has-text("Perbarui Kata Sandi")')).toBeVisible();
  });

  test('section "Profil Perusahaan" dengan badge "Segera Hadir" tampil', async ({ page }) => {
    await expect(page.locator('text="Profil Perusahaan"')).toBeVisible();
    await expect(page.locator('text="Segera Hadir"')).toBeVisible();
  });

  test('sidebar navigasi tetap tampil di halaman settings', async ({ page }) => {
    const sidebar = page.locator('aside').first();
    await expect(sidebar.locator('text="ADIE ERP"')).toBeVisible();
    await expect(sidebar.locator('text="Pengaturan"')).toBeVisible();
  });

  test('header menampilkan "Pengaturan"', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toContainText('Pengaturan');
  });
});
