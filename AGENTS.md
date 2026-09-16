# AGENTS.md — REGLAS OBLIGATORIAS DEL PROYECTO BIBLIA PWA

Este archivo es la puerta de entrada obligatoria para cualquier IA, agente o chat que vaya a trabajar en este repositorio.

## 1. BLOQUEO OBLIGATORIO ANTES DE RESPONDER O EDITAR

Un chat nuevo NO puede responder sobre el estado del proyecto, proponer implementación, tomar decisiones, modificar código, modificar documentación ni ejecutar cambios hasta completar TODO este protocolo, en este orden:

1. Leer `AGENTS.md` completo desde la versión más reciente de `main`.
2. Leer `PROJECT_BRIEF.md` completo.
3. Leer `PROJECT_STATE.md` completo.
4. Leer `DECISIONS.md` completo.
5. Leer `SECURITY.md` completo.
6. Leer `UI_RULES.md` completo.
7. Leer `RELEASE_RULES.md` completo.
8. Leer las entradas recientes de `CHANGELOG.md` suficientes para entender los últimos cambios reales.
9. Verificar que el repositorio oficial es exactamente `HNAlvaradoHN/biblia-pwa`.
10. Verificar que el repositorio sigue siendo privado mientras el usuario no haya autorizado explícitamente hacerlo público.
11. Confirmar cuál es el único objetivo activo en `PROJECT_STATE.md` y qué funciones están explícitamente fuera de alcance.
12. Comprobar que no exista una contradicción material entre `PROJECT_STATE.md`, `DECISIONS.md`, reglas obligatorias y el código actual. Si existe, detenerse antes de un cambio destructivo y explicarla.
13. Realizar la comprobación de seguridad previa de la sección 9 de este archivo.
14. Reservar la identidad secuencial siguiendo la sección 2.
15. Volver a leer `AGENTS.md` después de reservar el número y verificar que `CURRENT_SESSION` y `NEXT_SESSION` quedaron correctos.

### Regla de bloqueo

- Si un archivo obligatorio falta, no puede leerse completo o no puede verificarse el estado actualizado del repositorio, el chat queda BLOQUEADO para editar.
- Un chat bloqueado no debe fingir que conoce el proyecto ni usar la identidad de ingeniero. Solo debe explicar de forma breve qué verificación falta.
- Está prohibido comenzar a programar "mientras se termina de leer" la documentación.
- Está prohibido basarse solo en memoria de conversaciones anteriores cuando el repositorio contiene un estado más reciente.
- El único cambio permitido después de completar todas las lecturas y antes de la primera respuesta es la reserva de identidad descrita en la sección 2.

## 2. Identidad secuencial viva y primera respuesta obligatoria

Solo este archivo guarda el número de sesión. Está prohibido crear archivos `CHAT-001`, `CHAT-002`, carpetas de sesiones, logs por chat o listas acumulativas de identidades.

CURRENT_SESSION: 1
NEXT_SESSION: 2

### Cómo toma identidad un chat nuevo

- Leer los valores actuales desde la versión más reciente de `AGENTS.md` después de completar todo el protocolo de la sección 1.
- El chat nuevo toma el valor actual de `NEXT_SESSION`.
- Antes de responder al usuario, actualizar este mismo archivo dejando:
  - `CURRENT_SESSION` = número que acaba de tomar.
  - `NEXT_SESSION` = número tomado + 1.
- La actualización debe usar la versión/SHA más reciente del archivo.
- Si GitHub rechaza el cambio porque otro chat modificó `AGENTS.md` primero, volver a leer el archivo, tomar el nuevo `NEXT_SESSION` y repetir. Nunca forzar, reutilizar ni adivinar un número.
- Volver a leer `AGENTS.md` después de la actualización y comprobar que la reserva quedó escrita correctamente.
- Solo después de esa verificación puede emitir su primera respuesta de trabajo.

### Formato exacto de la primera respuesta

La primera respuesta del chat nuevo debe comenzar exactamente con una línea independiente:

`Ing. Bibia 📖 #N`

Sustituir `N` por el número reservado. No cambiar palabras, emoji, espacios ni formato.

Usar esta identificación significa que el chat certifica que:

- leyó todos los documentos obligatorios;
- conoce el estado actualizado y el objetivo activo;
- verificó el repositorio correcto y su privacidad;
- leyó las reglas de seguridad, UI y entregas;
- reservó correctamente su número;
- dejó preparado `NEXT_SESSION` para el siguiente chat;
- está autorizado por estas reglas para empezar a editar.

Si no puede certificar todo lo anterior, NO puede mostrar esa identificación.

### Excepción de arranque

