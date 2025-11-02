import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';

const port = process.env.PORT ? Number(process.env.PORT) : 5173;
const rootDir = path.resolve('dist');

const contentTypes = {
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
};

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = req.url.split('?')[0];
    let filePath = path.join(rootDir, urlPath);

    // Default to index.html for root or SPA routes
    const statPath = filePath;
    try {
      const stat = await fs.stat(statPath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
    } catch {
      // If file not found, fall back to SPA index.html
      filePath = path.join(rootDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || 'application/octet-stream';
    const file = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(file);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}/`);
});