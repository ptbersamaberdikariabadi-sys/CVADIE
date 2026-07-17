import { test, expect } from '@playwright/test';

/**
 * Homepage (/) — Tampilan User
 * Mengcover: hero section, navigasi, kategori/layanan, CTA, footer
 */
test.describe('Homepage — Tampilan User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('halaman berhasil dimuat dan memiliki judul yang benar', async ({ page }) => {
    // Title: "CV. Abadi Dewana | General Trading & Industrial Equipment"
    await expect(page).toHaveTitle(/Abadi Dewana/i);
  });

  test('header tampil dengan logo dan aksi navigasi', async ({ page }) => {
    // Header ada
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Logo link ke homepage
    await expect(page.locator('header a[href="/"]').first()).toBeVisible();
  });

  test('navigasi TENTANG KAMI dan LAYANAN tersedia di header', async ({ page }) => {
    await expect(page.locator('header a[href="/about"]')).toBeVisible();
    await expect(page.locator('header a[href="/services"]')).toBeVisible();
  });

  test('hero section tampil dengan headline utama', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    // Headline dari CMS / fallback mencakup kata kunci industri
    await expect(h1).toContainText(/industri|suku cadang|partner/i);
  });

  test('tombol MINTA PENAWARAN (RFQ) di hero tampil', async ({ page }) => {
    const rfqBtn = page.locator('a[href="/rfq"]').first();
    await expect(rfqBtn).toBeVisible();
  });

  test('tombol JELAJAHI KATALOG PRODUK di hero tampil dan bisa diklik', async ({ page }) => {
    // Tombol ini merender teks dari CMS — cari link ke /products
    const catalogBtn = page.locator('a[href="/products"]').first();
    await expect(catalogBtn).toBeVisible();
    await catalogBtn.click();
    await page.waitForURL('/products');
    expect(page.url()).toContain('/products');
  });

  test('section layanan/kategori industri tampil', async ({ page }) => {
    // Section dengan heading "Sektor Industri & Layanan Utama" atau dari CMS
    const sectionHeading = page.locator('text=/Sektor Industri/i').first().or(
      page.locator('text=/Layanan Utama/i').first()
    ).or(
      page.locator('text=/Pneumatik/i').first()
    );
    await expect(sectionHeading.first()).toBeVisible({ timeout: 10000 });
  });

  test('section trust grid (keunggulan) tampil', async ({ page }) => {
    // Section berisi item-item keunggulan
    const trustItem = page.locator('text=/Garansi/i').first().or(
      page.locator('text=/Global Sourcing/i').first()
    ).or(
      page.locator('text=/PKP/i').first()
    );
    await expect(trustItem.first()).toBeVisible({ timeout: 10000 });
  });

  test('footer tampil dengan informasi perusahaan CV. ABADI DEWANA', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    // Footer berisi "CV. ABADI DEWANA" (bukan singkatan "ADIE")
    await expect(footer).toContainText(/CV\. ABADI DEWANA/i);
  });

  test('footer berisi informasi kontak (email/telepon)', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer).toContainText(/0821|WhatsApp|abadidewana/i);
  });

  test('tombol RFQ di header tersedia', async ({ page }) => {
    // "MINTA PENAWARAN (RFQ)" button di header
    const headerRfqBtn = page.locator('header a[href="/rfq"]').first();
    await expect(headerRfqBtn).toBeVisible();
  });
});
