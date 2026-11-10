import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
async function walk(directory) {
  const files = [];
  for (const entry of await readdir(new URL(directory, root), { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) files.push(...await walk(`${path}/`));
    else files.push(path);
  }
  return files;
}
const files = ['server.js', 'playwright.config.js',
  ...await walk('scripts/'), ...await walk('test/'), ...await walk('e2e/'),
  ...await walk('lib/'), ...await walk('public/')];
const javascript = files.filter(file => /\.(?:js|mjs)$/.test(file));
for (const file of javascript) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(file, root))], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
for (const file of ['package.json', 'package-lock.json', '.htmlvalidate.json', 'Versatil.code-workspace',
  '.vscode/launch.json', '.vscode/settings.json', '.vscode/tasks.json']) {
  JSON.parse(await readFile(new URL(file, root), 'utf8'));
}
console.log(`Sintaxis verificada: ${javascript.length} archivos JavaScript y 7 archivos JSON.`);
