const HEX_RE = /#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi;
const RGB_RE = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/gi;
const CUSTOM_PROP_RE = /--(?:[a-z0-9-]*(?:primary|brand|accent)[a-z0-9-]*)\s*:\s*(#[0-9a-f]{3,6}\b|rgba?\([^)]+\))/gi;

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function toHex({ r, g, b }) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// Reject near-white, near-black, and low-saturation grays — we want the one
// standout brand color, not the neutral palette every site is mostly made of.
function isBrandish({ r, g, b }) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2 / 255;
  const saturation = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
  if (lightness > 0.93 || lightness < 0.12) return false;
  if (saturation < 0.25) return false;
  return true;
}

function tallyColors(text, tally, weight = 1) {
  for (const m of text.matchAll(HEX_RE)) {
    const rgb = hexToRgb(m[0]);
    if (isBrandish(rgb)) tally.set(toHex(rgb), (tally.get(toHex(rgb)) || 0) + weight);
  }
  for (const m of text.matchAll(RGB_RE)) {
    const rgb = { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
    if (isBrandish(rgb)) {
      const hex = toHex(rgb);
      tally.set(hex, (tally.get(hex) || 0) + weight);
    }
  }
}

// CSS custom properties named like --primary/--brand/--accent are a much
// stronger signal of intentional brand color than raw frequency counting.
function tallyCustomPropColors(text, tally) {
  for (const m of text.matchAll(CUSTOM_PROP_RE)) {
    tallyColors(m[1], tally, 25);
  }
}

async function fetchCssText(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  } finally {
    clearTimeout(timeout);
  }
}

function parseColor(str) {
  const hexMatch = str.match(HEX_RE);
  if (hexMatch) return hexToRgb(hexMatch[0]);
  const rgbMatch = [...str.matchAll(RGB_RE)][0];
  if (rgbMatch) return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) };
  return null;
}

export async function extractBrand($, baseUrl) {
  const tally = new Map();

  // theme-color is often just the page's neutral background (near-black for
  // dark themes, near-white for light ones) rather than a real accent color —
  // only trust it when it's actually a saturated, brand-looking color.
  const themeColor = $('meta[name="theme-color"]').attr('content')?.trim();
  if (themeColor) {
    const rgb = parseColor(themeColor);
    if (rgb && isBrandish(rgb)) {
      return { primaryColor: themeColor, source: 'theme-color', logoUrl: findLogo($, baseUrl) };
    }
  }

  const styleBlocks = $('style')
    .map((_, el) => $(el).text())
    .get()
    .join('\n');
  tallyCustomPropColors(styleBlocks, tally);
  tallyColors(styleBlocks, tally);
  $('[style]').each((_, el) => tallyColors($(el).attr('style') || '', tally));

  const stylesheetHref = $('link[rel="stylesheet"]').first().attr('href');
  if (stylesheetHref) {
    try {
      const cssUrl = new URL(stylesheetHref, baseUrl).toString();
      const cssText = await fetchCssText(cssUrl, 4000);
      tallyCustomPropColors(cssText, tally);
      tallyColors(cssText, tally);
    } catch {
      // best-effort only
    }
  }

  let best = null;
  let bestCount = 0;
  for (const [color, count] of tally) {
    if (count > bestCount) {
      best = color;
      bestCount = count;
    }
  }

  return { primaryColor: best || '#6366f1', source: best ? 'css-frequency' : 'fallback', logoUrl: findLogo($, baseUrl) };
}

function findLogo($, baseUrl) {
  // Scope to header/nav first — a "logo"-hinted <img> anywhere in the body
  // (e.g. a client-logo carousel used as social proof) is a false positive.
  const scope = $('header, nav').first();
  const searchRoot = scope.length ? scope : $('body');
  const candidate = searchRoot
    .find('img')
    .filter((_, el) => {
      const hint = `${$(el).attr('alt') || ''} ${$(el).attr('class') || ''} ${$(el).attr('id') || ''} ${$(el).attr('src') || ''}`;
      return /logo/i.test(hint);
    })
    .first();

  const fallbackFirstImg = candidate.length ? candidate : searchRoot.find('img').first();
  const src = fallbackFirstImg.attr('src');
  if (src) {
    try {
      return new URL(src, baseUrl).toString();
    } catch {
      // fall through to favicon
    }
  }

  const icon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').first().attr('href');
  if (icon) {
    try {
      return new URL(icon, baseUrl).toString();
    } catch {
      return null;
    }
  }
  return null;
}
