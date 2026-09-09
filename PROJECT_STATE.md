# PROJECT_STATE.md — ESTADO ACTUAL

Última actualización: 2026-09-09

## Estado general

Etapa: definición y planificación inicial.

Repositorio oficial: `HNAlvaradoHN/biblia-pwa`.

Visibilidad esperada: privada.

Todavía no existe implementación de la aplicación.

## Completado

- Objetivo y alcance general definidos.
- PWA elegida como plataforma inicial.
- Repositorio privado creado.
- Sistema de continuidad entre chats definido mediante `AGENTS.md`.
- Reglas de cero basura, privacidad y documentación establecidas.
- Reglas estrictas de interfaz y cambios visuales establecidas en `UI_RULES.md`.
- Desarrollo secuencial definido: un objetivo activo a la vez, con cierre, prueba, limpieza y documentación antes de avanzar.
- Concepto de vinculación por código aceptado.
- Google Drive seleccionado como dirección preferida a investigar para sincronización personal sin exigir que otro dispositivo permanezca encendido.
- Pantalla de congregación movida al final como función opcional; no forma parte del MVP ni debe implementarse sin confirmación posterior del usuario.

## Objetivo activo

Cerrar arquitectura técnica de la primera versión.

No comenzar implementación ni saltar a otros módulos hasta cerrar este objetivo o hasta que el usuario cambie explícitamente la prioridad.

## En evaluación

- Permitir en el editor combinar texto escrito con teclado y bloques de escritura/dibujo con lápiz o stylus en teléfono/tablet. Esta idea todavía no está aprobada como requisito definitivo.

## Decisiones técnicas aún abiertas

- Framework frontend definitivo.
- Persistencia local definitiva.
- Librería/editor de prédicas definitivo.
- Fuente y formato inicial de datos bíblicos.
- Diseño final de sincronización con Google Drive.
- Si se implementará o no la pantalla de congregación al final del proyecto.

## Siguiente paso

Definir el stack técnico mínimo para Fase 1 y, una vez aprobado, crear la estructura inicial de la PWA sin añadir módulos futuros innecesarios.

## Fase 1 pendiente

Objetivo: obtener una Biblia instalable, rápida y usable offline.

Pendiente:
- Inicializar aplicación.
- Configurar PWA.
- Crear modelo bíblico básico.
- Incorporar dataset legal/de prueba apropiado.
- Navegación libro → capítulo → versículos.
- Persistir última lectura.
- Probar funcionamiento offline.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.