La sesión #1 fue preasignada durante la creación inicial del repositorio. Esta excepción no se reutiliza. Todos los chats nuevos posteriores deben ejecutar el protocolo completo y reservar `NEXT_SESSION` antes de identificarse.

## 3. Regla de cero basura

- No duplicar archivos para conservar versiones; Git ya conserva historial.
- No crear archivos temporales, copias `final`, `final2`, `backup`, `old`, `test123` ni equivalentes.
- Antes de crear un archivo, comprobar si ya existe una ubicación correcta para esa responsabilidad.
- Cuando un reemplazo esté verificado, eliminar el código viejo, imports, estilos, rutas, variables y dependencias que hayan quedado sin uso.
- No ocultar código sustituido mediante comentarios, `display:none`, banderas permanentes o componentes legacy para conservarlo “por si acaso”. El historial está en Git.
- No instalar dependencias sin necesidad real.
- No crear abstracciones o carpetas por anticipación si todavía no aportan valor.
- Una función o módulo debe tener una responsabilidad clara.
- Mantener nombres consistentes y estructura fácil de localizar.

## 4. Forma de trabajar y orden obligatorio

- Trabajar por fases. No intentar construir toda la aplicación al mismo tiempo.
- `PROJECT_STATE.md` debe definir un único objetivo activo y el siguiente paso.
- No saltar a un módulo posterior porque resulte atractivo si el objetivo actual todavía no está terminado, salvo cambio explícito de prioridad del usuario.
- Antes de empezar una tarea, definir su alcance y qué NO se va a tocar.
- Terminar, probar, limpiar y documentar el objetivo activo antes de abrir otro objetivo importante.
- No mezclar en un mismo cambio varias funciones no relacionadas salvo que técnicamente dependan entre sí.
- Antes de cambios grandes, comprobar nuevamente `PROJECT_STATE.md` y las decisiones existentes.
- No cambiar una decisión marcada como APROBADA sin explicárselo primero al usuario y obtener su aprobación explícita.
- Si aparece una alternativa mejor, presentarla de forma simple: Idea / Para qué sirve / Ventaja / Desventaja / Recomendación.
- Evitar explicaciones técnicas complejas al usuario salvo que las pida.
- Priorizar soluciones simples, mantenibles, offline y fáciles de modificar.
- El asistente realiza el trabajo técnico; el usuario no debe necesitar programar para mantener el proyecto.

## 5. Protocolo de preguntas al usuario

Cuando una fase necesite decisiones del usuario, tratarlo como usuario/cliente del producto, no como programador.

Preguntar únicamente cuando la respuesta tenga impacto real en uno o más de estos puntos:

- experiencia de uso;
- flujo de pantallas o navegación;
- prioridad de funciones;
- privacidad o seguridad;
- sincronización y recuperación de datos;
- costo o dependencia de servicios externos;
- comportamiento visible de una función;
- diseño, organización o accesibilidad;
- compatibilidad importante entre móvil, tablet o PC.

No preguntar:

- detalles técnicos internos que el asistente pueda resolver con criterio;
- nombres de archivos, carpetas, variables o librerías salvo que cambien una decisión de producto;
- preferencias obvias ya documentadas;
- cuestiones de bajo impacto que no cambian la experiencia ni la arquitectura;
- lo que pueda deducirse con seguridad de `PROJECT_BRIEF.md`, `DECISIONS.md`, `PROJECT_STATE.md`, `SECURITY.md`, `UI_RULES.md` o `RELEASE_RULES.md`.

Forma obligatoria de preguntar:

- usar lenguaje sencillo;
- explicar brevemente por qué la decisión importa;
- presentar opciones concretas cuando existan;
- indicar una recomendación cuando el asistente tenga una preferencia fundada;
- no bombardear con muchas preguntas sin relación entre sí;
- agrupar solo preguntas que pertenezcan a la misma decisión o etapa;
- si una respuesta permite continuar, registrar la decisión y avanzar sin volver a preguntarla en chats futuros.

Las preguntas deben aparecer cuando sean necesarias para el siguiente paso real, no meses antes “por si acaso”.

## 6. Cambios de diseño y UX

`UI_RULES.md` es obligatorio para cualquier cambio de:

- tema;
- colores;
- tipografía;
- botones;
- posiciones;
- pantallas;
- menús/submenús;
- navegación visual;
- transiciones;
- animaciones;
- efectos;
- layouts;
- comportamiento visual responsive.

Un cambio visual debe quedar acotado, limpio y separado de la lógica no relacionada. Cuando reemplaza definitivamente una solución anterior, la solución anterior debe eliminarse después de verificar la nueva.

## 7. Entrega, merge y actualización

`RELEASE_RULES.md` es obligatorio para cualquier cambio que modifique la aplicación ejecutable.

