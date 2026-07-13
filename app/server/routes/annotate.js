import { Router } from 'express';
import multer from 'multer';
import { analyzeVisual } from '../lib/claude.js';

const ACCEPTED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ACCEPTED_MIME.has(file.mimetype)) {
      cb(new Error('UNSUPPORTED_TYPE'));
      return;
    }
    cb(null, true);
  },
});

export const annotateRouter = Router();

annotateRouter.post('/annotate', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'La imagen pesa demasiado (máximo 8MB). Prueba con una captura más liviana.'
          : 'Ese archivo no es una imagen soportada. Usa PNG, JPG o WEBP.';
      return res.status(400).json({ error: message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No llegó ninguna imagen.' });
    }

    const device = req.body?.device === 'mobile' ? 'mobile' : 'desktop';
    const urlContext = req.body?.url || '';

    try {
      const result = await analyzeVisual({
        imageBase64: req.file.buffer.toString('base64'),
        mediaType: req.file.mimetype,
        device,
        urlContext,
      });

      const startId = Number(req.body?.startId) || 1;
      const findings = result.findings.map((f, i) => ({
        id: startId + i,
        source: 'visual',
        category: f.category,
        severity: f.severity,
        title: f.title,
        description: f.description,
        box: f.box,
      }));

      res.json({ findings });
    } catch (e) {
      console.error('[/api/annotate]', e);
      res.status(502).json({
        error: 'No pudimos analizar esa imagen. Verifica que sea un screenshot legible de la landing e inténtalo de nuevo.',
      });
    }
  });
});
