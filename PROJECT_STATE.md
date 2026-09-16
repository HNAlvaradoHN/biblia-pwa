# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-09-16

## Estado general

Etapa: implementación de Fase 1 del lector bíblico y datos personales locales.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad actual: pública desde el 2026-09-16 por autorización explícita del usuario.

La versión `0.1.4` quedó integrada en `main`, pasó CI y el usuario confirmó en un dispositivo real que la versión publicada se ve y funciona correctamente a nivel de esta revisión. Con esto se cerró Favoritos y Notas reales.

Antes de continuar la siguiente función del lector, el usuario pidió endurecer la continuidad entre chats y la seguridad del repositorio. Durante ese trabajo el usuario autorizó y realizó el cambio de visibilidad a público, por lo que la revisión preventiva se convirtió en una auditoría real del repositorio público. El endurecimiento queda documentado como D-030 y no cambia la versión ejecutable.

El objetivo funcional activo continúa siendo completar las acciones básicas del versículo y añadir un `versículo activo` por defecto para ayudar a seguir visualmente la lectura sin perder el punto.

## Completado

### Base y reglas

- PWA elegida como plataforma inicial, con enfoque offline-first.
- Repositorio oficial público y documentación de continuidad, seguridad, UI y entregas establecidos.
- Stack de Fase 1: React + TypeScript + Vite, React Router, IndexedDB + Dexie, `vite-plugin-pwa`, ESLint y GitHub Actions.
- Corpus bíblico separado de datos personales y detrás de un proveedor reemplazable.
- RVR60 sigue siendo la traducción deseada, pero no se incorporará ni redistribuirá contenido sin procedencia y permisos verificables.
- La aplicación puede publicarse para terceros en el futuro, por lo que las licencias del corpus y encabezados son requisito real.

### Continuidad y seguridad endurecidas

- `AGENTS.md` exige a todo chat nuevo leer todos los documentos obligatorios y verificar el estado actualizado antes de responder sobre implementación o editar.
- Un chat que no puede completar esa verificación queda bloqueado y no puede identificarse como ingeniero ni editar.
- La identidad secuencial futura usa el formato exacto `Ing. Bibia 📖 #N` y solo puede mostrarse después de reservar `CURRENT_SESSION`/`NEXT_SESSION` y volver a verificar `AGENTS.md`.
- Mostrar esa identidad certifica que el chat leyó reglas, estado, decisiones, seguridad, UI, entregas y changelog reciente.
- `SECURITY.md` trata todo contenido versionado, ramas e historial como públicamente accesibles.
- Se prohíben secretos, tokens, credenciales, claves privadas, URLs firmadas temporales, datos personales reales, bases personales y material privado en Git.
- Se documentó explícitamente que cualquier secreto incorporado al frontend/PWA debe considerarse públicamente visible y no puede usarse como secreto real.
- Antes de cada merge debe revisarse el diff por secretos/datos personales y también cualquier rama o referencia auxiliar creada por el cambio.
- `.gitignore` se amplió para bloquear claves/certificados privados comunes, archivos de credenciales, bases locales, dumps y backups.

### Auditoría del repositorio público — 2026-09-16

- Confirmado que el repositorio oficial está público por decisión explícita del usuario.
- Revisado el árbol actual de `main`: no se observaron `.env`, claves privadas, archivos de credenciales, bases locales, dumps, backups ni datasets personales versionados.
- Ejecutadas búsquedas de alta señal en el árbol público actual para prefijos/patrones comunes de GitHub, Google, AWS, OpenAI, Slack, GitLab, Stripe y claves privadas; no se detectaron coincidencias evidentes.
- Revisado el workflow principal: permisos de contenido en solo lectura y verificaciones con `npm ci`, TypeScript, ESLint, build PWA y `npm audit --omit=dev --audit-level=high`.
- El CI del PR de endurecimiento, que antes no lograba iniciar runner mientras el repositorio era privado, se reejecutó después del cambio a público y completó en verde.
- Revisadas las ramas públicas. Se detectó `recibos-apk-build`, una rama ajena al proyecto Biblia con código de una aplicación de recibos.
- En el historial antiguo de esa rama se detectó un valor de contraseña de firma incrustado en configuración Android. No se detectó un archivo de keystore versionado mediante la revisión del historial de esa ruta.
- La referencia pública `recibos-apk-build` se movió al mismo commit limpio de `main`, retirando de la punta de la rama todo el árbol ajeno al proyecto Biblia.
- El valor histórico debe considerarse comprometido si fue utilizado o reutilizado fuera de este repositorio. Mover la referencia no garantiza purgar inmediatamente objetos históricos, cachés o copias externas.
- Las demás ramas públicas revisadas corresponden a trabajo histórico de Biblia; sus diferencias actuales respecto de `main` no mostraron archivos adicionales de credenciales ni datos personales.
- `main` no tiene actualmente reglas de protección/rulesets configurados. Esto no expone por sí solo un secreto, pero queda como endurecimiento recomendable para exigir PR/CI en cambios futuros cuando la configuración de GitHub disponible lo permita.

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
- Si se añadirá protección obligatoria de `main` mediante ruleset/branch protection; la conexión actual de automatización no dispone de administración suficiente para configurarlo directamente.

## Restricción de contenido para desarrollo

Hasta contar con una fuente autorizada para el contenido definitivo, se trabaja con datos ficticios o una fuente legal de prueba. Favoritos, notas y futuros resaltados guardan referencias estructuradas y datos personales en almacenamiento del usuario, no copias acopladas del corpus ni datos personales versionados en Git.

## Siguiente paso inmediato

1. Cerrar mediante PR el endurecimiento documental/seguridad ya actualizado para la visibilidad pública.
2. Confirmar CI verde del PR después de los últimos cambios y fusionarlo.
3. Confirmar `main` verde después del merge.
4. Retomar D-029 sin mezclar más objetivos.
5. Implementar persistencia local del versículo activo y de resaltados.
6. Hacer que el toque normal seleccione visualmente un único versículo activo y reemplace al anterior.
7. Añadir `Resaltar`, `Copiar` y `Compartir` al panel contextual existente junto con `Favorito` y `Nota`.
8. Exigir TypeScript, lint, build PWA y auditoría en verde.
9. Revisar diferencias, incluyendo revisión de secretos/datos personales, y limpiar cualquier resto no relacionado.
10. Integrar mediante PR solo si todo queda verde.
11. Confirmar nuevamente `main`, desplegar y verificar la nueva versión antes de pedir prueba al usuario.

## Después de este objetivo

El siguiente objetivo funcional previsto es la búsqueda bíblica completa por palabras/frases. Después se retomará el lector capítulo por capítulo ya aprobado, salvo que una revisión real revele una corrección prioritaria.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.
