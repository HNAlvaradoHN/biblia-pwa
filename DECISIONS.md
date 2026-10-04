# DECISIONS.md — REGISTRO ACTIVO DE DECISIONES

Este archivo conserva una vista operativa compacta de decisiones aprobadas. Las decisiones D-001 a D-043 se resumen aquí para reducir carga de lectura; su texto íntegro permanece en `docs/history/DECISIONS_D001_D043.md`.

**Uso obligatorio:** si una tarea futura modifica un área cubierta por D-001 a D-043, leer primero la decisión completa correspondiente en el archivo histórico antes de cambiar producto.

## Decisiones fundacionales compactadas — D-001 a D-043

- **D-001 — PWA primero.** La plataforma inicial es una PWA.
- **D-002 — GitHub oficial.** GitHub es el repositorio técnico oficial del proyecto.
- **D-003 — Cursor no requerido.** El proyecto no depende de Cursor para desarrollarse o mantenerse.
- **D-004 — Cero basura.** Mantener estructura limpia, sin archivos/código huérfanos ni duplicación innecesaria.
- **D-005 — Identidad secuencial original.** Decisión histórica; la vigencia actual y su integración con gobernanza v4 están en D-049.
- **D-006 — Separación de datos.** Corpus bíblico y datos personales deben permanecer separados.
- **D-007 — Offline-first.** Lectura y funciones personales básicas deben funcionar sin conexión.
- **D-008 — Vinculación por código.** La dirección de producto para vincular dispositivos mediante código permanece aprobada.
- **D-009 — Sincronización personal.** Dirección de producto aprobada; implementación técnica sigue abierta.
- **D-010 — Pantalla de congregación.** Postergada y opcional; no forma parte del MVP.
- **D-011 — RVR60.** Es la traducción deseada, pero no se asume licencia ni derecho de redistribución.
- **D-012 — Stack Fase 1.** React + TypeScript + Vite, React Router, IndexedDB/Dexie, vite-plugin-pwa, ESLint y GitHub Actions; dependencias adicionales solo por necesidad real.
- **D-013 — Modularidad y reemplazo limpio.** UI y lógica deben ser modulares; una solución sustituida se elimina cuando sea seguro.
- **D-014 — Un objetivo activo.** Trabajar un único objetivo principal salvo repriorización explícita.
- **D-015 — Preguntas con fundamento.** Preguntar al usuario solo decisiones de producto con impacto real.
- **D-016 — Entregas en verde.** No declarar una versión lista sin validaciones aplicables y versión visible/actualizable.
- **D-017 — Inicio.** La app abre en Inicio y no directamente en el lector.
- **D-018 — Lectura del día.** Se presenta como un versículo con acciones para compartir y abrir el pasaje.
- **D-019 — Personalización amplia.** Dirección aprobada para ampliar apariencia/lectura y contenido compartido; detalles se deciden por etapas.
- **D-020 — Entrada Biblia.** Pantalla Biblia con continuar leyendo, búsqueda rápida de libros y navegación a capítulos.
- **D-021 — Capítulos.** Selección clara de capítulos y continuidad de última lectura.
- **D-022 — Dos experiencias de lectura.** Lector continuo y lector enfocado capítulo por capítulo; conservar/restaurar posición.
- **D-023 — Encabezados bíblicos.** Mostrar títulos de sección solo desde fuente autorizada; no inventar/copiar contenido editorial sin permiso.
- **D-024 — Distribución pública.** La app puede distribuirse a terceros; licencias del corpus y assets son requisito real.
- **D-025 — Dirección visual moderna.** La UI debe ser moderna y responsive desde la base.
- **D-026 — Navegación glass.** Barra inferior translúcida compatible con temas y fondos.
- **D-027 — Guardados recientes.** Inicio puede mostrar accesos/resúmenes compactos de guardados reales.
- **D-028 — Favoritos y notas reales.** Colecciones persistentes, locales e independientes del corpus.
- **D-029 — Versículo activo y acciones.** Un versículo activo visualmente distinto de Favorito/Nota/Resaltar/Copiar/Compartir.
- **D-030 — Continuidad estricta.** Repositorio y memoria oficial son fuente de verdad; adaptada posteriormente a gobernanza v4.
- **D-031 — APK externa.** Solo referencia/donante técnica; no copiar secretos, código compilado ni contenido sin derechos.
- **D-032 — Interacción del lector.** Menú contextual bajo demanda y selección múltiple para acciones compatibles.
- **D-033 — Compartir y buscar.** Compartir por formato y búsqueda bíblica son funciones aprobadas.
- **D-034 — Compartir imagen.** Fondos/formatos para compartir y búsqueda ampliada se construyen sin sacrificar legibilidad.
- **D-035 — Modos de lectura.** Selector entre continuo, capítulo por capítulo y versículo por versículo, preservando posición.
- **D-036 — Corrección + avance.** Si el usuario pide corregir y continuar, corregir primero y seguir el objetivo oficial salvo bloqueo real.
- **D-037 — Resaltados por color.** Paleta persistente con comportamiento coherente individual/múltiple.
- **D-038 — Menús inteligentes.** Paneles contextuales deben mantenerse dentro del viewport; transiciones de lectura deben ser sutiles y accesibles.
- **D-039 — Personalización global.** Temas/tamaño/fuente persistentes y separados de estilos de compartir.
- **D-040 — Contraste obligatorio.** Temas, glass y resaltados deben mantener legibilidad.
- **D-041 — Temas curados.** Usar conjuntos de tokens completos; submenús modales con blur y scroll interno cuando corresponda.
- **D-042 — Menú móvil completo.** En móvil, priorizar acceso a todas las acciones dentro del viewport.
- **D-043 — Versículos separados/corridos.** Preferencia visual independiente de modos de lectura y de los datos asociados a cada versículo.

