# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-09-09

## Estado general

Etapa: implementación de Fase 1 y ajuste visual de la primera entrega ejecutable.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad esperada: privada.

La versión `0.1.2` fue integrada en `main`, pasó CI y el usuario confirmó visualmente en móvil que un despliegue específico servía `v0.1.2`. Esa versión introdujo el Inicio visual compacto y la barra inferior glass.

A partir de la revisión real del usuario se prepara `0.1.3`, centrada únicamente en aprovechar el espacio libre del Inicio mediante una sección compacta `Guardados recientes`, sin abrir todavía la función completa de favoritos/notas ni romper la regla de evitar scroll vertical innecesario en móvil.

## Completado

### Definición y reglas

- Objetivo y alcance general definidos.
- PWA elegida como plataforma inicial.
- Repositorio privado creado.
- Sistema de continuidad entre chats definido mediante `AGENTS.md`.
- Reglas de cero basura, privacidad, interfaz, documentación y entregas establecidas.
- Desarrollo secuencial definido: un objetivo activo a la vez, con cierre, prueba, limpieza y documentación antes de avanzar.
- Protocolo de preguntas al usuario definido para pedir solo decisiones con impacto real.
- Dirección visual moderna, clara y responsive establecida como regla obligatoria desde la primera entrega.
- Posible distribución pública futura aprobada; licencias/permisos del contenido bíblico se tratan como requisito real.
- Stack técnico mínimo de Fase 1 cerrado: React + TypeScript + Vite, React Router, IndexedDB + Dexie, `vite-plugin-pwa`, TypeScript/ESLint y GitHub Actions.
- Dirección visual glass para navegación inferior aprobada mediante D-026, preparada para convivir con futuros temas/fondos sin implementar todavía el selector de fondos.
- D-027 aprueba mostrar `Guardados recientes` de forma compacta en Inicio y exige que cualquier muestra previa a la función real se identifique claramente como demostración.

### Base ejecutable de Fase 1

- Proyecto React + TypeScript + Vite inicializado.
- Dependencias bloqueadas mediante `package-lock.json` reproducible.
- PWA configurada con manifiesto, service worker/Workbox, limpieza de cachés antiguas y estrategia de actualización por aviso.
- Aviso `Nueva versión disponible` con acción `Actualizar ahora`; no hay recarga automática silenciosa.
- Navegación base implementada: Inicio, Biblia y rutas preparadas para áreas posteriores sin implementar su lógica antes de tiempo.
- Pantalla Biblia implementada con búsqueda rápida de libros por nombre.
- Selector de capítulos implementado en cuadrícula y preparado para destacar el último capítulo leído.
- Lector normal vertical implementado con continuidad entre los capítulos disponibles del libro.
- Modelo bíblico implementado con traducción, libro, capítulo, sección/título y versículo.
- Contenido bíblico detrás de un proveedor reemplazable para sustituir la muestra sin acoplar el resto de la aplicación.
- Muestra ficticia explícita incluida; no contiene RVR60 ni pretende reproducir otra traducción.
- Persistencia local con IndexedDB/Dexie implementada para última lectura, capítulo y ancla de versículo.
- Restauración de lectura basada en ancla estable de versículo en vez de depender solo de píxeles de scroll.
- Diseño base responsive implementado con tokens CSS centralizados, navegación adaptativa y soporte `prefers-reduced-motion`.
- CI permanente configurado con `npm ci`, TypeScript, ESLint, build PWA y auditoría de dependencias.
- PR #1 de la base ejecutable pasó CI y fue integrado mediante squash en `main`.
- PR #2 añadió retención del `dist/` verificado de `main` y fallback SPA para despliegue; también pasó CI y fue integrado.
- PR #3 integró `0.1.1`: eliminó la portada grande, retiró accesos duplicados y compactó Inicio/barra inferior en móvil.
- PR #4 integró `0.1.2`: encabezado compacto, tarjetas con mayor presencia visual, iconos SVG y navegación inferior glass.
- El usuario confirmó en un teléfono que el despliegue específico de `0.1.2` mostraba `v0.1.2`.

