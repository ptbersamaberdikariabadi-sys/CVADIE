# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: category.spec.ts >> Dynamic Category Navigation >> should navigate to specific category and filter correctly
- Location: tests\e2e\category.spec.ts:9:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/products/textile" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Logo CV. ADIE" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Logo CV. ADIE" [ref=e5]
      - navigation "Menu utama" [ref=e6]:
        - link "BERANDA" [ref=e7] [cursor=pointer]:
          - /url: /
        - link "KATALOG PRODUK" [ref=e8] [cursor=pointer]:
          - /url: /products
        - link "TENTANG KAMI" [ref=e9] [cursor=pointer]:
          - /url: /about
        - link "LAYANAN" [ref=e10] [cursor=pointer]:
          - /url: /services
      - generic [ref=e11]:
        - button "Buka pencarian" [ref=e12]:
          - img [ref=e13]
        - link "Cart" [ref=e16] [cursor=pointer]:
          - /url: /rfq
          - img [ref=e17]
        - link "MINTA PENAWARAN (RFQ)" [ref=e21] [cursor=pointer]:
          - /url: /rfq
  - main [ref=e22]:
    - main [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]:
          - img "CV Adie" [ref=e26]
          - img [ref=e27]
          - img [ref=e28]
          - tablist "Navigasi slide hero" [ref=e29]:
            - tab "Tampilkan slide 1" [selected] [ref=e30]
            - tab "Tampilkan slide 2" [ref=e31]
            - tab "Tampilkan slide 3" [ref=e32]
        - generic [ref=e34]:
          - heading "Partner Pengadaan Otomatisasi B2B Tercepat" [level=1] [ref=e35]
          - paragraph [ref=e36]: CV. Abadi Dewana Industrial Equipment (CV. ADIE) menjamin downtime pabrik Anda dapat teratasi secara efisien melalui jaringan pengadaan global dan komitmen Jaminan Garansi Riil.
          - generic [ref=e37]:
            - link "MINTA PENAWARAN (RFQ)" [ref=e38] [cursor=pointer]:
              - /url: /rfq
            - link "JELAJAHI KATALOG PRODUK" [ref=e39] [cursor=pointer]:
              - /url: /products
      - generic [ref=e42]:
        - generic [ref=e43]:
          - img [ref=e44]
          - heading "Jaminan Garansi Riil Penggantian 100%" [level=3] [ref=e47]
        - generic [ref=e48]:
          - img [ref=e49]
          - heading "Solusi Global Sourcing Part Langka" [level=3] [ref=e51]
        - generic [ref=e52]:
          - img [ref=e53]
          - heading "Status PKP & Legalitas B2B Resmi" [level=3] [ref=e57]
        - generic [ref=e58]:
          - img [ref=e59]
          - heading "Dukungan Teknisi Berpengalaman & After-Sales" [level=3] [ref=e61]
      - generic [ref=e63]:
        - generic [ref=e64]:
          - heading "Layanan" [level=2] [ref=e65]
          - paragraph
        - generic [ref=e66]:
          - link "Textile Part Spinning, Knitting, Weaving, Dyeing" [active] [ref=e67] [cursor=pointer]:
            - /url: /products/textile
            - generic [ref=e70]:
              - img [ref=e71]
              - heading "Textile" [level=3] [ref=e74]
              - paragraph [ref=e75]: Part Spinning, Knitting, Weaving, Dyeing
          - link "Electronic Parts Service Parts Electronic" [ref=e76] [cursor=pointer]:
            - /url: /products/electronic-parts
            - generic [ref=e79]:
              - img [ref=e80]
              - heading "Electronic Parts" [level=3] [ref=e83]
              - paragraph [ref=e84]: Service Parts Electronic
          - link "Pneumatic Menjual Part Pneumatic" [ref=e85] [cursor=pointer]:
            - /url: /products/pneumatic
            - generic [ref=e88]:
              - img [ref=e89]
              - heading "Pneumatic" [level=3] [ref=e94]
              - paragraph [ref=e95]: Menjual Part Pneumatic
          - link "Barang Umum Menjual barang umum seperti ATK, Safety Gear, dan lain sebagainya" [ref=e96] [cursor=pointer]:
            - /url: /products/barang-umum
            - generic [ref=e99]:
              - img [ref=e100]
              - heading "Barang Umum" [level=3] [ref=e103]
              - paragraph [ref=e104]: Menjual barang umum seperti ATK, Safety Gear, dan lain sebagainya
        - link "Lihat Semua Kategori" [ref=e106] [cursor=pointer]:
          - /url: /products
          - text: Lihat Semua Kategori
          - img [ref=e107]
      - generic [ref=e110]:
        - generic [ref=e111]:
          - heading "Produk Tersedia" [level=2] [ref=e112]
          - paragraph [ref=e113]: Lihat daftar sebagian produk dan suku cadang industri dari katalog kami.
        - generic [ref=e114]:
          - generic [ref=e115]:
            - img "RING TRAVELLERS NO. 3 - 5000 PCS - Suku Cadang Barang Umum KANAI JUYO KOGYO" [ref=e117]
            - generic [ref=e118]:
              - generic [ref=e119]:
                - generic [ref=e120]: KANAI JUYO KOGYO
                - generic [ref=e121]:
                  - text: Barang Umum
                  - generic [ref=e122]: Ring Travellers
              - heading "RING TRAVELLERS NO. 3 - 5000 PCS" [level=3] [ref=e123]
              - paragraph [ref=e124]: "PN: NO. 3"
              - paragraph [ref=e125]
              - generic [ref=e126]:
                - link "DETAIL" [ref=e127] [cursor=pointer]:
                  - /url: /products/barang-umum/9d96949b-b392-4f53-b6a9-44d75c6912ae
                - button "+ KERANJANG" [ref=e128]:
                  - img [ref=e129]
                  - text: + KERANJANG
          - generic [ref=e133]:
            - img "SLIVER GUIDE SIMPLEX TOYODA - Suku Cadang Textile TOYODA" [ref=e135]
            - generic [ref=e136]:
              - generic [ref=e137]:
                - generic [ref=e138]: TOYODA
                - generic [ref=e139]:
                  - text: Textile
                  - generic [ref=e140]: Simplex
              - heading "SLIVER GUIDE SIMPLEX TOYODA" [level=3] [ref=e141]
              - paragraph [ref=e142]: "PN: -"
              - paragraph [ref=e143]
              - generic [ref=e144]:
                - link "DETAIL" [ref=e145] [cursor=pointer]:
                  - /url: /products/textile/809a7b38-48e5-47b4-8a81-2b3d25f65a3a
                - button "+ KERANJANG" [ref=e146]:
                  - img [ref=e147]
                  - text: + KERANJANG
          - generic [ref=e151]:
            - img "CREADLE SHOCK ABSORBER/OIL DUMPER WINDING MURATA Q-PRO (USED) - Suku Cadang Textile MURATA" [ref=e153]
            - generic [ref=e154]:
              - generic [ref=e155]:
                - generic [ref=e156]: MURATA
                - generic [ref=e157]:
                  - text: Textile
                  - generic [ref=e158]: Winding
              - heading "CREADLE SHOCK ABSORBER/OIL DUMPER WINDING MURATA Q-PRO (USED)" [level=3] [ref=e159]
              - paragraph [ref=e160]: "PN: -"
              - paragraph
              - generic [ref=e161]:
                - link "DETAIL" [ref=e162] [cursor=pointer]:
                  - /url: /products/textile/7d4fddcc-6a64-471f-9cd5-c2c7eecca247
                - button "+ KERANJANG" [ref=e163]:
                  - img [ref=e164]
                  - text: + KERANJANG
          - generic [ref=e168]:
            - img "GEAR CARIER (NYLON) 32T SPINNING TOYODA - Suku Cadang Textile TOYODA" [ref=e170]
            - generic [ref=e171]:
              - generic [ref=e172]:
                - generic [ref=e173]: TOYODA
                - generic [ref=e174]:
                  - text: Textile
                  - generic [ref=e175]: Spinning
              - heading "GEAR CARIER (NYLON) 32T SPINNING TOYODA" [level=3] [ref=e176]
              - paragraph [ref=e177]: "PN: -"
              - paragraph
              - generic [ref=e178]:
                - link "DETAIL" [ref=e179] [cursor=pointer]:
                  - /url: /products/textile/347f9577-e311-4823-b287-8f1a35208c9c
                - button "+ KERANJANG" [ref=e180]:
                  - img [ref=e181]
                  - text: + KERANJANG
          - generic [ref=e185]:
            - img "COVER DRUM WINDING MURATA 21C - Suku Cadang Textile MURATA" [ref=e187]
            - generic [ref=e188]:
              - generic [ref=e189]:
                - generic [ref=e190]: MURATA
                - generic [ref=e191]:
                  - text: Textile
                  - generic [ref=e192]: Winding
              - heading "COVER DRUM WINDING MURATA 21C" [level=3] [ref=e193]
              - paragraph [ref=e194]: "PN: -"
              - paragraph [ref=e195]
              - generic [ref=e196]:
                - link "DETAIL" [ref=e197] [cursor=pointer]:
                  - /url: /products/textile/1d63a175-1433-4fdf-a990-2b8042242568
                - button "+ KERANJANG" [ref=e198]:
                  - img [ref=e199]
                  - text: + KERANJANG
          - generic [ref=e203]:
            - img "SOLENOID FT30-SC WINDING MURATA - Suku Cadang Textile MURATA" [ref=e205]
            - generic [ref=e206]:
              - generic [ref=e207]:
                - generic [ref=e208]: MURATA
                - generic [ref=e209]:
                  - text: Textile
                  - generic [ref=e210]: Winding
              - heading "SOLENOID FT30-SC WINDING MURATA" [level=3] [ref=e211]
              - paragraph [ref=e212]: "PN: FT30-SC"
              - paragraph [ref=e213]
              - generic [ref=e214]:
                - link "DETAIL" [ref=e215] [cursor=pointer]:
                  - /url: /products/textile/dcb5f0a5-e97d-44cf-abce-9836c2fa690d
                - button "+ KERANJANG" [ref=e216]:
                  - img [ref=e217]
                  - text: + KERANJANG
        - link "Lihat Semua Produk" [ref=e222] [cursor=pointer]:
          - /url: /products
          - text: Lihat Semua Produk
          - img [ref=e223]
      - generic [ref=e226]:
        - img "Pelayanan dan Kualitas Suku Cadang Industri" [ref=e229]
        - generic [ref=e230]:
          - heading "Mengapa CV. ADIE Berbeda?" [level=2] [ref=e231]
          - list [ref=e232]:
            - listitem [ref=e233]:
              - img [ref=e234]
              - generic [ref=e237]:
                - strong [ref=e238]: "Jaminan Garansi Riil:"
                - text: Jika komponen berkendala, kami ganti 100% identik & dampingi pengujian hingga mesin berjalan running normal.
            - listitem [ref=e239]:
              - img [ref=e240]
              - generic [ref=e243]:
                - strong [ref=e244]: "Harga Kompetitif & Fleksibel:"
                - text: Menggunakan jaringan global sourcing untuk menemukan part langka dengan komitmen harga rasional dan opsi negosiasi adil.
            - listitem [ref=e245]:
              - img [ref=e246]
              - generic [ref=e249]:
                - strong [ref=e250]: "Spesialis Manufaktur:"
                - text: Spesialisasi andal dalam menyuplai Pabrik Tekstil, Autopart, Makanan, Pulp & Paper, dan Water Treatment.
            - listitem [ref=e251]:
              - img [ref=e252]
              - generic [ref=e255]:
                - strong [ref=e256]: "ToP Fleksibel:"
                - text: Mendukung kelancaran cash flow operasional dengan Term of Payment yang disesuaikan kesepakatan kontrak.
            - listitem [ref=e257]:
              - img [ref=e258]
              - generic [ref=e261]:
                - strong [ref=e262]: "PKP Aktif & Legalitas Valid:"
                - text: Akta Pendirian, NIB, NPWP lengkap, dan kami berhak menerbitkan Faktur Pajak resmi di setiap transaksi.
      - generic [ref=e264]:
        - heading "Alur Kerja Pengadaan Cepat & Tepat" [level=2] [ref=e265]
        - generic [ref=e266]:
          - generic [ref=e268]:
            - generic [ref=e269]: "1"
            - heading "Identifikasi Masalah" [level=3] [ref=e270]
            - paragraph [ref=e271]: Konsultasi part langka atau penggantian
          - generic [ref=e272]:
            - generic [ref=e273]: "2"
            - heading "Kirim RFQ" [level=3] [ref=e274]
            - paragraph [ref=e275]: Upload daftar kebutuhan spesifik
          - generic [ref=e276]:
            - generic [ref=e277]: "3"
            - heading "Global Sourcing" [level=3] [ref=e278]
            - paragraph [ref=e279]: Pencarian harga rasional & negosiasi
          - generic [ref=e280]:
            - generic [ref=e281]: "4"
            - heading "Delivery & Setup" [level=3] [ref=e282]
            - paragraph [ref=e283]: Barang diantar dan didampingi teknisi
      - generic [ref=e284]:
        - img [ref=e286]
        - generic [ref=e288]:
          - heading "PUNYA KEBUTUHAN MENDESAK UNTUK MENCEGAH DOWNTIME?" [level=2] [ref=e289]
          - paragraph [ref=e290]: Tim CV. ADIE siap melacak komponen yang Anda butuhkan melalui jaringan pengadaan global dengan harga yang sangat masuk akal dan term of payment fleksibel.
          - link "HUBUNGI KAMI SEKARANG (RFQ)" [ref=e291] [cursor=pointer]:
            - /url: /rfq
            - img [ref=e292]
            - text: HUBUNGI KAMI SEKARANG (RFQ)
  - contentinfo [ref=e295]:
    - generic [ref=e296]:
      - generic [ref=e297]:
        - heading "Kantor" [level=3] [ref=e298]
        - generic [ref=e299]:
          - paragraph [ref=e300]: "Kantor Administrasi:"
          - paragraph [ref=e301]: Dusun Bengang RT.05/RW.07 Desa Buahdua, Kec. Buahdua,
          - paragraph [ref=e302]: Kab. Sumedang, Jawa Barat - 45392
      - generic [ref=e303]:
        - heading "Kontak & Dukungan" [level=3] [ref=e304]
        - list [ref=e305]:
          - listitem [ref=e306]:
            - generic [ref=e307]: "Email:"
            - link "abadidewana.ie@gmail.com" [ref=e308] [cursor=pointer]:
              - /url: mailto:abadidewana.ie@gmail.com
          - listitem [ref=e309]:
            - generic [ref=e310]: "Telepon Kantor:"
            - generic [ref=e311]: (0261) 2142579
          - listitem [ref=e312]:
            - generic [ref=e313]: "WhatsApp:"
            - generic [ref=e314]:
              - generic [ref=e315]:
                - generic [ref=e316]: Fuja (Admin)
                - link "+62 838-4758-2958" [ref=e317] [cursor=pointer]:
                  - /url: https://wa.me/6283847582958?text=Halo%20Fuja,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
              - generic [ref=e318]:
                - generic [ref=e319]: Ihsan (Teknisi)
                - link "+62 821-1638-1296" [ref=e320] [cursor=pointer]:
                  - /url: https://wa.me/6282116381296?text=Halo%20Ihsan,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
              - generic [ref=e321]:
                - generic [ref=e322]: Nurul (Admin)
                - link "+62 812-1461-4097" [ref=e323] [cursor=pointer]:
                  - /url: https://wa.me/6281214614097?text=Halo%20Nurul,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
              - generic [ref=e324]:
                - generic [ref=e325]: Zeinan (IT)
                - link "+62 857-0036-3571" [ref=e326] [cursor=pointer]:
                  - /url: https://wa.me/6285700363571?text=Halo%20Zeinan,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
      - generic [ref=e327]:
        - heading "Legalitas Perusahaan" [level=3] [ref=e328]
        - generic [ref=e329]:
          - paragraph [ref=e330]:
            - strong [ref=e331]: CV. ABADI DEWANA INDUSTRIAL EQUIPMENT
            - text: terdaftar secara sah secara hukum dan memiliki status
            - strong [ref=e332]: PKP Aktif
            - text: yang berhak menerbitkan Faktur Pajak resmi untuk transaksi pengadaan B2B pabrik Anda.
          - paragraph [ref=e333]: © 2026 CV. ABADI DEWANA. Hak Cipta Dilindungi Undang-Undang.
  - generic [ref=e334]:
    - generic:
      - generic:
        - generic:
          - heading "Hubungi Kami" [level=3]
          - button
        - paragraph: Tim kami siap membantu Anda dengan penawaran dan kebutuhan sparepart.
      - generic:
        - generic:
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
    - button "Chat via WhatsApp" [ref=e335]:
      - img [ref=e336]
  - button "Open Next.js Dev Tools" [ref=e343] [cursor=pointer]:
    - generic [ref=e346]:
      - text: Rendering
      - generic [ref=e347]:
        - generic [ref=e348]: .
        - generic [ref=e349]: .
        - generic [ref=e350]: .
  - alert [ref=e351]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { generateSlug } from '../../src/utils/slugify';
  3  | 
  4  | /**
  5  |  * Dynamic Category Navigation — Tampilan User
  6  |  * Test navigasi dari homepage → kategori → halaman produk per kategori
  7  |  */
  8  | test.describe('Dynamic Category Navigation', () => {
  9  |   test('should navigate to specific category and filter correctly', async ({ page }) => {
  10 |     // 1. Visit homepage
  11 |     await page.goto('/');
  12 |     await page.waitForLoadState('networkidle');
  13 | 
  14 |     // Cari link kategori apapun yang menuju ke detail kategori produk
  15 |     const categoryLink = page.locator('a[href^="/products/"]').first();
  16 |     
  17 |     // Scroll ke section kategori agar kartu terkena viewport
  18 |     await categoryLink.scrollIntoViewIfNeeded();
  19 |     
  20 |     // Dapatkan slug-nya untuk verifikasi
  21 |     const href = await categoryLink.getAttribute('href');
  22 |     const expectedSlug = href?.replace('/products/', '') || '';
  23 |     
  24 |     // Tunggu link kategori muncul
  25 |     await expect(categoryLink).toBeVisible({ timeout: 10000 });
  26 |     await categoryLink.click();
  27 | 
  28 |     // 3. Verify routing ke slug yang benar
> 29 |     await page.waitForURL(`/products/${expectedSlug}`, { timeout: 15000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  30 | 
  31 |     // 4. Verify h1 ada di halaman kategori
  32 |     await expect(page.locator('h1').first()).toBeVisible();
  33 | 
  34 |     // 5. Verify sidebar memiliki "Filter Sub-Kategori"
  35 |     await expect(page.locator('text="Filter Sub-Kategori"')).toBeVisible();
  36 | 
  37 |     // 6. Verify grid produk atau pesan kosong tampil
  38 |     const productGrid = page.locator('.grid').first();
  39 |     const emptyMessage = page.locator('text="Tidak ada produk ditemukan di kategori/sub-kategori ini."').first();
  40 |     const productGridOrEmpty = productGrid.or(emptyMessage);
  41 |     await expect(productGridOrEmpty).toBeVisible();
  42 |   });
  43 | 
  44 |   test('category page tampil dengan benar saat diakses langsung via URL', async ({ page }) => {
  45 |     const slug = generateSlug("Pneumatik & Kompresor");
  46 |     await page.goto(`/products/${slug}`);
  47 |     await page.waitForLoadState('networkidle');
  48 | 
  49 |     // H1 harus ada
  50 |     await expect(page.locator('h1').first()).toBeVisible();
  51 | 
  52 |     // Sidebar filter tersedia
  53 |     await expect(page.locator('text="Filter Sub-Kategori"')).toBeVisible();
  54 | 
  55 |     // Grid atau pesan kosong tampil
  56 |     const content = page.locator('main').first();
  57 |     await expect(content).toBeVisible();
  58 |   });
  59 | });
  60 | 
```