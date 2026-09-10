# CHANGELOG.md

Registrar únicamente cambios relevantes del proyecto. No usar este archivo como transcripción de conversaciones.

## 2026-09-09 — Inicialización del proyecto

- Creado el repositorio privado oficial `HNAlvaradoHN/biblia-pwa`.
- Añadido protocolo obligatorio para continuidad e identidad secuencial de chats.
- Añadido resumen maestro del alcance de Biblia PWA y Modo Predicación.
- Añadido estado inicial del proyecto.
- Registradas decisiones aprobadas hasta la fecha.
- Establecidas reglas de privacidad, seguridad y cero basura.
- Proyecto permanece en planificación; todavía no se ha creado código de la PWA.

## 2026-09-09 — Prioridad de funciones

- Pantalla de congregación movida al final como función opcional y fuera del MVP.
- No debe implementarse salvo confirmación posterior del usuario.
- Escritura con lápiz/stylus en el editor registrada como idea en evaluación, todavía no como requisito aprobado.

## 2026-09-09 — Disciplina de interfaz y desarrollo

- Creado `UI_RULES.md` como regla obligatoria para temas, botones, layouts, pantallas, menús, submenús, transiciones, efectos y cambios visuales.
- Establecido reemplazo limpio: una solución anterior verificada como sustituida debe eliminarse junto con código, estilos, imports y dependencias huérfanas.
- Prohibido conservar diseño viejo oculto, comentado o desactivado como respaldo permanente; Git conserva el historial.
- `AGENTS.md` exige leer `UI_RULES.md` antes de que un chat pueda tomar identidad y trabajar.
- Establecido desarrollo secuencial con un único objetivo activo principal en `PROJECT_STATE.md`.

## 2026-09-09 — Protocolo de decisiones con el usuario

- Establecido que las preguntas al usuario deben centrarse en decisiones de producto con impacto real.
- Evitar preguntas técnicas internas, obvias, repetidas o de bajo valor.
- Las preguntas deben ser claras, pocas, oportunas y acompañadas de recomendación cuando corresponda.
- Las respuestas aprobadas deben documentarse para evitar volver a preguntar lo mismo en chats futuros.

## 2026-09-09 — Disciplina de entregas y actualización

- Creado `RELEASE_RULES.md` como regla obligatoria para merge, CI, despliegue, versiones y actualización de la PWA.
- Prohibido declarar una versión `Lista para probar` mientras existan fallos conocidos relevantes de build, tipos, lint, pruebas, CI, merge o despliegue.
- Cada versión desplegada deberá ser identificable para confirmar qué build está usando el usuario.
- La PWA deberá avisar cuando exista una nueva versión y pedir actualizar antes de probar cambios nuevos.
- No se forzará una recarga durante predicación, edición no guardada u otra operación crítica; la actualización se aplicará en un punto seguro.
- `AGENTS.md` exige leer `RELEASE_RULES.md` antes de que un chat pueda tomar identidad y trabajar.

## 2026-09-09 — Estructura de pantalla de Inicio

- Aprobado que la aplicación abra en una pantalla de Inicio, no directamente en el lector bíblico.
- El Inicio tendrá `Continuar leyendo`, una sección `Lectura del día` y accesos claros a `Biblia`, `Prédicas`, `Buscar` y otras funciones aprobadas.
- `Lectura del día` queda definida como un solo versículo con opciones `Compartir` y `Leer pasaje completo`.

## 2026-09-09 — Personalización futura del lector

- Registrado que la Biblia deberá contemplar dos modos de disposición de versículos: versículos corridos y versículos separados.
- Compartir versículos formará parte del producto, incluyendo la posibilidad de usar imágenes o fondos visuales.
- Se desea contemplar fondos/estilos dentro de la aplicación, temas adicionales además de día/noche y más personalizaciones de lectura/apariencia.
- Los detalles de estas funciones no se decidirán ahora; se preguntarán y documentarán cuando llegue la fase correspondiente.

## 2026-09-09 — Entrada a la sección Biblia

- Aprobado que `Biblia` tenga una pantalla propia que combine `Continuar leyendo`, selector de libros/capítulos y búsqueda rápida de libros.
- Se añadirá una lupa para escribir el nombre de un libro y encontrarlo rápidamente sin recorrer manualmente toda la lista.
- Esta búsqueda rápida estará orientada a localizar libros; la búsqueda de palabras/frases bíblicas se mantendrá como función separada para evitar confusión.
- Al elegir un libro, se mostrará una cuadrícula de capítulos y se destacará el último capítulo leído de ese libro para facilitar retomar la lectura.

## 2026-09-09 — Dos experiencias de lectura bíblica