---

## D-044 — Base local del editor de prédicas
Estado: APROBADA

La Fase 4 comienza con documentos de prédica independientes de las notas bíblicas y guardados localmente/offline en IndexedDB.

Primera etapa:

- pantalla `Mis prédicas`;
- crear una prédica;
- buscar por título o contenido;
- abrir y editar;
- duplicar;
- archivar y restaurar;
- guardado automático local;
- estructura inicial: título, introducción, bosquejo/puntos y conclusión.

Reglas:

- una prédica es un documento personal independiente; no reutilizar la tabla de notas bíblicas;
- no exigir cuenta ni conexión para crear/editar;
- evitar borrado destructivo en esta primera etapa; `Archivar` es la acción de retiro principal;
- el editor básico puede usar controles nativos mientras se valida el flujo; no añadir un editor pesado solo por anticipación;
- referencias bíblicas inteligentes, vista rápida y regreso exacto son la fase siguiente y deben construirse sobre esta base sin acoplar el texto bíblico al documento;
- el autosave debe reducir riesgo de pérdida accidental durante preparación;
- la interfaz debe funcionar en móvil, tablet y computadora.

## D-045 — Referencias bíblicas inteligentes en Prédicas
Estado: APROBADA

La Fase 5 comienza detectando referencias bíblicas escritas dentro de Introducción, Bosquejo/puntos y Conclusión, conservando además una representación estructurada independiente del texto visible.

Primera etapa:

- detectar referencias de libros disponibles en el corpus con formato `Libro capítulo:versículo` y rangos `Libro capítulo:versículo-versículo`;
- guardar estructura interna con libro, capítulo, versículo inicial/final, campo y posición del texto;
- mostrar controles compactos para abrir una vista rápida del pasaje sin abandonar la prédica;
- permitir `Abrir en Biblia` desde la vista rápida;
- al abrir Biblia desde una prédica, mostrar una acción explícita `Volver a prédica`;
- al volver, restaurar la misma prédica, el campo original y la posición de edición aproximada de la referencia.

Reglas:

