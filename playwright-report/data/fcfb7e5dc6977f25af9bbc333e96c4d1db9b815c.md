# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: about.spec.ts >> Halaman About — Tampilan User >> informasi kontak perusahaan tampil
- Location: tests\e2e\about.spec.ts:39:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('text=/kontak/i').first().or(locator('text=/WhatsApp/i').first()).or(locator('text=/0821/i').first()).first()
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=/kontak/i').first().or(locator('text=/WhatsApp/i').first()).or(locator('text=/0821/i').first()).first()
    22 × locator resolved to <p class="text-xs text-gray-500 text-center mt-3">WhatsApp: 0812-1461-4097</p>
       - unexpected value "hidden"

```

```yaml
- banner:
  - link "Logo CV. ADIE":
    - /url: /
    - img "Logo CV. ADIE"
  - navigation "Menu utama":
    - link "BERANDA":
      - /url: /
    - link "KATALOG PRODUK":
      - /url: /products
    - link "TENTANG KAMI":
      - /url: /about
    - link "LAYANAN":
      - /url: /services
  - button "Buka pencarian"
  - link "Cart":
    - /url: /rfq
  - link "MINTA PENAWARAN (RFQ)":
    - /url: /rfq
- main:
  - heading "Tentang Kami" [level=1]
  - paragraph: Menjadi mitra bisnis terpercaya yang menawarkan harga terbaik, bertanggung jawab, serta mampu menyelesaikan masalah internal maupun kebutuhan mitra bisnis.
  - heading "Sejarah Perusahaan" [level=2]
  - paragraph: CV. Abadi Dewana Industrial Equipment (CV. ADIE) didirikan oleh Adie Woo pada tahun 2024. Berbekal pengalaman lebih dari 15 tahun di bidang technical services dan pemasaran suku cadang industri (sparepart marketing), beliau mendirikan perusahaan ini dengan jaringan sumber daya dan pengetahuan industri yang luas.
  - paragraph: Kami didukung oleh tenaga profesional berpengalaman yang siap memberikan jaminan atas solusi teknis, pengadaan, dan proyek yang kami kerjakan. Kami sangat bangga dengan konsistensi, komunikasi yang transparan, dan layanan purna jual (after-sales) yang unggul.
  - paragraph: Kami menyadari bahwa downtime mesin sangat merugikan bagi lini produksi. Oleh karena itu, kami hadir dengan jaringan global sourcing untuk mengatasi kelangkaan komponen, serta menentang keras monopoli harga yang tidak rasional.
  - heading "Misi & Komitmen" [level=3]
  - heading "Harga Kompetitif" [level=4]
  - paragraph: Memberikan penawaran harga terbaik yang kompetitif dan tetap membuka ruang untuk negosiasi.
  - heading "Jaminan Garansi Riil" [level=4]
  - paragraph: Memberikan jaminan garansi riil yang didasari tanggung jawab penuh, bukan sekadar formalitas di atas kertas. Penggantian 100% identik dan pendampingan ekstra.
  - heading "Kualitas Layanan" [level=4]
  - paragraph: Berkomitmen menjaga kualitas layanan demi memelihara kepercayaan jangka panjang dengan mitra.
  - heading "Target Industri & Spesialisasi" [level=2]
  - heading "Textile Factory" [level=3]
  - paragraph: Spinning & Dyeing
  - heading "Autopart Factory" [level=3]
  - paragraph: Assembly Lines
  - heading "Food Factory" [level=3]
  - paragraph: F&B Production
  - heading "Pulp & Paper" [level=3]
  - paragraph: Paper Processing
  - heading "Water Treatment" [level=3]
  - paragraph: WWTP / WTP
  - heading "Manajemen Inti" [level=2]
  - heading "Adie Woo" [level=3]
  - paragraph: Founder & Marketing Director
  - paragraph: Memiliki pengalaman lebih dari 15 tahun di industri technical services dan pemasaran suku cadang (sparepart marketing).
  - heading "Legalitas Perusahaan" [level=2]
  - text: Perusahaan PKP Status perpajakan resmi, siap menerbitkan Faktur Pajak Izin Usaha Lengkap Akta Pendirian, SK Kemenkumham, NIB, NPWP Valid Anti-Monopoli & Global Sourcing Melacak part langka/diskontinu dengan harga rasional
  - heading "Informasi Kontak & Lokasi" [level=2]
  - text: Kantor Administrasi Tanjungsari RT/RW 002/006 Kec. Sukasari, Kab. Sumedang Jawa Barat Workshop & Gudang Dusun Cinulukadu, RT/RW 03/08 Kec. Rancaekek, Kab. Bandung Jawa Barat Telepon & Mobile (0261) 2142579 / 0821-2777-2205 Email Resmi abadidewana.ie@gmail.com
