import { test, expect } from '@playwright/test';
import { generateSlug } from '../../src/utils/slugify';

/**
 * Dynamic Category Navigation — Tampilan User
 * Test navigasi dari homepage → kategori → halaman produk per kategori
 */
test.describe('Dynamic Category Navigation', () => {
  test('should navigate to specific category and filter correctly', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2. Cari kartu kategori apapun yang ada di homepage
    // Kategori di-render dari CMS atau fallback — cari link ke /products/[slug]
    // Fallback categories include: "Pneumatik & Kompresor", "Otomasi & Elektrikal", dll.
    const categoryTitle = "Pneumatik & Kompresor";

    // Cari link berdasarkan href menuju /products/ (lebih reliable daripada teks)
    const categoryLink = page.locator(`a[href="/products/${generateSlug(categoryTitle)}"]`).first();
    
    // Scroll ke section kategori agar kartu terkena viewport
    await page.evaluate(() => window.scrollBy(0, 600));
    
    // Tunggu link kategori muncul
    await expect(categoryLink).toBeVisible({ timeout: 10000 });
    await categoryLink.click();

    // 3. Verify routing ke slug yang benar
    const expectedSlug = generateSlug(categoryTitle);
    await page.waitForURL(`/products/${expectedSlug}`, { timeout: 15000 });

    // 4. Verify h1 menampilkan nama kategori
    await expect(page.locator('h1').first()).toContainText(/Pneumatik/i);

    // 5. Verify sidebar memiliki "Filter Sub-Kategori"
    await expect(page.locator('text="Filter Sub-Kategori"')).toBeVisible();

    // 6. Verify "Semua Produk" link tersedia dan aktif
    const allProductsLink = page.locator(`text="Semua Produk ${categoryTitle}"`);
    await expect(allProductsLink).toBeVisible();

    // 7. Verify grid produk atau pesan kosong tampil
    const productGrid = page.locator('.grid').first();
    const emptyMessage = page.locator('text="Tidak ada produk ditemukan di kategori/sub-kategori ini."').first();
    const productGridOrEmpty = productGrid.or(emptyMessage);
    await expect(productGridOrEmpty).toBeVisible();
  });

  test('category page tampil dengan benar saat diakses langsung via URL', async ({ page }) => {
    const slug = generateSlug("Pneumatik & Kompresor");
    await page.goto(`/products/${slug}`);
    await page.waitForLoadState('networkidle');

    // H1 harus ada
    await expect(page.locator('h1').first()).toBeVisible();

    // Sidebar filter tersedia
    await expect(page.locator('text="Filter Sub-Kategori"')).toBeVisible();

    // Grid atau pesan kosong tampil
    const content = page.locator('main').first();
    await expect(content).toBeVisible();
  });
});
