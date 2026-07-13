# Spec: Landing Page Reviewer (CRO AI Studio) — v1
Fecha: 2026-07-12

## Overview
Herramienta que analiza una landing page y entrega recomendaciones de CRO, pensada como pieza de portafolio de Mindtech Solutions. Sandy la usa en vivo durante llamadas de venta: pega la URL del cliente, muestra el análisis en pantalla, y opcionalmente sube un screenshot para desbloquear una capa visual anotada. El objetivo no es uso recurrente ni monetización — es generar una reacción fuerte en el momento y abrir conversaciones de negocio.

## Usuarios objetivo
Sandy, en llamada de venta frente a un cliente potencial. Sandy es quien pega la URL y opera la herramienta; el cliente es quien la ve y reacciona. Hoy ese momento de la llamada no existe — se resuelve con capturas de pantalla sueltas o comentarios verbales sin nada visual que lo respalde.

## Alcance

### La v1 SÍ hace
1. **Análisis estructural por URL**: el usuario pega una URL (obligatoria) y recibe un análisis de copy, CTAs, jerarquía de contenido y señales de SEO/velocidad, junto con una lista de recomendaciones de CRO generadas por Claude.
2. **Carga de imagen + screenshot anotado (opcional)**: el usuario puede subir una captura de la misma landing. Si es válida, se genera un screenshot anotado (cajas, flechas, números) conectado uno a uno con la lista de recomendaciones.
3. **Interfaz vistosa, animada y mobile-first** que empaqueta todo el flujo — pensada para verse bien en el momento de una demo en vivo, no solo funcionar.

### La v1 NO hace
- Login real ni cuentas de usuario.
- Captura automática de screenshot (headless browser): la imagen siempre la sube el usuario.
- Imágenes generadas por IA: el anotado va siempre sobre el screenshot real subido, nunca sobre una imagen creada por el modelo.
- Guardar historial de análisis anteriores.
- Comparar varias landings al mismo tiempo.
- Exportar o compartir el resultado (PDF, link, descarga): el resultado vive solo en pantalla durante la demo.
- Dashboards o analítica de uso.

## Comportamiento esperado
1. Sandy abre la herramienta en su laptop/tablet al inicio o durante la llamada de venta.
2. Pega la URL de la landing del cliente en el campo obligatorio y confirma.
3. Mientras se procesa, ve una animación de carga vistosa; el análisis se siente casi instantáneo (objetivo: bajo ~15-20 segundos) para no perder el ritmo de la conversación.
4. Aparece el análisis estructural en pantalla: copy, CTAs, jerarquía de contenido, señales de SEO/velocidad, y la lista de recomendaciones de CRO.
5. Sandy sube (opcional) una captura de la misma landing.
6. Si la imagen es válida, se genera el screenshot anotado: cajas, flechas y números superpuestos sobre la imagen real, cada uno conectado a un punto específico de la lista de recomendaciones.
7. Todo el resultado — análisis y anotado — queda visible en pantalla, con un diseño mobile-first que se ve bien tanto en laptop como en tablet/celular durante la demo.

## Errores y seguridad
- **URL inválida, sitio caído, bloqueado, protegido por login, o con muy poco contenido para analizar:** se muestra un mensaje de error claro explicando por qué no se pudo analizar esa URL. No se muestra un análisis parcial o a medias — en una demo en vivo, un resultado incompleto se ve peor que un error honesto.
- **Imagen no válida** (borrosa, no es un screenshot de landing, formato no soportado): se rechaza con un mensaje claro. El análisis por URL (nivel 1) sigue funcionando normal — la imagen es un extra, nunca un bloqueante.
- **Falla o timeout de la API de Claude:** mensaje de error claro invitando a reintentar, sin dejar a Sandy con una pantalla congelada en medio de la llamada.
- **Datos del cliente:** no se guarda información de las landings analizadas ni de los clientes; no aplica protección de cuentas porque no hay login real ni datos persistentes que proteger.

## Éxito
La v1 funciona si, después de mostrarla en una llamada de venta, se abre una conversación de negocio o propuesta concreta con ese cliente. No se mide por uso recurrente ni por número de análisis corridos — se mide por si convierte el momento de la demo en una oportunidad real.

## V2 (opcional)
Recortado de esta v1 (viene de la Fase 2 y el Backlog del roadmap):
- Repartir mejor las tareas de IA: mover clasificación puntual de elementos visuales a Hugging Face, dejando a Claude solo el razonamiento fino.
- Refinar el análisis con lo aprendido en llamadas de venta reales.
- Pulir la precisión del anotado si en la v1 se nota que falla en casos reales.
- Login decorativo (pantalla de auth que no bloquea acceso), solo si algún cliente pregunta por esa parte del producto.
- Exportar o compartir el resultado (PDF, link) para dejarle algo tangible al cliente después de la llamada.
- Historial de análisis guardados y comparación de varias landings.
- Login real con cuentas de usuario.
- Captura automática de screenshot vía headless browser (descartada salvo cambio de contexto del proyecto).
