import { fetchAndExtract, AnalysisError } from '../app/server/lib/extractPage.js';
import { analyzeStructural } from '../app/server/lib/claude.js';

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

    const findings = analysis.findings.map((f, i) => ({
      id: i + 1,
      category: f.category,
      severity: f.severity,
      title: f.title,
      description: f.description,
      section: f.section,
    }));

    res.status(200).json({
      analyzedUrl: page.displayUrl,
      device: normalizedDevice,
      score: analysis.score,
      headline: analysis.headline,
      categories: analysis.categories,
      findings,
      wireframe: analysis.wireframe,
      brand: { primaryColor: page.brand?.primaryColor, logoUrl: page.brand?.logoUrl },
    });
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
