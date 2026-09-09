# AGENTS.md — REGLAS OBLIGATORIAS DEL PROYECTO BIBLIA PWA

Este archivo es la puerta de entrada obligatoria para cualquier IA, agente o chat que vaya a trabajar en este repositorio.

## 1. Protocolo obligatorio antes de presentarse o modificar código

Ningún chat puede presentarse como `Ing. 📚 #N`, proponer cambios de implementación ni modificar código hasta completar, en este orden:

1. Leer `AGENTS.md` completo.
2. Leer `PROJECT_BRIEF.md` completo.
3. Leer `PROJECT_STATE.md` completo.
4. Leer `DECISIONS.md` completo.
5. Leer `SECURITY.md` completo.
6. Leer `UI_RULES.md` completo.
7. Leer las entradas recientes de `CHANGELOG.md`.
8. Verificar que el repositorio correcto es `HNAlvaradoHN/biblia-pwa` y que sigue siendo privado.
9. Tomar la identidad secuencial siguiendo la regla de la sección 2.

Si falta alguno de estos archivos, no puede tomar identidad ni empezar implementación. Primero debe reparar la documentación mínima sin inventar decisiones.

## 2. Identidad secuencial viva

Solo este archivo guarda el número de sesión. Está prohibido crear archivos `CHAT-001`, `CHAT-002`, carpetas de sesiones o listas acumulativas de identidades.

CURRENT_SESSION: 1
NEXT_SESSION: 2

### Cómo toma identidad un chat nuevo

- Leer los valores actuales desde la versión más reciente de `AGENTS.md`.
- El nuevo chat debe tomar el valor de `NEXT_SESSION`.
- Antes de presentarse, actualizar este mismo archivo dejando:
  - `CURRENT_SESSION` = número que acaba de tomar.
  - `NEXT_SESSION` = número tomado + 1.
- La actualización debe usar la versión/SHA más reciente del archivo. Si GitHub rechaza el cambio porque otro chat modificó el archivo primero, volver a leerlo y tomar el nuevo `NEXT_SESSION`. Nunca forzar ni reutilizar un número.
- Volver a leer `AGENTS.md` después de actualizar y comprobar que el número quedó reservado correctamente.
- Solo entonces puede presentarse exactamente como `Ing. 📚 #N`.

### Excepción de arranque

La sesión #1 queda preasignada durante la creación inicial del repositorio, pero tampoco puede presentarse como `Ing. 📚 #1` hasta haber creado, leído y verificado todos los documentos obligatorios anteriores.

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
- `PROJECT_STATE.md` debe definir un objetivo activo y el siguiente paso.
- No saltar a un módulo posterior porque resulte atractivo si el objetivo actual todavía no está terminado, salvo cambio explícito de prioridad del usuario.
- Antes de empezar una tarea, definir su alcance y qué NO se va a tocar.
- Terminar, probar, limpiar y documentar el objetivo activo antes de abrir otro objetivo importante.
- No mezclar en un mismo cambio varias funciones no relacionadas salvo que técnicamente dependan entre sí.
- Antes de cambios grandes, comprobar `PROJECT_STATE.md` y las decisiones existentes.
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
- lo que pueda deducirse con seguridad de `PROJECT_BRIEF.md`, `DECISIONS.md`, `PROJECT_STATE.md`, `SECURITY.md` o `UI_RULES.md`.

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

## 7. Antes de considerar terminado un cambio

Cuando aplique:

- Comprobar que el proyecto compila.
- Ejecutar pruebas/linter disponibles.
- Para cambios visuales, cumplir además la lista de verificación de `UI_RULES.md`.
- Revisar que no se hayan añadido secretos, datos personales ni archivos innecesarios.
- Revisar que no quede código muerto ni restos del enfoque sustituido.
- Actualizar `PROJECT_STATE.md` si cambió el estado real.
- Actualizar `DECISIONS.md` solo cuando haya una decisión nueva o modificada.
- Actualizar `CHANGELOG.md` con cambios reales relevantes, sin convertirlo en un diario de conversación.

## 8. Privacidad y seguridad

`SECURITY.md` es obligatorio. Como mínimo:

- Nunca subir contraseñas, tokens, secretos, credenciales ni respaldos personales.
- Nunca subir prédicas, notas o información personal real del usuario como datos de prueba.
- Usar datos ficticios para desarrollo y pruebas.
- Tratar el repositorio como si algún día pudiera verse comprometido aunque sea privado.
- Los códigos de vinculación de dispositivos deben ser temporales y de uso limitado; nunca una contraseña permanente.

## 9. Fuente oficial de verdad

La verdad actual del proyecto está en este orden:

1. Instrucción explícita más reciente del usuario.
2. `DECISIONS.md` para decisiones aprobadas.
3. `PROJECT_STATE.md` para estado de implementación y orden actual.
4. `PROJECT_BRIEF.md` para alcance y visión.
5. `UI_RULES.md` para arquitectura y disciplina de interfaz.
6. Código y pruebas para comportamiento ya implementado.
7. `CHANGELOG.md` para historial relevante.

Si dos fuentes contradicen, no adivinar: conservar la opción más reciente y documentada y señalar la contradicción antes de hacer un cambio destructivo.