- la detección depende del corpus disponible y no inventa referencias inexistentes;
- el texto bíblico mostrado proviene del proveedor bíblico actual, nunca se copia dentro del documento de prédica;
- las referencias estructuradas se regeneran al guardar para mantenerse sincronizadas con el texto;
- la vista rápida debe ser modal, legible, compatible con temas y con blur, sin perder el contenido no guardado;
- abrir Biblia debe forzar un guardado seguro antes de navegar;
- el regreso exacto no debe depender únicamente del botón Atrás del navegador;
- esta etapa no añade todavía detección de abreviaturas complejas, referencias entre capítulos ni herramientas de comentario bíblico.


## D-046 — GitHub Pages como publicación principal
Estado: APROBADA

GitHub Pages pasa a ser el canal principal de publicación de Biblia PWA. Vercel se conserva como respaldo opcional y no debe bloquear el avance del proyecto cuando alcance cuotas o límites temporales.

Reglas:

- la publicación principal se realiza desde GitHub Actions hacia GitHub Pages;
- el repositorio sigue siendo la fuente técnica de verdad;
- el build para Pages debe conservar rutas, PWA, service worker y navegación correctas bajo el subpath del repositorio;
- CI, typecheck, lint, build y auditoría siguen siendo obligatorios antes de considerar una entrega en verde;
- Vercel puede usarse como preview o respaldo cuando esté disponible, pero no es requisito para fusionar o publicar si GitHub Pages ya ofrece una validación equivalente;
- no introducir dependencias específicas del proveedor que dificulten mover la PWA a otro host estático en el futuro;
- datos personales, prédicas, notas, favoritos y resaltados continúan siendo locales al dispositivo y no se publican en GitHub Pages.


## D-047 — Referencias inline y lectura enfocada desde Prédicas
Estado: APROBADA

Las referencias bíblicas detectadas dentro de una prédica deben sentirse parte del texto que el usuario está escribiendo, no como una lista separada debajo del campo.

Reglas:

- una referencia válida se remarca visualmente dentro del mismo contenido de Introducción, Bosquejo/puntos o Conclusión;
- tocar la referencia remarcada abre la vista rápida del pasaje;
- la vista rápida conserva una acción para seguir escribiendo y otra para leer el capítulo completo;
- al entrar a la lectura completa desde una prédica, la interfaz bíblica pasa a un modo enfocado sin navegación principal, ajustes, menús de versículo ni otras acciones;
- durante ese modo enfocado la única acción de salida visible es `Volver a prédica`;
- el regreso restaura la misma prédica y el campo/punto de edición de origen;
- el contenido persistido de la prédica sigue siendo texto plano; el marcado visual de referencias es una capa de interfaz y no HTML guardado;
- la detección sigue limitada a referencias realmente disponibles en el corpus actual y no inventa contenido.


## D-048 — Base de Modo Predicación
Estado: APROBADA

Después de estabilizar las referencias inline, Prédicas incorpora una primera vista de presentación enfocada para usar el bosquejo sin controles de edición.

Reglas iniciales:

- el editor ofrece una acción discreta `Predicar` que guarda primero la prédica y abre la vista de presentación;
- Modo Predicación es de solo lectura y no modifica el documento;
- muestra título, Introducción, Bosquejo/puntos y Conclusión con tipografía amplia y legible;
- oculta la navegación general y controles de edición para reducir distracciones;
- conserva las referencias bíblicas remarcadas y permite consultar su pasaje en una vista rápida;
- siempre existe una salida explícita `Volver a editar`;
- esta primera base no añade todavía temporizadores, anotaciones en vivo, control remoto ni herramientas de presentación avanzadas.


## D-049 — Identidad secuencial obligatoria integrada con gobernanza v4
Estado: APROBADA

El dueño confirma que la identidad secuencial `Ing. Bibia 📖 #N` sigue siendo obligatoria y nunca fue autorizada su eliminación.

Reglas:

