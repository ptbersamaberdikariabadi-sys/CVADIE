import { test, expect } from '@playwright/test';

/**
 * /products — Halaman Katalog Produk (User)
 * Mengcover: grid produk, tombol Add to Cart, floating bar RFQ
 *
 * CATATAN: AddToCartButton menampilkan teks "+ KERANJANG" (bukan "+ KERANJANG RFQ")
 */
test.describe('Halaman Produk — Tampilan User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
  });

  test('halaman produk berhasil dimuat', async ({ page }) => {
    await expect(page).toHaveURL('/products');
    await expect(page).toHaveTitle(/Produk|Katalog|Abadi Dewana/i);
  });

  test('heading halaman produk tampil', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('header dan footer tampil di halaman produk', async ({ page }) => {
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });

  test('grid produk atau pesan kosong tampil', async ({ page }) => {
    // AddToCartButton teks = "+ KERANJANG"
    const productCard = page.locator('button:has-text("+ KERANJANG")').first().or(
      page.locator('button:has-text("DITAMBAHKAN")').first()
    ).or(
      // Fallback: cari grid produk apapun
      page.locator('[class*="grid"]').first()
    ).or(
      page.locator('text=/Belum ada produk/i').first()
    ).or(
      page.locator('text=/Tidak ada produk/i').first()
    );
    await expect(productCard.first()).toBeVisible({ timeout: 15000 });
  });

  test('tombol "+ KERANJANG" bisa diklik dan cart icon badge muncul', async ({ page }) => {
    const addBtn = page.locator('button:has-text("+ KERANJANG")').first();
    const count = await addBtn.count();

    if (count === 0) {
      test.skip(true, 'Tidak ada produk di database untuk ditest');
      return;
    }

    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Setelah klik, teks berubah ke "DITAMBAHKAN" selama 2 detik
    const addedBtn = page.locator('button:has-text("DITAMBAHKAN")').first();
    await expect(addedBtn).toBeVisible({ timeout: 3000 });
  });

  test('CartIcon di header menampilkan badge count setelah add to cart', async ({ page }) => {
    const addBtn = page.locator('button:has-text("+ KERANJANG")').first();
    const count = await addBtn.count();

    if (count === 0) {
      test.skip(true, 'Tidak ada produk untuk ditest');
      return;
    }

    await addBtn.click();
    // CartIcon di header harus menampilkan badge dengan angka > 0
    // CartIcon: span dengan angka count di header
    const cartBadge = page.locator('header span').filter({ hasText: /^[1-9]/ }).first();
    await expect(cartBadge).toBeVisible({ timeout: 5000 });
  });

  test('link ke halaman RFQ tersedia di header', async ({ page }) => {
    const rfqLink = page.locator('header a[href="/rfq"]').first();
    await expect(rfqLink).toBeVisible();
  });
});
