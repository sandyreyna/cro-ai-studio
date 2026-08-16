import { Router } from 'express';
import { fetchAndExtract, AnalysisError } from '../lib/extractPage.js';
import { analyzeStructural } from '../lib/claude.js';
import { buildAnalyzeResponse } from '../lib/response.js';

export const analyzeRouter = Router();

analyzeRouter.post('/analyze', async (req, res) => {
  const { url, device } = req.body || {};
  const normalizedDevice = device === 'mobile' ? 'mobile' : 'desktop';

  try {
    const page = await fetchAndExtract(url);
    const analysis = await analyzeStructural(page, normalizedDevice);
    res.json(buildAnalyzeResponse(page, normalizedDevice, analysis));
  } catch (err) {
    if (err instanceof AnalysisError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('[/api/analyze]', err);
    res.status(502).json({
      error: 'No pudimos completar el análisis con IA en este momento. Inténtalo de nuevo en unos segundos.',
    });
  }
});