### Ajuste visual 0.1.3 en preparación

- Añadida al Inicio una sección compacta `Guardados recientes` debajo de `Lectura del día`.
- La muestra usa dos vistas previas (`Favorito` y `Nota`) tomadas del corpus ficticio de desarrollo y está marcada explícitamente como `Demostración`; no pretende representar datos personales reales.
- Cada tarjeta muestra tipo de guardado, referencia y una vista previa corta del texto, y permite abrir el contexto bíblico correspondiente.
- Los estilos de esta sección viven en un archivo propio del módulo Inicio para mantener modularidad y evitar ampliar innecesariamente el CSS global.
- En móviles comunes se muestran dos tarjetas compactas; en pantallas de poca altura se reducen primero subtítulos, líneas de texto y altura de tarjetas antes de necesitar scroll.
- En tablet/PC la sección ocupa el ancho completo debajo de las dos tarjetas principales de Inicio.
- Build identificado como `0.1.3`.
- La rama `ui-home-saved-013` pasó `npm ci`, TypeScript, ESLint, build PWA y auditoría de dependencias en verde.

## Objetivo activo

Cerrar, integrar, publicar y verificar `0.1.3` sin abrir todavía la función completa de guardados.

No abrir editor de prédicas, sincronización, selector de fondos, personalizaciones avanzadas ni otros módulos posteriores dentro de este ajuste.

## En evaluación

- Permitir en el editor combinar texto escrito con teclado y bloques de escritura/dibujo con lápiz o stylus en teléfono/tablet. Esta idea todavía no está aprobada como requisito definitivo.

## Decisiones de producto futuras ya registradas, pero no abiertas todavía

- Implementación completa de favoritos, resaltados y notas; cuando exista, `Guardados recientes` deberá usar esos datos reales.
- Diseño exacto de los modos de disposición `versículos corridos` y `versículos separados`.
- Diseño y flujo completo de compartir versículos con imágenes/fondos.
- Fondos o estilos visuales seleccionables dentro de la aplicación.
- Temas adicionales además de día/noche.
- Personalizaciones de lectura y apariencia.
- Diseño exacto del indicador temporal al volver del lector capítulo por capítulo.
- Implementación y controles definitivos del lector temporal capítulo por capítulo.

No hacer preguntas detalladas sobre estos puntos hasta llegar a su fase correspondiente.

## Decisiones técnicas aún abiertas

- Fuente y formato definitivo del corpus bíblico autorizado.
- Diseño final de sincronización con Google Drive.
- Editor definitivo de prédicas cuando llegue esa fase.
- Si se implementará o no la pantalla de congregación al final del proyecto.
- Proveedor definitivo de despliegue para etapas posteriores; el host de prueba no debe crear dependencia arquitectónica.

## Restricción de contenido para desarrollo

Como la aplicación puede publicarse en el futuro, no se debe construir Fase 1 alrededor de un corpus o títulos editoriales con derechos no verificados.

Hasta contar con una fuente autorizada para el contenido definitivo, se desarrolla con datos ficticios o una fuente legal adecuada para pruebas, manteniendo el modelo preparado para sustituir el corpus sin romper referencias ni datos personales.

## Siguiente paso

1. Exigir CI verde sobre el commit final de `0.1.3`.
2. Abrir PR contra `main` y exigir nuevamente CI verde.
3. Integrar solo si todas las verificaciones pasan.
4. Confirmar CI verde y artefacto en `main`.
5. Desplegar `0.1.3`.
6. Verificar que el enlace publicado carga y muestra versión `0.1.3`.
7. Pedir al usuario actualizar antes de revisar `Guardados recientes`.

## Fase 1 pendiente

Objetivo: obtener una Biblia instalable, rápida y usable offline.

Pendiente después de cerrar este ajuste visual:

- verificar funcionamiento offline desde una versión instalada;
- verificar en navegador real el aviso y proceso de actualización entre versiones;
- ampliar el corpus únicamente cuando exista fuente legal/autorizada apropiada;
- completar las siguientes funciones del lector en su orden aprobado, sin mezclarlas en este ajuste.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.
