# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-09-09

## Estado general

Etapa: implementación de Fase 1.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad esperada: privada.

Existe una primera base ejecutable de la aplicación en proceso de integración. Todavía no debe presentarse al usuario como `Lista para probar` hasta completar merge, despliegue y verificación publicada según `RELEASE_RULES.md`.

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
- CI permanente preparado para `npm ci`, TypeScript, ESLint, build PWA y auditoría de dependencias.
- Bootstrap técnico ejecutado en GitHub Actions con instalación, typecheck, lint, build y auditoría en verde antes de abrir integración.

## Objetivo activo

Completar la primera entrega ejecutable de Fase 1: integrar la base en `main`, desplegarla mediante un flujo de prueba reemplazable y verificar que la versión publicada carga correctamente antes de declararla lista para probar.

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
- Proveedor definitivo de despliegue para etapas posteriores; el primer host de prueba no debe crear dependencia arquitectónica.

## Restricción de contenido para desarrollo

Como la aplicación puede publicarse en el futuro, no se debe construir Fase 1 alrededor de un corpus o títulos editoriales con derechos no verificados.

Hasta contar con una fuente autorizada para el contenido definitivo, se desarrolla con datos ficticios o una fuente legal adecuada para pruebas, manteniendo el modelo preparado para sustituir el corpus sin romper referencias ni datos personales.

## Siguiente paso

1. Abrir PR de la base de Fase 1 contra `main`.
2. Exigir CI verde sobre el PR usando instalación desde `package-lock.json`.
3. Integrar solo si todas las verificaciones pasan.
4. Verificar nuevamente CI sobre `main`.
5. Desplegar la versión `0.1.0` para prueba.
6. Comprobar la aplicación publicada y su versión antes de comunicar `✅ Lista para probar`.

## Fase 1 pendiente

Objetivo: obtener una Biblia instalable, rápida y usable offline.

Pendiente después de este bootstrap:

- verificar funcionamiento offline desde una versión realmente desplegada/instalada;
- verificar en navegador real el aviso y proceso de actualización entre versiones;
- ampliar el corpus únicamente cuando exista fuente legal/autorizada apropiada;
- completar las siguientes funciones del lector en su orden aprobado, sin mezclarlas en este bootstrap.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.
