import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-5';

const CATEGORY_NAMES = ['Copy', 'CTAs', 'Jerarquía', 'SEO / Velocidad'];

const STRUCTURAL_TOOL = {
  name: 'submit_cro_analysis',
  description: 'Entrega el análisis CRO estructural de la landing page en formato estructurado.',
  input_schema: {
    type: 'object',
    properties: {
      score: {
        type: 'integer',
        minimum: 0,
        maximum: 100,
        description: 'Puntaje CRO general de la landing, 0-100.',
      },
      headline: {
        type: 'string',
        description:
          'Una frase corta y directa (estilo titular) resumiendo el estado de la landing, en español, con la parte clave envuelta en dobles asteriscos para énfasis. Ej: "Tu landing convierte, pero **deja dinero en la mesa**."',
      },
      categories: {
        type: 'array',
        minItems: 4,
        maxItems: 4,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', enum: CATEGORY_NAMES },
            score: { type: 'integer', minimum: 0, maximum: 100 },
          },
          required: ['name', 'score'],
        },
      },
      findings: {
        type: 'array',
        minItems: 4,
        maxItems: 8,
        items: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: CATEGORY_NAMES },
            severity: { type: 'string', enum: ['alta', 'media', 'baja'] },
            title: { type: 'string', description: 'Título corto del hallazgo, en español, orientado a acción.' },
            description: {
              type: 'string',
              description: 'Explicación específica del problema y la recomendación concreta para resolverlo, en español, 1-3 frases.',
            },
          },
          required: ['category', 'severity', 'title', 'description'],
        },
      },
    },
    required: ['score', 'headline', 'categories', 'findings'],
  },
};

const VISUAL_TOOL = {
  name: 'submit_visual_findings',
  description:
    'Entrega hallazgos de diseño visual sobre un screenshot real de landing page, con la posición de cada hallazgo en la imagen.',
  input_schema: {
    type: 'object',
    properties: {
      findings: {
        type: 'array',
        minItems: 3,
        maxItems: 8,
        items: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: [...CATEGORY_NAMES, 'Diseño visual'] },
            severity: { type: 'string', enum: ['alta', 'media', 'baja'] },
            title: { type: 'string', description: 'Título corto del hallazgo visual, en español.' },
            description: {
              type: 'string',
              description: 'Qué está mal visualmente y qué cambio concreto recomienda, en español, 1-3 frases.',
            },
            box: {
              type: 'object',
              description:
                'Posición del elemento señalado, como porcentaje del ancho/alto TOTAL de la imagen (0-100). x,y es el CENTRO del elemento.',
              properties: {
                x: { type: 'number', minimum: 0, maximum: 100 },
                y: { type: 'number', minimum: 0, maximum: 100 },
                w: { type: 'number', minimum: 1, maximum: 100 },
                h: { type: 'number', minimum: 1, maximum: 100 },
              },
              required: ['x', 'y', 'w', 'h'],
            },
          },
          required: ['category', 'severity', 'title', 'description', 'box'],
        },
      },
    },
    required: ['findings'],
  },
};

function useTool(message, toolName) {
  const block = message.content.find((c) => c.type === 'tool_use' && c.name === toolName);
  if (!block) throw new Error('Claude no devolvió un análisis estructurado. Inténtalo de nuevo.');
  return block.input;
}

export async function analyzeStructural(page, device) {
  const prompt = `Eres un consultor senior de CRO (Conversion Rate Optimization) revisando la landing page de un cliente potencial durante una llamada de venta en vivo. Analiza el siguiente contenido extraído del HTML real de la página y entrega un análisis honesto, específico y accionable — nada de consejos genéricos. Sé crítico donde haga falta: en una demo de venta, un análisis que solo halaga no sirve.

Versión analizada: ${device === 'mobile' ? 'móvil' : 'escritorio'}.

URL: ${page.finalUrl}
Título (<title>): ${page.title || '(vacío)'}
Meta description: ${page.metaDescription || '(vacía)'}
Viewport meta presente: ${page.hasViewportMeta ? 'sí' : 'no'}
H1: ${page.h1s.join(' | ') || '(ninguno)'}
H2 (primeros): ${page.h2s.join(' | ') || '(ninguno)'}
Textos de botones/links (candidatos a CTA): ${page.ctaTexts.join(' | ') || '(ninguno)'}
Imágenes totales: ${page.imgTotal}, sin atributo alt: ${page.imgAltMissing}
Cantidad de palabras de cuerpo: ${page.wordCount}

Extracto del texto visible de la página (puede estar truncado):
"""
${page.bodyTextSample}
"""

Evalúa 4 categorías (Copy, CTAs, Jerarquía, SEO / Velocidad) con un score 0-100 cada una, un score general 0-100, y entre 4 y 8 hallazgos concretos priorizados por impacto real en conversión. Usa la herramienta submit_cro_analysis para responder.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    tools: [STRUCTURAL_TOOL],
    tool_choice: { type: 'tool', name: STRUCTURAL_TOOL.name },
    messages: [{ role: 'user', content: prompt }],
  });

  return useTool(message, STRUCTURAL_TOOL.name);
}

export async function analyzeVisual({ imageBase64, mediaType, device, urlContext }) {
  const prompt = `Eres un consultor senior de CRO y diseño UX revisando el screenshot real de una landing page (versión ${device === 'mobile' ? 'móvil' : 'escritorio'}) de ${urlContext || 'un cliente'}.

Identifica entre 3 y 8 problemas de diseño visual concretos: contraste, espaciado, jerarquía visual, alineación, tamaño/legibilidad de texto, competencia visual entre elementos, prueba social ausente, etc. Para cada uno, da la posición EXACTA del elemento en la imagen como porcentaje del ancho y alto total (x,y = centro del elemento en %, w,h = tamaño en %). Sé preciso con las coordenadas — se usarán para dibujar un cuadro sobre la imagen real.

Usa la herramienta submit_visual_findings para responder.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    tools: [VISUAL_TOOL],
    tool_choice: { type: 'tool', name: VISUAL_TOOL.name },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: prompt },
        ],
      },
    ],
  });

  return useTool(message, VISUAL_TOOL.name);
}

export { CATEGORY_NAMES };
