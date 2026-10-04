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

## 2026-10-03 — Lectura corrida tipo Biblia impresa 0.1.17

- Refinado el modo `Corridos` para que los versículos se lean como un párrafo continuo de Biblia impresa.
- Los números de versículo quedan pequeños y en superíndice, sin separar cada versículo en una tarjeta.
- El versículo activo y los resaltados conservan marcas sutiles aplicadas solo al texto correspondiente.
- El modo capítulo por capítulo adopta la misma presentación corrida.
- Renombrado `Fuente de lectura` a `Tipo de letra de la Biblia` y añadida una explicación: solo cambia la tipografía del texto bíblico, no la interfaz.
- `Separados` conserva su diseño actual de un versículo por bloque.
- Build visible actualizado a `0.1.17`.

## 2026-10-03 — Versículos separados o corridos 0.1.16

- Añadida preferencia persistente de disposición bíblica dentro de `Aa`.
- `Separados` conserva un versículo por bloque.
- `Corridos` presenta los versículos como texto continuo manteniendo número e interacción individual.
- El cambio se aplica inmediatamente y se conserva al volver a abrir la aplicación.
- El modo capítulo por capítulo también respeta la disposición elegida.
- Versículo por versículo permanece individual por definición.
- Favoritos, notas, resaltados, selección múltiple y menú de acciones siguen funcionando por versículo.
- La entrega anterior `0.1.15` quedó publicada con CI de main verde y producción READY; su menú móvil completo fue verificado automáticamente.
- Build visible actualizado a `0.1.16`.

## 2026-10-03 — Menú completo e inventario APK 0.1.15

- En móvil el menú de acciones del versículo pasa a una hoja flotante completa dentro del viewport.
- El panel respeta safe areas, queda por encima de la navegación y usa scroll interno cuando sea necesario.
- El encabezado del menú permanece visible para conservar referencia y cierre.
- Se mantiene backdrop blur y apariencia temática.
- Creado `APK_INVENTORY.md` con clasificación REUTILIZABLE VERIFICADO / RECONSTRUIBLE / REQUIERE LICENCIA / NO REUTILIZAR.
- El inventario consolida los hallazgos ya verificados de la APK externa y evita copiar corpus, assets, secretos o código sin autorización.
- El siguiente candidato funcional documentado es la preferencia `versículos separados / versículos corridos`.
- Build visible actualizado a `0.1.15`.

## 2026-10-03 — Temas curados y submenús blur 0.1.14

- Eliminados los selectores libres de color de texto y fondo general para evitar combinaciones sin contraste.
- Añadidos temas completos predefinidos: Claro, Sepia, Verde, Azul, Rojo, Morado y Noche.
- Cada tema define sus propios colores de fondo, tarjetas, texto, bordes, marca, acento y superficies glass.
- Corregida la herencia global de texto para que encabezado `Biblia`, nombres de libros y otros textos no desaparezcan en tema Noche.
- Revisadas superficies de Inicio, Guardados y Buscar para eliminar mezclas con blanco fijo que lavaban el contraste.
- El menú de los tres puntos ahora aparece sobre un backdrop con blur y conserva posicionamiento inteligente arriba/abajo.
- Compartir, Modo de lectura y Apariencia usan superficies modales por encima de la navegación, con blur y scroll interno cuando no caben completos.
- Los resaltados Azul, Verde, Rojo, Amarillo, Naranja y Morado permanecen suaves y adaptados a la superficie del tema.
- Build visible actualizado a `0.1.14`.

## 2026-10-03 — Contraste de temas y resaltados 0.1.13

- Revisados los tokens de color de los cuatro temas para mejorar contraste de texto, superficies, marca y navegación.
- Corregidos colores fijos que perdían legibilidad en el tema Noche.
- Las superficies tipo glass ahora se mezclan con los colores del tema en lugar de usar blanco fijo.
- El tema Noche recibe una paleta más equilibrada y texto secundario con mayor contraste.
- La paleta de resaltados pasa a Azul, Verde, Rojo, Amarillo, Naranja y Morado.
- Los resaltados conservan transparencia suave tipo vidrio sobre la superficie del lector.
- Verificación matemática de contraste de texto/superficie realizada sobre los tokens principales; los pares principales superan el umbral AA para texto normal.
- Build visible actualizado a `0.1.13`.

## 2026-10-03 — Hoja de apariencia móvil y limpieza 0.1.12

- Corregida la hoja `Aa` para mantenerse completamente dentro del viewport móvil y respetar las áreas seguras del dispositivo.
- Elevado el overlay de apariencia para que siempre quede por encima del encabezado, lector y navegación.
- El encabezado del panel queda fijo dentro de la propia hoja mientras se desplaza su contenido.
- Al abrir apariencia se bloquea el scroll de la página de fondo para evitar saltos o que el panel termine fuera de posición.
- Eliminadas reglas CSS duplicadas del lector que habían quedado tras iteraciones anteriores.
- La revisión nocturna programada se ejecutó hasta las 5:45 a. m.; no dejó cambios adicionales en `main` ni abrió trabajo nuevo fuera del objetivo autorizado.
- Build visible actualizado a `0.1.12`.

