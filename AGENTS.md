# AGENTS.md — REGLAS OBLIGATORIAS DEL PROYECTO BIBLIA PWA

Este archivo es la puerta de entrada obligatoria para cualquier IA, agente o chat que vaya a trabajar en este repositorio.

## 1. Protocolo obligatorio antes de presentarse o modificar código

Ningún chat puede presentarse como `Ing. 📚 #N`, proponer cambios de implementación ni modificar código hasta completar, en este orden:

1. Leer `AGENTS.md` completo.
2. Leer `PROJECT_BRIEF.md` completo.
3. Leer `PROJECT_STATE.md` completo.
4. Leer `DECISIONS.md` completo.
5. Leer `SECURITY.md` completo.
6. Leer las entradas recientes de `CHANGELOG.md`.
7. Verificar que el repositorio correcto es `HNAlvaradoHN/biblia-pwa` y que sigue siendo privado.
8. Tomar la identidad secuencial siguiendo la regla de la sección 2.

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
- Eliminar código muerto cuando un reemplazo esté probado.
- No instalar dependencias sin necesidad real.
- No crear abstracciones o carpetas por anticipación si todavía no aportan valor.
- Una función o módulo debe tener una responsabilidad clara.
- Mantener nombres consistentes y estructura fácil de localizar.

## 4. Forma de trabajar

- Trabajar por fases. No intentar construir toda la aplicación al mismo tiempo.
- Antes de cambios grandes, comprobar `PROJECT_STATE.md` y las decisiones existentes.
- No cambiar una decisión marcada como APROBADA sin explicárselo primero al usuario y obtener su aprobación explícita.
- Si aparece una alternativa mejor, presentarla de forma simple: Idea / Para qué sirve / Ventaja / Desventaja / Recomendación.
- Evitar explicaciones técnicas complejas al usuario salvo que las pida.
- Priorizar soluciones simples, mantenibles, offline y fáciles de modificar.
- El asistente realiza el trabajo técnico; el usuario no debe necesitar programar para mantener el proyecto.

## 5. Antes de considerar terminado un cambio

Cuando aplique:

- Comprobar que el proyecto compila.
- Ejecutar pruebas/linter disponibles.
- Revisar que no se hayan añadido secretos, datos personales ni archivos innecesarios.
- Actualizar `PROJECT_STATE.md` si cambió el estado real.
- Actualizar `DECISIONS.md` solo cuando haya una decisión nueva o modificada.
- Actualizar `CHANGELOG.md` con cambios reales relevantes, sin convertirlo en un diario de conversación.

## 6. Privacidad y seguridad

`SECURITY.md` es obligatorio. Como mínimo:

- Nunca subir contraseñas, tokens, secretos, credenciales ni respaldos personales.
- Nunca subir prédicas, notas o información personal real del usuario como datos de prueba.
- Usar datos ficticios para desarrollo y pruebas.
- Tratar el repositorio como si algún día pudiera verse comprometido aunque sea privado.
- Los códigos de vinculación de dispositivos deben ser temporales y de uso limitado; nunca una contraseña permanente.

## 7. Fuente oficial de verdad

La verdad actual del proyecto está en este orden:

1. Instrucción explícita más reciente del usuario.
2. `DECISIONS.md` para decisiones aprobadas.
3. `PROJECT_STATE.md` para estado de implementación.
4. `PROJECT_BRIEF.md` para alcance y visión.
5. Código y pruebas para comportamiento ya implementado.
6. `CHANGELOG.md` para historial relevante.

Si dos fuentes contradicen, no adivinar: conservar la opción más reciente y documentada y señalar la contradicción antes de hacer un cambio destructivo.
