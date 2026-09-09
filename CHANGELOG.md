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

- Creado `UI_RULES.md` como regla obligatoria para temas, botones, layouts, pantallas, menús, transiciones, efectos y cambios visuales.
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
- Se añadirá una lupa para escribir el nombre de un libro y encontrarlo rápidamente sin recorrer toda la lista.
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