## 2026-10-03 — Menús inteligentes, transición de página y personalización 0.1.11

- El menú de acciones del versículo se posiciona dinámicamente arriba o abajo según el espacio real disponible y evita quedar oculto detrás del borde inferior o la navegación.
- El menú flotante recalcula posición al hacer scroll o cambiar el tamaño de la pantalla y puede usar scroll interno si crece.
- El lector capítulo/versículo incorpora una transición sutil tipo cambio de página al avanzar o retroceder.
- La ayuda de gesto horizontal se oculta automáticamente después de unos segundos.
- Añadido panel global de apariencia accesible desde el encabezado.
- Añadidos temas Claro, Sepia, Verde y Noche.
- Añadidos tamaño de texto, tres tipografías de lectura, color del texto con control de contraste y fondo general configurable.
- Las preferencias de apariencia se guardan localmente y afectan lector continuo y modos enfocados, sin alterar las plantillas de compartir como imagen.
- Build visible actualizado a `0.1.11`.

## 2026-10-02 — Gestos y resaltados por color 0.1.10

- Corregido el gesto horizontal del lector enfocado usando eventos táctiles con detección de dirección y umbral.
- Al entrar a un modo enfocado desde un versículo activo, se usa ese versículo exacto como punto de entrada.
- En modo versículo por versículo, la referencia inicial recibe una señal visual sutil temporal para confirmar el punto de entrada.
- Añadida paleta persistente de seis colores para resaltados.
- Los resaltados usan una apariencia suave tipo vidrio esmerilado en lugar de un relleno plano intenso.
- La selección múltiple puede aplicar un color común y, cuando todos comparten el mismo resaltado, quitarlo en conjunto.
- Registrada la regla de trabajo continuo: si el usuario pide corregir y continuar, se corrige y se avanza salvo bloqueo obligatorio.
- Build visible actualizado a `0.1.10`.

## 2026-10-02 — Selector de modos de lectura 0.1.9

- El botón `Leer capítulo` se sustituye por `Modo de lectura`.
- Añadidos tres modos: `Continuo`, `Capítulo por capítulo` y `Versículo por versículo`.
- El modo versículo por versículo permite avanzar/retroceder una referencia a la vez y continuar entre capítulos.
- Antes de entrar a un modo enfocado se captura la posición real más cercana del lector normal.
- Al salir se restaura el lector normal en esa posición y se conserva la señal visual temporal de retorno.
- Se mantienen botones anterior/siguiente además del gesto horizontal táctil.
- Build visible actualizado a `0.1.9`.

## 2026-10-02 — Fondos de compartir, búsqueda ampliada y lector enfocado 0.1.8

- `Compartir como imagen` añade cuatro fondos predeterminados, color personal e imagen personal local como fondo.
- Las imágenes personales se procesan en el dispositivo; se aplica una capa de contraste para mantener legibilidad.
- La búsqueda unificada encuentra libros por nombre además de coincidencias en versículos.
- La palabra/frase buscada queda resaltada dentro de los resultados y se toleran búsquedas sin tildes.
- Implementado el lector capítulo por capítulo como vista enfocada temporal.
- El lector enfocado permite capítulo anterior/siguiente y gesto horizontal intencional en pantallas táctiles.
- Al cerrar vuelve al lector normal y, cuando existe ancla de retorno, restaura la posición y la señala visualmente durante aproximadamente 2 segundos.
- Build visible actualizado a `0.1.8`.

## 2026-10-02 — Compartir por formato y búsqueda bíblica 0.1.7

- Al tocar un nuevo versículo fuera del modo de selección múltiple se limpia cualquier selección transitoria para asegurar un único versículo activo visible.
- `Compartir` ahora pregunta si se desea compartir como texto o como imagen.
- La imagen se genera localmente; si el contenido seleccionado no cabe de forma legible, la app solicita reducir la selección.
- Compartir imagen usa Web Share con archivo PNG cuando el dispositivo lo soporta y descarga el PNG como fallback.
- Implementada la siguiente etapa: búsqueda bíblica por palabras o frases sobre todo el corpus disponible.
- Los resultados muestran referencia + texto y abren directamente el versículo exacto.
- Build visible actualizado a `0.1.7`.

## 2026-10-02 — Ajuste de interacción del lector 0.1.6

- Tocar un versículo ahora solo mueve el `versículo activo`; ya no abre automáticamente el panel de acciones.
- El versículo activo incorpora un control discreto de opciones para abrir/cerrar el menú bajo demanda.
- El panel contextual puede cerrarse con `X` o tocando fuera.
- Añadido modo temporal de selección múltiple de versículos.
- La selección múltiple permite añadir a Favoritos, Resaltar, Copiar y Compartir como texto.
- Las notas continúan siendo individuales.
- Registrada la regla futura para compartir como imagen: si la selección no cabe de forma legible, se advertirá y deberá reducirse en lugar de forzar una imagen saturada.
- Build visible actualizado a `0.1.6`.

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

