# Landing Page Reviewer — Brief del proyecto (Fase 1)

## Qué es

Una herramienta de IA que analiza una landing page y entrega recomendaciones de CRO (Conversion Rate Optimization). Es la primera fase de un proyecto más amplio; por ahora el foco es construir este módulo completo, funcional y pulido.

**Propósito:** pieza de portafolio/demo para Mindtech Solutions — no es un SaaS que se vaya a vender ni monetizar en esta fase. El objetivo es impresionar a quien lo ve y generar conversaciones/leads, no maximizar uso o retención.

## Autenticación y diseño

- **Sin login real.** Un demo no necesita cuenta de usuario; el login es fricción que no aporta al objetivo (impresionar rápido). Como mucho, un login decorativo que no bloquea el acceso, solo para mostrar que el diseño de auth existe.
- Diseño **vistoso, con animaciones**, friendly para el usuario.
- **Mobile-first**: debe verse bien centrado y ser de uso rápido en móvil, no solo responsive de escritorio adaptado.

## Estrategia de modelos de IA

No forzar un solo proveedor. Repartir según qué tan fino sea el razonamiento requerido:

- **Claude** para las tareas de razonamiento complejo sobre texto e imagen: analizar un screenshot, identificar problemas de UX/CRO, redactar recomendaciones, generar copy. Los modelos abiertos de Hugging Face tienden a quedarse cortos en este tipo de razonamiento fino, y un output mediocre en la pieza que debe demostrar capacidad juega en contra.
- **Hugging Face** reservado para tareas puntuales y verificables (ej. clasificación de elementos visuales), no como motor principal de análisis.
- **Antes de construir la interfaz**, validar con una prueba real (una landing existente) que la calidad del análisis de Claude sobre un screenshot es lo bastante buena como para sostener el proyecto.

## Flujo definido

1. **URL (obligatoria):** el usuario pega la URL de la landing. Con esto se genera un análisis estructural — copy, CTAs, jerarquía de contenido, señales de SEO/velocidad — extraído del HTML, sin necesitar imagen.
2. **Imagen (opcional, "extra" que desbloquea más):** el usuario puede subir una captura de la página. Esto desbloquea una capa adicional de sugerencias de diseño visual (contraste, espaciado, jerarquía visual), presentadas como un **screenshot anotado**: cajas, flechas y números superpuestos sobre la imagen real marcando cada hallazgo, conectados con la lista de recomendaciones.

**Por qué imagen subida y no captura automática:** un headless browser para capturar screenshots automáticamente añade riesgo técnico (protección anti-bot, contenido con scroll, JS pesado) que no vale la pena para un MVP construido en semanas por una sola persona. Dejar que el usuario suba su propia imagen simplifica la construcción y da control al usuario sobre qué versión de la página se evalúa.

**Por qué anotación sobre screenshot real y no imagen generada por IA:** los modelos de generación de imagen actuales todavía fallan con texto preciso y layouts de UI funcionales — el resultado se ve "casi bien" pero con errores que, en un contexto de CRO donde la precisión importa, dañan más que ayudan. La anotación sobre el screenshot real es técnicamente más simple y más confiable, y visualmente es justo el tipo de output que impresiona en un portafolio (la persona ve su propia landing marcada con los hallazgos).

## Riesgos identificados y cómo se mitigan

- **Forzar Hugging Face en tareas de razonamiento fino** produce output mediocre que daña la percepción de calidad → mitigado usando Claude para razonamiento y HF solo en tareas puntuales.
- **Auth agrega fricción y tiempo de desarrollo sin aportar al objetivo real** → mitigado eliminando el login real o dejándolo decorativo.
- **Confundir "portafolio" con "producto"** llevaría a construir retención/cuentas que no hacen falta → la métrica de éxito no es uso recurrente, es impacto en quien lo ve y en las conversaciones que genera con clientes potenciales.

## Siguiente paso pendiente de validar

Antes de construir la interfaz, correr una prueba real: tomar una landing existente (propia o de un cliente), pasarle la URL para el análisis nivel 1, y opcionalmente subir una captura para probar el nivel 2 (screenshot anotado). Confirmar que la calidad del análisis con Claude justifica construir el resto de la interfaz alrededor de este módulo.
