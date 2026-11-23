// Produkcijski preview s gzipom i SPA fallbackom.
//
// Vite dev server (npm run dev) i `vite preview` ne služe build na isti način
// kao produkcijski host (bez gzipa, s drugačijim keširanjem). Lighthouse na
// njima ne mjeri stvarni bundle. Ovaj server služi `dist/` onako kako bi ga
// trebao služiti Apache/LiteSpeed s uključenim mod_deflate.
//
// Korištenje:
//   npm run build
//   npm run preview:gzip
//   otvori http://localhost:4173

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT) || 4173;

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('dist/index.html ne postoji. Pokreni "npm run build" prije previewa.');
  process.exit(1);
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const kompresibilno = /\.(html|js|css|json|svg|ttf|woff2?)$/i;

function posalji(req, res, filePath) {
  fs.readFile(filePath, (error, buffer) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Greška pri čitanju datoteke.');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const zaglavlja = {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': filePath.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
    };

    const prihvacaGzip = String(req.headers['accept-encoding'] || '').includes('gzip');

    if (prihvacaGzip && kompresibilno.test(ext)) {
      const gzip = zlib.gzipSync(buffer, { level: 9 });
      res.writeHead(200, {
        ...zaglavlja,
        'Content-Encoding': 'gzip',
        'Vary': 'Accept-Encoding',
        'Content-Length': gzip.length,
      });
      res.end(req.method === 'HEAD' ? undefined : gzip);
      return;
    }

    res.writeHead(200, { ...zaglavlja, 'Content-Length': buffer.length });
    res.end(req.method === 'HEAD' ? undefined : buffer);
  });
}

http
  .createServer((req, res) => {
    const putanja = decodeURIComponent((req.url || '/').split('?')[0]);
    const datoteka = path.join(root, putanja);

    // Ne dopusti izlazak iz dist/ preko "../".
    if (!datoteka.startsWith(root)) {
      res.writeHead(403);
      res.end();
      return;
    }

    fs.stat(datoteka, (error, statistika) => {
      if (!error && statistika.isFile()) {
        posalji(req, res, datoteka);
        return;
      }

      // Nedostajući asset mora ostati 404; samo rute bez ekstenzije idu na SPA.
      if (path.extname(putanja)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      posalji(req, res, path.join(root, 'index.html'));
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Production preview (gzip): http://localhost:${port}`);
    console.log('Lighthouse pokreni na ovoj adresi, ne na localhost:5173.');
  });
