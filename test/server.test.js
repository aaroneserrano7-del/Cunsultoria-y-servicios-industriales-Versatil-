import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server.js';
import { mkdtemp, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const server = createApp();
let base;
before(async () => {
  await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.listening ? new Promise(resolve => server.close(resolve)) : undefined);

const routes = ['/', '/nosotros', '/consultoria', '/comercializacion',
  '/comercializacion/motorreductores', '/comercializacion/productos-industriales',
  '/renta', '/contacto', '/cotizar', '/aviso-de-privacidad'];

test('all pages load with local assets and working internal links', async () => {
  for (const route of routes) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    const html = await response.text();
    assert.match(html, /<html lang="es-MX">/);
    assert.equal((html.match(/<h1>/g) || []).length, 1, route);
    for (const [, target] of html.matchAll(/(?:href|src)="(\/[^\"]*)"/g)) {
      assert.equal((await fetch(base + target.replaceAll('&amp;', '&'))).status, 200, `${route} → ${target}`);
    }
  }
});

test('health describes the email-only contact mode', async () => {
  assert.deepEqual(await (await fetch(base + '/api/health')).json(), { status: 'ok', contact: 'email' });
});

test('quotations are email links and the server accepts no submission', async () => {
  const res = await fetch(base + '/api/cotizaciones', { method: 'POST', body: '{}' });
  assert.equal(res.status, 405);
  assert.equal((await fetch(base + '/api/cotizaciones')).status, 404);
  const html = await (await fetch(base + '/cotizar?departamento=renta')).text();
  assert.doesNotMatch(html, /<form|<input|<textarea/);
  assert.match(html, /mailto:maquinaria@versatilconsulting.com.mx/);
  assert.equal((await fetch(base + '/api/quotation-status')).status, 404);
});

test('unknown routes and private files remain inaccessible', async () => {
  for (const path of ['/server.js', '/package.json', '/.git/config', '/assets/%2e%2e%2f%2e%2e%2fserver.js', '/missing']) {
    assert.equal((await fetch(base + path)).status, 404, path);
  }
  assert.equal((await fetch(base + '/%ZZ')).status, 400);
  assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
});

test('HEAD works and development robots block indexing', async () => {
  const head = await fetch(base + '/nosotros/', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.match(await (await fetch(base + '/robots.txt')).text(), /Disallow: \//);
});

test('all pages support HEAD and all assets have the expected MIME and security headers', async () => {
  for (const route of routes) {
    const response = await fetch(base + route, { method: 'HEAD' });
    assert.equal(response.status, 200, route);
    assert.equal(await response.text(), '');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.match(response.headers.get('content-security-policy'), /form-action 'none'/);
  }
  for (const [asset, type] of [['styles.css', 'text/css'], ['app.js', 'text/javascript'], ['versatil-symbol.svg', 'image/svg+xml']]) {
    assert.equal((await fetch(base + '/assets/' + asset)).headers.get('content-type').split(';')[0], type);
  }
});

test('invalid encodings, control characters, traversal and unsupported methods are rejected', async () => {
  for (const route of ['/%00', '/assets/app%00.js', '/%0a', '/%ZZ']) assert.equal((await fetch(base + route)).status, 400, route);
  for (const route of ['/assets/%2e%2e%2f%2e%2e%2f.env', '/assets/.env', '/assets/source.map', '/lib/quotations.js', '/.vscode/launch.json']) {
    assert.equal((await fetch(base + route)).status, 404, route);
  }
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) assert.equal((await fetch(base + '/', { method })).status, 405);
});

test('a symbolic link cannot expose a file outside the public directory', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'versatil-private-'));
  const outside = join(directory, 'probe.txt');
  const name = `audit-${randomUUID()}.svg`;
  const link = new URL('../public/assets/' + name, import.meta.url);
  try {
    await writeFile(outside, 'AUDIT-ONLY');
    try { await symlink(outside, link); }
    catch (error) {
      if (error.code === 'EPERM') { t.skip('The operating system did not allow creation of the test symlink.'); return; }
      throw error;
    }
    assert.equal((await fetch(base + '/assets/' + name)).status, 404);
  } finally {
    await rm(link, { force: true });
    await rm(directory, { recursive: true, force: true });
  }
});

test('CLI reports invalid or occupied ports with a controlled failure', () => {
  for (const port of ['not-a-number', '-1', '65536', String(server.address().port)]) {
    const result = spawnSync(process.execPath, [fileURLToPath(new URL('../server.js', import.meta.url))], {
      encoding: 'utf8', timeout: 5000, env: { ...process.env, HOST: '127.0.0.1', PORT: port }
    });
    assert.equal(result.status, 1, `${port}: ${result.stderr}`);
    assert.match(result.stderr, /PORT debe ser|está ocupado/);
    assert.doesNotMatch(result.stderr, /Unhandled|node:events|RangeError/);
  }
});
