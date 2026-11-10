import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/nosotros', '/consultoria', '/comercializacion',
  '/comercializacion/motorreductores', '/comercializacion/productos-industriales',
  '/renta', '/contacto', '/cotizar', '/aviso-de-privacidad'];

for (const route of routes) {
  test(`${route}: renders, has no overflow and passes automated accessibility checks`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.waitForFunction(() => document.getAnimations().length === 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) }))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('contact only offers the three official email addresses', async ({ page }) => {
  const emails = ['nom@versatilconsulting.com.mx', 'administracion@versatilconsulting.com.mx', 'maquinaria@versatilconsulting.com.mx'];
  for (const path of ['/contacto', '/cotizar']) {
    await page.goto(path);
    await expect(page.locator('form,input,textarea')).toHaveCount(0);
    for (const email of emails) await expect(page.locator(`main a[href="mailto:${email}"]`).first()).toBeVisible();
    expect(await page.locator('a[href^="tel:"],a[href*="wa.me"]').count()).toBe(0);
  }
  await page.goto('/cotizar?departamento=renta');
  await expect(page.locator('[data-department="renta"]')).toHaveClass(/is-selected/);
  await page.goto('/cotizar?departamento=%3Cscript%3E');
  await expect(page.locator('.is-selected')).toHaveCount(0);
});

test('mobile menu supports keyboard and correct expanded state', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('.menu-toggle');
  if (await button.isVisible()) {
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
  } else await expect(page.getByRole('navigation')).toBeVisible();
});

test('content and navigation are accessible without JavaScript', async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/cotizar`);
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();
    await expect(page.locator('form,input,textarea')).toHaveCount(0);
  } finally { await context.close(); }
});

test('reduced motion cancels entrance and menu animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const button = page.locator('.menu-toggle');
  if (await button.isVisible()) await button.click();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await expect(page.locator('h1')).toHaveCSS('opacity', '1');
});
