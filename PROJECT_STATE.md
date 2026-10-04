# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-10-03

## Estado general

Etapa: implementación de Fase 1 del lector bíblico y datos personales locales.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad actual: pública desde el 2026-09-16 por autorización explícita del usuario.

La versión `0.1.21` está integrada en `main`, pasó CI y se publicó correctamente mediante GitHub Pages. La prueba física del usuario detectó un defecto real: al abrir una referencia, la vista rápida no bloquea el scroll del contenido de fondo. También se confirmó como refinamiento deseado que, desde Modo Predicación, la referencia permita `Leer capítulo` y regresar al mismo punto del modo.

El 2026-10-02 se incorporó el paquete maestro general v4. El 2026-10-03 el dueño aclaró que nunca autorizó eliminar la identidad secuencial. La gobernanza queda corregida: todo chat nuevo inicia en `LOCKED_READ_ONLY`, completa lectura/sincronización, reserva y verifica `Ing. Bibia 📖 #N`, emite `LOCKED_READ_ONLY_REPORT` y solo modifica producto con una tarea autorizada. `SECURITY.md`, `UI_RULES.md` y `RELEASE_RULES.md` siguen vigentes.

El objetivo funcional activo es validar físicamente `0.1.22` ya publicada: bloqueo del scroll de fondo, `Cerrar` + `Leer capítulo` dentro de Modo Predicación, retorno al mismo punto y mantenimiento de pantalla activa cuando la plataforma lo permita.

## Completado

### Base y reglas

- PWA elegida como plataforma inicial, con enfoque offline-first.
- Repositorio oficial público y documentación de continuidad, seguridad, UI y entregas establecidos.
- Stack de Fase 1: React + TypeScript + Vite, React Router, IndexedDB + Dexie, `vite-plugin-pwa`, ESLint y GitHub Actions.
- Corpus bíblico separado de datos personales y detrás de un proveedor reemplazable.
- RVR60 sigue siendo la traducción deseada, pero no se incorporará ni redistribuirá contenido sin procedencia y permisos verificables.
- La aplicación puede publicarse para terceros en el futuro, por lo que las licencias del corpus y encabezados son requisito real.

### Continuidad y seguridad vigentes

- `AGENTS.md` contiene el paquete maestro general v4 de autonomía controlada y revisores automáticos.
- Todo chat nuevo comienza en `LOCKED_READ_ONLY`; puede leer, revisar y diagnosticar. Antes de una tarea autorizada solo puede realizar la reserva estrictamente limitada de `CURRENT_SESSION`/`NEXT_SESSION` exigida por `AGENTS.md`.
- La primera respuesta sincronizada debe comenzar con la identidad exacta `Ing. Bibia 📖 #N` ya reservada y verificada, seguida del `LOCKED_READ_ONLY_REPORT` definido por `AGENTS.md`.
- Si cambia `AGENTS.md`, `protocol_version` o una regla fundamental durante una sesión, el chat vuelve a `LOCKED_READ_ONLY / UNSYNCED` y debe resincronizar.
- `SECURITY.md`, `UI_RULES.md` y `RELEASE_RULES.md` siguen vigentes como reglas específicas del proyecto.
- `SECURITY.md` trata todo contenido versionado, ramas e historial como públicamente accesibles.
- Se prohíben secretos, tokens, credenciales, claves privadas, URLs firmadas temporales, datos personales reales, bases personales y material privado en Git.
- Antes de cada merge debe revisarse el diff por secretos/datos personales y cualquier referencia auxiliar creada por el cambio.

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

## APK externa como referencia técnica

Estado: VERIFICADO / USO COMO REFERENCIA, NO COMO BASE DE CÓDIGO.

El usuario aportó el paquete Android `Santa Biblia Reina Valera_0.1.4.apks` para estudiar qué elementos útiles pueden rescatarse o reconstruirse en Biblia PWA.

Hallazgos verificados del paquete analizado:

- es un bundle `.apks` con una aplicación Flutter compilada;
- incluye datos bíblicos locales y puede funcionar con el corpus empaquetado sin depender de una consulta remota para leer esos archivos;
- contiene tres datasets bíblicos locales: español (`bible_rvr.json`), inglés KJV y portugués;
- el dataset español contiene 66 libros;
- cada libro incluye identificadores, nombre, grupo, autor, indicador de Antiguo/Nuevo Testamento, capítulos y versículos;
- cada versículo está estructurado individualmente y puede incluir un campo `title`;
- se verificó, por ejemplo, que Génesis 1:1 contiene un encabezado de sección en `title`;
- el paquete contiene recursos visuales, tipografías y librerías/servicios de terceros que deben evaluarse individualmente antes de reutilizar;
- se observaron valores de configuración/credenciales dentro de recursos empaquetados de la app externa. No deben copiarse, publicarse ni reutilizarse en este repositorio.

Decisión de uso:

- Biblia PWA sigue siendo el proyecto principal; no se reemplaza por Flutter ni por el APK externo;
- la app externa se trata como referencia/donante para identificar funciones, estructura de datos, organización y UX que puedan mejorar el proyecto;
- funciones útiles se reconstruyen con código propio dentro de la arquitectura actual cuando tengan sentido;
- no se copiará código compilado, secretos, configuración privada ni dependencias externas innecesarias;
- texto RVR60, títulos editoriales, iconos, fuentes u otros assets solo podrán incorporarse si su licencia/procedencia permite redistribución pública;
- la estructura de datos sí puede inspirar el modelo interno, siempre manteniendo corpus y datos personales separados;
- antes de integrar algo proveniente de la app externa, clasificarlo como: `REUTILIZABLE VERIFICADO`, `RECONSTRUIBLE`, `REQUIERE LICENCIA` o `NO REUTILIZAR`.

