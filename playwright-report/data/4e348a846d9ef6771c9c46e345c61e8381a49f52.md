# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\admin-rfq.spec.ts >> Admin RFQ — /admin/rfq >> tabel RFQ memiliki kolom yang benar
- Location: tests\e2e\admin\admin-rfq.spec.ts:23:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('th:has-text("Tanggal")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('th:has-text("Tanggal")')

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * /admin/rfq — Halaman Prospek RFQ (Admin)
  5  |  * Mengcover: tabel RFQ, kolom data, status badge, tombol aksi
  6  |  * Menggunakan storageState dari globalSetup
  7  |  */
  8  | test.describe('Admin RFQ — /admin/rfq', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await page.goto('/admin/rfq');
  11 |     await page.waitForLoadState('networkidle');
  12 |   });
  13 | 
  14 |   test('halaman admin rfq berhasil diakses (bukan redirect ke login)', async ({ page }) => {
  15 |     expect(page.url()).toContain('/admin/rfq');
  16 |     expect(page.url()).not.toContain('/login');
  17 |   });
  18 | 
  19 |   test('heading "Daftar Prospek Masuk" tampil', async ({ page }) => {
  20 |     await expect(page.locator('text="Daftar Prospek Masuk"')).toBeVisible();
  21 |   });
  22 | 
  23 |   test('tabel RFQ memiliki kolom yang benar', async ({ page }) => {
> 24 |     await expect(page.locator('th:has-text("Tanggal")')).toBeVisible();
     |                                                          ^ Error: expect(locator).toBeVisible() failed
  25 |     await expect(page.locator('th:has-text("Klien")')).toBeVisible();
  26 |     await expect(page.locator('th:has-text("Kontak")')).toBeVisible();
  27 |     await expect(page.locator('th:has-text("Urgensi")')).toBeVisible();
  28 |     await expect(page.locator('th:has-text("Status")')).toBeVisible();
  29 |     await expect(page.locator('th:has-text("Aksi")')).toBeVisible();
  30 |   });
  31 | 
  32 |   test('tabel menampilkan data atau pesan kosong', async ({ page }) => {
  33 |     // Cari baris data ATAU pesan "belum ada"
  34 |     const dataRow = page.locator('tbody tr').first();
  35 |     const emptyMessage = page.locator('text="Belum ada prospek yang masuk."');
  36 | 
  37 |     await expect(dataRow.or(emptyMessage).first()).toBeVisible({ timeout: 10000 });
  38 |   });
  39 | 
  40 |   test('jika ada data RFQ: tombol aksi (Eye/WA) tersedia', async ({ page }) => {
  41 |     const rows = page.locator('tbody tr');
  42 |     const rowCount = await rows.count();
  43 | 
  44 |     if (rowCount === 0) {
  45 |       // Tidak ada data — skip test ini
  46 |       console.log('Tidak ada RFQ data, skip test tombol aksi');
  47 |       return;
  48 |     }
  49 | 
  50 |     // Cek tombol aksi di baris pertama (Eye button)
  51 |     const firstRow = rows.first();
  52 |     const actionButtons = firstRow.locator('button, a').filter({ hasText: '' });
  53 |     const btnCount = await actionButtons.count();
  54 |     expect(btnCount).toBeGreaterThan(0);
  55 |   });
  56 | 
  57 |   test('jika ada data RFQ: status badge tampil dengan styling yang benar', async ({ page }) => {
  58 |     const rows = page.locator('tbody tr');
  59 |     const rowCount = await rows.count();
  60 | 
  61 |     if (rowCount === 0) {
  62 |       console.log('Tidak ada data RFQ, skip test status badge');
  63 |       return;
  64 |     }
  65 | 
  66 |     // Status badge harus ada di setiap baris
  67 |     const statusCell = rows.first().locator('td').nth(4); // kolom Status
  68 |     await expect(statusCell).toBeVisible();
  69 |     // Badge harus memiliki teks status
  70 |     await expect(statusCell).not.toBeEmpty();
  71 |   });
  72 | 
  73 |   test('sidebar navigasi tetap tampil di halaman RFQ', async ({ page }) => {
  74 |     const sidebar = page.locator('aside').first();
  75 |     await expect(sidebar.locator('text="ADIE ERP"')).toBeVisible();
  76 |     await expect(sidebar.locator('text="Prospek RFQ"')).toBeVisible();
  77 |   });
  78 | });
  79 | 
```