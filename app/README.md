# CRO AI Studio — Landing Page Reviewer

Herramienta de IA que analiza una landing page (URL + screenshot opcional) y entrega recomendaciones de CRO, usando Claude para el razonamiento. Ver `../cro-ai-studio-brief.md` y `../outputs/spec.md` para el contexto completo del proyecto.

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

- **Nivel 1 (obligatorio):** el frontend pega la URL a `POST /api/analyze`. El servidor hace fetch del HTML real, extrae copy/CTAs/jerarquía/señales SEO con `cheerio`, y le pide a Claude (`claude-sonnet-5`, vía tool-use forzado) un análisis estructurado: score, 4 categorías, y una lista de hallazgos accionables.
- **Nivel 2 (opcional):** si el usuario sube una captura, el frontend la manda a `POST /api/annotate` junto con la URL y el dispositivo. Claude analiza la imagen con visión y devuelve hallazgos de diseño visual con coordenadas (% del ancho/alto de la imagen), que el frontend dibuja como cajas/números sobre el screenshot real subido.
- Ambas llamadas corren en paralelo cuando hay imagen, para no sumar los tiempos de espera.
- Si el análisis de imagen falla, el análisis por URL se muestra igual (la imagen nunca bloquea el nivel 1), con una nota discreta de error.

## Notas de seguridad

- La API key de Anthropic vive solo en `server/.env` (gitignoreado) y nunca se expone al navegador.
- El fetch de URLs bloquea direcciones privadas/internas (SSRF guard) antes de hacer la petición.
- No hay login, ni base de datos, ni almacenamiento de resultados — todo vive en memoria del navegador durante la sesión, como especifica la v1 del spec.
