## 2026-10-03 — Restauración de identidad secuencial y coherencia de gobernanza

- Aclarado que la identidad secuencial `Ing. Bibia 📖 #N` sigue siendo obligatoria.
- Restaurados en `AGENTS.md` `PROTOCOL_VERSION`, `CURRENT_SESSION: 2` y `NEXT_SESSION: 3`.
- Integrado el handshake secuencial con `LOCKED_READ_ONLY`: primero lectura y sincronización completas; después reserva/verificación de identidad; luego primera respuesta con identidad + `LOCKED_READ_ONLY_REPORT`.
- La reserva de identidad queda como única mutación permitida antes de una tarea autorizada y solo puede actualizar el contador de sesión.
- Corregida D-030 y añadida D-049 para mantener coherencia entre decisiones y gobernanza.
- Registrado que la memoria oficial afectada debe actualizarse después de hitos significativos durante el trabajo, no reconstruirse únicamente al final.
- Corregidas referencias antiguas a `0.1.19` en el estado general para que el objetivo activo y la primera respuesta reflejen `0.1.21` y el handshake restaurado.
- Este ajuste es exclusivamente documental/de gobernanza; no modifica código ni versión ejecutable de Biblia PWA.

# CHANGELOG.md

Registrar únicamente cambios relevantes del proyecto. No usar este archivo como transcripción de conversaciones.

El historial anterior a `0.1.18` fue movido sin pérdida a `docs/history/CHANGELOG_ARCHIVE_THROUGH_0.1.17.md`. Este archivo mantiene únicamente cambios recientes y relevantes para continuidad.

## 2026-10-04 — Barra fija con VisualViewport 0.1.36

- Corregida definitivamente la posición de la barra del editor: vuelve a `position: fixed`.
- Se añade compensación dinámica con `window.visualViewport` para mantener la barra sobre el teclado móvil.
- El offset inferior se recalcula cuando cambia el tamaño o desplazamiento del viewport visible, al rotar el dispositivo y ante resize.
- La barra ya no depende de la posición del documento: debe permanecer visible aunque se haga scroll hacia arriba o abajo.
- Los paneles de herramientas se desplazan junto con la barra.
- Se restaura espacio inferior en la hoja para que el contenido final no quede oculto detrás de la barra fija.
- Se conserva sin cambios el orden `Aa → Texto → B → I → U → S → Listas → +` y todos los toggles de formato.
- Build visible actualizado a `0.1.36`.

## 2026-10-04 — Restauración de barra flotante sobre teclado 0.1.35

- Corregida una regresión introducida al crear el editor dedicado: la barra de herramientas deja de usar `position: fixed`.
- La barra vuelve a usar comportamiento `sticky` al borde inferior visible, como antes de 0.1.32.
- En móvil, al aparecer el teclado, la barra debe permanecer dentro del viewport visible y encima del teclado en lugar de quedar debajo o perderse.
- Se elimina el espacio inferior extra reservado exclusivamente para la barra fija.
- Se conserva sin cambios el orden de 0.1.34: `Aa → Texto → B → I → U → S → Listas → +`.
- Se conserva sin cambios la deselección rápida de B/I/U/S y de H1/H2/Cita/listas/checklist.
- Build visible actualizado a `0.1.35`.

## 2026-10-04 — Prioridad de Texto y deselección rápida 0.1.34

- La barra visible cambia a `Aa → Texto → B → I → U → S → Listas → +`.
- `Texto` sale del panel `Aa` y queda como segundo acceso directo.
- `Aa` conserva H1, H2, Cita y sangría.
- H1, H2 y Cita muestran estado activo dentro del panel.
- Viñetas, Numerada y Verificación muestran estado activo dentro del panel de listas.
- Tocar de nuevo H1/H2/Cita/lista/checklist cuando ya están activos los desactiva y regresa inmediatamente a `Texto`.
- El botón de Listas permanece visualmente activo cuando el párrafo actual usa viñetas, numeración o checklist.
- Build visible actualizado a `0.1.34`.

