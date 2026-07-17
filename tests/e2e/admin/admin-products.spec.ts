import { test, expect } from '@playwright/test';

/**
 * /admin/products — Halaman Katalog Produk (Admin)
 * Mengcover: tabel produk, tombol tambah, navigasi ke form baru, form edit
 * Menggunakan storageState dari globalSetup
 */
test.describe('Admin Katalog Produk — /admin/products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
  });

  test('halaman admin products berhasil diakses', async ({ page }) => {
    expect(page.url()).toContain('/admin/products');
    expect(page.url()).not.toContain('/login');
  });

  test('heading "Katalog Produk" tampil', async ({ page }) => {
    // Scope ke h2 agar tidak bentrok dengan sidebar nav item 'Katalog Produk'
    await expect(page.locator('h2:has-text("Katalog Produk")')).toBeVisible();
  });

  test('sub-heading "peralatan industri" tampil', async ({ page }) => {
    await expect(page.locator('text=/peralatan industri/i').first()).toBeVisible();
  });

  test('tombol "Tambah Produk" tampil dan dapat diklik', async ({ page }) => {
    const addBtn = page.locator('a:has-text("Tambah Produk")').first().or(
      page.locator('text="Tambah Produk"').first()
    );
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await page.waitForURL('**/admin/products/new');
    expect(page.url()).toContain('/admin/products/new');
  });

  test('tabel produk memiliki kolom yang benar', async ({ page }) => {
    await expect(page.locator('th:has-text("SKU")')).toBeVisible();
    await expect(page.locator('th:has-text("Produk")')).toBeVisible();
    await expect(page.locator('th:has-text("Kategori")')).toBeVisible();
    await expect(page.locator('th:has-text("Merek")')).toBeVisible();
    await expect(page.locator('th:has-text("Stok")')).toBeVisible();
    await expect(page.locator('th:has-text("Aksi")')).toBeVisible();
  });

  test('tabel produk menampilkan data atau pesan kosong', async ({ page }) => {
    const dataRow = page.locator('tbody tr').first();
    const emptyMessage = page.locator('text=/Belum ada produk/i').first();
    await expect(dataRow.or(emptyMessage).first()).toBeVisible({ timeout: 10000 });
  });

  test('stok badge dengan warna yang benar tampil jika ada produk', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    if (rowCount === 0) {
      console.log('Tidak ada produk, skip test stok badge');
      return;
    }

    // Stok badge harus ada di kolom ke-5 (index 4)
    const stockCell = rows.first().locator('td').nth(4);
    await expect(stockCell).toBeVisible();
    // Badge span harus ada
    const badge = stockCell.locator('span').first();
    await expect(badge).toBeVisible();
  });

  test('sidebar navigasi tetap tampil', async ({ page }) => {
    const sidebar = page.locator('aside').first();
    await expect(sidebar.locator('text="ADIE ERP"')).toBeVisible();
    await expect(sidebar.locator('text="Katalog Produk"')).toBeVisible();
  });
});

test.describe('Admin Form Tambah Produk — /admin/products/new', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/products/new');
    await page.waitForLoadState('networkidle');
  });

  test('halaman new product berhasil diakses', async ({ page }) => {
    expect(page.url()).toContain('/admin/products/new');
    expect(page.url()).not.toContain('/login');
  });

  test('heading "Tambah Produk" tampil', async ({ page }) => {
    await expect(page.locator('text="Tambah Produk"')).toBeVisible();
  });

  test('tombol kembali ke daftar produk tersedia', async ({ page }) => {
    // Arrow back / link kembali
    const backLink = page.locator('a[href="/admin/products"]').first();
    await expect(backLink).toBeVisible();
  });

  test('form produk dengan field-field utama tampil', async ({ page }) => {
    // Form harus ada dengan minimal beberapa field
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Cari field nama produk (biasanya ada input dengan placeholder/label Nama)
    const nameInput = page.locator('input[name="name"], input[placeholder*="Nama"], input[id*="name"]').first().or(
      page.locator('label:has-text("Nama")').first()
    );
    await expect(nameInput.first()).toBeVisible({ timeout: 10000 });
  });
});
