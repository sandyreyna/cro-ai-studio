# CRO AI Studio — Landing Page Reviewer

Herramienta de IA que analiza una landing page por URL y entrega recomendaciones de CRO junto con un wireframe generado de cómo se vería la página mejorada, usando Claude para el razonamiento. Ver `../cro-ai-studio-brief.md` y `../outputs/spec.md` para el contexto original del proyecto (nota: la v1 documentada ahí incluía carga de screenshot; se reemplazó por el wireframe generado por las razones explicadas abajo).

## Estructura

```
app/
  server/   API Node/Express — llama a Claude, hace fetch del HTML de la URL
  client/   React + TypeScript + Vite + Tailwind + framer-motion + lucide-react
```

## Cómo correrlo

1. **Backend**
   ```
   cd app/server
   npm install         # ya instalado si acabas de clonar este estado
   cp .env.example .env
   # pega tu ANTHROPIC_API_KEY en server/.env (nunca la subas a git)
   npm run dev
   ```
   Corre en `http://localhost:3001`.

2. **Frontend** (en otra terminal)
   ```
   cd app/client
   npm install
   npm run dev
   ```
   Corre en `http://localhost:5173` y hace proxy de `/api` hacia el backend.

## Cómo funciona

- El frontend pega la URL a `POST /api/analyze`. El servidor hace fetch del HTML real, extrae copy/CTAs/jerarquía/señales SEO con `cheerio`, y además intenta detectar el color de marca (meta `theme-color`, custom properties CSS, frecuencia de colores) y el logo/favicon (`app/server/lib/brand.js`).
- Con ese contexto, le pide a Claude (`claude-sonnet-5`, vía tool-use forzado) en una sola llamada: score, 4 categorías, una lista de hallazgos accionables (cada uno etiquetado con la sección del wireframe a la que corresponde: `nav`, `hero`, `features`, `social-proof`, `cta`, `footer` o `general`), y un **wireframe de la versión mejorada** — copy nuevo por sección que resuelve los hallazgos, respetando el color de marca real detectado.
- El frontend renderiza ese wireframe como un mockup real (no una imagen ni coordenadas estimadas). Pasar el cursor o hacer click en un hallazgo resalta su(s) sección(es) correspondiente(s) en el wireframe, y viceversa — todo con posiciones DOM reales, sin depender de que un modelo de visión adivine coordenadas sobre una foto (ver historial de decisiones abajo).

### Por qué no hay carga de screenshot

La v1 original (ver `../outputs/spec.md`) sí incluía subir una captura para un "screenshot anotado" con cajas dibujadas por Claude Vision sobre la imagen real. Se probó y funcionaba bien con capturas de un solo viewport, pero con capturas de página completa (full-page, muy altas) la precisión de las coordenadas se degradaba notablemente — un hallazgo sobre un elemento de arriba podía terminar marcado muy abajo. Se decidió reemplazarlo por el wireframe generado: mismo "wow" visual en una demo, pero sin depender de que el modelo acierte una posición en píxeles.

## Desbloqueo Pro (paywall)

- El wireframe que Claude genera SIEMPRE incluye todas las secciones (nav, hero, features, prueba social, cta, footer) — Claude necesita el cuadro completo para razonar bien las recomendaciones.
- Lo que cambia es qué manda el servidor al navegador: `app/server/lib/response.js` (`buildAnalyzeResponse`) corta el array de secciones justo después del hero para cualquier visitante público. Las secciones bloqueadas **no viajan por la red en absoluto** — no es un blur de CSS, es contenido que el navegador nunca recibe. El frontend solo sabe los *tipos* de sección que faltan (`lockedSections`) y dibuja un skeleton genérico por cada una.
- **`SKIP_PAYWALL=true`** en `server/.env` (local, gitignoreado) hace que el servidor mande todo sin recortar — así ves el reporte completo vos mismo para armar el PDF pagado. **Nunca se define esta variable en Vercel ni en Hostinger** — no hay parámetro de URL, header ni endpoint que la reemplace en producción; el sitio público siempre está bloqueado.
- También se detecta la plataforma/CMS de la landing analizada (WordPress, Shopify, Webflow, Wix, Squarespace) a partir del mismo HTML que ya se descarga para el color de marca — `app/server/lib/platform.js`. Se muestra como texto discreto junto al diagnóstico gratuito si hay coincidencia clara; si no, no se muestra nada.

## Notas de seguridad

- La API key de Anthropic vive solo en `server/.env` (gitignoreado) y nunca se expone al navegador.
- El fetch de URLs bloquea direcciones privadas/internas (SSRF guard) antes de hacer la petición.
- No hay login, ni base de datos, ni almacenamiento de resultados — todo vive en memoria del navegador durante la sesión, como especifica la v1 del spec.
