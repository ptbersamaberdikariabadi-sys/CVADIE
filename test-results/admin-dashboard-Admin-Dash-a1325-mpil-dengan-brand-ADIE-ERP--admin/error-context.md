# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\dashboard.spec.ts >> Admin Dashboard — /admin >> sidebar tampil dengan brand "ADIE ERP"
- Location: tests\e2e\admin\dashboard.spec.ts:21:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text="ADIE ERP"')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text="ADIE ERP"')

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
  4  |  * /admin — Dashboard Admin
  5  |  * Mengcover: sidebar navigasi, metric cards, header, logout button
  6  |  * Menggunakan storageState dari globalSetup (admin sudah login)
  7  |  */
  8  | test.describe('Admin Dashboard — /admin', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await page.goto('/admin');
  11 |     await page.waitForLoadState('networkidle');
  12 |   });
  13 | 
  14 |   test('admin berhasil mengakses dashboard (tidak redirect ke login)', async ({ page }) => {
  15 |     // Jika auth gagal → akan redirect ke /login
  16 |     const url = page.url();
  17 |     expect(url).toContain('/admin');
  18 |     expect(url).not.toContain('/login');
  19 |   });
  20 | 
  21 |   test('sidebar tampil dengan brand "ADIE ERP"', async ({ page }) => {
> 22 |     await expect(page.locator('text="ADIE ERP"')).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  23 |   });
  24 | 
  25 |   test('sidebar memiliki semua menu navigasi', async ({ page }) => {
  26 |     // Scope ke aside agar tidak bentrok dengan h1 header yang juga menampilkan nama halaman
  27 |     const sidebar = page.locator('aside').first();
  28 |     await expect(sidebar.locator('text="Ikhtisar"')).toBeVisible();
  29 |     await expect(sidebar.locator('text="Prospek RFQ"')).toBeVisible();
  30 |     await expect(sidebar.locator('text="Katalog Produk"')).toBeVisible();
  31 |     await expect(sidebar.locator('text="Profil CMS"')).toBeVisible();
  32 |     await expect(sidebar.locator('text="Pengaturan"')).toBeVisible();
  33 |   });
  34 | 
  35 |   test('header halaman menampilkan judul "Ikhtisar"', async ({ page }) => {
  36 |     const header = page.locator('header').first();
  37 |     await expect(header).toBeVisible();
  38 |     await expect(header).toContainText('Ikhtisar');
  39 |   });
  40 | 
  41 |   test('tombol Keluar (logout) tersedia di sidebar', async ({ page }) => {
  42 |     await expect(page.locator('text="Keluar"')).toBeVisible();
  43 |   });
  44 | 
  45 |   test('metric card "Total Prospek (RFQ)" tampil', async ({ page }) => {
  46 |     await expect(page.locator('text="Total Prospek (RFQ)"')).toBeVisible();
  47 |   });
  48 | 
  49 |   test('metric card "Total Produk Aktif" tampil', async ({ page }) => {
  50 |     await expect(page.locator('text="Total Produk Aktif"')).toBeVisible();
  51 |   });
  52 | 
  53 |   test('metric card "Estimasi Konversi" tampil', async ({ page }) => {
  54 |     await expect(page.locator('text="Estimasi Konversi"')).toBeVisible();
  55 |   });
  56 | 
  57 |   test('section Aktivitas Terkini tampil di dashboard', async ({ page }) => {
  58 |     await expect(page.locator('text="Aktivitas Terkini"')).toBeVisible();
  59 |   });
  60 | 
  61 |   test('navigasi ke Prospek RFQ dari sidebar berfungsi', async ({ page }) => {
  62 |     await page.locator('text="Prospek RFQ"').click();
  63 |     await page.waitForURL('**/admin/rfq');
  64 |     expect(page.url()).toContain('/admin/rfq');
  65 |   });
  66 | 
  67 |   test('navigasi ke Katalog Produk dari sidebar berfungsi', async ({ page }) => {
  68 |     await page.locator('text="Katalog Produk"').click();
  69 |     await page.waitForURL('**/admin/products');
  70 |     expect(page.url()).toContain('/admin/products');
  71 |   });
  72 | });
  73 | 
```