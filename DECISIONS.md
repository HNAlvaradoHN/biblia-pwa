# DECISIONS.md — DECISIONES DEL PROYECTO

Solo registrar aquí decisiones realmente aceptadas. No registrar ideas pasajeras como si fueran obligatorias.

## D-001 — PWA primero
Estado: APROBADA

La primera versión será una PWA. No cambiar a Android nativo por complejidad. Si en el futuro hace falta APK, se evaluará empaquetar la misma base web sin rehacer el proyecto.

## D-002 — GitHub como repositorio oficial
Estado: APROBADA

`HNAlvaradoHN/biblia-pwa` es el repositorio oficial del proyecto. Debe permanecer privado salvo decisión explícita posterior del usuario.

## D-003 — Cursor no es requisito
Estado: APROBADA

El proyecto no dependerá de Cursor. GitHub es la fuente oficial; el editor local es una herramienta secundaria. El asistente realizará el trabajo técnico principal.

## D-004 — Cero basura y estructura mantenible
Estado: APROBADA

No acumular copias, archivos de sesión, dependencias o módulos innecesarios. Git conserva el historial. La estructura debe facilitar modificaciones futuras.

## D-005 — Identidad secuencial de chats
Estado: APROBADA

Cada chat nuevo que trabaje en el proyecto debe tomar una identidad `Ing. Bibia 📖 #N` usando exclusivamente los campos `CURRENT_SESSION` y `NEXT_SESSION` de `AGENTS.md`.

No crear archivos por sesión ni listas históricas de números.

Antes de mostrar esa identidad, el chat debe leer y verificar toda la documentación obligatoria, el estado actualizado, las reglas de seguridad y la privacidad del repositorio; después debe reservar/confirmar su número en `AGENTS.md`. Mostrar la identidad certifica que completó ese protocolo.

## D-006 — Datos bíblicos separados de datos personales
Estado: APROBADA

El corpus bíblico debe estar separado lógicamente de prédicas, notas, favoritos, resaltados, historial y configuración para reducir riesgos al actualizar la Biblia.

## D-007 — Offline como base
Estado: APROBADA

La lectura bíblica y los datos personales esenciales deben funcionar sin Internet. La sincronización es complementaria, no requisito para usar la Biblia.

## D-008 — Vinculación de dispositivos mediante código
Estado: APROBADA

Para añadir un dispositivo se prefiere ingresar un código temporal en lugar de escanear QR. El código no será una contraseña permanente y no debe repetirse para cada sincronización una vez vinculado el dispositivo.

## D-009 — Dirección preferida para sincronización personal
Estado: APROBADA A NIVEL DE PRODUCTO / IMPLEMENTACIÓN ABIERTA

Se prefiere investigar e implementar sincronización opcional usando almacenamiento controlado por el usuario, actualmente Google Drive como primera opción, para permitir que un dispositivo reciba cambios aunque el otro esté apagado.

No se desea depender obligatoriamente de Supabase, Firebase, Cloudflare u otra base de datos comercial si no es necesaria.

La implementación exacta, cifrado, manejo de conflictos y autenticación quedan abiertos hasta su fase técnica.

## D-010 — Pantalla de congregación independiente
Estado: POSTERGADA / OPCIONAL

Si algún día se implementa, no debe duplicar la pantalla privada del pastor: la congregación tendría una vista independiente que solo muestre contenido público.

Sin embargo, desde 2026-09-09 esta función deja de formar parte del camino principal y del MVP. Debe quedar para el final del proyecto y no implementarse salvo que el usuario confirme posteriormente que realmente la quiere.

No diseñar otras partes del proyecto de forma que dependan obligatoriamente de esta función.

## D-011 — RVR60 deseada, licencia no asumida
Estado: APROBADA

RVR60 es la traducción principal deseada. No incorporar ni redistribuir un dataset completo encontrado en Internet sin verificar procedencia y permisos adecuados.

## D-012 — Stack técnico mínimo de Fase 1
Estado: APROBADA

La base técnica de Fase 1 será:

- React + TypeScript;
- Vite como herramienta de desarrollo y build;
- React Router en modo declarativo/sencillo para navegación;
- IndexedDB como almacenamiento local del navegador;
- Dexie como capa de acceso a IndexedDB para datos personales y estado local que requiera persistencia estructurada;
- `vite-plugin-pwa`/Workbox para instalación, funcionamiento offline, caché y aviso de actualización;
- ESLint y chequeo de TypeScript;
- pruebas automatizadas mínimas con herramientas compatibles con Vite/React cuando exista comportamiento que justificar probar;
- GitHub Actions para verificaciones automáticas antes de considerar una entrega en verde.