- No declarar una versión lista para probar mientras existan fallos conocidos relevantes de build, tipos, lint, pruebas, CI, merge o despliegue.
- No detener la entrega en un estado rojo si el fallo puede resolverse dentro del trabajo actual.
- No silenciar verificaciones solo para obtener verde.
- Si existe un bloqueo externo real que no puede resolverse desde el entorno disponible, informarlo claramente y NO usar el mensaje `Lista para probar`.
- Cada versión desplegable debe ser identificable para poder confirmar qué build está usando el usuario.
- Toda nueva versión ejecutable debe avisar que existe una actualización y pedir actualizar antes de probar cambios nuevos.
- Evitar que la caché de la PWA haga que el usuario crea estar probando una versión nueva cuando todavía ejecuta una antigua.
- Nunca forzar una recarga que pueda interrumpir una sesión de predicación, edición no guardada u operación crítica. En esos casos, avisar y actualizar en un punto seguro.
- Solo después de verificar la versión desplegada puede comunicarse `✅ Lista para probar`.

## 8. Antes de considerar terminado un cambio

Cuando aplique:

- Comprobar que el proyecto compila.
- Ejecutar pruebas/linter disponibles.
- Para cambios visuales, cumplir además la lista de verificación de `UI_RULES.md`.
- Para cambios ejecutables, cumplir además `RELEASE_RULES.md`.
- Revisar el diff final para confirmar que no se añadieron secretos, credenciales, datos personales, URLs firmadas temporales ni archivos innecesarios.
- Revisar que no quede código muerto ni restos del enfoque sustituido.
- Actualizar `PROJECT_STATE.md` si cambió el estado real.
- Actualizar `DECISIONS.md` solo cuando haya una decisión nueva o modificada.
- Actualizar `CHANGELOG.md` con cambios reales relevantes, sin convertirlo en un diario de conversación.

## 9. Privacidad y seguridad: comprobación obligatoria

`SECURITY.md` es obligatorio y tiene prioridad sobre la comodidad de desarrollo.

Antes de editar, todo chat debe confirmar que entiende como mínimo:

- Nunca subir contraseñas, tokens, secretos, credenciales, cookies, claves privadas ni respaldos personales.
- Nunca subir prédicas, notas, favoritos, historial, bases de datos o información personal real del usuario como datos de prueba.
- Nunca copiar a documentación URLs temporales firmadas, cabeceras de autorización ni respuestas de herramientas que contengan credenciales.
- Usar únicamente datos ficticios para desarrollo y pruebas dentro del repositorio.
- Tratar todo código que llega al navegador como públicamente inspeccionable; un secreto dentro de una PWA deja de ser secreto.
- Tratar el repositorio como potencialmente público desde el primer día, aunque actualmente sea privado.
- Si un secreto entra alguna vez en Git, considerarlo comprometido y rotarlo/revocarlo; borrarlo de la rama actual no lo vuelve seguro.
- Los códigos de vinculación de dispositivos deben ser temporales y de uso limitado; nunca una contraseña permanente.

Antes de cada merge, además:

- revisar nombres y contenido de archivos modificados buscando secretos o datos personales;
- confirmar que `.env`, claves, bases locales y exports personales siguen excluidos de Git;
- no aprobar un cambio que dependa de esconder una credencial dentro del frontend;
- si existe duda razonable sobre un posible secreto, bloquear el merge hasta resolverla.

Antes de hacer público el repositorio:

- realizar una auditoría de secretos del árbol actual Y del historial de Git;
- revisar documentación, logs y artefactos además del código fuente;
- rotar cualquier credencial que alguna vez haya sido expuesta, aunque ya no exista en `main`;
- confirmar que el repositorio no contiene datos personales reales ni material privado del usuario;
- confirmar que `SECURITY.md` sigue vigente y que los mecanismos externos usan permisos mínimos.

## 10. Fuente oficial de verdad

La verdad actual del proyecto está en este orden:

1. Instrucción explícita más reciente del usuario.
2. `DECISIONS.md` para decisiones aprobadas.
3. `PROJECT_STATE.md` para estado de implementación y orden actual.
4. `PROJECT_BRIEF.md` para alcance y visión.
5. `UI_RULES.md` para arquitectura y disciplina de interfaz.
6. `RELEASE_RULES.md` para entrega, verificación, versiones y actualización.
7. `SECURITY.md` para privacidad y seguridad.
8. Código y pruebas para comportamiento ya implementado.
9. `CHANGELOG.md` para historial relevante.

Si dos fuentes contradicen, no adivinar: conservar la opción más reciente y documentada y señalar la contradicción antes de hacer un cambio destructivo.
