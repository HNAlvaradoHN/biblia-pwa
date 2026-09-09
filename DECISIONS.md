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
Estado: APROBADA

No duplicar la pantalla del pastor. La congregación debe tener una vista independiente en navegador que solo muestre contenido público enviado por el pastor.

## D-011 — RVR60 deseada, licencia no asumida
Estado: APROBADA

RVR60 es la traducción principal deseada. No incorporar ni redistribuir un dataset completo encontrado en Internet sin verificar procedencia y permisos adecuados.

## D-012 — Stack técnico
Estado: ABIERTO

React/Vite, Dexie/IndexedDB, Tiptap, Zustand y otras herramientas han sido consideradas, pero todavía no deben tratarse como selección definitiva hasta cerrar la arquitectura con el usuario.
