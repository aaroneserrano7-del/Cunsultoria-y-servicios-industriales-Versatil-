import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('static delivery puts index and assets at the root and includes the Netlify rules', async () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/build-static.mjs', import.meta.url))], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const output = new URL('../dist-static/', import.meta.url);
  for (const file of ['index.html', 'assets/styles.css', 'assets/app.js', 'contacto/index.html', 'cotizar/index.html']) {
    assert.equal(await readFile(new URL(file, output), 'utf8'), await readFile(new URL('../public/' + file, import.meta.url), 'utf8'));
  }
  assert.match(await readFile(new URL('_redirects', output), 'utf8'), /^\/cotizar \/cotizar\/index.html 200$/m);
  const headers = await readFile(new URL('_headers', output), 'utf8');
  assert.match(headers, /frame-ancestors 'self' https:\/\/app.netlify.com/);
  assert.match(headers, /form-action 'none'/);
  for (const file of ['.env', 'server.js', 'package.json', 'docs', 'public']) {
    await assert.rejects(access(new URL(file, output)));
  }
  const entries = await readdir(output);
  assert(entries.includes('index.html'));
  assert(!entries.includes('VERSATIL-WEB'));
});