Reglas de alcance:

- no añadir Zustand en Fase 1 mientras el estado de React y módulos simples sean suficientes;
- no añadir Tiptap hasta la fase del editor de prédicas;
- no añadir backend, Supabase, Firebase u otra base de datos remota para la lectura bíblica inicial;
- mantener el corpus bíblico detrás de una estructura/proveedor reemplazable para poder usar datos de prueba legales ahora y sustituirlos por una fuente autorizada después sin romper referencias;
- mantener contenido bíblico y datos personales separados;
- el proveedor final de despliegue queda abierto hasta preparar la primera entrega ejecutable, porque no afecta la estructura base y debe evaluarse según costo, simplicidad y disponibilidad del momento.

Esta selección se considera decisión técnica interna delegada al asistente, coherente con las prioridades aprobadas de simplicidad, offline, mantenimiento y facilidad de modificación.

## D-013 — Interfaz modular y reemplazo limpio
Estado: APROBADA

La interfaz debe construirse de forma modular para permitir cambios frecuentes de temas, botones, posiciones, pantallas, menús, submenús, transiciones y efectos sin afectar lógica no relacionada.

Las reglas detalladas viven en `UI_RULES.md` y son obligatorias.

Cuando una solución visual o componente sea reemplazado definitivamente y el reemplazo esté verificado, el código anterior debe eliminarse junto con restos huérfanos. No conservar versiones viejas ocultas, comentadas o desactivadas como mecanismo de respaldo; Git conserva el historial.

## D-014 — Un objetivo activo a la vez
Estado: APROBADA

El desarrollo debe avanzar de forma secuencial y documentada. `PROJECT_STATE.md` define el objetivo activo y el siguiente paso.

No saltar entre módulos o introducir funciones no relacionadas antes de cerrar, probar, limpiar y documentar el objetivo actual, salvo que el usuario cambie explícitamente la prioridad.

## D-015 — Preguntas de producto con fundamento
Estado: APROBADA

Cuando una etapa requiera decisiones del usuario, el asistente debe preguntar desde la perspectiva de producto/experiencia, no trasladarle decisiones técnicas internas que puede resolver por su cuenta.

Las preguntas deben ser pocas, claras y relevantes, y aparecer cuando sean necesarias para avanzar. Deben centrarse en decisiones con impacto real sobre UX, privacidad, seguridad, costos, sincronización, compatibilidad, prioridades, diseño o comportamiento visible.

No repetir preguntas ya resueltas ni preguntar detalles obvios o de bajo impacto. Las respuestas aprobadas deben documentarse para que chats futuros continúen sin volver a empezar la conversación.

## D-016 — Entregas solo en verde y actualización visible
Estado: APROBADA

Cuando exista implementación ejecutable, ningún cambio puede presentarse como `Lista para probar` mientras haya fallos conocidos relevantes de build, chequeo de tipos, lint, pruebas, CI, merge o despliegue.

El asistente debe continuar corrigiendo los fallos resolubles dentro del trabajo actual y no silenciar verificaciones solo para obtener verde. Si existe un bloqueo externo real que no puede resolverse desde el entorno disponible, debe informarse claramente y no declarar la versión lista.

Toda versión desplegada deberá ser identificable y la PWA deberá avisar claramente cuando exista una nueva versión. Antes de probar cambios nuevos, el usuario debe actualizar para reducir el riesgo de evaluar una versión antigua por caché.

Excepción: nunca forzar una recarga que pueda interrumpir una sesión de predicación, edición no guardada u otra operación crítica. En ese caso se avisará y la actualización se aplicará en un punto seguro.

Las reglas completas de entrega viven en `RELEASE_RULES.md` y son obligatorias.

## D-017 — Pantalla de inicio
Estado: APROBADA

La aplicación abrirá en una pantalla de Inicio moderna en lugar de entrar directamente al lector bíblico.

La estructura base del Inicio tendrá:

1. acceso visible y compacto a `Continuar leyendo`, usando la última lectura del usuario;
2. una sección compacta `Lectura del día`;
3. la barra de navegación principal como acceso a `Biblia`, `Prédicas`, `Buscar` y demás áreas, sin duplicar esos accesos dentro del contenido de Inicio.

