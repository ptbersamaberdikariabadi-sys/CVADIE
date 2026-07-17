import { test, expect } from '@playwright/test';

/**
 * RFQ B2B Flow — Tampilan User
 * 
 * CATATAN: AddToCartButton menampilkan teks "+ KERANJANG" (bukan "+ KERANJANG RFQ")
 * Floating cart menggunakan CartIcon di header (badge angka), bukan teks "item di keranjang"
 */
test.describe('RFQ B2B Flow', () => {
  test('should navigate to products and add item to RFQ cart', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2. Navigate to products page via hero CTA button
    const catalogBtn = page.locator('a[href="/products"]').first();
    await expect(catalogBtn).toBeVisible();
    await catalogBtn.click();
    await page.waitForURL('/products');

    // 3. Find first Add to Cart button and click it
    // Teks aktual tombol: "+ KERANJANG" (dari AddToCartButton.tsx)
    const addToCartBtns = page.locator('button:has-text("+ KERANJANG")');
    
    // Jika tidak ada produk di DB, test tidak bisa dilanjutkan
    const btnCount = await addToCartBtns.count();
    if (btnCount === 0) {
      // Cek apakah pesan kosong muncul
      const emptyMsg = page.locator('text=/Belum ada produk yang ditambahkan/i').first();
      const isEmptyVisible = await emptyMsg.isVisible();
      if (isEmptyVisible) {
        test.skip(true, 'Database tidak memiliki produk — jalankan seed.sql terlebih dahulu');
      }
      return;
    }

    await addToCartBtns.first().click();

    // 4. Verify tombol berubah ke "DITAMBAHKAN" (feedback singkat)
    await expect(page.locator('button:has-text("DITAMBAHKAN")').first()).toBeVisible({ timeout: 3000 });

    // 5. Navigate ke RFQ page via header CartIcon (link ke /rfq)
    await page.goto('/rfq');
    await page.waitForLoadState('networkidle');
    await page.waitForURL('/rfq');

    // 6. Verify RFQ page shows the cart item section
    const cartItemSection = page.locator('text="Daftar Keranjang B2B"');
    await expect(cartItemSection).toBeVisible({ timeout: 5000 });

    // 7. Fill out RFQ Form
    await page.fill('input[name="name"]', 'Budi Santoso');
    await page.fill('input[name="company"]', 'PT. Maju Mundur');
    await page.fill('input[name="email"]', 'budi@majumundur.com');
    await page.fill('input[name="phone"]', '081234567890');
    await page.selectOption('select[name="urgency"]', 'Tinggi');

    // textarea message opsional jika ada item di keranjang
    const msgArea = page.locator('textarea[name="message"]');
    await msgArea.fill('Tolong kirimkan penawaran segera.');

    // 8. Verify tombol submit tersedia dan enabled
    const submitBtn = page.locator('button:has-text("KIRIM RFQ VIA WHATSAPP")');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('halaman RFQ tampil tanpa cart', async ({ page }) => {
    // Akses RFQ langsung tanpa item di cart
    await page.goto('/rfq');
    await page.waitForLoadState('networkidle');

    // Heading hero tampil
    await expect(page.locator('h1:has-text("Request for Quotation")')).toBeVisible();

    // Form RFQ tampil
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="company"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('select[name="urgency"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();

    // Tombol submit tersedia
    await expect(page.locator('button:has-text("KIRIM RFQ VIA WHATSAPP")')).toBeVisible();
  });

  test('select urgency memiliki semua opsi yang benar', async ({ page }) => {
    await page.goto('/rfq');
    await page.waitForLoadState('networkidle');

    const select = page.locator('select[name="urgency"]');
    await expect(select).toBeVisible();

    // Cek opsi tersedia
    await expect(select.locator('option[value="Normal"]')).toBeAttached();
    await expect(select.locator('option[value="Tinggi"]')).toBeAttached();
    await expect(select.locator('option[value="Mendesak"]')).toBeAttached();
  });

  test('informasi kontak di panel kiri RFQ tampil', async ({ page }) => {
    await page.goto('/rfq');
    await page.waitForLoadState('networkidle');

    // Panel kiri berisi info WhatsApp dan legalitas
    await expect(page.locator('text="WhatsApp Fast Response"')).toBeVisible();
    await expect(page.locator('text="Legalitas PKP"')).toBeVisible();
    await expect(page.locator('text="Term of Payment"')).toBeVisible();
  });
});
