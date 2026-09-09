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
- Protocolo de preguntas al usuario definido para pedir solo decisiones con impacto real.
- Reglas de entrega establecidas en `RELEASE_RULES.md`: no declarar versiones listas mientras existan fallos relevantes, identificar builds y avisar actualización de la PWA antes de probar cambios nuevos.
- Concepto de vinculación por código aceptado.
- Google Drive seleccionado como dirección preferida a investigar para sincronización personal sin exigir que otro dispositivo permanezca encendido.
- Pantalla de congregación movida al final como función opcional; no forma parte del MVP ni debe implementarse sin confirmación posterior del usuario.
- Pantalla de inicio aprobada: `Continuar leyendo`, `Lectura del día` y accesos principales como `Biblia`, `Prédicas` y `Buscar`.
- `Lectura del día` definida como un solo versículo con acciones `Compartir` y `Leer pasaje completo`.
- Dirección de personalización futura registrada: vista de versículos corridos/separados, compartir versículos, fondos visuales, temas adicionales y más opciones de apariencia/lectura.
- Entrada a `Biblia` aprobada: combina `Continuar leyendo`, selector de libros/capítulos y lupa para localizar rápidamente un libro por nombre.

## Objetivo activo

Cerrar arquitectura técnica de la primera versión.

No comenzar implementación ni saltar a otros módulos hasta cerrar este objetivo o hasta que el usuario cambie explícitamente la prioridad.

## En evaluación

- Permitir en el editor combinar texto escrito con teclado y bloques de escritura/dibujo con lápiz o stylus en teléfono/tablet. Esta idea todavía no está aprobada como requisito definitivo.

## Decisiones de producto futuras ya registradas, pero no abiertas todavía

- Diseño exacto de los modos de lectura `versículos corridos` y `versículos separados`.
- Diseño y flujo de compartir versículos.
- Uso de imágenes/fondos en contenido compartido.
- Fondos o estilos visuales dentro de la aplicación.
- Temas adicionales además de día/noche.
- Personalizaciones de lectura y apariencia.

No hacer preguntas detalladas sobre estos puntos hasta llegar a su fase correspondiente.

## Decisiones técnicas aún abiertas

- Framework frontend definitivo.
- Persistencia local definitiva.
- Librería/editor de prédicas definitivo.
- Fuente y formato inicial de datos bíblicos.
- Diseño final de sincronización con Google Drive.
- Si se implementará o no la pantalla de congregación al final del proyecto.
- Proveedor/flujo definitivo de despliegue de la PWA cuando llegue la implementación.

## Siguiente paso

Cerrar las decisiones de producto necesarias para la experiencia base de la primera versión y luego definir el stack técnico mínimo para Fase 1.

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
- Configurar verificaciones de calidad/CI y flujo de despliegue antes de la primera entrega ejecutable.
- Implementar un mecanismo visible de versión/actualización antes de depender de pruebas sobre versiones desplegadas.

## Regla de actualización

Este archivo describe únicamente el estado REAL. No marcar una función como terminada porque esté planeada o diseñada; solo cuando exista y haya sido verificada.

Debe existir un solo objetivo activo principal. Cuando se complete, mover el siguiente paso a objetivo activo antes de iniciar trabajo nuevo.