En teléfono, el Inicio debe priorizar que sus elementos esenciales quepan en una sola pantalla en un tamaño de texto normal y en móviles comunes, evitando desplazamiento vertical innecesario. No se recortará contenido ni se bloqueará el scroll cuando sea necesario por pantallas especialmente pequeñas, zoom o accesibilidad.

No usar una portada/hero grande de presentación en el Inicio de uso diario. La pantalla debe mantener la filosofía visual del proyecto: moderna, clara, responsiva, llamativa sin sobrecarga y fácil de entender en móvil, tablet y PC.

## D-018 — Lectura del día
Estado: APROBADA

`Lectura del día` mostrará un solo versículo destacado en la pantalla de Inicio.

Ese versículo tendrá al menos dos acciones visibles o de acceso directo:

- `Compartir`;
- `Leer pasaje completo`, abriendo el contexto bíblico correspondiente.

La forma exacta de seleccionar el versículo diario, su diseño visual y el formato de compartir se definirán cuando llegue su fase.

## D-019 — Personalización amplia del lector y del contenido compartido
Estado: DIRECCIÓN APROBADA / DETALLES PENDIENTES

La aplicación debe contemplar personalización amplia, pero sus detalles se definirán solo cuando corresponda a cada fase.

Queda registrado que se desea:

- dos formas de visualizar la disposición de versículos: versículos corridos y versículos separados;
- compartir versículos;
- permitir fondos visuales/imágenes para contenido compartido;
- contemplar fondos o estilos visuales dentro de la propia aplicación;
- ofrecer más temas que solo día/noche;
- permitir diversas personalizaciones de lectura y apariencia.

No adelantar preguntas ni implementación de estos puntos antes de su fase. Cuando llegue el momento, preguntar solo las decisiones necesarias y documentarlas por separado.

## D-020 — Entrada a la sección Biblia
Estado: APROBADA

Al tocar `Biblia` desde Inicio, no se abrirá únicamente un selector de libros ni únicamente la última lectura.

La pantalla principal de Biblia combinará:

- acceso a `Continuar leyendo` desde la última posición guardada;
- acceso claro al listado/selector de libros y capítulos;
- una lupa o búsqueda rápida para escribir el nombre de un libro y encontrarlo sin recorrer manualmente toda la lista.

La búsqueda por lupa de esta pantalla estará orientada primero a localizar libros rápidamente. La búsqueda de palabras o frases dentro del texto bíblico puede vivir como función separada para evitar confusión.

## D-021 — Selección de capítulos
Estado: APROBADA

Después de elegir un libro, la aplicación mostrará una cuadrícula clara con sus capítulos disponibles.

Si el usuario ya leyó antes ese libro, el último capítulo leído de ese libro quedará destacado visualmente para ayudarle a retomar su ubicación sin impedir que seleccione cualquier otro capítulo.

La selección de capítulos debe ser rápida, fácil de tocar en móvil/tablet y clara también en PC.

## D-022 — Dos experiencias de lectura bíblica
Estado: APROBADA

La Biblia tendrá dos experiencias de lectura distintas, sin crear un tercer modo innecesario:

### 1. Lector normal

Es la vista habitual de la Biblia.

- Permite desplazamiento vertical continuo.
- Puede continuar del final de un capítulo al siguiente dentro del mismo flujo.
- Conserva exactamente la posición del usuario.
- La disposición de versículos `corridos` o `separados` es una preferencia visual independiente y no constituye otro modo de lectura.

### 2. Lector capítulo por capítulo

Es una vista temporal y enfocada para leer un capítulo de manera individual, sin recorrer toda la hoja continua del lector normal.

- Presenta el capítulo de forma limpia y enfocada, ocupando prácticamente toda la zona útil de lectura.
- Puede usar una superficie/fondo opaco tipo hoja para mejorar concentración y legibilidad.
- Permite cambiar directamente al capítulo anterior o siguiente.
- En móvil/tablet, el gesto horizontal para cambiar de capítulo no debe depender exclusivamente de comenzar desde los bordes; debe reconocer un deslizamiento intencional desde una zona interior segura para evitar conflictos con los gestos del sistema.

### Regreso al lector normal

Al cerrar el lector capítulo por capítulo:

- volver exactamente al lector normal;
- restaurar la posición que el usuario tenía antes de abrir el lector temporal;
- señalar visualmente esa posición durante aproximadamente 2 segundos para que el usuario identifique inmediatamente dónde iba;
- el indicador temporal no debe mover el texto ni hacer perder la posición.

El diseño exacto del indicador de retorno y de los controles del lector capítulo por capítulo se definirá en la fase visual correspondiente.