- Corregida la definición anterior para evitar confundir `capítulo separado` con un tercer modo de lectura.
- La Biblia tendrá un lector normal con desplazamiento vertical continuo entre capítulos.
- Existirá además un lector temporal capítulo por capítulo para leer un capítulo de forma enfocada y cambiar al anterior/siguiente.
- En móvil/tablet, el gesto horizontal de cambio de capítulo evitará depender de los bordes para no chocar con gestos del sistema.
- Al cerrar el lector capítulo por capítulo, se restaurará exactamente la posición previa del lector normal.
- Esa posición se resaltará o indicará visualmente durante aproximadamente 2 segundos para que el usuario identifique dónde iba.
- `Versículos corridos` y `versículos separados` quedan como preferencia de disposición del texto, independiente de las dos experiencias de lectura.

## 2026-09-09 — Títulos temáticos de la Biblia

- Aprobado que el lector muestre títulos/encabezados de sección además de los versículos, para conservar una experiencia similar a una Biblia normal.
- Los encabezados deben diferenciarse visualmente del texto bíblico y formar parte de la estructura del contenido.
- No se inventarán ni copiarán encabezados editoriales de una fuente sin autorización; la fuente bíblica definitiva deberá permitir incorporarlos legalmente o aportar una alternativa autorizada.
- Con esta decisión se considera suficientemente definida la experiencia base de lectura necesaria para pasar al cierre del stack técnico mínimo de Fase 1.

## 2026-09-09 — Distribución futura y stack de Fase 1

- Aprobado que la aplicación pueda publicarse en el futuro para que otras personas la instalen y utilicen.
- Esto convierte la licencia del corpus bíblico y de los encabezados editoriales en un requisito real antes de distribuir contenido definitivo.
- Mientras no exista una fuente autorizada, Fase 1 podrá usar datos ficticios, muestras limitadas o una fuente legal de prueba detrás de una arquitectura reemplazable.
- Cerrado el stack técnico mínimo de Fase 1: React + TypeScript + Vite, React Router, IndexedDB + Dexie, `vite-plugin-pwa`, TypeScript/ESLint y GitHub Actions.
- Zustand y Tiptap quedan fuera de Fase 1 hasta que exista una necesidad real.
- `PROJECT_STATE.md` avanza el objetivo activo desde planificación de arquitectura a inicialización de la PWA base.

## 2026-09-09 — Primera base ejecutable de Fase 1

- Inicializada la aplicación React + TypeScript + Vite en versión `0.1.0`.
- Añadida PWA con manifiesto, service worker/Workbox, limpieza de cachés antiguas y aviso explícito `Nueva versión disponible` / `Actualizar ahora`.
- Añadida versión visible para identificar con certeza el build que se está usando.
- Implementada pantalla Inicio con `Continuar leyendo`, versículo diario de demostración y accesos a las áreas principales.
- Implementada entrada a Biblia con búsqueda rápida por nombre de libro, selector de capítulos y resaltado preparado para el último capítulo leído.
- Implementado lector vertical continuo con títulos de sección y contenido ficticio claramente identificado como prueba, no RVR60.
- Implementado modelo/proveedor bíblico reemplazable separado de los datos personales.
- Implementada persistencia local con IndexedDB/Dexie para libro, capítulo y ancla de versículo de la última lectura.
- Añadido diseño base moderno y responsive con tokens CSS centralizados y soporte de movimiento reducido.
- Registrada como regla permanente la dirección visual moderna desde la primera entrega en `UI_RULES.md` y D-025.
- Añadido `package-lock.json` reproducible y CI permanente con `npm ci`, TypeScript, ESLint, build PWA y auditoría de dependencias.
- Durante bootstrap se detectaron y corrigieron antes del merge una incompatibilidad Vite/PWA y un error de TypeScript; el ciclo final de bootstrap quedó en verde.
- Prédicas, búsqueda de texto bíblico, sincronización y personalizaciones avanzadas siguen fuera de este cambio para respetar el alcance de Fase 1.

## 2026-09-09 — Preparación y primer intento de entrega 0.1.0

- Integrada la base ejecutable a `main` mediante PR #1 después de CI verde; `main` volvió a quedar verde tras el merge.
- Integrada mediante PR #2 la retención del `dist/` verificado de `main` y el fallback SPA necesario para rutas internas de un host estático.
- El commit `7fdf73867de2d12c88fad62e8675de5fadce6b20` pasó `npm ci`, TypeScript, ESLint, build PWA y auditoría de dependencias.
- GitHub Actions conservó el artefacto exacto `biblia-pwa-dist` con digest `sha256:2219827e137032cd028d66bd9830e6b9ecbc86e71dc7b32edb0c2139a53c5481`.
- Se creó un despliegue de producción en Vercel usando ese artefacto exacto para evitar reconstrucciones distintas al build aprobado por CI.
- La verificación automática publicada quedó inicialmente bloqueada porque el conector de lectura de Vercel no tenía acceso al scope/equipo donde se creó el despliegue.
- Posteriormente el usuario pudo abrir el enlace público en su dispositivo, confirmando que la aplicación publicada cargaba y permitiendo iniciar revisión visual real.