- `AGENTS.md` v4 se conserva como marco de seguridad, sincronización, autorización por objetivo y autonomía controlada.
- La identidad secuencial se integra como handshake específico de Biblia PWA y no es sustituida por `LOCKED_READ_ONLY`.
- Todo chat nuevo debe leer y sincronizar primero, reservar `NEXT_SESSION`, volver a verificar `AGENTS.md` y solo entonces emitir su primera respuesta de trabajo.
- La primera línea debe usar exactamente `Ing. Bibia 📖 #N`, seguida del `LOCKED_READ_ONLY_REPORT`.
- La reserva de identidad es la única escritura permitida antes de una tarea autorizada y solo puede cambiar `CURRENT_SESSION`/`NEXT_SESSION`.
- El contador válido restaurado queda en `CURRENT_SESSION: 2` y `NEXT_SESSION: 3`; no se asignan identidades retroactivas a chats que no completaron correctamente el handshake.
- Durante cada tarea autorizada, la memoria oficial afectada debe mantenerse actualizada después de hitos significativos y no reconstruirse únicamente al final.
- Ninguna decisión aprobada de gobernanza puede considerarse sustituida por una edición documental posterior sin autorización explícita del dueño.


## D-050 — Referencias y continuidad en Modo Predicación
Estado: APROBADA

El refinamiento de Modo Predicación debe permitir consultar una referencia sin que el contenido de fondo siga desplazándose y debe conservar el contexto cuando el usuario decide leer el capítulo completo.

Reglas:

- al abrir una vista rápida de referencia, el contenido detrás del modal queda bloqueado y no responde al scroll hasta cerrarlo;
- dentro de Modo Predicación la vista rápida ofrece `Cerrar` y `Leer capítulo`;
- `Leer capítulo` abre la lectura bíblica enfocada sin navegación general ni acciones ajenas al flujo de prédica;
- el retorno desde Biblia distingue si la referencia se abrió desde el editor o desde Modo Predicación;
- si se abrió desde Modo Predicación, `Volver a Predicación` restaura la misma prédica y la posición vertical previa;
- durante Modo Predicación la aplicación intentará mantener la pantalla activa cuando la plataforma ofrezca Screen Wake Lock, sin convertir esa API en requisito para usar la función;
- si el navegador no admite Wake Lock o rechaza la solicitud, Modo Predicación debe seguir funcionando normalmente.


## D-051 — Eliminación explícita de prédicas
Estado: APROBADA

Las prédicas pueden eliminarse definitivamente además de archivarse.

Reglas:

- cada prédica muestra una acción `Eliminar`;
- `Archivar` permanece como opción reversible y distinta de eliminar;
- eliminar una prédica borra su registro local de IndexedDB;
- antes del borrado debe mostrarse una confirmación explícita indicando que la acción no se puede deshacer;
- la acción destructiva debe diferenciarse visualmente de Abrir, Duplicar, Archivar y Restaurar;
- no se implementa papelera en esta etapa; si en el futuro se aprueba recuperación de borrados, será una función separada.


## D-052 — Retorno semántico y herramientas rápidas de bosquejo
Estado: APROBADA

Modo Predicación debe regresar al contexto real desde el que se abrió una referencia y el editor de Bosquejo debe ofrecer operaciones rápidas sin abandonar el modelo de texto plano.

Reglas:

- el retorno desde Biblia a Modo Predicación debe identificar la referencia de origen por campo y posición, no depender únicamente de píxeles de scroll;
- la restauración se ejecuta después de que la prédica esté cargada/renderizada;
- al encontrar la referencia, se centra y se marca temporalmente para reorientar al predicador;
- el scroll previo queda solo como respaldo si la referencia ya no existe;
- `Bosquejo y puntos` ofrece acciones rápidas iniciales para numeración, viñetas, aumentar sangría y reducir sangría;
- las acciones trabajan sobre línea/selección y mantienen el contenido persistido como texto plano;
- no se introduce HTML persistido ni un editor enriquecido completo en esta etapa.


## D-053 — Editor estructurado de prédicas y persistencia incremental
Estado: APROBADA

