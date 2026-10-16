'use strict';

/* ============================================================
   Local development server for the Bin Kamal Builders website.
   Serves the static files AND handles POST /api/send with the
   exact same mailer used in production (Vercel).

   Usage:
     1) copy .env.example to .env and fill in GMAIL_APP_PASSWORD
     2) npm install
     3) npm run dev      →  http://localhost:8788
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { sendEnquiry } = require('./lib/mailer');

/* --- minimal .env loader --- */
(function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(function (line) {
    const m = line.match(/^\s*([A-Za-z0-9_.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
})();

const PORT = process.env.PORT || 8788;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function json(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(function (req, res) {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (urlPath === '/api/send') {
    if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });
    let data = '';
    req.on('data', function (chunk) {
      data += chunk;
      if (data.length > 1e6) req.destroy();
    });
    req.on('end', async function () {
      let payload = {};
      try { payload = JSON.parse(data || '{}'); } catch (e) {}
      try {
        const out = await sendEnquiry(payload);
        console.log('[dev] enquiry sent:', out.messageId, payload.form || '');
        return json(res, 200, { ok: true, id: out.messageId, skipped: !!out.skipped });
      } catch (err) {
        console.error('[dev] enquiry failed:', err && (err.response || err.publicMessage || err.message));
        return json(res, err.statusCode || 500, { ok: false, error: err.publicMessage || err.message });
      }
    });
    return;
  }

  let rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  let file = path.join(ROOT, rel);

  // keep inside the root
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.stat(file, function (err, stat) {
    if (!err && stat.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, function (err2, buf) {
      if (err2) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404 Not Found'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(buf);
    });
  });
});

server.listen(PORT, function () {
  console.log('BKB dev server running: http://localhost:' + PORT);
  console.log('GMAIL_USER=' + (process.env.GMAIL_USER || '(not set)'));
  console.log('GMAIL_APP_PASSWORD=' + (process.env.GMAIL_APP_PASSWORD ? '(set)' : '(not set)'));
  console.log('MAIL_TO=' + (process.env.MAIL_TO || '(defaults to GMAIL_USER)'));
});
