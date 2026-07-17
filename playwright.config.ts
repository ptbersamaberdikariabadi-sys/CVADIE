import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Muat .env.local agar ADMIN_EMAIL / ADMIN_PASSWORD tersedia di globalSetup
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

/**
 * Playwright configuration — ADIE Web
 * Projects:
 *   - public    : tes tampilan user (homepage, products, rfq, dll.)
 *   - admin     : tes tampilan admin (login, dashboard, dll.) — reuse auth state
 */
export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup.ts',

  /* Jalan paralel antar file */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    // --- Tampilan User / Public ---
    {
      name: 'public',
      testMatch: [
        '**/e2e/homepage.spec.ts',
        '**/e2e/products.spec.ts',
        '**/e2e/category.spec.ts',
        '**/e2e/rfq.spec.ts',
        '**/e2e/about.spec.ts',
        '**/e2e/services.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'] },
    },

    // --- Auth tests (login page, redirect) — tanpa storageState (unauthenticated) ---
    {
      name: 'auth',
      testMatch: ['**/e2e/admin/login.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },

    // --- Tampilan Admin (menggunakan session yang tersimpan) ---
    {
      name: 'admin',
      // Eksklusi login.spec.ts karena login test butuh state unauthenticated
      testMatch: ['**/e2e/admin/!(login)*.spec.ts', '**/e2e/admin/[^l]*.spec.ts'],
      testIgnore: ['**/e2e/admin/login.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json',
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