El editor de Prédicas deja de evolucionar como un campo de texto plano con botones aislados y pasa a planificarse como un editor estructurado de notas/artículos, inspirado en patrones de uso de Telegram, Joplin y aplicaciones de notas similares.

Esta decisión sustituye únicamente la parte de herramientas rápidas de `Bosquejo y puntos` definida en D-052. La regla de retorno semántico a Modo Predicación de D-052 sigue vigente.

Objetivo de experiencia:

- formato rápido de texto: negrita, cursiva, subrayado y tachado;
- jerarquía de texto: párrafo, título/subtítulo;
- estructura: lista numerada, lista con viñetas y lista de tareas;
- bloques útiles: cita;
- enlace;
- aumentar/reducir sangría cuando aplique a listas;
- deshacer/rehacer;
- limpiar formato;
- controles compactos y agrupados, sin una fila sobredimensionada de botones permanentes;
- en móvil, priorizar acciones frecuentes y mover acciones secundarias a un menú `Más` o superficie equivalente.

Arquitectura de contenido:

- no persistir HTML como fuente canónica del documento;
- separar metadatos de la prédica del contenido editable;
- representar el contenido mediante bloques estructurados con identificadores estables;
- cada bloque debe declarar su sección (`introduction`, `outline`, `conclusion`), orden, tipo y contenido;
- el formato inline debe representarse como datos estructurados/marks, no como HTML arbitrario;
- las referencias bíblicas siguen siendo datos derivados del contenido y deben conservar capacidad de detección, vista rápida y retorno exacto;
- las prédicas existentes deben migrarse sin pérdida desde los campos de texto actuales.

Persistencia y sincronización futura:

- el autosave local debe actualizar únicamente los bloques realmente modificados, no reescribir la prédica completa por cada cambio de texto;
- escribir caracteres modifica estado local inmediato; la persistencia se agrupa con debounce y afecta solo al bloque activo/cambiado;
- cambios de estructura (crear, eliminar, mover o cambiar tipo de bloque) se guardan de forma transaccional;
- el modelo debe quedar preparado para sincronización futura por bloques/versiones, evitando depender de subir un documento completo por cada edición;
- mientras no exista sincronización remota, todo sigue guardándose únicamente en IndexedDB del dispositivo;
- no introducir colaboración en tiempo real, CRDT o dependencias pesadas sin una necesidad concreta posterior.

Plan de implementación obligatorio:

1. definir/migrar el modelo de bloques y mantener compatibilidad con prédicas existentes;
2. implementar persistencia incremental local y pruebas de migración;
3. sustituir el editor actual por el editor estructurado;
4. implementar la barra compacta de formato y sus acciones;
5. adaptar detección de referencias bíblicas y Modo Predicación al nuevo documento;
6. validar autosave, edición, referencias, retorno exacto, duplicar, archivar, eliminar y modo offline antes de cerrar la migración.

No se considerará terminada esta migración mediante una colección parcial de botones sobre el editor de texto plano actual.

Cierre de implementación: **COMPLETADA Y VALIDADA FÍSICAMENTE en 0.1.40**. El usuario confirmó funcionamiento integral de edición continua, autosave, selección/borrado, formato, listas, imágenes, referencias, regreso exacto y Modo Predicación.


## D-054 — Documento continuo e imágenes en Prédicas
Estado: APROBADA

La arquitectura interna por bloques de D-053 no debe imponerse visualmente al usuario. La experiencia de Prédicas debe sentirse como un documento continuo de notas/artículo, no como una colección de cajas o tarjetas editables.

Esta decisión corrige la interpretación visual introducida en 0.1.27 y complementa D-053 sin eliminar su arquitectura interna.

Reglas de experiencia:

