export type Device = 'desktop' | 'mobile';
export type Severity = 'alta' | 'media' | 'baja';

export interface Category {
  name: string;
  score: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Finding {
  id: number;
  source: 'structural' | 'visual';
  category: string;
  severity: Severity;
  title: string;
  description: string;
  box?: Box;
}

export interface AnalyzeResult {
  analyzedUrl: string;
  device: Device;
  score: number;
  headline: string;
  categories: Category[];
  findings: Finding[];
}

export interface AnnotateResult {
  findings: Finding[];
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

export async function annotateImage(
  file: File,
  url: string,
  device: Device,
  signal?: AbortSignal,
): Promise<AnnotateResult> {
  const form = new FormData();
  form.append('image', file);
  form.append('url', url);
  form.append('device', device);
  let res: Response;
  try {
    res = await fetch('/api/annotate', { method: 'POST', body: form, signal });
  } catch {
    throw new ApiError('No pudimos conectar con el servidor para analizar la imagen.');
  }
  if (!res.ok) throw new ApiError(await parseErrorMessage(res, 'No pudimos analizar esa imagen.'));
  return res.json();
}
