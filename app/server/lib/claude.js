import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-5';

const CATEGORY_NAMES = ['Copy', 'CTAs', 'Jerarquía', 'SEO / Velocidad'];
const SECTION_TYPES = ['nav', 'hero', 'features', 'social-proof', 'cta', 'footer'];

const STRUCTURAL_TOOL = {
  name: 'submit_cro_analysis',
  description:
    'Entrega el análisis CRO estructural de la landing page, junto con un wireframe de cómo se vería la versión mejorada si se aplican las recomendaciones.',
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
            section: {
              type: 'string',
              enum: [...SECTION_TYPES, 'general'],
              description:
                'A qué sección del wireframe mejorado corresponde este hallazgo (para conectarlo visualmente). Usa "general" si no aplica a una sola sección puntual.',
            },
          },
          required: ['category', 'severity', 'title', 'description', 'section'],
        },
      },
      wireframe: {
        type: 'object',
        description:
          'Wireframe de la versión MEJORADA de la landing: cómo se vería si se aplican las recomendaciones de mayor impacto. Usa el nombre de marca, color y tono reales de la página — no genérico.',
        properties: {
          sections: {
            type: 'array',
            minItems: 4,
            maxItems: 6,
            description: 'Secciones en orden de arriba hacia abajo. Incluye siempre nav, hero, cta y footer; agrega features y/o social-proof solo si aportan a las recomendaciones.',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: SECTION_TYPES },
                eyebrow: { type: 'string', description: 'Texto pequeño arriba del headline (solo hero), opcional.' },
                headline: { type: 'string', description: 'Titular principal (hero) o mensaje de la franja (cta).' },
                subheadline: { type: 'string', description: 'Subtítulo de apoyo (solo hero).' },
                primaryCta: { type: 'string', description: 'Texto del botón principal (nav, hero o cta).' },
                secondaryCta: { type: 'string', description: 'Texto del botón secundario (solo hero), opcional.' },
                links: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Links de navegación (solo nav), 2-4 items cortos.',
                },
                items: {
                  type: 'array',
                  description: 'Tarjetas de features (solo features), 3-4 items.',
                  items: {
                    type: 'object',
                    properties: { title: { type: 'string' }, description: { type: 'string' } },
                    required: ['title', 'description'],
                  },
                },
                proofItems: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Frases cortas de prueba social: nombres de clientes, métricas o mini-testimonios (solo social-proof), 2-4 items.',
                },
                footerText: { type: 'string', description: 'Línea de footer (solo footer).' },
              },
              required: ['type'],
            },
          },
        },
        required: ['sections'],
      },
    },
    required: ['score', 'headline', 'categories', 'findings', 'wireframe'],
  },
};

function useTool(message, toolName) {
  const block = message.content.find((c) => c.type === 'tool_use' && c.name === toolName);
  if (!block) throw new Error('Claude no devolvió un análisis estructurado. Inténtalo de nuevo.');
  return block.input;
}

export async function analyzeStructural(page, device) {
  const brand = page.brand || {};
  const prompt = `Eres un consultor senior de CRO (Conversion Rate Optimization) y copywriter revisando la landing page de un cliente potencial durante una llamada de venta en vivo. Analiza el siguiente contenido extraído del HTML real de la página y entrega un análisis honesto, específico y accionable — nada de consejos genéricos. Sé crítico donde haga falta: en una demo de venta, un análisis que solo halaga no sirve.

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
Color de marca detectado: ${brand.primaryColor || '(no detectado)'}

Extracto del texto visible de la página (puede estar truncado):
"""
${page.bodyTextSample}
"""

Evalúa 4 categorías (Copy, CTAs, Jerarquía, SEO / Velocidad) con un score 0-100 cada una, un score general 0-100, y entre 4 y 8 hallazgos concretos priorizados por impacto real en conversión, cada uno etiquetado con la sección del wireframe a la que corresponde.

Además, genera un WIREFRAME de cómo se vería esta landing si se aplicaran las recomendaciones de mayor impacto: usa el nombre/tono de marca real (infiere el nombre de marca del título o del dominio), copy nuevo y mejorado (headline, subheadline, CTAs, features, prueba social) que resuelva específicamente los hallazgos identificados — no un mockup genérico. Usa la herramienta submit_cro_analysis para responder.`;

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    tools: [STRUCTURAL_TOOL],
    tool_choice: { type: 'tool', name: STRUCTURAL_TOOL.name },
    messages: [{ role: 'user', content: prompt }],
  });

  return useTool(message, STRUCTURAL_TOOL.name);
}

export { CATEGORY_NAMES, SECTION_TYPES };
