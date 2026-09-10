# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\admin-products.spec.ts >> Admin Katalog Produk — /admin/products >> heading "Katalog Produk" tampil
- Location: tests\e2e\admin\admin-products.spec.ts:19:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h2:has-text("Katalog Produk")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h2:has-text("Katalog Produk")')

```

```yaml
- heading "Akses Internal ADIE" [level=2]
- paragraph: Hanya untuk staf resmi CV. Abadi Dewana
- text: Email Staf
- textbox "admin@cv-adie.com"
- text: Kata Sandi
- textbox "••••••••"
- button "MASUK KE SISTEM ERP"
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * /admin/products — Halaman Katalog Produk (Admin)
  5   |  * Mengcover: tabel produk, tombol tambah, navigasi ke form baru, form edit
  6   |  * Menggunakan storageState dari globalSetup
  7   |  */
  8   | test.describe('Admin Katalog Produk — /admin/products', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.goto('/admin/products');
  11  |     await page.waitForLoadState('networkidle');
  12  |   });
  13  | 
  14  |   test('halaman admin products berhasil diakses', async ({ page }) => {
  15  |     expect(page.url()).toContain('/admin/products');
  16  |     expect(page.url()).not.toContain('/login');
  17  |   });
  18  | 
  19  |   test('heading "Katalog Produk" tampil', async ({ page }) => {
  20  |     // Scope ke h2 agar tidak bentrok dengan sidebar nav item 'Katalog Produk'
> 21  |     await expect(page.locator('h2:has-text("Katalog Produk")')).toBeVisible();
      |                                                                 ^ Error: expect(locator).toBeVisible() failed
  22  |   });
  23  | 
  24  |   test('sub-heading "peralatan industri" tampil', async ({ page }) => {
  25  |     await expect(page.locator('text=/peralatan industri/i').first()).toBeVisible();
  26  |   });
  27  | 
  28  |   test('tombol "Tambah Produk" tampil dan dapat diklik', async ({ page }) => {
  29  |     const addBtn = page.locator('a:has-text("Tambah Produk")').first().or(
  30  |       page.locator('text="Tambah Produk"').first()
  31  |     );
  32  |     await expect(addBtn).toBeVisible();
  33  |     await addBtn.click();
  34  |     await page.waitForURL('**/admin/products/new');
  35  |     expect(page.url()).toContain('/admin/products/new');
  36  |   });
  37  | 
  38  |   test('tabel produk memiliki kolom yang benar', async ({ page }) => {
  39  |     await expect(page.locator('th:has-text("SKU")')).toBeVisible();
  40  |     await expect(page.locator('th:has-text("Produk")')).toBeVisible();
  41  |     await expect(page.locator('th:has-text("Kategori")')).toBeVisible();
  42  |     await expect(page.locator('th:has-text("Merek")')).toBeVisible();
  43  |     await expect(page.locator('th:has-text("Stok")')).toBeVisible();
  44  |     await expect(page.locator('th:has-text("Aksi")')).toBeVisible();
  45  |   });
  46  | 
  47  |   test('tabel produk menampilkan data atau pesan kosong', async ({ page }) => {
  48  |     const dataRow = page.locator('tbody tr').first();
  49  |     const emptyMessage = page.locator('text=/Belum ada produk/i').first();
  50  |     await expect(dataRow.or(emptyMessage).first()).toBeVisible({ timeout: 10000 });
  51  |   });
  52  | 
  53  |   test('stok badge dengan warna yang benar tampil jika ada produk', async ({ page }) => {
  54  |     const rows = page.locator('tbody tr');
  55  |     const rowCount = await rows.count();
  56  |     if (rowCount === 0) {
  57  |       console.log('Tidak ada produk, skip test stok badge');
  58  |       return;
  59  |     }
  60  | 
  61  |     // Stok badge harus ada di kolom ke-5 (index 4)
  62  |     const stockCell = rows.first().locator('td').nth(4);
  63  |     await expect(stockCell).toBeVisible();
  64  |     // Badge span harus ada
  65  |     const badge = stockCell.locator('span').first();
  66  |     await expect(badge).toBeVisible();
  67  |   });
  68  | 
  69  |   test('sidebar navigasi tetap tampil', async ({ page }) => {
  70  |     const sidebar = page.locator('aside').first();
  71  |     await expect(sidebar.locator('text="ADIE ERP"')).toBeVisible();
  72  |     await expect(sidebar.locator('text="Katalog Produk"')).toBeVisible();
  73  |   });
  74  | });
  75  | 
  76  | test.describe('Admin Form Tambah Produk — /admin/products/new', () => {
  77  |   test.beforeEach(async ({ page }) => {
  78  |     await page.goto('/admin/products/new');
  79  |     await page.waitForLoadState('networkidle');
  80  |   });
  81  | 
  82  |   test('halaman new product berhasil diakses', async ({ page }) => {
  83  |     expect(page.url()).toContain('/admin/products/new');
  84  |     expect(page.url()).not.toContain('/login');
  85  |   });
  86  | 
  87  |   test('heading "Tambah Produk" tampil', async ({ page }) => {
  88  |     await expect(page.locator('text="Tambah Produk"')).toBeVisible();
  89  |   });
  90  | 
  91  |   test('tombol kembali ke daftar produk tersedia', async ({ page }) => {
  92  |     // Arrow back / link kembali
  93  |     const backLink = page.locator('a[href="/admin/products"]').first();
  94  |     await expect(backLink).toBeVisible();
  95  |   });
  96  | 
  97  |   test('form produk dengan field-field utama tampil', async ({ page }) => {
  98  |     // Form harus ada dengan minimal beberapa field
  99  |     const form = page.locator('form').first();
  100 |     await expect(form).toBeVisible();
  101 | 
  102 |     // Cari field nama produk (biasanya ada input dengan placeholder/label Nama)
  103 |     const nameInput = page.locator('input[name="name"], input[placeholder*="Nama"], input[id*="name"]').first().or(
  104 |       page.locator('label:has-text("Nama")').first()
  105 |     );
  106 |     await expect(nameInput.first()).toBeVisible({ timeout: 10000 });
  107 |   });
  108 | });
  109 | 
```