- los bloques internos no muestran numeración, bordes de tarjeta, handles ni botones `+ Bloque` en la experiencia normal;
- Enter y Backspace deben sentirse como edición normal de párrafos, aunque internamente creen, dividan o unan bloques;
- Introducción, Bosquejo/puntos y Conclusión pueden conservarse como secciones lógicas, pero el área editable dentro de cada sección debe leerse como una hoja continua;
- la barra de herramientas debe inspirarse en patrones de editores de artículos/notas: formato de texto, tipo de párrafo/lista, adjuntos e inserciones, con controles compactos;
- la estructura interna nunca debe convertirse en ruido visual para el usuario.

Imágenes:

- Prédicas debe permitir insertar imágenes dentro del documento;
- las imágenes se almacenan como adjuntos independientes en IndexedDB, no embebidas como base64 dentro del texto ni dentro del registro completo de la prédica;
- un bloque de imagen referencia un adjunto mediante identificador estable;
- insertar una imagen debe usar la posición exacta del cursor dentro del texto cuando exista una selección/cursor activo;
- al insertar una imagen en medio de un párrafo, el texto anterior queda arriba y el texto posterior queda debajo, manteniendo una zona de escritura inmediata después de la imagen;
- las imágenes deben mostrarse con tamaño contenido dentro de la hoja y no ocupar casi toda la pantalla móvil por defecto;
- una imagen puede ampliarse en el futuro mediante una acción explícita, pero su representación normal dentro de la nota debe ser compacta;
- eliminar una prédica elimina también sus adjuntos huérfanos asociados;
- duplicar una prédica debe duplicar también los adjuntos necesarios para que la copia sea autónoma;
- las imágenes deben funcionar offline y mostrarse también en Modo Predicación cuando ese flujo se adapte al documento estructurado;
- la futura sincronización debe poder transferir adjuntos separadamente del texto;
- no se suben imágenes a servicios externos en esta etapa.

Orden corregido:

1. ocultar la estructura visual de bloques y recuperar una experiencia continua;
2. añadir modelo local de adjuntos e inserción de imágenes;
3. implementar la barra compacta de formato;
4. adaptar Modo Predicación y referencias al documento continuo estructurado;
5. validar integridad, autosave, retorno exacto, imágenes, duplicado, borrado y offline.

La versión 0.1.27 se considera una etapa técnica transitoria de la arquitectura, no la experiencia visual definitiva.


## D-055 — Barra compacta de edición de Prédicas
Estado: APROBADA

La hoja de Prédicas usa una barra compacta inspirada en aplicaciones de notas. Las funciones frecuentes quedan disponibles sin ocupar una fila sobredimensionada y las funciones de categoría abren paneles pequeños.

Reglas iniciales:

- el orden visible prioriza: `Aa → Texto → B → I → U → S → Listas → +`;
- `Texto` es acceso directo de segundo nivel visible para volver inmediatamente a párrafo normal;
- `Aa` agrupa H1, H2, cita y sangría; `Texto` deja de estar oculto dentro de ese panel;
- listas agrupa viñetas, numeración y checklist;
- `+` agrupa inserciones; la acción visible se denomina `Galería` y vive aquí, dejando de existir como botón independiente;
- al seleccionar Galería, la PWA restringe el selector a imágenes; el navegador/sistema operativo conserva control sobre qué proveedor nativo (Fotos/Galería/Archivos) muestra, porque la web no puede forzar una app específica;
- el formato inline se persiste mediante marks estructurados, no HTML;
- Negrita, Cursiva, Subrayado y Tachado funcionan en dos modos: sobre selección existente o como modo activo para lo que se escribe a continuación;
- cuando un formato inline está activo, su botón debe mostrar estado visual activo y permanecer así hasta desactivarlo o cambiar explícitamente ese estado;
- la cursiva debe representarse con una `I` reconocible, no con un símbolo ambiguo;
- H1, H2, Cita, viñetas, numeración y checklist deben mostrar estado activo y, si se toca de nuevo la opción ya activa, regresar inmediatamente a `Texto`;
- el tipo de párrafo/lista se persiste en el bloque interno;
- editar texto después de aplicar formato debe reajustar rangos de marks y no perderlos silenciosamente;
- dividir/unir párrafos debe preservar y trasladar los marks correspondientes;
- la estructura interna continúa invisible en la hoja normal;
- enlace, color/resaltado y deshacer/rehacer completarán la misma barra en el siguiente subhito, sin rediseñarla otra vez.

