# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\admin-settings.spec.ts >> Admin Pengaturan — /admin/settings >> heading "Pengaturan" tampil
- Location: tests\e2e\admin\admin-settings.spec.ts:19:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h2:has-text("Pengaturan")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h2:has-text("Pengaturan")')

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
  4  |  * /admin/settings — Halaman Pengaturan (Admin)
  5  |  * Mengcover: profil admin, email, form ubah password, badge "Segera Hadir"
  6  |  * Menggunakan storageState dari globalSetup
  7  |  */
  8  | test.describe('Admin Pengaturan — /admin/settings', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await page.goto('/admin/settings');
  11 |     await page.waitForLoadState('networkidle');
  12 |   });
  13 | 
  14 |   test('halaman settings berhasil diakses', async ({ page }) => {
  15 |     expect(page.url()).toContain('/admin/settings');
  16 |     expect(page.url()).not.toContain('/login');
  17 |   });
  18 | 
  19 |   test('heading "Pengaturan" tampil', async ({ page }) => {
> 20 |     await expect(page.locator('h2:has-text("Pengaturan")')).toBeVisible();
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  21 |   });
  22 | 
  23 |   test('deskripsi halaman pengaturan tampil', async ({ page }) => {
  24 |     await expect(page.locator('text=/Kelola informasi profil/i').first()).toBeVisible();
  25 |   });
  26 | 
  27 |   test('kartu profil admin tampil dengan label "Administrator"', async ({ page }) => {
  28 |     await expect(page.locator('text="Administrator"')).toBeVisible();
  29 |   });
  30 | 
  31 |   test('email admin yang sedang login tampil di profil', async ({ page }) => {
  32 |     // Email admin yang digunakan di test: abadidewana.ie@gmail.com
  33 |     const emailDisplay = page.locator('text=/abadidewana/i').first().or(
  34 |       page.locator('text=/@gmail.com/i').first()
  35 |     );
  36 |     await expect(emailDisplay.first()).toBeVisible({ timeout: 10000 });
  37 |   });
  38 | 
  39 |   test('badge "Akses Penuh" tampil di profil admin', async ({ page }) => {
  40 |     await expect(page.locator('text="Akses Penuh"')).toBeVisible();
  41 |   });
  42 | 
  43 |   test('section "Keamanan Akun" tampil', async ({ page }) => {
  44 |     await expect(page.locator('text="Keamanan Akun"')).toBeVisible();
  45 |   });
  46 | 
  47 |   test('field email login (disabled) tersedia di section keamanan', async ({ page }) => {
  48 |     const emailInput = page.locator('input[type="email"][disabled]').first();
  49 |     await expect(emailInput).toBeVisible();
  50 |     // Email harus ter-isi dengan email admin yang login
  51 |     const emailVal = await emailInput.inputValue();
  52 |     expect(emailVal).toContain('@');
  53 |   });
  54 | 
  55 |   test('form ubah kata sandi tampil', async ({ page }) => {
  56 |     await expect(page.locator('text="Ubah Kata Sandi"')).toBeVisible();
  57 |     const passwordInputs = page.locator('input[type="password"]');
  58 |     const count = await passwordInputs.count();
  59 |     expect(count).toBeGreaterThanOrEqual(2); // Minimal 2: baru + konfirmasi
  60 |   });
  61 | 
  62 |   test('tombol "Perbarui Kata Sandi" tersedia', async ({ page }) => {
  63 |     await expect(page.locator('button:has-text("Perbarui Kata Sandi")')).toBeVisible();
  64 |   });
  65 | 
  66 |   test('section "Profil Perusahaan" dengan badge "Segera Hadir" tampil', async ({ page }) => {
  67 |     await expect(page.locator('text="Profil Perusahaan"')).toBeVisible();
  68 |     await expect(page.locator('text="Segera Hadir"')).toBeVisible();
  69 |   });
  70 | 
  71 |   test('sidebar navigasi tetap tampil di halaman settings', async ({ page }) => {
  72 |     const sidebar = page.locator('aside').first();
  73 |     await expect(sidebar.locator('text="ADIE ERP"')).toBeVisible();
  74 |     await expect(sidebar.locator('text="Pengaturan"')).toBeVisible();
  75 |   });
  76 | 
  77 |   test('header menampilkan "Pengaturan"', async ({ page }) => {
  78 |     const header = page.locator('header').first();
  79 |     await expect(header).toContainText('Pengaturan');
  80 |   });
  81 | });
  82 | 
```