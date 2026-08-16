// Server-side paywall gate: sections after the hero are removed from the
// JSON payload entirely for any visitor unless SKIP_PAYWALL=true is set in
// the LOCAL environment only (see server/.env.example). This must never be
// set in Vercel/Hostinger's environment variables — production always
// behaves as locked, with no request param or header able to bypass it.
export function buildAnalyzeResponse(page, device, analysis) {
  const findings = analysis.findings.map((f, i) => ({
    id: i + 1,
    category: f.category,
    severity: f.severity,
    title: f.title,
    description: f.description,
    section: f.section,
  }));

  const unlocked = process.env.SKIP_PAYWALL === 'true';
  const allSections = analysis.wireframe.sections;
  const heroIndex = allSections.findIndex((s) => s.type === 'hero');
  const splitAt = heroIndex === -1 ? allSections.length : heroIndex + 1;
  const visibleSections = unlocked ? allSections : allSections.slice(0, splitAt);
  const lockedSections = unlocked ? [] : allSections.slice(splitAt).map((s) => s.type);

  return {
    analyzedUrl: page.displayUrl,
    device,
    score: analysis.score,
    headline: analysis.headline,
    categories: analysis.categories,
    findings,
    wireframe: { sections: visibleSections },
    lockedSections,
    unlocked,
    brand: { primaryColor: page.brand?.primaryColor, logoUrl: page.brand?.logoUrl },
    platform: page.platform || null,
  };
}
