# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-09-10

## Estado general

Etapa: implementación de Fase 1 del lector bíblico y datos personales locales.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad esperada: privada.

La versión `0.1.3` quedó integrada y el usuario confirmó en un dispositivo real que un despliegue publicado mostraba `v0.1.3`. Esa versión cerró la composición del Inicio con `Guardados recientes`.

El objetivo activo es `0.1.4`: convertir Favoritos y Notas en funciones reales, locales y navegables desde el Inicio y desde el lector.

## Completado

### Base y reglas

- PWA elegida como plataforma inicial, con enfoque offline-first.
- Repositorio privado y documentación de continuidad, seguridad, UI y entregas establecidos.
- Stack de Fase 1: React + TypeScript + Vite, React Router, IndexedDB + Dexie, `vite-plugin-pwa`, ESLint y GitHub Actions.
- Corpus bíblico separado de datos personales y detrás de un proveedor reemplazable.
- RVR60 sigue siendo la traducción deseada, pero no se incorporará ni redistribuirá contenido sin procedencia y permisos verificables.
- La aplicación puede publicarse para terceros en el futuro, por lo que las licencias del corpus y encabezados son requisito real.

### Lectura bíblica existente

- Inicio compacto, moderno y responsive con `Continuar leyendo`, `Lectura del día` y barra inferior glass.
- Pantalla Biblia con búsqueda rápida de libros y selector de capítulos.
- Lector normal vertical continuo entre capítulos disponibles.
- Títulos/encabezados de sección integrados en el modelo bíblico.
- Última posición persistida con ancla estable de versículo.
- PWA con aviso de actualización y versión visible.
- Contenido ficticio de desarrollo identificado explícitamente como demostración; no es RVR60.

### Versiones publicadas confirmadas

- `0.1.0`: primera base ejecutable.
- `0.1.1`: Inicio móvil compactado y accesos duplicados eliminados.
- `0.1.2`: Inicio visual reforzado y barra inferior glass.
- `0.1.3`: `Guardados recientes` añadido al Inicio; el usuario confirmó un despliegue que mostraba `v0.1.3`.

### Favoritos y Notas 0.1.4 — implementación actual en rama

Rama activa: `feature-favorites-notes-014`.

Implementado:

- IndexedDB/Dexie ampliado con tablas separadas para favoritos y notas bíblicas.
- Guardados basados en referencia estructurada `bookId + capítulo + versículo`, sin copiar el corpus dentro de los datos personales.
- Pantalla completa `Mis favoritos` con lista real, estado vacío, acceso al versículo exacto y opción de quitar favoritos.
- Pantalla completa `Mis notas` con lista real, estado vacío, texto de la nota, contexto bíblico, acceso al versículo exacto y opción de eliminar.
- Tarjeta `Favoritos` del Inicio abre la colección completa y muestra el favorito más reciente cuando existe.
- Tarjeta `Notas` del Inicio abre la colección completa y muestra la nota más reciente cuando existe.
- Eliminadas las vistas previas ficticias de guardados del Inicio; los estados vacíos explican cómo crear el primer dato real.
- En el lector normal, tocar un versículo abre un panel contextual compacto en vez de mostrar controles permanentes.
- Desde ese panel se puede guardar/quitar Favorito y crear/guardar/eliminar una nota asociada al versículo.
- Los enlaces desde Favoritos y Notas vuelven al versículo exacto usando el ancla estable del lector.
- Build visible identificado como `0.1.4`.
- Durante validación, CI detectó un problema de nulabilidad en TypeScript y un import sin uso en lint; ambos fueron corregidos sin desactivar verificaciones.
- El último commit funcional de la rama pasó instalación bloqueada, TypeScript, ESLint, build PWA y auditoría de dependencias en verde.

## Objetivo activo

Cerrar, integrar, desplegar y verificar `0.1.4 — Favoritos y Notas reales`.

No abrir todavía resaltados, búsqueda bíblica completa, lector capítulo por capítulo, prédicas, sincronización, fondos o personalizaciones avanzadas hasta cerrar esta entrega.

## Decisiones de producto futuras ya registradas, pero no abiertas todavía

- Resaltados bíblicos y su comportamiento visual.
- Diseño exacto de `versículos corridos` y `versículos separados`.
- Compartir versículos con imágenes/fondos y su flujo visual completo.
- Fondos seleccionables dentro de la aplicación.
- Temas adicionales además de día/noche.
- Personalizaciones de lectura y apariencia.
- Diseño exacto del indicador temporal al volver del lector capítulo por capítulo.
- Implementación y controles definitivos del lector temporal capítulo por capítulo.
- Editor de prédicas y posible escritura/dibujo con stylus cuando llegue su fase.

No hacer preguntas detalladas sobre estos puntos hasta llegar a su fase correspondiente.

## Decisiones técnicas aún abiertas

- Fuente y formato definitivo del corpus bíblico autorizado.
- Diseño final de sincronización opcional con Google Drive.
- Editor definitivo de prédicas cuando llegue esa fase.
- Si se implementará o no la pantalla de congregación al final del proyecto.
- Proveedor definitivo de despliegue a largo plazo; el host de prueba no debe crear dependencia arquitectónica.

## Restricción de contenido para desarrollo

Hasta contar con una fuente autorizada para el contenido definitivo, se trabaja con datos ficticios o una fuente legal de prueba. Los favoritos y notas guardan referencias estructuradas y datos personales, no copias acopladas del corpus, para poder sustituir la traducción sin romper las referencias.

## Siguiente paso inmediato

1. Registrar la decisión de Favoritos y Notas reales y actualizar changelog.
2. Exigir nuevamente CI verde sobre el commit final de la rama.
3. Revisar diferencias contra `main` para descartar basura o cambios no relacionados.
4. Abrir PR y exigir CI verde sobre integración.
5. Fusionar solo si todo queda verde.
6. Confirmar CI verde y artefacto exacto de `main`.
7. Desplegar `0.1.4`.
8. Verificar que la versión publicada muestra `v0.1.4` y las rutas internas funcionan.
9. Pedir al usuario actualizar la PWA antes de probar Favoritos y Notas.

## Después de 0.1.4

El siguiente objetivo funcional previsto es la búsqueda bíblica completa por palabras/frases. Después se retomará el lector capítulo por capítulo ya aprobado, salvo que una revisión real de `0.1.4` revele una corrección prioritaria.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.