## D-023 — Títulos y encabezados bíblicos
Estado: APROBADA

El lector no debe presentar la Biblia como una sucesión plana de versículos. Debe mostrar también los títulos, encabezados o temas de sección correspondientes, como en una Biblia impresa o digital normal.

Estos encabezados deben formar parte de la estructura de contenido del lector y verse claramente diferenciados del texto bíblico sin confundirse con números de versículo.

Como los títulos de sección pueden ser contenido editorial propio de una edición concreta, no se inventarán ni se copiarán de una fuente no autorizada. La fuente bíblica definitiva deberá incluirlos legalmente o proporcionar una forma autorizada y confiable de incorporarlos.

## D-024 — Posible distribución pública futura
Estado: APROBADA

La aplicación no se diseña únicamente para uso privado permanente. El objetivo es que en el futuro pueda publicarse para que otras personas la instalen y utilicen.

Consecuencias obligatorias:

- la arquitectura no debe depender de datos bíblicos que solo sean aceptables para una prueba privada;
- antes de incorporar o distribuir RVR60, títulos editoriales u otro contenido con derechos, debe verificarse que exista permiso o una fuente autorizada para ese uso;
- durante desarrollo puede usarse contenido ficticio, limitado o una fuente legal de prueba si todavía no se dispone de derechos para el corpus definitivo;
- el hecho de que el repositorio sea privado no convierte en redistribuible un contenido protegido;
- la publicación futura no obliga a abrir públicamente el repositorio ni a exponer datos personales del usuario.

## D-025 — Dirección visual moderna desde la primera entrega
Estado: APROBADA

La aplicación debe verse actual, clara, atractiva y fácil de entender desde su primera versión ejecutable. No se construirá deliberadamente una interfaz anticuada o descuidada para corregirla al final.

La experiencia debe adaptarse de forma real a teléfono, tablet y computadora, mantener buena legibilidad y objetivos táctiles cómodos, y evitar sobrecarga de controles o efectos.

La dirección detallada vive en `UI_RULES.md`. Esta regla no obliga a implementar ahora todos los temas, fondos o personalizaciones futuras; exige que la base visual ya sea moderna, coherente y preparada para evolucionar limpiamente.

## D-026 — Navegación glass compatible con temas y fondos
Estado: APROBADA

La barra de navegación inferior usará una dirección visual tipo `glass`: superficie translúcida, desenfoque y contraste suficientes para dejar percibir parcialmente el fondo sin perder legibilidad.

La sección activa debe distinguirse con un tono suave derivado del tema visual actual. La arquitectura de estilos debe permitir que, cuando se implementen fondos de pantalla o temas personalizados, ese tono pueda adaptarse al fondo/tema sin rehacer la navegación.

El efecto glass no debe ser tan transparente que perjudique lectura, accesibilidad o claridad de iconos y etiquetas. Los fondos de pantalla personalizados siguen perteneciendo a su fase futura; esta decisión solo prepara la navegación para convivir correctamente con ellos.

## D-027 — Guardados recientes en Inicio
Estado: APROBADA

La pantalla Inicio puede aprovechar el espacio disponible mostrando una sección compacta `Guardados recientes` con vistas previas de contenido guardado, como favoritos, resaltados o notas, en lugar de rellenar con accesos duplicados o contenido decorativo sin función.

Reglas:

- la sección debe mantenerse compacta y priorizar que Inicio siga cabiendo sin scroll vertical en móviles comunes con tamaño de texto normal;
- puede mostrar dos o tres vistas previas recientes y adaptarse horizontalmente si el ancho es limitado;
- cada vista previa debe indicar claramente el tipo de guardado y su referencia bíblica;
- cuando existan guardados reales, la sección deberá alimentarse de los datos reales del usuario;
- mientras la función de guardados todavía no esté implementada, cualquier contenido usado para probar la composición debe estar marcado explícitamente como demostración y no presentarse como dato personal real;
- en pantallas bajas, se reducirán primero textos secundarios y altura de las vistas previas antes de introducir desplazamiento vertical innecesario.

## D-028 — Favoritos y notas como colecciones reales
Estado: APROBADA

Las tarjetas `Favoritos` y `Notas` de `Guardados recientes` serán accesos funcionales a colecciones completas y no nuevas pestañas de la barra inferior.

