import { test, expect } from '@playwright/test';

test.describe('RFQ B2B Flow', () => {
  test('should navigate to products and add item to RFQ cart', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    
    // 2. Navigate to products page
    await page.locator('text="JELAJAHI KATALOG PRODUK"').first().click();
    await page.waitForURL('/products');

    // 3. Find first Add to Cart button and click it
    // Wait for products to load
    await page.waitForSelector('button:has-text("+ KERANJANG RFQ")');
    const addToCartBtns = page.locator('button:has-text("+ KERANJANG RFQ")');
    await addToCartBtns.first().click();

    // 4. Verify Floating Cart exists and has 1 item
    const floatingCart = page.locator('text="1 item di keranjang"');
    await expect(floatingCart).toBeVisible();

    // 5. Navigate to RFQ page
    await page.locator('text="Buka RFQ"').click();
    await page.waitForURL('/rfq');

    // 6. Verify RFQ page shows the cart item
    const cartItemSection = page.locator('text="Daftar Keranjang B2B"');
    await expect(cartItemSection).toBeVisible();

    // 7. Fill out RFQ Form
    await page.fill('input[name="name"]', 'Budi Santoso');
    await page.fill('input[name="company"]', 'PT. Maju Mundur');
    await page.fill('input[name="email"]', 'budi@majumundur.com');
    await page.fill('input[name="phone"]', '081234567890');
    await page.selectOption('select[name="urgency"]', 'Tinggi');
    await page.fill('textarea[name="message"]', 'Tolong kirimkan penawaran segera.');

    // We do NOT click submit in this automated test because it will open WhatsApp and pollute DB, 
    // unless we have a mock or staging env. For now, we assert the button is visible.
    const submitBtn = page.locator('button:has-text("KIRIM RFQ VIA WHATSAPP")');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });
});