## 2026-09-09 — Inicio móvil compacto 0.1.1

- Revisada la primera publicación real en un teléfono y detectado que Inicio ocupaba demasiado espacio vertical.
- Eliminada la portada/hero grande del Inicio de uso diario.
- Eliminada la sección de accesos `Biblia`, `Prédicas` y `Buscar` dentro de Inicio porque duplicaba la barra de navegación inferior.
- Inicio queda centrado en `Continuar leyendo` y `Lectura del día`.
- Compactados en móvil el encabezado, tarjetas, botones y barra inferior para priorizar que el contenido esencial quepa en una sola pantalla en móviles comunes y tamaño de texto normal.
- Se conserva desplazamiento cuando sea necesario por pantallas muy pequeñas, zoom o accesibilidad; no se recorta contenido.
- Eliminados los estilos huérfanos de la portada y de los accesos retirados.
- El build de este ajuste queda identificado como `0.1.1`.

## 2026-09-09 — Inicio visual y barra glass 0.1.2

- Aprobada una dirección tipo glass para la navegación inferior, con transparencia y desenfoque controlados para que futuros fondos/temas puedan percibirse detrás sin perder legibilidad.
- El estado activo usa un tono suave derivado del color del tema y queda preparado para adaptarse a futuros fondos sin rehacer la barra.
- Sustituidos símbolos tipográficos de navegación por iconos SVG consistentes para `Inicio`, `Biblia`, `Prédicas` y `Buscar`.
- Añadido al Inicio un encabezado compacto con fecha/contexto para evitar sensación de vacío sin volver a añadir accesos duplicados.
- `Continuar leyendo` gana jerarquía visual con icono y tarjeta translúcida compacta.
- `Lectura del día` queda como pieza protagonista con superficie glass suave y mantiene `Compartir` / `Leer pasaje completo`.
- Añadidos ajustes para pantallas móviles bajas: primero se reducen textos secundarios y espacios antes de necesitar desplazamiento.
- El scroll no se bloquea para conservar accesibilidad, zoom y compatibilidad con pantallas excepcionalmente pequeñas.
- El selector de fondos de pantalla todavía no se implementa; esta versión únicamente prepara el sistema visual para convivir con él más adelante.
- El build queda identificado como `0.1.2`.

## 2026-09-09 — Guardados recientes en Inicio 0.1.3

- Aprobado usar parte del espacio libre del Inicio para una sección compacta `Guardados recientes` en vez de añadir accesos duplicados o relleno decorativo.
- Añadidas dos vistas previas de demostración (`Favorito` y `Nota`) usando exclusivamente el corpus ficticio de desarrollo; se identifican explícitamente como `Demostración` y no representan datos personales reales.
- Cada vista previa muestra tipo de guardado, referencia y texto breve y abre el contexto bíblico correspondiente.
- La sección se adapta a móvil, tablet y PC; en pantallas bajas reduce contenido secundario y altura antes de provocar scroll vertical.
- Los estilos nuevos se aislaron en `src/features/home/home.css` para conservar modularidad y evitar ensuciar el CSS global.
- La función completa de favoritos, resaltados y notas sigue pendiente; cuando exista, esta sección deberá alimentarse de datos reales.
- El build queda identificado como `0.1.3`.

## 2026-09-10 — Favoritos y notas reales 0.1.4

- Convertidas las tarjetas `Favoritos` y `Notas` del Inicio en accesos reales a pantallas completas de cada colección, sin añadir nuevas pestañas a la barra inferior.
- Añadido almacenamiento local en IndexedDB/Dexie para favoritos y notas bíblicas, separado del corpus y basado en referencias estructuradas libro/capítulo/versículo.
- `Guardados recientes` deja de usar muestras ficticias: muestra el favorito y la nota más recientes del usuario o estados vacíos útiles si todavía no existen.
- Añadidas pantallas `Mis favoritos` y `Mis notas` con listas reales, estados vacíos y opciones para quitar/eliminar elementos.
- Cada elemento guardado permite volver al versículo exacto mediante el ancla estable del lector.
- Al tocar un versículo en el lector normal aparece un panel contextual compacto con acciones `Favorito` y `Nota`, evitando controles permanentes sobre todo el texto.
- Desde el lector se puede guardar o quitar un favorito y crear, guardar o eliminar una nota asociada al versículo.
- Durante la validación se detectaron y corrigieron errores de nulabilidad TypeScript y un import no utilizado; no se desactivó ninguna comprobación.
- El build queda identificado como `0.1.4`.
- PR #6 y `main` pasaron TypeScript, ESLint, build PWA y auditoría de dependencias en verde.
- El usuario confirmó en un dispositivo real que la versión publicada `v0.1.4` se ve correctamente; la entrega queda cerrada y verificada.