- `Favoritos` abre una pantalla completa con todos los versículos marcados como favoritos por el usuario.
- `Notas` abre una pantalla completa con todas las notas bíblicas guardadas por el usuario.
- Cada elemento conserva una referencia bíblica estructurada y permite volver directamente al versículo exacto relacionado.
- El Inicio muestra una vista previa reciente tomada de los datos reales del usuario; cuando no hay datos, muestra un estado vacío útil en lugar de contenido ficticio presentado como personal.
- En el lector normal, tocar un versículo revela acciones contextuales sin llenar permanentemente el texto de controles.
- La primera implementación incluye guardar/quitar favorito y crear, guardar o eliminar una nota asociada al versículo.
- Favoritos y notas son datos personales locales, almacenados de forma separada del corpus bíblico.

La implementación interna puede evolucionar más adelante sin cambiar esta experiencia, por ejemplo para ampliar organización, búsqueda o edición de notas cuando corresponda.

## D-029 — Versículo activo por defecto y acciones adicionales
Estado: APROBADA

En el lector normal, tocar un versículo debe marcarlo de forma visible como `versículo activo` para ayudar al usuario a seguir por dónde va leyendo.

Reglas:

- el versículo activo es el comportamiento por defecto al tocar un versículo durante la lectura normal;
- solo puede existir un versículo activo a la vez;
- al tocar otro versículo, el anterior deja de estar activo y el nuevo toma su lugar;
- la marca del versículo activo debe ser visualmente suave y distinta de un resaltado permanente;
- la posición activa debe guardarse localmente para ayudar a retomar la lectura sin perder el punto;
- `Resaltar` es una acción independiente y persistente: puede existir en varios versículos a la vez;
- el panel contextual del versículo incluirá, además de `Favorito` y `Nota`, las acciones `Resaltar`, `Copiar` y `Compartir`;
- `Copiar` copiará texto y referencia de forma clara;
- `Compartir` usará el mecanismo nativo del dispositivo cuando esté disponible y tendrá un fallback razonable cuando no lo esté;
- los detalles visuales avanzados de colores de resaltado y compartir con imágenes/fondos siguen reservados para una fase posterior.

Esta distinción evita confundir la guía temporal de lectura con los resaltados que el usuario decide conservar como guardados permanentes.

## D-030 — Protocolo estricto de continuidad y repositorio publicable
Estado: APROBADA / ACTUALIZADA PARA CONVIVIR CON AGENTS.md v4

Todo chat nuevo debe tratar la lectura del estado y reglas del repositorio como una puerta obligatoria antes de trabajar. No puede responder sobre implementación ni editar hasta leer y verificar `AGENTS.md`, `PROJECT_BRIEF.md`, `PROJECT_STATE.md`, `DECISIONS.md`, `SECURITY.md`, `UI_RULES.md`, `RELEASE_RULES.md` y el `CHANGELOG.md` reciente, comprobar el repositorio oficial, verificar su visibilidad actual y reservar su número secuencial.

Desde 2026-10-03, `AGENTS.md` v4 y la identidad secuencial conviven: todo chat nuevo comienza en `LOCKED_READ_ONLY`, completa la lectura y sincronización obligatorias, reserva y verifica su identidad `Ing. Bibia 📖 #N`, emite el `LOCKED_READ_ONLY_REPORT` y solo modifica producto cuando existe una tarea autorizada. La identidad secuencial no puede eliminarse ni sustituirse sin aprobación explícita del dueño.

Además, el repositorio se desarrollará desde ahora como potencialmente público: no puede contener secretos, credenciales, tokens, claves privadas, URLs firmadas temporales, datos personales reales, bases de datos personales ni otros valores cuya exposición comprometa al usuario. Los secretos nunca pueden depender de permanecer ocultos dentro del frontend/PWA.

Antes de cada merge debe revisarse el diff por secretos y datos personales. Antes de hacer público el repositorio será obligatoria una auditoría separada del árbol actual y del historial completo de Git, además de licencias y configuración externa. La visibilidad no se cambiará sin autorización explícita del usuario después de esa auditoría.


## D-031 — APK externa como referencia/donante
Estado: APROBADA

La aplicación Android externa aportada por el usuario se utilizará como fuente de análisis para identificar estructura, funciones y patrones de UX que puedan mejorar Biblia PWA.

Reglas:

