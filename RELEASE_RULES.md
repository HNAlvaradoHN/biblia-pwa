# RELEASE_RULES.md — REGLAS DE ENTREGA, VERIFICACIÓN Y ACTUALIZACIÓN

Este archivo define cuándo una versión de Biblia PWA puede considerarse lista para probar o usar.

## 1. Regla principal: no entregar en rojo

Una tarea de implementación no puede darse por terminada ni presentarse al usuario como lista para probar mientras exista un fallo conocido relevante en la cadena de entrega.

Cuando ya exista infraestructura de CI/despliegue, antes de decir `Lista para probar` deben estar correctos, según aplique:

- compilación/build;
- TypeScript o chequeo de tipos;
- linter;
- pruebas automatizadas disponibles;
- verificaciones de seguridad/dependencias configuradas;
- merge o rama objetivo correcta;
- GitHub Actions/CI en verde;
- despliegue finalizado correctamente;
- comprobación básica de que la aplicación publicada abre y carga la versión esperada.

Si algo falla, investigar y corregir dentro del trabajo actual en la medida técnicamente posible. No presentar una versión fallida como lista solo porque el código ya fue escrito o el merge ya ocurrió.

Si existe un bloqueo externo imposible de resolver desde el entorno disponible (caída de proveedor, permisos inexistentes, servicio externo fuera de línea, etc.), informarlo de forma explícita y NO decir `Lista para probar`.

## 2. Estado único para el usuario

Solo usar el mensaje equivalente a:

`✅ Lista para probar`

cuando las verificaciones aplicables hayan pasado y la versión publicada/verificable corresponda al cambio realizado.

Antes de ese punto, describir el estado como trabajo pendiente, fallo o bloqueo; nunca inducir al usuario a probar una versión antigua creyendo que es la nueva.

## 3. Versiones identificables

Cuando comience la implementación real de la PWA, toda versión desplegada deberá tener un identificador visible o consultable por la aplicación, por ejemplo una versión semántica (`0.1.0`) y/o un identificador corto de build/commit.

Objetivo: poder confirmar con certeza qué versión está ejecutando el usuario y compararla con la última desplegada.

No depender únicamente de la hora del navegador o de asumir que el service worker ya actualizó.

## 4. Actualización obligatoria para probar la nueva versión

Cada nueva versión desplegada debe poder detectar que existe una actualización y mostrar un aviso claro al usuario.

Ejemplo conceptual:

`Hay una nueva versión disponible. Actualizar ahora.`

Para probar cambios nuevos, el usuario debe actualizar primero. La aplicación debe reducir al mínimo la posibilidad de que se pruebe una versión anterior por caché.

Después de completar la actualización, debe quedar claro que ya está cargada la nueva versión, idealmente mostrando el número/identificador actualizado cuando haga falta diagnosticar.

## 5. Excepción crítica: predicación o trabajo activo

No aplicar una recarga forzada que pueda interrumpir una sesión de predicación, edición no guardada o una operación crítica en curso.

Si aparece una actualización durante una sesión crítica:

- avisar que existe;
- conservar el trabajo actual;
- permitir terminar o guardar de forma segura;
- aplicar la actualización al salir de la sesión o mediante una acción explícita segura.

La obligación de usar la última versión no justifica perder una prédica, posición, nota o contenido no guardado.

## 6. PWA y caché

El sistema de actualización de la PWA debe diseñarse para evitar versiones fantasma o mezclas entre archivos viejos y nuevos.

Cuando se implemente el service worker:

- definir una estrategia de actualización clara;
- invalidar cachés antiguas cuando corresponda;
- no conservar assets obsoletos sin motivo;
- evitar que una nueva interfaz use JavaScript/CSS de una versión anterior;
- probar actualización desde una versión anterior, no solo instalación limpia.

## 7. Después de cada cambio desplegable

Antes de entregar al usuario:

1. terminar el cambio solicitado;
2. limpiar código viejo y basura relacionada;
3. ejecutar verificaciones locales disponibles;
4. integrar/mergear mediante el flujo definido para el proyecto;
5. comprobar CI en verde;
6. comprobar despliegue correcto;
7. verificar la aplicación publicada;
8. confirmar la versión/build cargada;
9. indicar al usuario que hay una nueva versión y que debe actualizar antes de probar;
10. solo entonces declarar `✅ Lista para probar`.

## 8. Mensaje de actualización al usuario

Cada entrega que cambie la aplicación ejecutable debe incluir un mensaje breve indicando que existe una nueva versión y que debe actualizar antes de probarla.

Formato recomendado:

`✅ Lista para probar — Nueva versión disponible. Actualizá la aplicación antes de probar este cambio.`

Si el cambio es solo documentación y no modifica la aplicación ejecutable, no hace falta pedir actualización.

## 9. No ocultar fallos

No desactivar pruebas, reglas de linter, chequeos de tipos o verificaciones solo para obtener verde.

Si un chequeo está mal configurado, corregir la configuración. Si detecta un problema real, corregir el problema.

Verde debe significar que las verificaciones relevantes pasaron, no que fueron silenciadas.

## 10. Registro

Los cambios ejecutables relevantes se documentan en `CHANGELOG.md`.

`PROJECT_STATE.md` debe reflejar si una versión está realmente desplegada/verificada cuando ese dato sea relevante para el objetivo activo.

Git conserva el historial técnico; no crear archivos manuales por versión solo para duplicar lo que ya existe en commits/tags/releases.