export type Device = 'desktop' | 'mobile';
export type Severity = 'alta' | 'media' | 'baja';
export type SectionType = 'nav' | 'hero' | 'features' | 'social-proof' | 'cta' | 'footer';

export interface Category {
  name: string;
  score: number;
}

export interface Finding {
  id: number;
  category: string;
  severity: Severity;
  title: string;
  description: string;
  section: SectionType | 'general';
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface WireframeSection {
  type: SectionType;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCta?: string;
  secondaryCta?: string;
  links?: string[];
  items?: FeatureItem[];
  proofItems?: string[];
  footerText?: string;
}

export interface Wireframe {
  sections: WireframeSection[];
}

export interface Brand {
  primaryColor?: string;
  logoUrl?: string;
}

export interface AnalyzeResult {
  analyzedUrl: string;
  device: Device;
  score: number;
  headline: string;
  categories: Category[];
  findings: Finding[];
  wireframe: Wireframe;
  brand: Brand;
}

export class ApiError extends Error {}

async function parseErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return data?.error || fallback;
  } catch {
    return fallback;
  }
}

export async function analyzeUrl(url: string, device: Device, signal?: AbortSignal): Promise<AnalyzeResult> {
  let res: Response;
  try {
    res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, device }),
      signal,
    });
  } catch {
    throw new ApiError('No pudimos conectar con el servidor de análisis. Revisa tu conexión e inténtalo de nuevo.');
  }
  if (!res.ok) throw new ApiError(await parseErrorMessage(res, 'No pudimos analizar esa URL.'));
  return res.json();
}
