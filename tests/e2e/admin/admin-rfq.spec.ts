import { test, expect } from '@playwright/test';

/**
 * /admin/rfq — Halaman Prospek RFQ (Admin)
 * Mengcover: tabel RFQ, kolom data, status badge, tombol aksi
 * Menggunakan storageState dari globalSetup
 */
test.describe('Admin RFQ — /admin/rfq', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/rfq');
    await page.waitForLoadState('networkidle');
  });

  test('halaman admin rfq berhasil diakses (bukan redirect ke login)', async ({ page }) => {
    expect(page.url()).toContain('/admin/rfq');
    expect(page.url()).not.toContain('/login');
  });

  test('heading "Daftar Prospek Masuk" tampil', async ({ page }) => {
    await expect(page.locator('text="Daftar Prospek Masuk"')).toBeVisible();
  });

  test('tabel RFQ memiliki kolom yang benar', async ({ page }) => {
    await expect(page.locator('th:has-text("Tanggal")')).toBeVisible();
    await expect(page.locator('th:has-text("Klien")')).toBeVisible();
    await expect(page.locator('th:has-text("Kontak")')).toBeVisible();
    await expect(page.locator('th:has-text("Urgensi")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Aksi")')).toBeVisible();
  });

  test('tabel menampilkan data atau pesan kosong', async ({ page }) => {
    // Cari baris data ATAU pesan "belum ada"
    const dataRow = page.locator('tbody tr').first();
    const emptyMessage = page.locator('text="Belum ada prospek yang masuk."');

    await expect(dataRow.or(emptyMessage).first()).toBeVisible({ timeout: 10000 });
  });

  test('jika ada data RFQ: tombol aksi (Eye/WA) tersedia', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
      // Tidak ada data — skip test ini
      console.log('Tidak ada RFQ data, skip test tombol aksi');
      return;
    }

    // Cek tombol aksi di baris pertama (Eye button)
    const firstRow = rows.first();
    const actionButtons = firstRow.locator('button, a').filter({ hasText: '' });
    const btnCount = await actionButtons.count();
    expect(btnCount).toBeGreaterThan(0);
  });

  test('jika ada data RFQ: status badge tampil dengan styling yang benar', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
      console.log('Tidak ada data RFQ, skip test status badge');
      return;
    }

    // Status badge harus ada di setiap baris
    const statusCell = rows.first().locator('td').nth(4); // kolom Status
    await expect(statusCell).toBeVisible();
    // Badge harus memiliki teks status
    await expect(statusCell).not.toBeEmpty();
  });

  test('sidebar navigasi tetap tampil di halaman RFQ', async ({ page }) => {
    const sidebar = page.locator('aside').first();
    await expect(sidebar.locator('text="ADIE ERP"')).toBeVisible();
    await expect(sidebar.locator('text="Prospek RFQ"')).toBeVisible();
  });
});