- Biblia PWA sigue siendo la base oficial; no se sustituye por el proyecto Flutter compilado de la APK.
- Se pueden reconstruir con código propio funciones observadas en la APK cuando encajen con el alcance y arquitectura aprobados.
- La estructura de datos de libros, capítulos, versículos y encabezados puede estudiarse y servir como referencia técnica.
- No copiar ni reutilizar secretos, tokens, credenciales, configuración privada o servicios externos innecesarios encontrados dentro del paquete.
- No incorporar automáticamente RVR60, encabezados editoriales, fuentes, iconos, imágenes u otros recursos sin verificar procedencia y derechos de redistribución.
- Todo elemento candidato debe clasificarse antes de integrarlo como: `REUTILIZABLE VERIFICADO`, `RECONSTRUIBLE`, `REQUIERE LICENCIA` o `NO REUTILIZAR`.
- Los hallazgos de la APK no cambian por sí solos el objetivo activo; las funciones se incorporan por fases y sin mezclar tareas.
- El inventario y las conclusiones relevantes deben quedar documentados para que un chat nuevo pueda continuar sin depender de esta conversación.

## D-032 — Versículo activo, menú bajo demanda y selección múltiple
Estado: APROBADA

El toque normal sobre un versículo sirve únicamente para mover el `versículo activo` y no debe abrir automáticamente el menú contextual.

Reglas:

- el versículo activo seguirá siendo único y persistente como guía de lectura;
- el versículo activo mostrará un control discreto de opciones en una esquina para abrir el menú contextual solo cuando el usuario lo necesite;
- el menú podrá cerrarse con una `X` o tocando fuera del panel;
- existirá un modo temporal de selección múltiple para aplicar acciones razonables a varios versículos a la vez;
- en selección múltiple se admiten como acciones iniciales `Favoritos`, `Resaltar`, `Copiar` y `Compartir texto`; las notas siguen siendo individuales;
- compartir varios versículos como texto sí está permitido mientras el sistema operativo acepte el contenido;
- compartir como imagen se implementará en una fase visual posterior y no deberá intentar meter automáticamente todos los versículos seleccionados;
- cuando la selección exceda lo que el diseño de imagen pueda mostrar de forma legible, la app deberá advertir al usuario y pedir reducir la selección;
- el límite de imagen deberá depender del espacio/layout real de la plantilla, tipografía y contenido, no de un número fijo arbitrario de versículos.

## D-033 — Compartir por formato y búsqueda bíblica
Estado: APROBADA

Al ejecutar `Compartir`, la aplicación debe preguntar primero si el usuario desea compartir como `Texto` o como `Imagen`.

Reglas:

- la elección de formato aplica tanto a un versículo como a una selección múltiple;
- texto puede incluir todos los versículos seleccionados mientras el dispositivo acepte el contenido;
- imagen se genera localmente y debe conservar referencia y legibilidad;
- si el contenido no cabe de forma legible en la plantilla de imagen, la aplicación no debe recortarlo ni reducirlo de forma extrema: debe advertir y pedir una selección menor;
- el cálculo de capacidad de imagen depende del texto real y del espacio disponible, no de un número fijo de versículos;
- si el dispositivo permite compartir archivos mediante Web Share, la imagen se comparte directamente; si no, se ofrece como archivo descargable.

La siguiente función activa después de estabilizar estas acciones es la búsqueda bíblica de palabras o frases sobre todo el corpus disponible, con resultados que abren el versículo exacto.

## D-034 — Personalización inicial al compartir imagen y búsqueda ampliada
Estado: APROBADA

La función `Compartir como imagen` debe ser útil desde su primera versión visual sin esperar a toda la futura personalización global de la aplicación.

Reglas:

- incluir varios fondos visuales predeterminados aptos para lectura;
- permitir elegir un color de fondo personal;
- permitir usar una imagen personal del dispositivo como fondo de esa composición, procesada localmente y sin subirla a un servicio externo;
- conservar contraste mediante una capa de protección cuando se use una foto;
- si el texto seleccionado no cabe de forma legible, pedir reducir la selección;
- la personalización usada para compartir una imagen es independiente de los futuros fondos/temas permanentes de la aplicación.

La búsqueda bíblica unificada también debe localizar libros por nombre además de palabras/frases dentro de versículos. En los resultados textuales debe resaltarse visualmente la coincidencia buscada, incluyendo coincidencias equivalentes sin tilde cuando sea posible.

El lector capítulo por capítulo aprobado en D-022 pasa a implementación después de estas mejoras: vista enfocada, capítulo anterior/siguiente, gesto horizontal intencional y regreso al lector normal conservando la posición, con señal visual temporal al volver.

## D-035 — Selector de modo de lectura
Estado: APROBADA

El acceso directo `Leer capítulo` se sustituye por un selector `Modo de lectura` para que el usuario elija la experiencia sin perder la posición del lector normal.

