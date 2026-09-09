# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-09-09

## Estado general

Etapa: implementación de Fase 1 y ajuste visual de la primera entrega ejecutable.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad esperada: privada.

La primera base ejecutable `0.1.0` está integrada en `main`, pasó todas las verificaciones de CI y fue publicada. El enlace público abrió correctamente en un dispositivo del usuario y permitió obtener la primera revisión visual real.

A partir de esa revisión se prepara la versión `0.1.1`, enfocada únicamente en compactar la pantalla Inicio en móvil y eliminar accesos duplicados que ya existen en la barra de navegación inferior.

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
- Pantalla Inicio implementada con `Continuar leyendo` y `Lectura del día` de demostración.
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
- La publicación `0.1.0` fue accesible desde el enlace público y recibió revisión visual real del usuario.

### Ajuste visual 0.1.1 en preparación

- Eliminada de Inicio la portada/hero grande que ocupaba demasiado espacio en móvil.
- Eliminada la sección de accesos `Biblia / Prédicas / Buscar` dentro del contenido de Inicio porque duplicaba la barra inferior.
- Inicio reducido a sus dos elementos esenciales: `Continuar leyendo` y `Lectura del día`.
- Compactados en móvil encabezado, tarjetas, botones y barra inferior para priorizar una sola pantalla en móviles comunes con tamaño de texto normal.
- Se mantiene scroll disponible para pantallas especialmente pequeñas, zoom o accesibilidad; no se recorta contenido.
- Eliminados estilos huérfanos de la portada y de los accesos retirados.
- Build identificado como `0.1.1`.
- Primera validación de rama pasó `npm ci`, TypeScript, ESLint, build PWA y auditoría de dependencias en verde.

## Objetivo activo

Cerrar y publicar el ajuste visual `0.1.1` del Inicio sin abrir funciones nuevas.

No abrir todavía editor de prédicas, sincronización, personalizaciones avanzadas ni otros módulos posteriores.

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
- Proveedor definitivo de despliegue para etapas posteriores; el host de prueba no debe crear dependencia arquitectónica.

## Restricción de contenido para desarrollo

Como la aplicación puede publicarse en el futuro, no se debe construir Fase 1 alrededor de un corpus o títulos editoriales con derechos no verificados.

Hasta contar con una fuente autorizada para el contenido definitivo, se desarrolla con datos ficticios o una fuente legal adecuada para pruebas, manteniendo el modelo preparado para sustituir el corpus sin romper referencias ni datos personales.

## Siguiente paso

1. Completar documentación del ajuste visual `0.1.1`.
2. Exigir CI verde sobre el commit final de la rama.
3. Abrir PR contra `main` y exigir nuevamente CI verde.
4. Integrar solo si todas las verificaciones pasan.
5. Confirmar CI verde y artefacto en `main`.
6. Desplegar `0.1.1`.
7. Verificar que el enlace publicado carga y muestra versión `0.1.1`.
8. Pedir al usuario actualizar la PWA antes de revisar el nuevo Inicio.

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