## 2026-10-04 — Formato activo y Galería 0.1.33

- Negrita, Cursiva, Subrayado y Tachado pueden activarse sin selección para aplicar el formato a lo que se escriba a continuación.
- Si existe una selección, la misma herramienta aplica o quita el formato sobre el texto seleccionado.
- Los botones B/I/U/S muestran estado activo mientras el formato correspondiente está encendido.
- La escritura nueva hereda el formato activo y puede desactivarse sin afectar caracteres anteriores.
- La cursiva usa una `I` tipográficamente reconocible en la barra.
- La acción `Imagen` del menú `+` pasa a llamarse `Galería`.
- El selector sigue limitado a imágenes; el navegador/sistema operativo decide si presenta Fotos/Galería/Archivos, ya que una PWA no puede forzar una aplicación nativa concreta.
- Build visible actualizado a `0.1.33`.

## 2026-10-04 — Editor dedicado de Prédicas 0.1.32

- Abrir o crear una prédica entra en una pantalla de edición dedicada.
- Durante edición se ocultan topbar general, navegación inferior y UpdatePrompt.
- El editor conserva encabezado propio con regreso a Mis prédicas, estado de guardado, Predicar y Guardar.
- La hoja aprovecha casi toda la pantalla y deja de sentirse incrustada dentro de la navegación general.
- La barra compacta de herramientas pasa a posición fija inferior, siempre al alcance durante escritura.
- Los paneles de herramientas se abren encima de la barra sin exigir desplazarse al final del documento.
- Se respetan safe areas en móvil.
- Build visible actualizado a `0.1.32`.

## 2026-10-03 — Barra compacta de formato 0.1.31

- Añadida barra compacta de edición para la hoja de Prédicas.
- `Aa` permite Texto, H1, H2, Cita y control de sangría.
- Añadidos Negrita, Cursiva, Subrayado y Tachado sobre selección de texto.
- Añadido menú de listas: Ninguna, Viñetas, Numerada y Verificación.
- `Imagen` fue movida al menú de inserción `+`; ya no aparece como acción independiente.
- El formato inline se guarda como marks estructurados y persiste en IndexedDB.
- Los marks se reajustan durante edición de texto y se conservan al dividir/unir párrafos.
- Añadido render visual de encabezados, citas, listas, checklist y sangría dentro de la hoja.
- Este hito deja pendiente completar Enlace, color/resaltado y deshacer/rehacer sobre la misma barra.
- Build visible actualizado a `0.1.31`.

## 2026-10-03 — División editorial de secciones 0.1.30

- Introducción, Bosquejo y puntos, y Conclusión quedan marcadas como secciones editoriales reales dentro de la misma hoja continua.
- Cada sección usa un encabezado semántico visible y accesible.
- Entre secciones se añade separación vertical y una línea divisoria discreta, sin volver a cajas independientes.
- La estructura interna por bloques continúa invisible para el usuario.
- Build visible actualizado a `0.1.30`.

## 2026-10-03 — Hoja de notas e imágenes en el cursor 0.1.29

- El editor deja de mostrar bordes/cajas alrededor del contenido de cada sección y se presenta como una hoja de notas más limpia y continua.
- Las imágenes ahora se insertan en el punto actual del cursor cuando se está escribiendo dentro de un párrafo.
- Insertar una imagen divide internamente el párrafo sin exponer esa estructura: texto anterior arriba, imagen en medio y texto posterior abajo.
- Siempre se conserva o crea un párrafo editable después de la imagen para seguir escribiendo inmediatamente.
- El editor registra la posición actual del cursor para colocar adjuntos con mayor precisión.
- Las imágenes se muestran con un tamaño máximo contenido para móvil, evitando que una sola imagen ocupe casi toda la pantalla.
- La arquitectura interna por bloques sigue invisible y se conserva únicamente para autosave, retorno exacto y futura sincronización.
- Build visible actualizado a `0.1.29`.

