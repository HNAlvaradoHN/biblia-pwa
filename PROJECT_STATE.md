# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-09-09

## Estado general

Etapa: implementación de Fase 1 y cierre de la primera entrega ejecutable.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad esperada: privada.

La primera base ejecutable `0.1.0` ya está integrada en `main` y sus verificaciones están en verde. Se creó un despliegue de producción para esta versión, pero todavía NO debe presentarse al usuario como `Lista para probar` porque falta verificar desde fuera que el despliegue terminó correctamente y sirve la versión esperada.

El bloqueo actual es externo: el conector de Vercel utilizado para consultar/verificar el despliegue no tiene autorización sobre el mismo scope/equipo donde el propio despliegue fue creado. `RELEASE_RULES.md` obliga a resolver esa verificación antes de entregar el enlace como listo.

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

### Base ejecutable de Fase 1

- Proyecto React + TypeScript + Vite inicializado.
- Dependencias bloqueadas mediante `package-lock.json` reproducible.
- PWA configurada con manifiesto, service worker/Workbox, limpieza de cachés antiguas y estrategia de actualización por aviso.
- Versión inicial `0.1.0` visible en la aplicación.
- Aviso `Nueva versión disponible` con acción `Actualizar ahora`; no hay recarga automática silenciosa.
- Navegación base implementada: Inicio, Biblia y rutas preparadas para áreas posteriores sin implementar su lógica antes de tiempo.
- Pantalla Inicio implementada con `Continuar leyendo`, `Lectura del día` de demostración y accesos principales.
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
- `main` volvió a pasar todas las verificaciones después del merge de la base.
- PR #2 añadió retención del `dist/` verificado de `main` y fallback SPA para despliegue; también pasó CI y fue integrado.
- Commit de entrega actual en `main`: `7fdf73867de2d12c88fad62e8675de5fadce6b20`.
- CI de ese commit quedó en verde y conservó el artefacto `biblia-pwa-dist`, generado por el mismo build verificado.
- Digest del artefacto verificado: `sha256:2219827e137032cd028d66bd9830e6b9ecbc86e71dc7b32edb0c2139a53c5481`.
- Se solicitó despliegue de producción en Vercel usando ese artefacto exacto, sin reconstruir la aplicación con dependencias distintas.

## Objetivo activo

Cerrar la entrega `0.1.0` verificando la publicación real antes de comunicar `✅ Lista para probar`.

No abrir todavía editor de prédicas, sincronización, personalizaciones avanzadas ni otros módulos posteriores.

### Bloqueo externo actual

- El despliegue de producción fue creado con ID `dpl_9TaQQG4nECpfKRYcGTTNju72NqKq` y alias previsto `biblia-pwa-geovaalvarado0-2860.vercel.app`.
- Las herramientas de lectura/verificación de Vercel responden `403 Forbidden` porque la conexión actual no está autorizada para el scope `geovaalvarado0-2860` / equipo `team_OxT7ZRrQ8lO1KbkGg9ZpTVvb`.
- El entorno de ejecución disponible tampoco puede hacer una comprobación HTTP independiente porque su resolución DNS externa está bloqueada.
- Por lo tanto, el despliegue está creado pero NO se considera todavía verificado ni listo para entregar.

## En evaluación

- Permitir en el editor combinar texto escrito con teclado y bloques de escritura/dibujo con lápiz o stylus en teléfono/tablet. Esta idea todavía no está aprobada como requisito definitivo.

## Decisiones de producto futuras ya registradas, pero no abiertas todavía

- Diseño exacto de los modos de disposición `versículos corridos` y `versículos separados`.
- Diseño y flujo completo de compartir versículos con imágenes/fondos.
- Fondos o estilos visuales dentro de la aplicación.
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
- Proveedor definitivo de despliegue para etapas posteriores; el primer host de prueba no debe crear dependencia arquitectónica.

## Restricción de contenido para desarrollo

Como la aplicación puede publicarse en el futuro, no se debe construir Fase 1 alrededor de un corpus o títulos editoriales con derechos no verificados.

Hasta contar con una fuente autorizada para el contenido definitivo, se desarrolla con datos ficticios o una fuente legal adecuada para pruebas, manteniendo el modelo preparado para sustituir el corpus sin romper referencias ni datos personales.

## Siguiente paso

1. Restablecer/autorizAR la conexión de Vercel para el scope donde se creó `biblia-pwa`.
2. Verificar que el despliegue terminó en estado correcto.
3. Abrir la raíz publicada y comprobar que carga la aplicación.
4. Abrir directamente una ruta interna como `/biblia` y comprobar el fallback SPA.
5. Confirmar que la aplicación publicada muestra versión `0.1.0` y que manifiesto/service worker son accesibles.
6. Solo después comunicar `✅ Lista para probar` y pedir al usuario actualizar antes de probar si ya tenía la PWA abierta/instalada.

## Fase 1 pendiente

Objetivo: obtener una Biblia instalable, rápida y usable offline.

Pendiente después de cerrar esta primera entrega:

- verificar funcionamiento offline desde una versión realmente desplegada/instalada;
- verificar en navegador real el aviso y proceso de actualización entre versiones;
- ampliar el corpus únicamente cuando exista fuente legal/autorizada apropiada;
- completar las siguientes funciones del lector en su orden aprobado, sin mezclarlas en este bootstrap.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.
