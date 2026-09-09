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

Cada chat que trabaje en el proyecto debe tomar una identidad `Ing. 📚 #N` usando exclusivamente los campos `CURRENT_SESSION` y `NEXT_SESSION` de `AGENTS.md`.

No crear archivos por sesión ni listas históricas de números.

El chat debe leer toda la documentación obligatoria y reservar/confirmar su número antes de presentarse con esa identidad.

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
