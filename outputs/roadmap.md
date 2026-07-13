# Roadmap: Landing Page Reviewer (CRO AI Studio)
Fecha: 2026-07-12

## La idea en una frase
Herramienta de IA que analiza una landing page (URL + screenshot opcional) y entrega recomendaciones de CRO, pensada como pieza de portafolio para que Sandy la use en llamadas de venta con clientes potenciales de Mindtech.

## La acción core
Pegar la URL de una landing y recibir recomendaciones de CRO generadas por Claude. Todo lo demás — la imagen, el anotado, el diseño — existe para hacer esa acción más rica o más vistosa, no para reemplazarla.

## Fase 1 — Lanzamiento

| # | Feature | Por qué va primero | Depende de |
|---|---------|--------------------|------------|
| 1 | Prueba de validación: correr una landing real por Claude (texto + screenshot) y confirmar que la calidad del análisis aguanta | Es la apuesta de la que depende todo el proyecto. Si Claude no produce un análisis lo bastante bueno sobre un screenshot, no vale la pena construir la interfaz alrededor — mejor descubrirlo en un día que en la semana 3 | — |
| 2 | Análisis estructural por URL: copy, CTAs, jerarquía de contenido, señales de SEO/velocidad, con lista de recomendaciones de CRO | Es la acción core. Sin esto no hay producto, todo lo demás lo complementa | #1 |
| 3 | Carga de imagen + screenshot anotado (cajas, flechas, números) conectado uno a uno con la lista de recomendaciones | Ya se decidió lanzar con ambos niveles desde el día 1 — es la pieza más "demo-able" en una llamada de venta, el momento en que el cliente ve su propia landing marcada | #2 |
| 4 | Interfaz vistosa, animada y mobile-first que empaqueta el flujo (input de URL → resultados → anotado) | Sandy la muestra en vivo frente al cliente; la primera impresión visual pesa tanto como la calidad del análisis en ese contexto | #2, #3 |

**Nota sobre el costo de este alcance:** lanzar con ambos niveles desde el día 1 (en vez de solo nivel 1) es una decisión consciente de meter más features en la Fase 1 porque el caso de uso — demo en vivo — necesita el momento "wow" del anotado para funcionar. El costo es una fecha de lanzamiento más lejana que si se hubiera lanzado solo con el análisis por URL.

## Fase 2 — Mejora

- **Repartir mejor las tareas de IA:** mover clasificación puntual de elementos visuales (donde no se necesita razonamiento fino) a Hugging Face, dejando a Claude solo lo que realmente lo justifica. Se decide con datos reales de la Fase 1, no antes.
- **Refinar el análisis con lo aprendido en llamadas de venta:** ajustar qué tipo de recomendaciones resuenan más con clientes reales, una vez que Sandy la haya usado varias veces en vivo.
- **Pulir la precisión del anotado** (posicionamiento de cajas/flechas, legibilidad en distintos tamaños de screenshot) si en la Fase 1 se nota que falla en casos reales.
- **Login decorativo:** agregar la pantalla de auth que no bloquea acceso, solo si en algún momento se necesita mostrar que el diseño de login existe (ej. para un cliente que pregunta por esa parte del producto).

## Backlog

- **Login real con cuentas de usuario:** no aporta al objetivo de portafolio/demo; agregaría fricción y tiempo de desarrollo sin acercar a nadie a la acción core.
- **Captura automática de screenshot vía headless browser:** ya descartada explícitamente en el brief — anti-bot, contenido con scroll y JS pesado no valen el riesgo para un MVP de una sola persona. Subir imagen manualmente sigue siendo la vía.
- **Imagen generada por IA en vez de anotado sobre screenshot real:** descartada — los modelos de generación de imagen todavía fallan con texto preciso y layouts de UI, y en CRO la precisión importa más que el efecto visual.
- **Dashboards de uso/analítica de retención:** el objetivo no es uso recurrente, es impacto en la conversación de venta — construir esto sería optimizar una métrica que no importa en esta fase.

## Siguiente paso
Convertir la Fase 1 en spec con /crear-specs, usando este roadmap como contexto.