## 2026-09-15 — Continuidad estricta y endurecimiento de seguridad

- Endurecido `AGENTS.md`: todo chat nuevo debe leer y verificar documentación, estado, reglas, privacidad del repositorio y objetivo activo antes de responder sobre implementación o editar.
- La identidad secuencial futura cambia al formato exacto `Ing. Bibia 📖 #N`; solo puede mostrarse después de reservar y volver a verificar `CURRENT_SESSION`/`NEXT_SESSION`.
- Un chat que no pueda completar todas las verificaciones obligatorias queda bloqueado para editar y no puede fingir estar al día.
- Registrada D-030 como regla aprobada de continuidad y repositorio potencialmente publicable.
- Endurecido `SECURITY.md`: secretos reales nunca pueden depender de permanecer ocultos en el frontend/PWA; también se prohíben URLs firmadas temporales, credenciales, bases personales y datos privados en Git.
- Establecida revisión de secretos/datos personales antes de cada merge y auditoría separada del árbol actual + historial completo antes de cualquier futura publicación del repositorio.
- Ampliado `.gitignore` para excluir claves privadas comunes, archivos de credenciales, bases locales, dumps y backups.
- La revisión preventiva actual del árbol y búsquedas de patrones comunes no detectó credenciales evidentes ni archivos personales sensibles versionados; esta revisión no sustituye la auditoría histórica completa previa a publicación.
- Este cambio es documental/de seguridad del repositorio; no modifica la versión ejecutable de la PWA.

## 2026-09-16 — Auditoría tras cambio a repositorio público

- El usuario autorizó y realizó el cambio de visibilidad del repositorio oficial a público.
- Verificado el árbol actual de `main`; no se observaron archivos de credenciales, claves privadas, bases personales, dumps o backups versionados.
- Las búsquedas de patrones de alta señal en el árbol público actual no detectaron tokens o claves evidentes de los proveedores revisados.
- El CI del PR de seguridad se reejecutó después del cambio a público y completó instalación, TypeScript, ESLint, build PWA y auditoría de dependencias en verde.
- La revisión de ramas públicas detectó `recibos-apk-build`, una rama ajena al proyecto Biblia con código de una aplicación de recibos y un valor histórico de contraseña de firma incrustado en configuración Android.
- No se detectó un archivo de keystore versionado en la ruta revisada. El valor histórico se considera comprometido si llegó a usarse o reutilizarse fuera del repositorio y no debe volver a utilizarse.
- La referencia `recibos-apk-build` se movió al commit limpio actual de `main`, retirando de la punta de la rama pública el árbol ajeno. Esto no equivale a garantizar purga inmediata de objetos históricos, cachés o copias externas.
- Las demás ramas públicas revisadas corresponden a trabajo histórico de Biblia y no mostraron archivos adicionales de credenciales o datos personales en sus diferencias actuales.
- Confirmado que `main` no tiene branch protection/rulesets configurados; queda como endurecimiento recomendable, no como fallo de la aplicación.
- `SECURITY.md` y `PROJECT_STATE.md` se actualizaron para reflejar la visibilidad pública real y las reglas de seguridad posteriores a la auditoría.


## 2026-10-02 — Gobernanza v4 y APK externa como referencia

- Reemplazado `AGENTS.md` por el paquete maestro general v4 de autonomía controlada y revisores automáticos, conservando `SECURITY.md`, `UI_RULES.md` y `RELEASE_RULES.md`.
- Documentado que la mecánica anterior de identidad secuencial queda sustituida por `LOCKED_READ_ONLY`, sincronización y autorización por objetivo.
- Analizado el paquete externo `Santa Biblia Reina Valera_0.1.4.apks` como fuente de referencia, no como nueva base de la aplicación.
- Verificado que el paquete es Flutter, contiene datasets bíblicos locales y que su dataset español tiene 66 libros con capítulos, versículos individuales y campos de metadatos/encabezados.
- Registrada la política de rescate: reconstruir funciones útiles con código propio, reutilizar contenido/assets solo con derechos verificados y no copiar secretos ni configuración privada.
- El objetivo funcional activo sigue siendo D-029; el PR #8 prepara la versión `0.1.5` y permanece pendiente de validación/CI/merge/despliegue antes de considerarse terminado.


## 2026-10-02 — Versículo activo y acciones 0.1.5

- Añadida persistencia local de un único versículo activo.
- Añadidos resaltados persistentes independientes del versículo activo.
- Ampliado el panel contextual con `Resaltar`, `Copiar` y `Compartir`, conservando `Favorito` y `Nota`.
- `Copiar` incluye referencia y texto; `Compartir` usa el mecanismo nativo cuando existe y copia al portapapeles como fallback.
- Diferenciados visualmente el estado activo y el resaltado persistente.
- El primer CI detectó un error de TypeScript relacionado con el estrechamiento de `book` dentro de handlers; se corrigió sin desactivar verificaciones.
- La rama corrigida pasó TypeScript, ESLint, build PWA y auditoría de dependencias.
- Build visible preparado como `0.1.5`; permanece pendiente de merge, CI de `main`, despliegue y validación publicada.
