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

    // Cari link kategori apapun yang menuju ke detail kategori produk
    const categoryLink = page.locator('a[href^="/products/"]').first();
    
    // Scroll ke section kategori agar kartu terkena viewport
    await categoryLink.scrollIntoViewIfNeeded();
    
    // Dapatkan slug-nya untuk verifikasi
    const href = await categoryLink.getAttribute('href');
    const expectedSlug = href?.replace('/products/', '') || '';
    
    // Tunggu link kategori muncul
    await expect(categoryLink).toBeVisible({ timeout: 10000 });
    await categoryLink.click();

    // 3. Verify routing ke slug yang benar
    await page.waitForURL(`/products/${expectedSlug}`, { timeout: 15000 });

    // 4. Verify h1 ada di halaman kategori
    await expect(page.locator('h1').first()).toBeVisible();

    // 5. Verify sidebar memiliki "Filter Sub-Kategori"
    await expect(page.locator('text="Filter Sub-Kategori"')).toBeVisible();

    // 6. Verify grid produk atau pesan kosong tampil
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
