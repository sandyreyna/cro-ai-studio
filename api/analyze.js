import { fetchAndExtract, AnalysisError } from '../app/server/lib/extractPage.js';
import { analyzeStructural } from '../app/server/lib/claude.js';
import { buildAnalyzeResponse } from '../app/server/lib/response.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url, device } = req.body || {};
  const normalizedDevice = device === 'mobile' ? 'mobile' : 'desktop';

  try {
    const page = await fetchAndExtract(url);
    const analysis = await analyzeStructural(page, normalizedDevice);
    res.status(200).json(buildAnalyzeResponse(page, normalizedDevice, analysis));
  } catch (err) {
    if (err instanceof AnalysisError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error('[/api/analyze]', err);
    res.status(502).json({
      error: 'No pudimos completar el análisis con IA en este momento. Inténtalo de nuevo en unos segundos.',
    });
  }
}

export const config = {
  maxDuration: 60,
};
