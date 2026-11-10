import { mkdir, readdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = resolve(root, 'dist');
const files = ['server.js'];
async function collect(directory) {
  for (const entry of await readdir(resolve(root, directory), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isSymbolicLink()) throw new Error(`No se permiten enlaces simbólicos en la entrega: ${path}`);
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) files.push(path);
  }
}
await collect('public');
await rm(destination, { recursive: true, force: true });
for (const file of files) {
  const target = resolve(destination, file);
  await mkdir(resolve(target, '..'), { recursive: true });
  await copyFile(resolve(root, file), target);
}
const { name, version, type, engines } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
await writeFile(resolve(destination, 'package.json'), JSON.stringify({ name, version, private: true, type, engines,
  scripts: { start: 'node server.js' } }, null, 2) + '\n');
console.log(`Entrega generada en dist: ${files.length + 1} archivos, sin credenciales ni dependencias de desarrollo.`);
