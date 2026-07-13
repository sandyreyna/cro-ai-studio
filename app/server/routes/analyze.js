import { Router } from 'express';
import { fetchAndExtract, AnalysisError } from '../lib/extractPage.js';
import { analyzeStructural } from '../lib/claude.js';

export const analyzeRouter = Router();

analyzeRouter.post('/analyze', async (req, res) => {
  const { url, device } = req.body || {};
  const normalizedDevice = device === 'mobile' ? 'mobile' : 'desktop';

  try {
    const page = await fetchAndExtract(url);
    const analysis = await analyzeStructural(page, normalizedDevice);

    const findings = analysis.findings.map((f, i) => ({
      id: i + 1,
      source: 'structural',
      category: f.category,
      severity: f.severity,
      title: f.title,
      description: f.description,
    }));

    res.json({
      analyzedUrl: page.displayUrl,
      device: normalizedDevice,
      score: analysis.score,
      headline: analysis.headline,
      categories: analysis.categories,
      findings,
    });
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