## 2026-10-03 — Documento continuo e imágenes 0.1.28

- Corregida la interpretación visual del editor estructurado: los bloques permanecen como arquitectura interna pero dejan de mostrarse como cajitas, números o controles `+ Bloque`.
- Introducción, Bosquejo/puntos y Conclusión vuelven a sentirse como superficies continuas de escritura.
- Enter/Backspace conservan la estructura interna necesaria para autosave y retorno exacto sin exponerla visualmente.
- Añadida tabla IndexedDB `sermonAttachments` en esquema v8 para adjuntos locales independientes del texto.
- Añadido bloque de tipo `image` que referencia un adjunto mediante ID estable.
- El editor permite seleccionar una o varias imágenes del dispositivo e insertarlas dentro de la sección activa.
- Las imágenes se muestran dentro de la nota, funcionan offline y pueden eliminarse individualmente.
- Duplicar una prédica duplica también sus adjuntos para que la copia sea autónoma.
- Eliminar una prédica elimina sus bloques y adjuntos asociados dentro de la misma operación local.
- El texto legado y los offsets de referencias bíblicas no cuentan los bloques de imagen, evitando desplazar referencias posteriores.
- Esta versión prepara la barra completa de formato; todavía no adapta imágenes a Modo Predicación.
- Build visible actualizado a `0.1.28`.

## 2026-10-03 — Editor estructurado por bloques 0.1.27

- Añadida migración IndexedDB v7 que convierte los tres bloques legados de cada prédica en bloques estructurados independientes por línea, conservando el texto.
- Las nuevas prédicas nacen directamente con bloques estructurados estables; ya no dependen de IDs `legacy`.
- El editor visible deja de trabajar como tres campos monolíticos y renderiza bloques independientes dentro de Introducción, Bosquejo/puntos y Conclusión.
- Enter divide un bloque en dos; Backspace al inicio une con el bloque anterior; cada sección permite añadir un bloque explícitamente.
- El autosave continúa siendo incremental: solo se persisten los bloques modificados.
- Duplicar conserva la estructura de bloques; eliminar sigue borrando prédica y bloques en una sola transacción.
- Las referencias bíblicas se detectan por bloque sin perder su posición global de sección para compatibilidad.
- Al abrir Biblia desde el editor se guarda `blockId` + posición local; al volver, el editor enfoca ese bloque exacto después de renderizarlo.
- Se elimina la barra transitoria de cuatro ajustes rápidos de `0.1.24`; no se acumula sobre el editor nuevo.
- Esta versión todavía no incorpora la barra completa de formato; ese es el paso 4 de D-053.
- Build visible actualizado a `0.1.27`.

## 2026-10-03 — Autosave incremental de Prédicas 0.1.26

- El editor deja de reescribir el contenido completo de la prédica en cada autosave por texto.
- Cada cambio en Introducción, Bosquejo o Conclusión se persiste únicamente en el bloque correspondiente después del debounce local.
- El título se persiste como metadato independiente cuando cambia.
- `getSermon()` y `getSermons()` hidratan el contenido desde `sermonBlocks`, por lo que una recarga recupera el último autosave incremental aunque los campos legados no hayan sido consolidados todavía.
- La fecha efectiva de actualización considera también los timestamps de los bloques.
- Se conserva una consolidación completa de compatibilidad en acciones seguras como `Guardar`, `Predicar` y abrir una referencia en Biblia.
- Se añadió control de versión de edición para evitar que un autosave anterior marque como guardados cambios más nuevos todavía pendientes.
- Build visible actualizado a `0.1.26`.

## 2026-10-03 — Modelo de bloques de Prédicas 0.1.25