La barra no debe contener controles sin comportamiento real.


## D-056 — Editor de Prédicas en pantalla dedicada
Estado: APROBADA

Abrir o crear una prédica debe llevar a una pantalla dedicada exclusivamente a edición, separada visualmente de la navegación general de la aplicación.

Reglas:

- `Mis prédicas` conserva la función de lista, búsqueda y gestión;
- `/predicas/:sermonId` entra en modo de edición dedicado;
- durante la edición se ocultan topbar global, navegación inferior y avisos generales que puedan cubrir el documento;
- el editor mantiene su propio encabezado con volver a Mis prédicas, estado de guardado, Predicar y Guardar;
- la hoja ocupa el espacio principal disponible y debe sentirse como una pantalla de trabajo independiente;
- la barra de herramientas debe permanecer fija y visible aunque el usuario haga scroll en cualquier dirección;
- la implementación correcta usa `position: fixed` combinado con `window.visualViewport` para compensar dinámicamente el área ocupada por el teclado móvil;
- el offset inferior se recalcula ante `resize`, `scroll` del VisualViewport, cambio de orientación y resize general;
- `sticky` queda descartado para esta barra porque depende del flujo/scroll del documento y puede desaparecer al alejarse de su posición original;
- un `fixed` sin compensación de VisualViewport también queda descartado porque el teclado puede cubrirlo;
- los paneles de herramientas se mueven junto con la barra y se abren sobre ella sin obligar a desplazarse al final de la nota;
- crear una nueva prédica debe continuar navegando directamente a esta pantalla dedicada;
- el cambio es de experiencia/navegación, no altera el modelo local, autosave ni estructura del documento.


## D-057 — Pestaña lateral móvil de herramientas
Estado: APROBADA

La barra inferior flotante de edición queda sustituida por una pestaña lateral móvil. Esta decisión reemplaza únicamente la presentación/posición de las herramientas descrita en D-056; la pantalla dedicada de edición de D-056 se mantiene.

Reglas:

- no existe barra de herramientas permanente en la parte inferior del editor;
- existe una pestaña lateral compacta, fija respecto a la pantalla y separada del flujo del documento;
- la pestaña puede arrastrarse y colocarse en el lado izquierdo o derecho;
- también puede ajustarse verticalmente; la posición se limita al viewport visible para evitar que quede inaccesible;
- la preferencia de lado/altura se guarda localmente y se reutiliza al volver al editor;
- un toque sin arrastre abre el panel de herramientas;
- el panel se abre hacia el interior de la pantalla, nunca fuera de ella;
- al elegir una herramienta, el panel se cierra inmediatamente;
- tocar fuera del panel también lo cierra;
- arrastrar la pestaña cierra cualquier panel abierto;
- el panel preserva la selección/cursor del editor al aplicar B/I/U/S y demás herramientas;
- Texto sigue siendo la opción prioritaria para volver a párrafo normal;
- Galería permanece dentro de las herramientas de inserción;
- esta solución no depende de la posición del teclado ni del scroll del documento;
- la antigua combinación de barra inferior `sticky`/`fixed` con compensación del teclado queda retirada de la experiencia activa.

La estructura de datos, autosave, formatos y pantalla dedicada no cambian por esta decisión.


## D-058 — Enlace, color, resaltado e historial local
Estado: APROBADA

El panel lateral de D-057 completa su conjunto inicial de edición con Enlace, color de texto, resaltado y deshacer/rehacer sin cambiar nuevamente la mecánica de la pestaña lateral.

Reglas:

