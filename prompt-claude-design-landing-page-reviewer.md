# Prompt para Claude Design — Landing Page Reviewer (CRO AI Studio)

> Copia y pega todo lo de abajo en claude.ai/design.

---

Construye la pantalla de entrada (landing/input) de **CRO AI Studio**, una herramienta de IA que analiza landing pages y entrega recomendaciones de CRO (Conversion Rate Optimization). Es una pieza de portafolio de Mindtech Solutions que Sandy usa en vivo durante llamadas de venta: pega la URL del cliente frente a él, y opcionalmente sube una captura para desbloquear una capa de análisis visual anotado. No es un SaaS que se vende — el objetivo es impresionar en el momento y verse impecable en mobile y desktop.

## Stack

React + TypeScript + Vite + Tailwind CSS + framer-motion + lucide-react.

## Sistema de diseño (usar en toda la app)

Fondo `bg-black` en toda la página. Tipografía Instrument Serif (regular e italic) vía Google Fonts, importada en `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
```

Clase reutilizable `.liquid-glass` (en `index.css`, dentro de `@layer components`), usada en navbar, inputs, cards, botones y cualquier superficie "flotante":

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.15) 80%,
    rgba(255, 255, 255, 0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

Micro-interacciones con framer-motion en 150–300ms, `useInView({ once: true, margin: "-100px" })` para reveals al hacer scroll, `whileHover`/`whileTap` sutiles (scale 1.02–1.05) en botones. Respeta `prefers-reduced-motion`.

## SECCIÓN 1 — PANTALLA DE ENTRADA (la única obligatoria en detalle; full-viewport, `min-h-screen`)

Contenedor `relative flex flex-col overflow-hidden`.

**Fondo:** video ambiental de loop suave (abstracto, sin texto ni producto — sirve solo de atmósfera), `absolute inset-0 w-full h-full object-cover object-bottom`, `muted autoPlay playsInline preload="auto"`, arrancando en `opacity: 0`. Lógica de fundido vía refs (sin transiciones CSS): al `canplay` reproduce y anima opacidad 0→1 en 500ms con `requestAnimationFrame`; en `timeupdate`, cuando falten ≤0.55s anima a 0; al `ended`, espera 100ms, reinicia `currentTime` y vuelve a fundir a 1 — loop perfecto sin corte visible. Encima del video, un overlay `bg-black/40` para que el texto blanco siempre tenga contraste suficiente (mínimo 4.5:1).

**Navbar** (`relative z-20 px-6 py-6`): pill `.liquid-glass rounded-full`, `max-w-5xl mx-auto px-6 py-3`, flex entre izquierda y derecha.
- Izquierda: ícono (Sparkles o ScanSearch de lucide-react, 24px, blanco) + texto "CRO AI Studio" (blanco, `font-semibold text-lg`).
- Derecha: texto pequeño "by Mindtech Solutions" (`text-white/50 text-xs md:text-sm`), como crédito discreto — nada de "Sign Up" ni "Login": la v1 no tiene autenticación real, y agregar esos botones sería fricción sin propósito en un demo.

**Contenido central** (`relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center gap-6`):

1. Encabezado en Instrument Serif, `text-6xl md:text-7xl lg:text-8xl` blanco, `tracking-tight`. Copy: **"Mira tu landing como <em className="italic">la ve tu cliente</em>."** (ajustable — el énfasis en itálica es lo importante del patrón visual, no el texto exacto).
2. Subtítulo (`text-white/70 text-sm md:text-base leading-relaxed max-w-lg`): "Pega la URL y recibe un análisis de copy, CTAs, jerarquía y señales de SEO en menos de 20 segundos. Sube una captura para desbloquear el detalle visual anotado."
3. **Input principal — URL (obligatorio):** pill `.liquid-glass rounded-full`, `max-w-xl w-full pl-6 pr-2 py-2 flex items-center gap-3`. Ícono `Link2` (lucide, 18px, `text-white/40`) a la izquierda del texto. `<input type="url">` transparente, `placeholder="https://tulandingpage.com"`, `text-white placeholder:text-white/40`, tamaño de fuente 16px mínimo (evita zoom automático en iOS). Botón circular blanco a la derecha (`bg-white rounded-full p-3 text-black`, mínimo 44×44px) con ícono `ArrowRight` (20px) — envía el análisis nivel 1.
4. **Zona secundaria — imagen (opcional):** justo debajo del input de URL, un bloque `.liquid-glass rounded-2xl` con borde punteado sutil (`border border-dashed border-white/15`), `px-6 py-5 max-w-xl w-full flex items-center gap-4`, con badge "Opcional" (`text-white/40 text-xs uppercase tracking-widest`). Ícono `ImagePlus` (lucide, 20px) + texto "Sube una captura de tu landing para el análisis visual anotado" (`text-white/60 text-sm`). Todo el bloque es clickable (`cursor-pointer`) y también acepta drag-and-drop; estado hover con `bg-white/5`. Esta zona nunca bloquea el envío del formulario — la URL sola ya dispara el análisis.
5. Botón terciario, discreto, tipo texto: "¿Cómo funciona?" (`text-white/50 text-xs underline-offset-4 hover:text-white/80 transition-colors`) que abre un tooltip/modal breve explicando el flujo de 2 niveles — opcional, solo si aporta claridad en una demo rápida.

**Estado de carga** (tras enviar la URL): reemplaza el contenido central con una animación vistosa (por ejemplo, pulso de gradiente radial blanco muy sutil sobre `.liquid-glass`, o partículas ascendiendo) + texto "Analizando tu landing…" que cicla entre 3–4 frases cortas (ej. "Leyendo el copy", "Revisando CTAs", "Chequeando señales de SEO") cada ~3s para que la espera de ~15–20s se sienta activa, no muerta.

**Estado de error** (URL inválida, sitio caído, protegido, sin contenido suficiente): card `.liquid-glass rounded-2xl p-6 max-w-lg`, ícono `AlertCircle` (lucide, blanco, sin rojo saturado — mantener la paleta monocromática, usar solo tamaño/ícono para señalar el error), mensaje claro y específico de por qué falló, y el input de URL sigue visible y editable para reintentar de inmediato.

**Footer inferior** (`relative z-10 flex justify-center pb-10`): una sola línea discreta, sin íconos sociales (Instagram/Twitter no aplican a esta herramienta) — por ejemplo "Hecho por Mindtech Solutions" (`text-white/30 text-xs`) o simplemente omitir.

## SECCIÓN 2 — RESULTADOS

Diséñala tú, dentro del mismo sistema visual (bg-black, `.liquid-glass`, Instrument Serif solo en titulares/énfasis, framer-motion con reveals al hacer scroll, mobile-first). Debe resolver, con la mejor estructura de layout que consideres:

- **Nivel 1 (siempre presente):** análisis estructural con copy, CTAs, jerarquía de contenido y señales de SEO/velocidad, presentado como una lista de recomendaciones de CRO clara y escaneable.
- **Nivel 2 (solo si se subió imagen):** el screenshot real del usuario mostrado con cajas, flechas y números superpuestos marcando cada hallazgo, conectado uno a uno con los ítems de la lista de recomendaciones (ej. al hacer click/hover en un ítem de la lista, resalta su marca correspondiente en la imagen).
- Todo el resultado permanece en pantalla (no hay export, descarga ni guardado — es intencional, la v1 no lo necesita).
- Prioriza que en una demo en vivo, frente a un cliente, la primera pantalla que aparece después de cargar sea la más impactante ("momento wow"), y que en mobile no requiera scroll excesivo para llegar a lo importante.

## Qué NO incluir (fuera de alcance en la v1)

Sin login real ni pantalla de auth (ni "Sign Up"/"Login" decorativos en esta fase). Sin pricing, features marketing, ni links de "About". Sin historial de análisis ni comparación de landings. Sin exportar/compartir resultado. Sin dashboard de analítica de uso. Todo esto está descartado a propósito para esta fase — no lo agregues aunque el patrón de diseño original (tipo SaaS) lo sugiera.
