import { readdir, mkdir, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist-static');
const files = [];
async function collect(directory) {
  for (const entry of await readdir(resolve(root, directory), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isSymbolicLink()) throw new Error(`No se permiten enlaces simbólicos: ${path}`);
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) files.push(path);
  }
}
await collect('public');
await rm(output, { recursive: true, force: true });
for (const file of files) {
  const relative = file.slice('public/'.length);
  const target = resolve(output, relative);
  await mkdir(resolve(target, '..'), { recursive: true });
  await copyFile(resolve(root, file), target);
}
for (const name of ['_headers', '_redirects']) {
  await copyFile(resolve(root, 'deploy/netlify', name), resolve(output, name));
}
console.log(`Entrega estática lista: ${files.length + 2} archivos en dist-static, con index.html directamente en la raíz.`);