- Enlace funciona sobre texto seleccionado o como modo activo para texto que se escriba después;
- si la selección ya tiene enlace, tocar Enlace lo quita rápidamente;
- las URLs sin esquema reciben `https://` por defecto; también se aceptan `mailto:` y `tel:`;
- color de texto y resaltado se guardan como marks estructurados, no como HTML;
- los colores pueden aplicarse a selección existente o quedar activos para escritura posterior;
- `Normal` elimina color de texto sobre una selección o desactiva color futuro;
- `Sin` elimina resaltado sobre una selección o desactiva resaltado futuro;
- el render del editor debe combinar color/resaltado con B/I/U/S, enlaces y referencias sin destruir otros marks;
- deshacer/rehacer usa historial local en memoria y persiste inmediatamente el estado restaurado en IndexedDB;
- el historial agrupa escritura continua del mismo bloque en ventanas cortas para evitar un paso por carácter;
- el historial inicial cubre texto y formato del bloque actual;
- operaciones estructurales como dividir/unir párrafos o insertar/eliminar imágenes reinician el historial para evitar referencias a bloques/adjuntos ya modificados;
- el historial no pretende restaurar adjuntos eliminados ni sustituye el autosave;
- elegir cualquiera de estas herramientas cierra el panel lateral, según D-057.

Después de este hito, el siguiente trabajo es adaptar Modo Predicación al documento enriquecido completo y ejecutar validación integral.


## D-059 — Selección de documento continuo
Estado: APROBADA

La hoja de Prédicas debe comportarse como un documento editable continuo también para selección nativa. Los párrafos/bloques internos ya no pueden actuar como hosts `contenteditable` independientes.

Reglas:

- Introducción, Bosquejo y Conclusión comparten un único host `contenteditable` para el cuerpo de la prédica;
- los bloques internos siguen existiendo para persistencia/autosave, pero heredan edición del host común y no crean límites nativos de selección;
- `Seleccionar todo` debe poder abarcar varios párrafos y secciones del cuerpo;
- encabezados editoriales de sección, imágenes, prefijos de lista y controles de checklist no son contenido editable y no deben borrarse accidentalmente;
- borrar una selección que cruza bloques se procesa de forma estructurada, actualizando texto/marks y compactando únicamente bloques seleccionados contiguos;
- no se unen bloques a través de imágenes ni entre secciones;
- Android/móvil debe usar también `beforeinput` para borrar selecciones estructuradas, porque el teclado virtual no garantiza eventos `keydown`;
- Enter sigue dividiendo el bloque activo y Backspace al inicio sigue uniendo con el bloque anterior cuando corresponde;
- pegar texto sigue siendo texto plano y respeta una selección que atraviese más de un bloque;
- la corrección no cambia la apariencia, la pestaña lateral, el modelo de datos ni el autosave.


## D-060 — Paridad visual entre edición y Modo Predicación
Estado: APROBADA

Todo contenido que Prédicas permita insertar o formatear en edición debe tener una representación coherente en Modo Predicación. No se acepta que una imagen visible en edición desaparezca al predicar.

Reglas:

- Modo Predicación consume los bloques estructurados reales, no únicamente los campos legacy concatenados;
- las imágenes se cargan desde `sermonAttachments` y se muestran en el mismo orden relativo en que fueron insertadas;
- encabezados, párrafos, cita, viñetas, numeración, checklist, sangría y marks inline se renderizan en presentación;
- negrita, cursiva, subrayado, tachado, enlaces, color y resaltado conservan representación visual;
- las referencias bíblicas se detectan por bloque y conservan `blockId` para retorno exacto;
- al abrir Biblia desde Modo Predicación se guarda `blockId` junto con sección, índice local y scroll;
- al regresar desde Biblia se intenta primero el bloque/referencia exactos y solo después se usa scroll como fallback;
- las imágenes en presentación deben ajustarse al ancho disponible y no cubrir de forma desproporcionada la pantalla móvil;
- eliminar una imagen desde edición requiere confirmación explícita antes de borrar el bloque y su adjunto;
- ninguna acción destructiva de imagen puede ejecutarse con un solo toque sin confirmación.

Este hito corrige la inconsistencia existente entre edición y presentación y completa la adaptación inicial de Modo Predicación al documento estructurado.