Modos iniciales:

- `Continuo`: mantiene el lector vertical normal actual.
- `Capítulo por capítulo`: muestra un capítulo completo en una vista enfocada con anterior/siguiente y gesto horizontal intencional.
- `Versículo por versículo`: muestra una sola referencia por vez para lectura pausada y permite avanzar o retroceder entre versículos, incluso al cruzar capítulos.

Reglas:

- entrar a un modo enfocado debe capturar la posición real más cercana del lector normal, no solo el capítulo de la URL;
- cerrar cualquier modo enfocado debe regresar al lector normal a esa posición;
- al regresar, la pantalla debe desplazarse automáticamente hasta el ancla guardada;
- la posición recuperada debe señalarse visualmente durante aproximadamente 2 segundos;
- los controles de salida deben ser evidentes y no depender únicamente de gestos;
- los gestos horizontales no deben reemplazar los botones anterior/siguiente;
- este selector de modo es independiente de la futura preferencia visual de versículos corridos o separados.

## D-036 — Corrección + avance continuo cuando el usuario lo pide
Estado: APROBADA

Cuando el usuario reporte una corrección y en la misma instrucción pida continuar con el siguiente paso, esa instrucción se interpreta como un objetivo compuesto autorizado: corregir primero lo necesario y, si no existe un bloqueo real, avanzar inmediatamente al siguiente objetivo oficial ya definido.

Reglas:

- no detener el avance solo porque apareció una corrección pequeña o visual;
- corregir primero cualquier defecto que afecte el flujo que se está probando;
- después continuar con el siguiente objetivo oficial ya registrado, sin pedir una autorización adicional cuando el usuario ya indicó explícitamente que se continúe;
- sí detenerse cuando sea obligatorio terminar o validar antes de avanzar por seguridad, integridad de datos, arquitectura, costo, irreversibilidad, CI roto o dependencia técnica bloqueante;
- no usar esta regla para abrir funcionalidades no aprobadas ni ampliar producto fuera del roadmap/decisiones existentes.

## D-037 — Resaltados por color con comportamiento común
Estado: APROBADA

Los resaltados persistentes deben permitir elegir colores suaves y conservar una apariencia tipo vidrio esmerilado, no una tarjeta plana o saturada.

Reglas:

- paleta inicial: Ámbar, Salvia, Cielo, Rosa, Lavanda y Durazno;
- el color se guarda localmente como parte del resaltado del versículo;
- el resaltado tiñe suavemente la tarjeta visual y mantiene contraste/legibilidad;
- selección múltiple puede aplicar el mismo color a todos los versículos seleccionados;
- si todos los versículos seleccionados comparten el mismo resaltado/color, la interfaz debe detectar esa propiedad común y ofrecer quitarla de todos;
- si la selección tiene estados distintos, la paleta puede unificarlos aplicando un nuevo color;
- quitar el resaltado no elimina favoritos, notas ni otras propiedades independientes.

## D-038 — Menús contextuales inteligentes y transición de página
Estado: APROBADA

Los menús contextuales del lector deben mantenerse visibles aunque el versículo activo esté cerca del inicio o del final de la pantalla.

Reglas:

- al abrir el menú de los tres puntos, la interfaz mide el espacio disponible;
- si hay espacio suficiente debajo, el menú aparece debajo;
- si el borde inferior, barra de navegación u otra zona útil dejaría el menú cortado, aparece encima;
- el panel puede limitar su altura y desplazarse internamente si el contenido crece;
- el comportamiento debe recalcularse al hacer scroll, rotar o redimensionar la pantalla.

En los modos enfocados, avanzar o retroceder puede usar una transición visual breve inspirada en pasar una página. Debe ser sutil, rápida y respetar `prefers-reduced-motion`.

La indicación de gesto horizontal es ayuda temporal: se muestra al entrar y desaparece automáticamente para conservar la pantalla limpia.

## D-039 — Personalización global inicial de lectura
Estado: APROBADA

La personalización global comienza con controles persistentes y separados del sistema de compartir imágenes.

Primera etapa:

- temas generales seguros: Claro, Sepia, Verde y Noche;
- tamaño del texto bíblico;
- tres familias tipográficas de sistema para evitar dependencias/licencias adicionales;
- color del texto bíblico con validación mínima de contraste;
- color de fondo general;
- persistencia local de preferencias;
- las superficies de lectura conservan contraste propio para que un fondo general personalizado no vuelva ilegible el contenido.

Reglas:

