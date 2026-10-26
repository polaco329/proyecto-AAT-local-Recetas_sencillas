const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1400 },
    recordVideo: { dir: 'reports/' },
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.locator('a[href="#main-content"]').click();
  await page.getByRole('button', { name: /abrir menú principal/i }).click();
  await page.getByRole('button', { name: /contacto/i }).hover();
  await page.waitForTimeout(1200);
  await context.close();
  await browser.close();
})();
