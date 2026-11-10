import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = resolve(fileURLToPath(new URL('./public/', import.meta.url)));
const pages = new Set(['/', '/nosotros', '/consultoria', '/comercializacion',
  '/comercializacion/motorreductores', '/comercializacion/productos-industriales',
  '/renta', '/contacto', '/cotizar', '/aviso-de-privacidad']);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };

export function createApp() {
  return createServer({ requestTimeout: 30000, headersTimeout: 15000 }, async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    // This first iteration is a development site, not a published website.
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store');
    const json = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(body));
    };
    let path;
    try { path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { return json(400, { error: 'Ruta inválida.' }); }
    if (/[\x00-\x1f\x7f]/.test(path)) return json(400, { error: 'Ruta inválida.' });
    if (path.length > 1) path = path.replace(/\/+$/, '');

    if (!['GET', 'HEAD'].includes(req.method)) {
      req.resume();
      res.setHeader('Allow', 'GET, HEAD');
      return json(405, { error: 'Método no permitido.' });
    }
    if (path === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ status: 'ok', contact: 'email' }));
    }
    let file;
    if (pages.has(path)) file = resolve(root, `.${path === '/' ? '' : path}/index.html`);
    else if (path.startsWith('/assets/') && Object.hasOwn(types, extname(path)) && extname(path) !== '.html') file = resolve(root, `.${path}`);
    else if (path === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(req.method === 'HEAD' ? undefined : 'User-agent: *\nDisallow: /\n');
    }
    if (!file || !file.startsWith(root + sep)) return json(404, { error: 'Página no encontrada.' });
    try {
      const resolvedFile = await realpath(file);
      const resolvedRoot = await realpath(root);
      if (!resolvedFile.startsWith(resolvedRoot + sep)) return json(404, { error: 'Página no encontrada.' });
      const body = await readFile(resolvedFile);
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch (error) {
      if (['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code)) return json(404, { error: 'Página no encontrada.' });
      return json(500, { error: 'No fue posible cargar la página.' });
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error('PORT debe ser un número entero entre 0 y 65535.');
    process.exitCode = 1;
  } else {
    const app = createApp();
    app.on('error', error => {
      console.error(error.code === 'EADDRINUSE'
        ? `El puerto ${port} está ocupado. Detenga la otra instancia o cambie PORT.`
        : `No fue posible iniciar el servidor (${error.code || 'error desconocido'}).`);
      process.exitCode = 1;
    });
    app.listen(port, host, () => console.log(`Versátil: servidor de desarrollo activo en puerto ${app.address().port}`));
  }
}
