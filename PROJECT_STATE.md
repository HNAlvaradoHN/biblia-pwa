# PROJECT_STATE.md — ESTADO OPERATIVO

Última actualización: 2026-10-03

## Fuente de verdad y alcance de este archivo

Este archivo contiene únicamente memoria operativa necesaria para continuar el proyecto. Las reglas permanentes viven en `AGENTS.md`, `SECURITY.md`, `UI_RULES.md` y `RELEASE_RULES.md`; no se duplican aquí.

La historia completa previa a esta compactación se conserva en `docs/history/PROJECT_STATE_2026-10-03_PRE_COMPACTION.md`. Las decisiones antiguas completas y changelog histórico también están archivados en `docs/history/`.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`, público por autorización explícita del dueño.

## Estado actual

- Plataforma: PWA offline-first.
- Stack vigente: React + TypeScript + Vite, React Router, IndexedDB/Dexie, `vite-plugin-pwa`, ESLint y GitHub Actions.
- Publicación principal: GitHub Pages. Vercel es respaldo opcional.
- Producción confirmada: **v0.1.32**.
- Corpus definitivo: **pendiente de fuente/licencia autorizada**. RVR60 sigue siendo la traducción deseada, pero no se redistribuye sin derechos verificables.
- Datos personales: locales al dispositivo; no se versionan ni publican.
- Sincronización remota/multidispositivo: todavía no implementada.

## Funcionalidad estable ya disponible

### Biblia y lectura
- Inicio con continuidad de lectura y guardados recientes.
- Selector de libros/capítulos y búsqueda bíblica.
- Lector continuo y modos enfocados.
- Versículos separados o corridos.
- Favoritos, notas, resaltados, copiar, compartir y selección múltiple.
- Temas curados, tipografía/tamaño y menús móviles/contextuales.

### Prédicas
- Lista `Mis prédicas`.
- Crear, buscar, abrir, autosave local, duplicar, archivar/restaurar y eliminar con confirmación.
- Campos actuales: título, Introducción, Bosquejo/puntos y Conclusión.
- Referencias bíblicas inline, vista rápida y lectura bíblica enfocada.
- Modo Predicación de solo lectura con navegación general oculta.
- `Leer capítulo` desde Modo Predicación y retorno semántico hacia la referencia de origen.
- Intento de Screen Wake Lock durante Modo Predicación cuando la plataforma lo soporta.

## Estado real del editor de Prédicas

Producción `0.1.28` ya usa estructura interna por bloques con autosave incremental y adjuntos de imagen locales. Esa estructura **no debe ser visible como cajas**: la experiencia objetivo es una hoja de notas normal.

`0.1.29` corrige dos detalles de producto detectados físicamente:

- quitar el aspecto de áreas/cajas separadas alrededor del texto;
- insertar imágenes en el punto del cursor, con texto arriba y abajo y tamaño contenido en móvil.

No existe sincronización remota todavía; todo sigue guardándose localmente en IndexedDB.

## Objetivo activo — D-053

Construir un editor estructurado de notas/artículos para Prédicas, manteniendo offline-first y preparando sincronización futura sin reescribir el documento completo en cada autosave.

Dirección aprobada:

- contenido persistido por bloques con identificadores estables;
- secciones: `introduction`, `outline`, `conclusion`;
- formato inline como datos/marks, no HTML arbitrario;
- autosave incremental de bloques modificados;
- cambios estructurales transaccionales;
- migración sin pérdida de las prédicas existentes;
- barra compacta tipo aplicación de notas, no una fila grande de botones.

Funciones objetivo iniciales del editor:

- negrita, cursiva, subrayado y tachado;
- párrafo, título/subtítulo;
- lista numerada, viñetas y tareas;
- cita y enlace;
- sangría cuando aplique;
- deshacer/rehacer;
- limpiar formato;
- en móvil, acciones frecuentes visibles y acciones secundarias agrupadas en `Más`.

## Orden obligatorio de implementación

1. Definir tablas/modelo de bloques y migración desde los campos de texto actuales.
2. Implementar persistencia incremental local y validar migración.
3. Sustituir el editor de texto plano por el editor estructurado.
4. Implementar la barra compacta de formato.
5. Adaptar referencias bíblicas y Modo Predicación al nuevo documento.
6. Validar crear/editar/autosave/duplicar/archivar/eliminar/offline/referencias/retorno exacto.
7. Solo después abrir sincronización/multidispositivo.

## Validaciones físicas aún relevantes

- Confirmar en dispositivo que `Eliminar` persiste tras recargar.
- Confirmar que `Predicar → referencia → Leer capítulo → Volver a Predicación` regresa a la referencia exacta en `0.1.24`.
- La barra rápida actual no requiere refinamiento físico adicional porque será reemplazada por D-053.

## Riesgos / restricciones vigentes

- No perder contenido durante la migración del editor.
- No acoplar el texto bíblico al documento de prédica; las referencias siguen siendo estructuradas/derivadas.
- No añadir un editor pesado o una dependencia nueva sin justificar mantenimiento, licencia, seguridad y tamaño.
- No abrir sincronización remota antes de estabilizar el modelo local por bloques.
- No versionar prédicas reales, notas personales, favoritos, bases locales, dumps ni secretos.

## Hitos D-053

### Paso 1 — modelo de bloques + migración
IMPLEMENTADO Y PUBLICADO en `0.1.25`.

- tabla `sermonBlocks` en IndexedDB v6;
- migración automática desde las tres secciones existentes;
- bloques iniciales estables;
- compatibilidad temporal con el modelo legado.

### Paso 2 — persistencia incremental
VALIDADO FÍSICAMENTE en `0.1.26`.

- PR #53 fusionado;
- TypeScript, ESLint, build PWA y auditoría pasaron en verde;
- el autosave de contenido escribe solo la sección/bloque modificado;
- el título se guarda separadamente como metadato;
- la lectura de prédicas se hidrata desde bloques;
- acciones explícitas de seguridad siguen consolidando el snapshot legado durante la transición;
- una versión de edición evita carreras entre autosaves viejos y cambios nuevos;
- GitHub Pages sirve `v0.1.26` y el usuario confirmó físicamente que un cambio autosalvado reaparece después de recargar sin presionar `Guardar`.

### Paso 3 — editor estructurado
CORREGIDO POR D-054.

La arquitectura por bloques de `0.1.27` se conserva internamente, pero su representación visual como cajitas/numeración/`+ Bloque` fue rechazada por el usuario. Esa UI es transitoria y se sustituye en `0.1.28` por una experiencia de documento continuo.

### Paso 3.1 — documento continuo + imágenes
PUBLICADO en `0.1.29`, con división editorial de secciones en implementación como `0.1.30`.

- `0.1.28` añadió adjuntos de imagen locales e hizo invisible la numeración/cajas de bloques.
- `0.1.29` simplifica todavía más la hoja: sin bordes de campo alrededor del contenido normal.
- el cursor se rastrea para insertar imágenes exactamente donde se está escribiendo;
- el párrafo se divide internamente alrededor de la imagen sin mostrar esa estructura;
- queda escritura inmediata debajo de la imagen;
- la imagen se muestra compacta por defecto para no ocupar casi toda la pantalla;
- referencias y autosave incremental deben seguir funcionando igual.

### Paso 4 — barra compacta de formato
PUBLICADO en `0.1.31`, PENDIENTE DE VALIDACIÓN FÍSICA.

- barra visible compacta: Aa, B, I, U, S, listas e inserción;
- Aa: Texto, H1, H2, Cita y sangría;
- listas: ninguna, viñetas, numeración y checklist;
- Imagen fue movida al menú `+`;
- marks inline persistentes para negrita/cursiva/subrayado/tachado;
- división/unión y edición de texto preservan formato;
- quedan para el siguiente subhito de la misma barra: Enlace, color/resaltado y deshacer/rehacer.

### Paso 4.1 — pantalla de edición dedicada
PUBLICADO en `0.1.32`, PENDIENTE DE VALIDACIÓN FÍSICA.

- abrir/crear prédica usa una pantalla enfocada sin navegación general;
- encabezado propio del editor conserva Volver, Guardar, Predicar y estado de autosave;
- la hoja ocupa el área de trabajo;
- la barra de formato queda fija abajo y siempre al alcance;
- los paneles de herramientas aparecen sobre la barra;
- no cambia persistencia, autosave ni estructura de datos.

## Siguiente paso inmediato

Validar físicamente `0.1.32`: abrir/crear una prédica debe entrar al editor dedicado y la barra inferior debe permanecer accesible durante toda la edición. Después completar Enlace + color/resaltado + deshacer/rehacer sobre la misma barra y, a continuación, adaptar Modo Predicación a texto enriquecido + imágenes.

## Después de D-053

Terminar los refinamientos pendientes de Modo Predicación sobre el documento estructurado. Luego abrir sincronización/multidispositivo.

## Memoria histórica

- Decisiones D-001 a D-043 completas: `docs/history/DECISIONS_D001_D043.md`.
- Changelog anterior a 0.1.18: `docs/history/CHANGELOG_ARCHIVE_THROUGH_0.1.17.md`.
- Estado previo a compactación: `docs/history/PROJECT_STATE_2026-10-03_PRE_COMPACTION.md`.

Consultar esos archivos solo cuando una tarea realmente necesite contexto histórico.