Pendiente específico:

- completar un inventario comparativo entre la APK externa y Biblia PWA para identificar funciones útiles que aún falten;
- verificar por separado procedencia/licencia del corpus español y de los encabezados editoriales antes de cualquier incorporación;
- no asumir que el hecho de estar dentro de una APK descargable concede permiso de redistribución.

### Referencias bíblicas inteligentes 0.1.19 — publicada; refinamiento físico solicitado

- PR #36 implementó detección y persistencia estructurada de referencias bíblicas dentro de Introducción, Bosquejo/puntos y Conclusión.
- Soporta inicialmente referencias disponibles en el corpus con formato `Libro capítulo:versículo` y rangos del mismo capítulo.
- Cada referencia detectada ofrece vista rápida del pasaje sin abandonar la prédica.
- `Abrir en Biblia` guarda primero la prédica y abre el pasaje exacto.
- El lector muestra `Volver a prédica` y restaura la misma prédica, campo y posición aproximada de edición.
- La validación automatizada móvil confirmó `Juan 1:1` y `Génesis 1:1-3`, vista rápida, apertura en Biblia, retorno seguro y ausencia de clipping evidente.
- El build visible es `0.1.19`.
- PR #36 fue fusionado a `main`; el CI de `main` pasó TypeScript, ESLint, build PWA y auditoría en verde.
- GitHub Pages quedó habilitado y publicó correctamente `0.1.19` en `https://hnalvaradohn.github.io/biblia-pwa/`.
- Vercel queda como respaldo y ya no es requisito para continuar el desarrollo.
- El usuario confirmó físicamente que la referencia se detecta y se ve, pero pidió refinar la interacción: verla remarcada dentro del texto, tocarla allí mismo y usar una lectura bíblica enfocada con regreso exclusivo a la prédica.


## Estado de gobernanza

- Identidad secuencial obligatoria restaurada e integrada con v4.
- Contador vigente: `CURRENT_SESSION: 3`, `NEXT_SESSION: 4`.
- El chat actual trabaja oficialmente como `Ing. Bibia 📖 #3`.
- La memoria oficial debe actualizarse durante el trabajo después de hitos significativos, manteniendo el orden real de implementación, validación y documentación.

## Objetivo activo

Publicar y validar físicamente `0.1.24`: el retorno exacto hacia Modo Predicación y las herramientas rápidas de `Bosquejo y puntos` ya están fusionados en `main`, pero GitHub Pages todavía sirve `v0.1.23`.

La base del versículo activo mantiene dos capas claramente distintas:

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
- la personalización avanzada global, prédicas y sincronización siguen fuera de este objetivo; sí entran los fondos propios de la composición de compartir y el lector capítulo por capítulo ya aprobado.

La decisión completa está registrada como D-029 en `DECISIONS.md`.

## Decisiones de producto futuras ya registradas, pero no abiertas todavía

- Diseño exacto de colores y personalización avanzada de resaltados.
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
- GitHub Pages es el canal principal de publicación actual; Vercel queda como respaldo. La app debe conservar portabilidad y no depender arquitectónicamente de un host específico.
- Si se añadirá protección obligatoria de `main` mediante ruleset/branch protection; la conexión actual de automatización no dispone de administración suficiente para configurarlo directamente.

## Restricción de contenido para desarrollo

Hasta contar con una fuente autorizada para el contenido definitivo, se trabaja con datos ficticios o una fuente legal de prueba. Favoritos, notas y futuros resaltados guardan referencias estructuradas y datos personales en almacenamiento del usuario, no copias acopladas del corpus ni datos personales versionados en Git.

## Siguiente paso inmediato

1. Completar CI/PR/merge/publicación de `0.1.24`.
2. Validar físicamente el flujo `Predicar → referencia → Leer capítulo → Volver a Predicación` y confirmar que regresa a la referencia exacta, centrada y marcada temporalmente.
3. Validar numeración, viñetas, aumentar sangría y reducir sangría dentro de `Bosquejo y puntos`, tanto en una línea como sobre varias líneas seleccionadas.
4. Validar `Eliminar` en una prédica de prueba y comprobar persistencia del borrado tras recargar.
5. Con esas validaciones, continuar el refinamiento de Modo Predicación sin acumular fallos de navegación/editor.

Estado de despliegue actual: `0.1.24` fue fusionada a `main` mediante PR #48 y su CI pasó TypeScript, ESLint, build PWA y auditoría. GitHub Pages todavía sirve `v0.1.23`, por lo que `0.1.24` permanece PENDIENTE DE PUBLICACIÓN y no debe presentarse todavía como lista para probar.

## Después de este objetivo

Después de estabilizar `0.1.24`, el siguiente objetivo oficial será continuar refinando Modo Predicación sobre una base ya validada de referencias rápidas, retorno exacto y herramientas de bosquejo, antes de abrir sincronización/multidispositivo.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.
