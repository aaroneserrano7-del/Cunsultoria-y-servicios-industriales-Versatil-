import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import assert from 'node:assert/strict';

const directory = await mkdtemp(join(tmpdir(), 'Versatil delivery '));
let child;
try {
  await cp(new URL('../dist/', import.meta.url), directory, { recursive: true });
  child = spawn(process.execPath, ['server.js'], { cwd: directory,
    env: { ...process.env, HOST: '127.0.0.1', PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  const port = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('La entrega no inició en 10 segundos.')), 10000);
    let output = '';
    child.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/servidor de desarrollo activo en puerto (\d+)/);
      if (match) { clearTimeout(timer); resolve(Number(match[1])); }
    });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('exit', code => { clearTimeout(timer); reject(new Error(`El servidor terminó antes de estar listo (${code}).`)); });
  });
  const base = `http://127.0.0.1:${port}`;
  assert.deepEqual(await (await fetch(base + '/api/health')).json(), { status: 'ok', contact: 'email' });
  for (const route of ['/', '/cotizar', '/contacto', '/assets/app.js']) assert.equal((await fetch(base + route)).status, 200, route);
  assert.doesNotMatch(await (await fetch(base + '/cotizar')).text(), /<form|<input|<textarea/);
  assert.equal((await fetch(base + '/api/cotizaciones', { method: 'POST', body: '{}' })).status, 405);
  console.log('Entrega aislada verificada: servidor, páginas y recursos funcionan en una ruta con espacios, sin instalar dependencias.');
} finally {
  if (child && child.exitCode === null && child.signalCode === null) { child.kill(); await once(child, 'exit'); }
  await rm(directory, { recursive: true, force: true });
}
