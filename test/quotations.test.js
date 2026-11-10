import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { departments } from '../lib/quotations.js';

for (const page of ['cotizar', 'contacto']) {
  test(`${page} exposes only the three official email destinations`, async () => {
    const html = await readFile(new URL(`../public/${page}/index.html`, import.meta.url), 'utf8');
    const main = html.split('<main id="contenido">')[1].split('</main>')[0];
    const destinations = [...main.matchAll(/href="mailto:([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual([...new Set(destinations)].sort(), Object.values(departments).map(area => area.email).sort());
    assert.doesNotMatch(main, /<form|<input|<textarea|href="tel:|wa.me|api.whatsapp|Formulario aún no disponible/i);
    assert.doesNotMatch(main, /api\/cotizaciones|Enviar solicitud/);
  });
}

test('contact works without a JavaScript submission handler or mail dependency', async () => {
  const app = await readFile(new URL('../public/assets/app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(app, /fetch\(|FormData|SMTP|setupQuotationForm/);
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(manifest.dependencies, undefined);
  assert.doesNotMatch(manifest.scripts.start, /env-file/);
});
