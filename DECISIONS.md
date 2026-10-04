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