- Añadida tabla IndexedDB `sermonBlocks` como base del editor estructurado D-053.
- Cada bloque tiene identificador estable, prédica, sección, orden, tipo, texto, marcas inline, sangría, estado opcional de tarea, nivel de encabezado, revisión y timestamps.
- La migración de base de datos v6 convierte cada prédica existente en bloques iniciales sin modificar ni borrar los campos de texto actuales.
- Introducción, Bosquejo y Conclusión se migran conservando exactamente su contenido; incluso las secciones vacías reciben un bloque inicial estable.
- Mientras la interfaz antigua siga activa, crear/guardar/duplicar mantiene una capa temporal de compatibilidad entre el registro legado y los bloques.
- Eliminar una prédica elimina también todos sus bloques dentro de la misma transacción.
- Añadido `getSermonBlocks()` como lectura ordenada para los siguientes pasos del editor.
- Esta versión no cambia todavía la interfaz visible ni el autosave completo actual; el siguiente hito es persistencia incremental por bloque.
- Build visible actualizado a `0.1.25`.

## 2026-10-03 — Compactación de memoria oficial

- Compactados `PROJECT_STATE.md`, `DECISIONS.md` y `CHANGELOG.md` para reducir lectura repetitiva en chats nuevos.
- No se modificaron reglas de `AGENTS.md`, `SECURITY.md`, `UI_RULES.md` ni `RELEASE_RULES.md`.
- D-001 a D-043 conservan resumen operativo en `DECISIONS.md` y texto íntegro en `docs/history/DECISIONS_D001_D043.md`.
- El historial detallado hasta `0.1.17` se conserva en `docs/history/CHANGELOG_ARCHIVE_THROUGH_0.1.17.md`.
- Se conserva una instantánea completa del estado previo en `docs/history/PROJECT_STATE_2026-10-03_PRE_COMPACTION.md`.
- Los archivos históricos dejan de formar parte de la lectura cotidiana; se consultan cuando una tarea futura los necesite.

## 2026-10-03 — Retorno exacto y herramientas de bosquejo 0.1.24

- Corregido el regreso desde `Leer capítulo` hacia Modo Predicación: el retorno ya no depende únicamente del valor de scroll.
- La referencia de origen queda identificada por campo y posición; al volver, la app espera a que la prédica esté renderizada, localiza esa misma referencia y la centra en pantalla.
- El valor de scroll anterior se conserva únicamente como fallback si la referencia ya no puede localizarse.
- La referencia recuperada recibe un foco visual temporal para ubicar rápidamente dónde se estaba predicando.
- `Bosquejo y puntos` incorpora ajustes rápidos de texto plano: numeración, viñetas, aumentar sangría y reducir sangría.
- Las acciones rápidas operan sobre las líneas seleccionadas o la línea actual sin guardar HTML ni romper referencias bíblicas.
- Build visible actualizado a `0.1.24`.

## 2026-10-03 — Eliminación de prédicas 0.1.23

- Añadida acción `Eliminar` a cada prédica junto a Abrir, Duplicar y Archivar/Restaurar.
- La eliminación borra definitivamente la prédica local de IndexedDB.
- Antes de borrar se exige una confirmación explícita con el título de la prédica y aviso de que la acción no se puede deshacer.
- La acción destructiva se diferencia visualmente de las acciones normales para reducir eliminaciones accidentales.
- Se conserva `Archivar` como alternativa reversible.
- Build visible actualizado a `0.1.23`.

## 2026-10-03 — Flujo de referencias en Modo Predicación 0.1.22

- Corregido el modal de referencias para impedir que el contenido de fondo siga desplazándose mientras la vista rápida está abierta, tanto en el editor como en Modo Predicación.
- En Modo Predicación, la vista rápida ahora ofrece `Cerrar` y `Leer capítulo`.
- Abrir un capítulo desde Modo Predicación conserva el origen y la posición vertical; `Volver a Predicación` regresa al mismo punto del bosquejo.
- El lector distingue si la referencia provino del editor o de Modo Predicación y adapta el mensaje/retorno correspondiente.
- Añadido intento automático de mantener la pantalla activa durante Modo Predicación mediante Screen Wake Lock cuando el navegador lo soporta; si no está disponible, la función falla de forma silenciosa sin romper el modo.
- El feedback físico sobre `0.1.21` confirmó un defecto real de scroll de fondo en la vista rápida; esta versión lo corrige antes de considerar cerrado el flujo.
- Build visible actualizado a `0.1.22`.


