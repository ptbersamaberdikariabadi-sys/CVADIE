# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: category.spec.ts >> Dynamic Category Navigation >> should navigate to specific category and filter correctly
- Location: tests\e2e\category.spec.ts:5:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: .grid, text="Tidak ada produk ditemukan di kategori/sub-kategori ini." >> nth=0
Expected: visible
Error: Unexpected token "=" while parsing css selector ".grid, text="Tidak ada produk ditemukan di kategori/sub-kategori ini."". Did you mean to CSS.escape it?

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for .grid, text="Tidak ada produk ditemukan di kategori/sub-kategori ini." >> nth=0

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Logo CV. ADIE" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Logo CV. ADIE" [ref=e5]
      - navigation [ref=e6]:
        - link "BERANDA" [ref=e7] [cursor=pointer]:
          - /url: /
        - link "TENTANG KAMI" [ref=e8] [cursor=pointer]:
          - /url: /about
        - link "PRODUK" [ref=e10] [cursor=pointer]:
          - /url: /products
        - link "LAYANAN" [ref=e11] [cursor=pointer]:
          - /url: /services
      - generic [ref=e12]:
        - button "Search" [ref=e13]:
          - img [ref=e14]
        - link "Cart" [ref=e17] [cursor=pointer]:
          - /url: /rfq
          - img [ref=e18]
        - link "MINTA PENAWARAN (RFQ)" [ref=e22] [cursor=pointer]:
          - /url: /rfq
  - main [ref=e23]:
    - generic [ref=e24]:
      - generic [ref=e26]:
        - link "KEMBALI KE SEMUA PRODUK" [ref=e27] [cursor=pointer]:
          - /url: /products
          - img [ref=e28]
          - text: KEMBALI KE SEMUA PRODUK
        - heading "Pneumatik & Kompresor" [level=1] [ref=e30]
        - paragraph [ref=e31]: Katalog spesifik untuk kebutuhan Pneumatik & Kompresor di pabrik Anda.
      - generic [ref=e33]:
        - complementary [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]:
              - img [ref=e37]
              - text: Filter Sub-Kategori
            - list [ref=e40]:
              - listitem [ref=e41]:
                - link "Semua Produk Pneumatik & Kompresor" [ref=e42] [cursor=pointer]:
                  - /url: /products/pneumatik-dan-kompresor
              - listitem [ref=e43]: Tidak ada sub-kategori tersedia
        - generic [ref=e44]:
          - generic [ref=e45]:
            - generic [ref=e46]:
              - textbox "Cari di Pneumatik & Kompresor..." [ref=e47]
              - img [ref=e48]
            - generic [ref=e51]: Menampilkan 0 dari 0 Produk
          - generic [ref=e52]: Gagal memuat produk. Silakan pastikan koneksi database Supabase Anda aktif.
  - contentinfo [ref=e53]:
    - generic [ref=e54]:
      - generic [ref=e55]:
        - heading "Kantor & Workshop" [level=3] [ref=e56]
        - generic [ref=e57]:
          - generic [ref=e58]:
            - paragraph [ref=e59]: "Kantor Administrasi:"
            - paragraph [ref=e60]: Tanjungsari RT/RW 002/006, Kec. Sukasari
            - paragraph [ref=e61]: Kab. Sumedang, Jawa Barat.
          - generic [ref=e62]:
            - paragraph [ref=e63]: "Workshop & Gudang:"
            - paragraph [ref=e64]: Dusun Cinulukadu, RT/RW 03/08
            - paragraph [ref=e65]: Rancaekek, Kab. Bandung, Jawa Barat.
      - generic [ref=e66]:
        - heading "Kontak & Dukungan" [level=3] [ref=e67]
        - list [ref=e68]:
          - listitem [ref=e69]:
            - generic [ref=e70]: "Email:"
            - link "abadidewana.ie@gmail.com" [ref=e71] [cursor=pointer]:
              - /url: mailto:abadidewana.ie@gmail.com
          - listitem [ref=e72]:
            - generic [ref=e73]: "Telepon / WhatsApp:"
            - generic [ref=e74]: 0821-2777-2205
            - generic [ref=e75]: (0261) 2142579
      - generic [ref=e76]:
        - heading "Legalitas Perusahaan" [level=3] [ref=e77]
        - generic [ref=e78]:
          - paragraph [ref=e79]:
            - strong [ref=e80]: CV. ABADI DEWANA INDUSTRIAL EQUIPMENT
            - text: terdaftar secara sah secara hukum dan memiliki status
            - strong [ref=e81]: PKP Aktif
            - text: yang berhak menerbitkan Faktur Pajak resmi untuk transaksi pengadaan B2B pabrik Anda.
          - paragraph [ref=e82]: © 2026 CV. ABADI DEWANA. Hak Cipta Dilindungi Undang-Undang.
  - generic [ref=e83]:
    - generic:
      - generic:
        - generic:
          - heading "Hubungi Kami" [level=3]
          - button
        - paragraph: Tim kami siap membantu Anda dengan penawaran dan kebutuhan sparepart.
      - generic:
        - generic:
          - link "Adie Woo Direktur / Sales":
            - /url: https://wa.me/6282127772205?text=Halo%20Adie Woo,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
            - generic:
              - generic: Adie Woo
              - generic: Direktur / Sales
          - link "Fuja Admin / Support":
            - /url: https://wa.me/6283847582958?text=Halo%20Fuja,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
            - generic:
              - generic: Fuja
              - generic: Admin / Support
          - link "Ihsan Teknisi / Support":
            - /url: https://wa.me/6282116381296?text=Halo%20Ihsan,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
            - generic:
              - generic: Ihsan
              - generic: Teknisi / Support
          - link "Nurul Admin / Keuangan":
            - /url: https://wa.me/6281214614097?text=Halo%20Nurul,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
            - generic:
              - generic: Nurul
              - generic: Admin / Keuangan
          - link "Zeinan IT / Support":
            - /url: https://wa.me/6285700363571?text=Halo%20Zeinan,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
            - generic:
              - generic: Zeinan
              - generic: IT / Support
    - button "Chat via WhatsApp" [ref=e84]:
      - img [ref=e85]
  - button "Open Next.js Dev Tools" [ref=e92] [cursor=pointer]:
    - img [ref=e93]
  - alert [ref=e96]: Produk Pneumatik & Kompresor - CV. ADIE | CV. ADIE
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { generateSlug } from '../../src/utils/slugify';
  3  | 
  4  | test.describe('Dynamic Category Navigation', () => {
  5  |   test('should navigate to specific category and filter correctly', async ({ page }) => {
  6  |     // 1. Visit homepage
  7  |     await page.goto('/');
  8  | 
  9  |     // 2. Find the "Pneumatik & Kompresor" category box and click it
  10 |     // Wait for the categories section to be visible
  11 |     const categoryTitle = "Pneumatik & Kompresor";
  12 |     await page.waitForSelector(`text="${categoryTitle}"`);
  13 |     
  14 |     // The closest Link wrapping the title is what we want to click
  15 |     const categoryBox = page.locator(`text="${categoryTitle}"`).first();
  16 |     await categoryBox.click();
  17 | 
  18 |     // 3. Verify it routes to the correct dynamic slug
  19 |     const expectedSlug = generateSlug(categoryTitle);
  20 |     await page.waitForURL(`/products/${expectedSlug}`);
  21 | 
  22 |     // 4. Verify the page title shows the category name
  23 |     await expect(page.locator(`h1:has-text("${categoryTitle}")`)).toBeVisible();
  24 | 
  25 |     // 5. Verify the sidebar has "Filter Sub-Kategori"
  26 |     await expect(page.locator('text="Filter Sub-Kategori"')).toBeVisible();
  27 | 
  28 |     // 6. Verify "Semua Produk" link is visible and active by default
  29 |     const allProductsLink = page.locator(`text="Semua Produk ${categoryTitle}"`);
  30 |     await expect(allProductsLink).toBeVisible();
  31 | 
  32 |     // If there are subcategories available, test clicking one (optional, depending on DB seed)
  33 |     // We can just assert that the product grid loaded something or shows "Tidak ada produk"
  34 |     const productGridOrEmpty = page.locator('.grid, text="Tidak ada produk ditemukan di kategori/sub-kategori ini."').first();
> 35 |     await expect(productGridOrEmpty).toBeVisible();
     |                                      ^ Error: expect(locator).toBeVisible() failed
  36 |   });
  37 | });
  38 | 
```