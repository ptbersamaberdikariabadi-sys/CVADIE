import { test, expect } from '@playwright/test';
import { generateSlug } from '../../src/utils/slugify';

test.describe('Dynamic Category Navigation', () => {
  test('should navigate to specific category and filter correctly', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');

    // 2. Find the "Pneumatik & Kompresor" category box and click it
    // Wait for the categories section to be visible
    const categoryTitle = "Pneumatik & Kompresor";
    await page.waitForSelector(`text="${categoryTitle}"`);
    
    // The closest Link wrapping the title is what we want to click
    const categoryBox = page.locator(`text="${categoryTitle}"`).first();
    await categoryBox.click();

    // 3. Verify it routes to the correct dynamic slug
    const expectedSlug = generateSlug(categoryTitle);
    await page.waitForURL(`/products/${expectedSlug}`);

    // 4. Verify the page title shows the category name
    await expect(page.locator(`h1:has-text("${categoryTitle}")`)).toBeVisible();

    // 5. Verify the sidebar has "Filter Sub-Kategori"
    await expect(page.locator('text="Filter Sub-Kategori"')).toBeVisible();

    // 6. Verify "Semua Produk" link is visible and active by default
    const allProductsLink = page.locator(`text="Semua Produk ${categoryTitle}"`);
    await expect(allProductsLink).toBeVisible();

    // If there are subcategories available, test clicking one (optional, depending on DB seed)
    // We can just assert that the product grid loaded something or shows "Tidak ada produk"
    const productGrid = page.locator('.grid').first();
    const emptyMessage = page.locator('text="Tidak ada produk ditemukan di kategori/sub-kategori ini."').first();
    const productGridOrEmpty = productGrid.or(emptyMessage);
    await expect(productGridOrEmpty).toBeVisible();
  });
});