## 2026-10-03 — Toque directo y base de Modo Predicación 0.1.21

- Las referencias inline responden a un toque normal, sin requerir mantener presionado.
- La vista rápida vuelve a abrirse centrada también en móvil.
- Las acciones de la vista rápida se reducen a controles discretos: `Seguir escribiendo` y `Leer capítulo`.
- Añadido acceso `Predicar` desde el editor.
- Primera base de Modo Predicación: vista de solo lectura, sin navegación principal, con título, Introducción, Bosquejo/puntos y Conclusión en tipografía amplia.
- Las referencias bíblicas permanecen resaltadas y consultables dentro del Modo Predicación.
- El modo conserva una salida explícita `Volver a editar` y no modifica el contenido de la prédica.
- Build visible actualizado a `0.1.21`.

## 2026-10-03 — Referencias inline en Prédicas 0.1.20

- Las referencias bíblicas dejan de mostrarse como controles separados debajo del campo.
- Las referencias detectadas quedan remarcadas dentro del mismo texto de Introducción, Bosquejo/puntos y Conclusión.
- Tocar una referencia remarcada abre directamente la vista rápida del pasaje.
- La vista rápida mantiene el pasaje breve y ofrece `Leer capítulo completo`.
- Al leer el capítulo desde una prédica, la interfaz oculta navegación, ajustes y acciones bíblicas: la única acción disponible es `Volver a prédica`.
- La lectura completa se limita al capítulo de la referencia y conserva el regreso al mismo campo/punto de edición.
- El editor mantiene texto plano en persistencia; el marcado visual de referencias se genera en la interfaz y no incrusta HTML en la prédica.
- Build visible actualizado a `0.1.20`.

## 2026-10-03 — Referencias bíblicas inteligentes 0.1.19

- Detección automática de referencias bíblicas en Introducción, Bosquejo/puntos y Conclusión de una prédica.
- Soporte inicial para `Libro capítulo:versículo` y rangos del mismo capítulo, según libros/versículos realmente disponibles en el corpus.
- Las referencias se guardan también como estructura interna: libro, capítulo, rango, campo y posición.
- Cada referencia detectada aparece como control compacto debajo del campo correspondiente.
- Añadida vista rápida modal del pasaje con estilo temático y blur, sin abandonar el editor.
- Desde la vista rápida se puede abrir el pasaje en Biblia.
- Antes de abrir Biblia se guarda la prédica de forma segura.
- El lector muestra `Volver a prédica` cuando fue abierto desde una referencia.
- Al volver, la app restaura la prédica, enfoca el campo original y posiciona el cursor junto a la referencia.
- El texto bíblico sigue viniendo del proveedor bíblico y no se duplica dentro de los datos personales.
- Build visible actualizado a `0.1.19`.

## 2026-10-03 — Base local de Prédicas 0.1.18

- La pestaña `Prédicas` deja de ser placeholder y abre `Mis prédicas`.
- Añadida tabla local `sermons` en IndexedDB/Dexie, separada de notas bíblicas y corpus.
- Se pueden crear, buscar, abrir, duplicar, archivar y restaurar prédicas.
- El editor inicial incluye Título, Introducción, Bosquejo y puntos, y Conclusión.
- Los cambios del editor se guardan automáticamente en el dispositivo y también existe botón Guardar.
- Las prédicas funcionan offline y no requieren cuenta.
- No se añade borrado destructivo en esta etapa; archivar protege mejor contra pérdidas accidentales.
- Referencias bíblicas inteligentes y vista rápida quedan como siguiente fase sobre esta base.
- La entrega anterior `0.1.17` quedó publicada con lectura corrida tipo Biblia impresa y el control renombrado a `Tipo de letra de la Biblia`.
- Build visible actualizado a `0.1.18`.
