# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\admin-cms.spec.ts >> Admin CMS Editor — /admin/cms >> heading "Kustomisasi Halaman Publik" tampil
- Location: tests\e2e\admin\admin-cms.spec.ts:19:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text="Kustomisasi Halaman Publik"')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text="Kustomisasi Halaman Publik"')

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
  4  |  * /admin/cms — Halaman CMS Editor (Admin)
  5  |  * Mengcover: heading, deskripsi, editor form/fields
  6  |  * Menggunakan storageState dari globalSetup
  7  |  */
  8  | test.describe('Admin CMS Editor — /admin/cms', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await page.goto('/admin/cms');
  11 |     await page.waitForLoadState('networkidle');
  12 |   });
  13 | 
  14 |   test('halaman admin cms berhasil diakses', async ({ page }) => {
  15 |     expect(page.url()).toContain('/admin/cms');
  16 |     expect(page.url()).not.toContain('/login');
  17 |   });
  18 | 
  19 |   test('heading "Kustomisasi Halaman Publik" tampil', async ({ page }) => {
> 20 |     await expect(page.locator('text="Kustomisasi Halaman Publik"')).toBeVisible();
     |                                                                     ^ Error: expect(locator).toBeVisible() failed
  21 |   });
  22 | 
  23 |   test('deskripsi editor CMS tampil', async ({ page }) => {
  24 |     await expect(page.locator('text=/Ubah teks/i').first()).toBeVisible();
  25 |   });
  26 | 
  27 |   test('CMS editor form atau komponen editor tersedia', async ({ page }) => {
  28 |     // CmsEditor komponen harus merender sesuatu — form, textarea, atau card
  29 |     const editorEl = page.locator('form').first().or(
  30 |       page.locator('textarea').first()
  31 |     ).or(
  32 |       page.locator('[data-testid="cms-editor"]').first()
  33 |     ).or(
  34 |       page.locator('.space-y-6').first() // Wrapper class editor
  35 |     );
  36 |     await expect(editorEl.first()).toBeVisible({ timeout: 10000 });
  37 |   });
  38 | 
  39 |   test('konten CMS beranda bisa dilihat — setidaknya satu section tampil', async ({ page }) => {
  40 |     // Cari section yang diketahui ada di CMS
  41 |     const section = page.locator('text=/Beranda/i').first().or(
  42 |       page.locator('text=/Hero/i').first()
  43 |     ).or(
  44 |       page.locator('text=/Profil/i').first()
  45 |     );
  46 |     await expect(section.first()).toBeVisible({ timeout: 10000 });
  47 |   });
  48 | 
  49 |   test('sidebar navigasi tetap tampil', async ({ page }) => {
  50 |     const sidebar = page.locator('aside').first();
  51 |     await expect(sidebar.locator('text="ADIE ERP"')).toBeVisible();
  52 |     await expect(sidebar.locator('text="Profil CMS"')).toBeVisible();
  53 |   });
  54 | 
  55 |   test('header halaman menampilkan "Profil CMS"', async ({ page }) => {
  56 |     const header = page.locator('header').first();
  57 |     await expect(header).toContainText('Profil CMS');
  58 |   });
  59 | });
  60 | 
```