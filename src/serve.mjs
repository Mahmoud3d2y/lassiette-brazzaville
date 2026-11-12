// Tiny static dev server for dist/ with clean URLs. `node src/serve.mjs [port]`
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 4173);
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

async function exists(p) { try { return await stat(p); } catch { return null; } }

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  path = normalize(path).replace(/^(\.\.[/\\])+/, '');
  let file = join(DIST, path);
  let st = await exists(file);
  if (st?.isDirectory()) {
    if (!path.endsWith('/')) { res.writeHead(301, { Location: path + '/' }); return res.end(); }
    file = join(file, 'index.html'); st = await exists(file);
  }
  if (!st) {
    const seg = path.split('/')[1];
    const notFound = (await exists(join(DIST, seg, '404.html'))) ? join(DIST, seg, '404.html') : join(DIST, '404.html');
    res.writeHead(404, { 'Content-Type': MIME['.html'] });
    return res.end(await readFile(notFound).catch(() => 'Not found'));
  }
  const type = MIME[extname(file)] || 'application/octet-stream';
  const cache = 'no-cache'; // dev server: always revalidate (production caching is set in netlify.toml / vercel.json)
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache });
  res.end(await readFile(file));
});
// If the port is busy, try the next ones instead of crashing.
const listen = (port, tries = 10) => server.once('error', (e) => {
  if (e.code === 'EADDRINUSE' && tries > 0) { console.log(`Port ${port} busy, trying ${port + 1}…`); listen(port + 1, tries - 1); } else throw e;
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}/`));
listen(PORT);
