# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-09-15

## Estado general

Etapa: implementación de Fase 1 del lector bíblico y datos personales locales.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad esperada: privada hasta autorización explícita del usuario después de una auditoría previa a publicación.

La versión `0.1.4` quedó integrada en `main`, pasó CI y el usuario confirmó en un dispositivo real que la versión publicada se ve y funciona correctamente a nivel de esta revisión. Con esto se cerró Favoritos y Notas reales.

Antes de continuar la siguiente función del lector, el usuario pidió endurecer la continuidad entre chats y la seguridad del repositorio pensando en una posible publicación futura. Ese endurecimiento queda documentado como D-030 y no cambia la versión ejecutable.

El objetivo funcional activo continúa siendo completar las acciones básicas del versículo y añadir un `versículo activo` por defecto para ayudar a seguir visualmente la lectura sin perder el punto.

## Completado

### Base y reglas

- PWA elegida como plataforma inicial, con enfoque offline-first.
- Repositorio privado y documentación de continuidad, seguridad, UI y entregas establecidos.
- Stack de Fase 1: React + TypeScript + Vite, React Router, IndexedDB + Dexie, `vite-plugin-pwa`, ESLint y GitHub Actions.
- Corpus bíblico separado de datos personales y detrás de un proveedor reemplazable.
- RVR60 sigue siendo la traducción deseada, pero no se incorporará ni redistribuirá contenido sin procedencia y permisos verificables.
- La aplicación puede publicarse para terceros en el futuro, por lo que las licencias del corpus y encabezados son requisito real.

### Continuidad y seguridad endurecidas

- `AGENTS.md` exige a todo chat nuevo leer todos los documentos obligatorios y verificar el estado actualizado antes de responder sobre implementación o editar.
- Un chat que no puede completar esa verificación queda bloqueado y no puede identificarse como ingeniero ni editar.
- La identidad secuencial futura usa el formato exacto `Ing. Bibia 📖 #N` y solo puede mostrarse después de reservar `CURRENT_SESSION`/`NEXT_SESSION` y volver a verificar `AGENTS.md`.
- Mostrar esa identidad certifica que el chat leyó reglas, estado, decisiones, seguridad, UI, entregas y changelog reciente.
- `SECURITY.md` establece que el repositorio debe desarrollarse como potencialmente público incluso mientras siga privado.
- Se prohíben secretos, tokens, credenciales, claves privadas, URLs firmadas temporales, datos personales reales, bases personales y material privado en Git.
- Se documentó explícitamente que cualquier secreto incorporado al frontend/PWA debe considerarse públicamente visible y no puede usarse como secreto real.
- Antes de cada merge debe revisarse el diff por secretos/datos personales; antes de hacer público el repo será obligatoria una auditoría separada del árbol actual y del historial de Git.
- `.gitignore` se amplió para bloquear claves/certificados privados comunes, archivos de credenciales, bases locales, dumps y backups.
- Primera revisión del árbol actual: no se observaron archivos `.env`, claves privadas, bases locales, archivos de credenciales ni backups versionados; búsquedas de prefijos/patrones comunes de credenciales no devolvieron coincidencias en `main`.
- Esta revisión actual es preventiva y no sustituye la auditoría histórica completa obligatoria antes de una futura publicación pública.

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
- `0.1.3`: `Guardados recientes` añadido al Inicio y confirmado en dispositivo real.
- `0.1.4`: Favoritos y Notas reales, confirmado por el usuario en la publicación de producción.

### Favoritos y Notas 0.1.4 — cerrado

- IndexedDB/Dexie ampliado con tablas separadas para favoritos y notas bíblicas.
- Guardados basados en referencia estructurada `bookId + capítulo + versículo`, sin copiar el corpus dentro de los datos personales.
- Pantalla completa `Mis favoritos` con lista real, estado vacío, acceso al versículo exacto y opción de quitar favoritos.
- Pantalla completa `Mis notas` con lista real, estado vacío, texto de la nota, contexto bíblico, acceso al versículo exacto y opción de eliminar.
- Tarjetas `Favoritos` y `Notas` del Inicio abren sus colecciones y muestran el dato más reciente cuando existe.
- Eliminadas las vistas previas ficticias de guardados del Inicio.
- En el lector normal, tocar un versículo abre un panel contextual compacto.
- Desde ese panel se puede guardar/quitar Favorito y crear/guardar/eliminar una nota asociada al versículo.
- Los enlaces desde Favoritos y Notas vuelven al versículo exacto usando el ancla estable del lector.
- Build visible identificado como `0.1.4`.
- Rama, PR #6 y `main` pasaron instalación bloqueada, TypeScript, ESLint, build PWA y auditoría de dependencias en verde.
- El usuario confirmó en un dispositivo real que la publicación `v0.1.4` se ve correctamente; entrega cerrada.

## Objetivo activo

Completar el comportamiento del versículo en el lector normal con dos capas claramente distintas:

1. `Versículo activo` por defecto para seguir visualmente la lectura.
2. Acciones contextuales persistentes o utilitarias: `Favorito`, `Nota`, `Resaltar`, `Copiar` y `Compartir`.

Reglas de alcance:

- tocar un versículo lo convierte en el único versículo activo;
- al tocar otro, el anterior deja de estar activo y el nuevo toma su lugar;
- la marca activa debe ser suave, clara y distinta de un resaltado permanente;
- la posición activa debe guardarse localmente para ayudar a retomar la lectura;
- `Resaltar` debe persistirse como dato personal local, separado del corpus, y puede existir en varios versículos;
- `Copiar` debe copiar referencia y texto de forma clara;
- `Compartir` debe usar el mecanismo nativo del dispositivo cuando exista y un fallback razonable cuando no exista;
- el panel contextual debe mantener el lector limpio y no cubrir innecesariamente el texto;
- no abrir todavía búsqueda bíblica completa, lector capítulo por capítulo, prédicas, sincronización, fondos o personalizaciones avanzadas dentro de este objetivo.

La decisión completa está registrada como D-029 en `DECISIONS.md`.

## Decisiones de producto futuras ya registradas, pero no abiertas todavía

- Diseño exacto de colores y personalización avanzada de resaltados.
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

Hasta contar con una fuente autorizada para el contenido definitivo, se trabaja con datos ficticios o una fuente legal de prueba. Favoritos, notas y futuros resaltados guardan referencias estructuradas y datos personales en almacenamiento del usuario, no copias acopladas del corpus ni datos personales versionados en Git.

## Siguiente paso inmediato

1. Cerrar mediante PR el endurecimiento documental/seguridad y mantener el repositorio privado.
2. Retomar D-029 sin mezclar más objetivos.
3. Implementar persistencia local del versículo activo y de resaltados.
4. Hacer que el toque normal seleccione visualmente un único versículo activo y reemplace al anterior.
5. Añadir `Resaltar`, `Copiar` y `Compartir` al panel contextual existente junto con `Favorito` y `Nota`.
6. Exigir TypeScript, lint, build PWA y auditoría en verde.
7. Revisar diferencias, incluyendo revisión de secretos/datos personales, y limpiar cualquier resto no relacionado.
8. Integrar mediante PR solo si todo queda verde.
9. Confirmar nuevamente `main`, desplegar y verificar la nueva versión antes de pedir prueba al usuario.

## Después de este objetivo

El siguiente objetivo funcional previsto es la búsqueda bíblica completa por palabras/frases. Después se retomará el lector capítulo por capítulo ya aprobado, salvo que una revisión real revele una corrección prioritaria.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.
