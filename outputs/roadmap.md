# Roadmap: Landing Page Reviewer (CRO AI Studio)
Fecha: 2026-07-12
Actualizado: 2026-07-13

## Nota de actualización (2026-07-13)
La Fase 1 se lanzó tal como estaba planeada acá, incluyendo la carga de imagen + screenshot anotado (#3 de la tabla de abajo). Al validarlo con capturas de página completa (full-page, muy altas), la precisión de las coordenadas que devolvía Claude Vision se degradaba — un hallazgo de arriba de la página podía terminar marcado abajo del todo. Se decidió no lanzar una feature con ese nivel de falla en una herramienta pensada para usarse en vivo frente a un cliente, así que se reemplazó el ítem #3 por: **generar un wireframe de la versión mejorada de la landing** (copy nuevo por sección, con el color de marca real del sitio) en la misma llamada a Claude que produce las recomendaciones — mismo objetivo (momento "wow", conectado 1 a 1 con la lista de hallazgos), sin depender de que un modelo de visión adivine una posición en píxeles. La tabla de Fase 1 y el Backlog quedan actualizados abajo para reflejar esto; el resto del roadmap no cambió.

## La idea en una frase
Herramienta de IA que analiza una landing page por URL y entrega recomendaciones de CRO junto con un wireframe generado de cómo se vería mejorada, pensada como pieza de portafolio para que Sandy la use en llamadas de venta con clientes potenciales de Mindtech.

## La acción core
Pegar la URL de una landing y recibir recomendaciones de CRO generadas por Claude. Todo lo demás — el wireframe, el diseño — existe para hacer esa acción más rica o más vistosa, no para reemplazarla.

## Fase 1 — Lanzamiento

| # | Feature | Por qué va primero | Depende de |
|---|---------|--------------------|------------|
| 1 | Prueba de validación: correr una landing real por Claude (texto + screenshot) y confirmar que la calidad del análisis aguanta | Es la apuesta de la que depende todo el proyecto. Si Claude no produce un análisis lo bastante bueno, no vale la pena construir la interfaz alrededor — mejor descubrirlo en un día que en la semana 3 | — |
| 2 | Análisis estructural por URL: copy, CTAs, jerarquía de contenido, señales de SEO/velocidad, con lista de recomendaciones de CRO | Es la acción core. Sin esto no hay producto, todo lo demás lo complementa | #1 |
| 3 | ~~Carga de imagen + screenshot anotado~~ → **Wireframe generado por IA de la versión mejorada**, conectado uno a uno con la lista de recomendaciones (ver Nota de actualización) | Sigue siendo la pieza más "demo-able" en una llamada de venta — el momento en que el cliente ve cómo se vería su landing arreglada — pero generado por Claude en vez de depender de una imagen subida y coordenadas de visión poco confiables | #2 |
| 4 | Interfaz vistosa, animada y mobile-first que empaqueta el flujo (input de URL → resultados → wireframe) | Sandy la muestra en vivo frente al cliente; la primera impresión visual pesa tanto como la calidad del análisis en ese contexto | #2, #3 |

**Nota sobre el costo de este alcance:** lanzar con ambos niveles desde el día 1 (en vez de solo nivel 1) es una decisión consciente de meter más features en la Fase 1 porque el caso de uso — demo en vivo — necesita el momento "wow" para funcionar. El costo es una fecha de lanzamiento más lejana que si se hubiera lanzado solo con el análisis por URL.

## Fase 2 — Mejora

- **Repartir mejor las tareas de IA:** mover clasificación puntual de elementos visuales (donde no se necesita razonamiento fino) a Hugging Face, dejando a Claude solo lo que realmente lo justifica. Se decide con datos reales de la Fase 1, no antes.
- **Refinar el análisis con lo aprendido en llamadas de venta:** ajustar qué tipo de recomendaciones resuenan más con clientes reales, una vez que Sandy la haya usado varias veces en vivo.
- **Pulir la fidelidad del wireframe generado** (tono de marca, variedad de layouts por sección) si en la Fase 1 se nota que se siente genérico en casos reales.
- **Login decorativo:** agregar la pantalla de auth que no bloquea acceso, solo si en algún momento se necesita mostrar que el diseño de login existe (ej. para un cliente que pregunta por esa parte del producto).

## Backlog

- **Login real con cuentas de usuario:** no aporta al objetivo de portafolio/demo; agregaría fricción y tiempo de desarrollo sin acercar a nadie a la acción core.
- **Captura automática de screenshot vía headless browser:** ya descartada explícitamente en el brief — anti-bot, contenido con scroll y JS pesado no valen el riesgo para un MVP de una sola persona.
- **Carga manual de imagen + anotado sobre screenshot real:** era el plan original de la Fase 1 (#3), reemplazado por el wireframe generado tras encontrar el problema de precisión de coordenadas en capturas full-page. Queda en backlog por si se resuelve la precisión (ej. dividiendo la imagen en franjas) y vuelve a tener sentido como complemento del wireframe.
- **Dashboards de uso/analítica de retención:** el objetivo no es uso recurrente, es impacto en la conversación de venta — construir esto sería optimizar una métrica que no importa en esta fase.

## Siguiente paso
Convertir la Fase 1 en spec con /crear-specs, usando este roadmap como contexto.