- estos ajustes afectan la lectura normal y los modos enfocados;
- no deben modificar automáticamente las plantillas/fondos de `Compartir como imagen`;
- un color de texto con contraste insuficiente debe rechazarse;
- los temas oscuros deben conservar botones, paneles glass y navegación legibles;
- personalizaciones más avanzadas, como tema generado desde una imagen, pueden añadirse después sobre esta base sin romper las preferencias existentes.

## D-040 — Contraste obligatorio de temas y resaltados
Estado: APROBADA

La personalización visual no puede reducir la legibilidad. Cada tema debe tener colores coordinados para fondo, superficies, texto principal, texto secundario, marca y controles.

Reglas:

- el texto principal y el texto bíblico deben mantener contraste alto respecto a sus superficies;
- el texto secundario debe mantener contraste legible, evitando tonos demasiado apagados;
- los componentes glass deben mezclar con las superficies del tema, no con blanco fijo, para evitar tarjetas lavadas en modo oscuro;
- los colores fijos de texto que funcionen solo en tema claro deben reemplazarse por variables del tema;
- los resaltados usarán colores semánticos claros: Azul, Verde, Rojo, Amarillo, Naranja y Morado;
- el resaltado sigue siendo translúcido/suave tipo vidrio esmerilado y nunca debe convertirse en un bloque saturado que opaque el texto;
- cambiar de tema debe conservar legibilidad de tarjetas, navegación, avisos, botones y lector.

## D-041 — Temas curados y submenús modales con blur
Estado: APROBADA

La personalización de tema no debe exponer combinaciones libres de fondo/texto que puedan producir resultados visuales feos o ilegibles. La primera versión estable usa temas completos predefinidos, cada uno con sus propios tokens de contraste.

Temas iniciales curados:

- Claro;
- Sepia;
- Verde;
- Azul;
- Rojo;
- Morado;
- Noche.

Reglas:

- cada tema define conjuntamente fondo general, superficies, superficie del lector, texto principal, texto secundario, bordes, marca, acento y colores glass;
- no mostrar selectores libres de color de texto o fondo general dentro de esta etapa;
- tamaño de texto y fuente siguen siendo personalizables;
- todos los textos que hereden color global deben usar `--ink` o una variable temática equivalente, evitando colores estáticos que desaparezcan en Noche;
- títulos de libros, marca `Biblia`, botones, avisos y navegación deben comprobarse explícitamente en tema Noche;
- los submenús contextuales deben aparecer por encima del contenido y navegación, con fondo desenfocado;
- si un submenú no cabe completo, debe tener desplazamiento interno y permanecer accesible dentro del viewport;
- el menú de los tres puntos mantiene posicionamiento inteligente arriba/abajo, pero siempre sobre un backdrop blur.

## D-042 — Menú de versículo completo en móvil
Estado: APROBADA

En pantallas móviles el menú de acciones del versículo debe priorizar que todas las acciones sean accesibles y visibles por encima de conservar un anclaje estricto al botón de tres puntos.

Reglas:

- en móvil se presenta como hoja flotante dentro del viewport con margen seguro;
- puede usar scroll interno cuando el contenido sea más alto que la pantalla;
- el encabezado con referencia y cierre permanece visible durante el scroll;
- debe respetar safe areas y quedar por encima de la navegación inferior;
- conserva backdrop blur y contraste del tema;
- en pantallas más amplias puede seguir usando posicionamiento contextual alrededor del versículo.

## D-043 — Disposición de versículos separados o corridos
Estado: APROBADA

La apariencia de lectura permite elegir entre dos disposiciones sin cambiar el contenido ni el modo de navegación.

Opciones:

- `Separados`: un versículo por bloque, comportamiento visual actual.
- `Corridos`: los versículos fluyen como un párrafo de Biblia impresa, con números de versículo discretos en superíndice y sin tarjetas separadas, conservando interacción individual.

Reglas:

- la preferencia se guarda localmente junto con apariencia;
- el cambio debe aplicarse inmediatamente sin recargar;
- afecta al lector continuo y al modo capítulo por capítulo;
- el modo versículo por versículo permanece individual por definición;
- favoritos, notas, resaltados, versículo activo y selección múltiple siguen asociados a cada versículo, independientemente de la disposición;
- el menú de acciones debe seguir accesible en modo corrido;
- el resaltado y el versículo activo en modo corrido deben marcar solo el texto del versículo de forma sutil, sin convertirlo en una tarjeta completa;
- títulos/encabezados de sección siguen separando bloques temáticos.

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
