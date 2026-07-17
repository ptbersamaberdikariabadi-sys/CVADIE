/**
 * globalSetup.ts
 * Dijalankan sekali sebelum semua test Playwright dimulai.
 * Login sebagai admin dan simpan storage state (cookies/localStorage)
 * ke .auth/admin.json agar dipakai oleh semua test di project 'admin'.
 */
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || adminPassword === 'YOUR_ADMIN_PASSWORD_HERE') {
    console.warn(
      '\n⚠️  [globalSetup] ADMIN_EMAIL atau ADMIN_PASSWORD belum diisi di .env.local.\n' +
      '   Tes admin akan di-skip atau gagal.\n' +
      '   Isi: ADMIN_EMAIL dan ADMIN_PASSWORD di file .env.local\n'
    );
    // Buat file auth kosong agar project 'admin' tidak crash saat storageState load
    const { mkdir, writeFile } = await import('fs/promises');
    await mkdir('.auth', { recursive: true });
    await writeFile('.auth/admin.json', JSON.stringify({ cookies: [], origins: [] }));
    return;
  }

  const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:3000';
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`${baseURL}/login`);

    // Isi form login
    await page.locator('input[type="email"]').fill(adminEmail);
    await page.locator('input[type="password"]').fill(adminPassword);
    await page.locator('button[type="submit"]').click();

    // Tunggu sampai redirect ke /admin berhasil (max 15 detik)
    await page.waitForURL('**/admin', { timeout: 15000 });

    console.log('✅ [globalSetup] Admin login berhasil, menyimpan auth state...');
  } catch (err) {
    console.error('❌ [globalSetup] Gagal login admin:', err);
    // Simpan state kosong agar test admin skip dengan graceful
    const { mkdir, writeFile } = await import('fs/promises');
    await mkdir('.auth', { recursive: true });
    await writeFile('.auth/admin.json', JSON.stringify({ cookies: [], origins: [] }));
    await browser.close();
    return;
  }

  // Simpan storage state (cookies session Supabase)
  const { mkdir } = await import('fs/promises');
  await mkdir('.auth', { recursive: true });
  await page.context().storageState({ path: '.auth/admin.json' });

  console.log('✅ [globalSetup] Auth state disimpan ke .auth/admin.json');
  await browser.close();
}

export default globalSetup;
