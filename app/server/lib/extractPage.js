import * as cheerio from 'cheerio';
import { assertPublicHostname } from './ssrfGuard.js';
import { extractBrand } from './brand.js';

export class AnalysisError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function normalizeUrl(raw) {
  let value = (raw || '').trim();
  if (!value) throw new AnalysisError('Pega la URL de tu landing page para empezar.');
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = `https://${value}`;

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new AnalysisError('No pudimos leer esa URL. Revisa que esté completa (ej. https://tulanding.com) e inténtalo de nuevo.');
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new AnalysisError('Solo se pueden analizar URLs http:// o https://.');
  }
  if (!parsed.hostname.includes('.')) {
    throw new AnalysisError('No pudimos leer esa URL. Revisa que esté completa (ej. https://tulanding.com) e inténtalo de nuevo.');
  }
  return parsed;
}

const TEXT_LIMIT = 12000;

export async function fetchAndExtract(rawUrl, { timeoutMs = 12000 } = {}) {
  const parsed = normalizeUrl(rawUrl);
  await assertPublicHostname(parsed.hostname).catch((e) => {
    throw new AnalysisError(e.message, 400);
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; CROAIStudioBot/1.0; +https://mindtechsolutions.com) landing-page-reviewer',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new AnalysisError('El sitio tardó demasiado en responder. Puede estar caído o muy lento en este momento.', 504);
    }
    throw new AnalysisError('No pudimos conectar con ese sitio. Revisa la URL o inténtalo de nuevo en unos segundos.', 502);
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 401 || res.status === 403) {
    throw new AnalysisError('Ese sitio está protegido (requiere login o bloquea el acceso automatizado) y no pudimos leer su contenido.', 403);
  }
  if (!res.ok) {
    throw new AnalysisError(`El sitio respondió con un error (${res.status}). Puede estar caído o la URL no existir.`, 502);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('html')) {
    throw new AnalysisError('Esa URL no devolvió una página HTML analizable.', 415);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const finalUrl = res.url || parsed.toString();
  const brand = await extractBrand($, finalUrl);

  $('script, style, noscript, svg, template').remove();

  const title = $('title').first().text().trim();
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const h1s = $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const h2s = $('h2').map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 12);
  const ctaTexts = $('a, button')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t && t.length <= 60)
    .slice(0, 30);
  const imgAltMissing = $('img').filter((_, el) => !$(el).attr('alt')).length;
  const imgTotal = $('img').length;

  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText.split(' ').filter(Boolean).length;

  if (wordCount < 40 && h1s.length === 0) {
    throw new AnalysisError(
      'La página tiene muy poco contenido para analizar. Puede estar protegida por login, depender de JavaScript pesado para renderizar, o no ser una landing page real.',
      422,
    );
  }

  return {
    finalUrl,
    displayUrl: parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : ''),
    title,
    metaDescription,
    canonical,
    hasViewportMeta: Boolean(viewport),
    h1s,
    h2s,
    ctaTexts,
    imgTotal,
    imgAltMissing,
    wordCount,
    bodyTextSample: bodyText.slice(0, TEXT_LIMIT),
    brand,
  };
}
