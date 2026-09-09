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

## D-012 — Stack técnico
Estado: ABIERTO

React/Vite, Dexie/IndexedDB, Tiptap, Zustand y otras herramientas han sido consideradas, pero todavía no deben tratarse como selección definitiva hasta cerrar la arquitectura con el usuario.

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
