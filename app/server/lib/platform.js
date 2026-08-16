// Detects the 5 most common site builders/CMSs from the raw HTML response.
// Checked against the untouched HTML string (not the cheerio-parsed DOM)
// so script/meta signals survive regardless of what extractPage strips out
// later. Order matters only in that we return the first clear match.
const SIGNALS = [
  { name: 'WordPress', test: /\/wp-content\/|\/wp-json\/|name=["']generator["']\s+content=["']WordPress/i },
  { name: 'Shopify', test: /cdn\.shopify\.com|Shopify\.theme|window\.Shopify\b/i },
  { name: 'Webflow', test: /data-wf-site=|data-wf-page=|\bwebflow\.js\b/i },
  { name: 'Wix', test: /static\.wixstatic\.com|content=["']Wix\.com Website Builder["']|\bwix-warmup-data\b/i },
  { name: 'Squarespace', test: /static1\.squarespace\.com/i },
];

export function detectPlatform(html) {
  for (const { name, test } of SIGNALS) {
    if (test.test(html)) return name;
  }
  return null;
}
