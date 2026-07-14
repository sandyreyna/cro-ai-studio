import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeRouter } from './routes/analyze.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('[warn] ANTHROPIC_API_KEY no está configurada. Copia server/.env.example a server/.env y agrega tu key.');
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.use('/api', analyzeRouter);

// Serve the built React app if present (production deploy on Hostinger/etc.
// runs a single Node process for both API and static assets). In local dev
// this folder doesn't exist yet — Vite's own dev server handles the client.
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
});

app.listen(PORT, () => {
  console.log(`CRO AI Studio API escuchando en http://localhost:${PORT}`);
});