- contentinfo:
  - heading "Kantor" [level=3]
  - paragraph: "Kantor Administrasi:"
  - paragraph: Dusun Bengang RT.05/RW.07 Desa Buahdua, Kec. Buahdua,
  - paragraph: Kab. Sumedang, Jawa Barat - 45392
  - heading "Kontak & Dukungan" [level=3]
  - list:
    - listitem:
      - text: "Email:"
      - link "abadidewana.ie@gmail.com":
        - /url: mailto:abadidewana.ie@gmail.com
    - listitem: "Telepon Kantor: (0261) 2142579"
    - listitem:
      - text: "WhatsApp: Fuja (Admin)"
      - link "+62 838-4758-2958":
        - /url: https://wa.me/6283847582958?text=Halo%20Fuja,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
      - text: Ihsan (Teknisi)
      - link "+62 821-1638-1296":
        - /url: https://wa.me/6282116381296?text=Halo%20Ihsan,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
      - text: Nurul (Admin)
      - link "+62 812-1461-4097":
        - /url: https://wa.me/6281214614097?text=Halo%20Nurul,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
      - text: Zeinan (IT)
      - link "+62 857-0036-3571":
        - /url: https://wa.me/6285700363571?text=Halo%20Zeinan,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
  - heading "Legalitas Perusahaan" [level=3]
  - paragraph:
    - strong: CV. ABADI DEWANA INDUSTRIAL EQUIPMENT
    - text: terdaftar secara sah secara hukum dan memiliki status
    - strong: PKP Aktif
    - text: yang berhak menerbitkan Faktur Pajak resmi untuk transaksi pengadaan B2B pabrik Anda.
  - paragraph: © 2026 CV. ABADI DEWANA. Hak Cipta Dilindungi Undang-Undang.
- heading "Hubungi Kami" [level=3]
- button
- paragraph: Tim kami siap membantu Anda dengan penawaran dan kebutuhan sparepart.
- link "Fuja Admin / Support":
  - /url: https://wa.me/6283847582958?text=Halo%20Fuja,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
- link "Ihsan Teknisi / Support":
  - /url: https://wa.me/6282116381296?text=Halo%20Ihsan,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
- link "Nurul Admin / Keuangan":
  - /url: https://wa.me/6281214614097?text=Halo%20Nurul,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
- link "Zeinan IT / Support":
  - /url: https://wa.me/6285700363571?text=Halo%20Zeinan,%20saya%20ingin%20bertanya%20mengenai%20produk%20dari%20CV.%20ADIE
- button "Chat via WhatsApp"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * /about — Halaman Tentang Kami (User)
  5  |  * Mengcover: hero, sejarah perusahaan, misi, tim manajemen, legalitas
  6  |  */
  7  | test.describe('Halaman About — Tampilan User', () => {
  8  |   test.beforeEach(async ({ page }) => {
  9  |     await page.goto('/about');
  10 |     await page.waitForLoadState('networkidle');
  11 |   });
  12 | 
  13 |   test('halaman about berhasil dimuat', async ({ page }) => {
  14 |     await expect(page).toHaveURL('/about');
  15 |     await expect(page).toHaveTitle(/Tentang|About|ADIE/i);
  16 |   });
  17 | 
  18 |   test('heading utama halaman about tampil', async ({ page }) => {
  19 |     const heading = page.locator('h1').first();
  20 |     await expect(heading).toBeVisible();
  21 |   });
  22 | 
  23 |   test('section sejarah perusahaan tampil', async ({ page }) => {
  24 |     const historySection = page.locator('text=/sejarah/i').first().or(
  25 |       page.locator('text=/CV. Abadi Dewana/i').first()
  26 |     ).or(
  27 |       page.locator('text=/didirikan/i').first()
  28 |     );
  29 |     await expect(historySection.first()).toBeVisible({ timeout: 10000 });
  30 |   });
  31 | 
  32 |   test('section misi atau komitmen tampil', async ({ page }) => {
  33 |     const missionSection = page.locator('text=/misi/i').first().or(
  34 |       page.locator('text=/komitmen/i').first()
  35 |     );
  36 |     await expect(missionSection.first()).toBeVisible({ timeout: 10000 });
  37 |   });
  38 | 
  39 |   test('informasi kontak perusahaan tampil', async ({ page }) => {
  40 |     const contactSection = page.locator('text=/kontak/i').first().or(
  41 |       page.locator('text=/WhatsApp/i').first()
  42 |     ).or(
  43 |       page.locator('text=/0821/i').first()
  44 |     );
> 45 |     await expect(contactSection.first()).toBeVisible({ timeout: 10000 });
     |                                          ^ Error: expect(locator).toBeVisible() failed
  46 |   });
  47 | 
  48 |   test('navbar dan footer tersedia', async ({ page }) => {
  49 |     await expect(page.locator('nav').first()).toBeVisible();
  50 |     await expect(page.locator('footer').first()).toBeVisible();
  51 |   });
  52 | });
  53 | 
```