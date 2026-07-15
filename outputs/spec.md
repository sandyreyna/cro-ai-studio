# Spec: Landing Page Reviewer (CRO AI Studio) — v1
Fecha: 2026-07-12
Actualizado: 2026-07-13 — ver "Nota de actualización" abajo.

## Nota de actualización (2026-07-13)
La v1 se construyó siguiendo este spec tal cual, incluyendo la carga de screenshot con anotado (cajas/números sobre la imagen real vía Claude Vision). Al probarlo con capturas de página completa (full-page, muy altas), la precisión de las coordenadas que devolvía el modelo se degradaba notablemente — un hallazgo de arriba de la página podía terminar marcado abajo del todo. En vez de mantener una feature con esa falla en una herramienta que se usa en vivo frente a un cliente, se reemplazó la carga de imagen por un **wireframe generado por IA**: en la misma llamada a Claude que produce las recomendaciones, se genera también un boceto de cómo se vería la landing si se aplicaran esos cambios (copy nuevo, respetando el color de marca real detectado del sitio). El resto del spec queda vigente; las secciones que mencionan la carga de imagen quedan documentadas abajo tal como estaban, marcadas como reemplazadas.

## Overview
Herramienta que analiza una landing page y entrega recomendaciones de CRO, pensada como pieza de portafolio de Mindtech Solutions. Sandy la usa en vivo durante llamadas de venta: pega la URL del cliente y ve en pantalla el análisis junto con un wireframe generado por IA de cómo se vería la landing mejorada. El objetivo no es uso recurrente ni monetización — es generar una reacción fuerte en el momento y abrir conversaciones de negocio.

## Usuarios objetivo
Sandy, en llamada de venta frente a un cliente potencial. Sandy es quien pega la URL y opera la herramienta; el cliente es quien la ve y reacciona. Hoy ese momento de la llamada no existe — se resuelve con capturas de pantalla sueltas o comentarios verbales sin nada visual que lo respalde.

## Alcance

### La v1 SÍ hace
1. **Análisis estructural por URL**: el usuario pega una URL (obligatoria) y recibe un análisis de copy, CTAs, jerarquía de contenido y señales de SEO/velocidad, junto con una lista de recomendaciones de CRO generadas por Claude.
2. **Wireframe generado por IA de la versión mejorada** *(reemplaza la carga de imagen + screenshot anotado del plan original — ver Nota de actualización)*: en la misma llamada a Claude, se genera un boceto de cómo se vería la landing si se aplicaran las recomendaciones de mayor impacto, con copy nuevo y el color de marca real del sitio (detectado automáticamente del CSS/favicon). Cada hallazgo de la lista queda conectado a la sección del wireframe que lo resuelve (nav, hero, features, prueba social, CTA, footer), con hover/click sincronizado en ambos sentidos.
3. **Interfaz vistosa, animada y mobile-first** que empaqueta todo el flujo — pensada para verse bien en el momento de una demo en vivo, no solo funcionar.

### La v1 NO hace
- Login real ni cuentas de usuario.
- Carga de imagen por parte del usuario: descartada tras la Nota de actualización — el wireframe generado reemplaza esa capa visual sin depender de que el usuario suba nada.
- Captura automática de screenshot (headless browser): se evaluó explícitamente (ver Backlog) y se descartó por el mismo motivo original (riesgo técnico) más el hallazgo de precisión de coordenadas.
- Anotado sobre imagen real (cajas/números superpuestos vía Claude Vision): era el enfoque de la v1 original: funcionaba bien con capturas de un solo viewport, pero perdía precisión con capturas full-page. Reemplazado por el wireframe.
- Guardar historial de análisis anteriores.
- Comparar varias landings al mismo tiempo.
- Exportar o compartir el resultado (PDF, link, descarga): el resultado vive solo en pantalla durante la demo.
- Dashboards o analítica de uso.

## Comportamiento esperado
1. Sandy abre la herramienta en su laptop/tablet al inicio o durante la llamada de venta.
2. Pega la URL de la landing del cliente en el campo obligatorio y confirma.
3. Mientras se procesa, ve una animación de carga vistosa; el análisis se siente casi instantáneo (objetivo: bajo ~15-20 segundos) para no perder el ritmo de la conversación.
4. Aparece el análisis estructural en pantalla: copy, CTAs, jerarquía de contenido, señales de SEO/velocidad, y la lista de recomendaciones de CRO — junto con el wireframe generado de la versión mejorada, en la misma respuesta (no hay un paso separado de subir nada).
5. Pasar el cursor (o tocar en móvil) un hallazgo de la lista resalta la sección correspondiente del wireframe, y viceversa.
6. Todo el resultado — análisis y wireframe — queda visible en pantalla, con un diseño mobile-first que se ve bien tanto en laptop como en tablet/celular durante la demo.

## Errores y seguridad
- **URL inválida, sitio caído, bloqueado, protegido por login, o con muy poco contenido para analizar:** se muestra un mensaje de error claro explicando por qué no se pudo analizar esa URL. No se muestra un análisis parcial o a medias — en una demo en vivo, un resultado incompleto se ve peor que un error honesto.
- **Falla o timeout de la API de Claude:** mensaje de error claro invitando a reintentar, sin dejar a Sandy con una pantalla congelada en medio de la llamada.
- **Datos del cliente:** no se guarda información de las landings analizadas ni de los clientes; no aplica protección de cuentas porque no hay login real ni datos persistentes que proteger.

## Éxito
La v1 funciona si, después de mostrarla en una llamada de venta, se abre una conversación de negocio o propuesta concreta con ese cliente. No se mide por uso recurrente ni por número de análisis corridos — se mide por si convierte el momento de la demo en una oportunidad real.

## V2 (opcional)
Recortado de esta v1 (viene de la Fase 2 y el Backlog del roadmap):
- Repartir mejor las tareas de IA: mover clasificación puntual de elementos visuales a Hugging Face, dejando a Claude solo el razonamiento fino.
- Refinar el análisis con lo aprendido en llamadas de venta reales.
- Pulir el copy y la fidelidad del wireframe generado si en la v1 se nota que se aleja del tono real de marca en casos reales.
- Login decorativo (pantalla de auth que no bloquea acceso), solo si algún cliente pregunta por esa parte del producto.
- Exportar o compartir el resultado (PDF, link) para dejarle algo tangible al cliente después de la llamada.
- Historial de análisis guardados y comparación de varias landings.
- Login real con cuentas de usuario.
- Captura automática de screenshot vía headless browser (descartada — ver Nota de actualización).
- Retomar el anotado sobre imagen real subida por el usuario, solo si se resuelve la precisión de coordenadas en capturas full-page (ej. dividiendo la imagen en franjas antes de mandarla a Claude Vision).
