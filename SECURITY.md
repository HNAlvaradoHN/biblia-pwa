# SECURITY.md — PRIVACIDAD Y SEGURIDAD

Este proyecto puede manejar prédicas, notas y otra información personal. La privacidad se diseña desde el inicio. El repositorio oficial es público desde el 2026-09-16 por autorización explícita del usuario, por lo que todo contenido versionado, ramas e historial deben tratarse como públicamente accesibles.

## 1. Regla principal

- La visibilidad actual del repositorio es pública por decisión explícita del usuario.
- Cambiar nuevamente la visibilidad requiere autorización explícita del usuario.
- Ser público no autoriza guardar secretos ni datos personales en Git.
- Todo contenido versionado debe considerarse público desde el momento en que se crea.
- No incluir información personal que no sea estrictamente necesaria para el funcionamiento/documentación pública del proyecto.
- Antes de crear o mantener una rama, recordar que una rama pública también expone su árbol y su historial alcanzable.

## 2. Prohibido subir a Git

Nunca guardar en commits, documentación, fixtures, ejemplos, logs o archivos auxiliares:

- contraseñas;
- tokens de acceso, refresh tokens o tokens de sesión;
- API keys secretas;
- claves privadas, certificados privados o material criptográfico secreto;
- secretos OAuth o secretos de cliente;
- credenciales de servicios;
- cookies o sesiones autenticadas;
- cabeceras `Authorization` reales;
- URLs temporales firmadas que concedan acceso a archivos o servicios;
- archivos `.env` con valores reales;
- archivos de credenciales de Google, GitHub, Vercel u otros proveedores;
- respaldos personales de la aplicación;
- prédicas reales del usuario usadas como dataset de prueba;
- notas bíblicas personales reales;
- favoritos, resaltados o historial real del usuario;
- datos exportados desde Google Drive u otra nube;
- bases de datos locales reales del usuario;
- dumps de IndexedDB, SQLite u otras bases personales;
- direcciones, teléfonos, documentos de identidad u otros datos privados del usuario;
- capturas, logs o artefactos que revelen secretos o datos personales.

Los ejemplos y fixtures del repositorio deben usar información ficticia.

## 3. Regla crítica para frontend/PWA

Una PWA se ejecuta en el dispositivo del usuario. Todo valor incluido en JavaScript, HTML, CSS, manifiestos, archivos estáticos o variables incorporadas durante el build puede ser inspeccionado por terceros.

Por tanto:

- nunca tratar una variable enviada al frontend como secreta;
- nunca ocultar una credencial en código ofuscado, Base64, nombres poco claros o archivos estáticos;
- una API que requiera un secreto real no debe depender de que ese secreto permanezca oculto dentro de la PWA;
- identificadores públicos de cliente solo pueden usarse cuando el proveedor los diseñe explícitamente como públicos y deben tener permisos/restricciones apropiados;
- secretos reales deben permanecer en infraestructura segura fuera del bundle público o en mecanismos autorizados del dispositivo/usuario según corresponda.

## 4. Si un secreto entra en Git por accidente

No basta con borrarlo en un commit posterior ni con mover/eliminar una rama.

- Considerarlo comprometido.
- Revocarlo o rotarlo inmediatamente.
- Sustituirlo por uno nuevo cuando sea necesario.
- Revisar el historial y los lugares donde pudo haberse copiado.
- Limpiar historial si corresponde, entendiendo que limpiar Git no sustituye la rotación del secreto.
- Si GitHub conserva vistas, cachés o referencias alcanzables después de reescribir historial, seguir el proceso de eliminación de datos sensibles de GitHub cuando aplique.
- Registrar el incidente sin copiar el secreto dentro de la documentación.

Nunca afirmar que un secreto vuelve a ser seguro solamente porque ya no aparece en `main` o en una rama visible.

## 5. Configuración y secretos

- Separar configuración pública de secretos.
- Usar variables de entorno o mecanismos de secretos del servicio únicamente del lado donde realmente puedan permanecer privados.
- Añadir reglas de `.gitignore` antes de crear archivos locales sensibles.
- Mantener `.env.example` exclusivamente con nombres de variables y valores ficticios/no sensibles.
- No imprimir secretos en logs ni mensajes de error.
- No copiar respuestas completas de herramientas externas a documentación si contienen tokens, cookies, firmas o URLs temporales.
- Evitar registrar IDs internos de infraestructura si no aportan valor público al proyecto.

## 6. Datos personales en la aplicación

- Biblia/corpus y datos personales deben mantenerse separados.
- Recoger solo los datos necesarios.
- No crear cuentas obligatorias para funciones que pueden ser locales.
- Favoritos, notas, resaltados, historial y prédicas reales pertenecen al almacenamiento del usuario, no al repositorio.
- La sincronización futura debe pedir permisos mínimos.
- Diseñar exportación y recuperación sin exponer información innecesaria.
- Los datos de prueba incluidos en Git deben ser ficticios y no derivados de contenido personal real.

## 7. Vinculación de dispositivos

El código numérico de vinculación deberá diseñarse como:

- temporal;
- de corta duración;
- limitado en intentos;
- de un solo uso o invalidado al completar el vínculo;
- insuficiente por sí solo como credencial permanente.

Después del vínculo, utilizar credenciales/identificadores seguros generados para los dispositivos. No almacenar el código temporal como contraseña ni escribirlo en logs permanentes.

## 8. Google Drive / sincronización

Estado actual: planeado, no implementado.

Cuando se implemente:

- solicitar el menor alcance de Drive que permita la función;
- no guardar credenciales ni tokens del usuario en GitHub;
- no incrustar secretos OAuth dentro del bundle de la PWA;
- estudiar cifrado de los datos personales antes de subirlos cuando sea viable;
- manejar conflictos sin destruir silenciosamente una versión más reciente;
- permitir funcionar localmente aunque Drive no esté disponible;
- no depender de que otro dispositivo esté encendido;
- documentar claramente qué identificadores son públicos y qué valores deben permanecer secretos.

## 9. Pantalla de congregación

- Nunca enviar notas privadas o contenido completo de la prédica a la vista pública si no es necesario.
- La pantalla pública debe recibir únicamente el contenido destinado a mostrar.
- Los códigos de conexión de pantalla también deberán expirar y limitar intentos.
- No confiar en datos enviados por clientes sin validación.
- Esta función sigue postergada y no debe introducir infraestructura o datos públicos anticipadamente.

## 10. Dependencias

Antes de añadir una dependencia:

- confirmar que realmente hace falta;
- preferir proyectos mantenidos y ampliamente usados cuando la seguridad sea relevante;
- evitar paquetes desconocidos para tareas triviales;
- mantener versiones controladas mediante lockfile;
- revisar alertas de vulnerabilidades y actualizar cuando corresponda;
- no instalar una herramienta de seguridad que exija subir código o datos personales a un tercero sin evaluar esa implicación.

## 11. Código y entradas externas

- Validar datos provenientes de red, archivos importados, parámetros de URL y almacenamiento externo.
- No ejecutar contenido importado como código.
- Escapar/sanitizar contenido cuando exista riesgo de inyección o XSS.
- Aplicar límites razonables a entradas para evitar abuso.
- No confiar en que un valor sea seguro solo porque proviene del almacenamiento local.

## 12. Revisión obligatoria antes de merge

Todo cambio debe pasar una revisión de privacidad/secretos antes del merge:

- revisar el diff completo;
- revisar nombres de archivos nuevos;
- comprobar que no se añadieron `.env`, claves, bases locales, exports, backups o credenciales;
- comprobar que no se incluyeron URLs firmadas temporales o cabeceras autenticadas;
- comprobar que no se añadieron datos personales reales;
- comprobar que cualquier configuración expuesta en frontend está clasificada conscientemente como pública;
- revisar también ramas nuevas o referencias auxiliares creadas por el cambio;
- ante una duda razonable, bloquear el merge hasta resolverla.

## 13. Auditoría de repositorio público

El repositorio ya es público. La auditoría de transición realizada el 2026-09-16 deja estas conclusiones operativas:

1. El árbol actual de `main` no mostró archivos `.env`, claves privadas, bases locales, archivos de credenciales, dumps o backups versionados.
2. Las búsquedas realizadas sobre `main` para patrones comunes de tokens, claves y credenciales no devolvieron coincidencias evidentes.
3. El workflow principal usa permisos de solo lectura sobre contenido y mantiene `npm ci`, TypeScript, ESLint, build PWA y auditoría de dependencias.
4. Se revisaron las ramas públicas. Se detectó una rama ajena al proyecto Biblia, `recibos-apk-build`, con código de otra aplicación y un valor de contraseña de firma incrustado en un commit histórico antiguo.
5. La referencia de `recibos-apk-build` se movió al mismo commit limpio de `main` para retirar de la rama pública el árbol ajeno. No se detectó un archivo de keystore versionado en esa rama, pero cualquier contraseña o material de firma relacionado debe considerarse comprometido si fue usado fuera de este repositorio y no debe reutilizarse.
6. Mover una referencia no garantiza borrar inmediatamente objetos históricos, cachés o copias externas. Si existiera material de firma real asociado o reutilización de esa contraseña, debe rotarse/reemplazarse fuera de este repositorio y, si fuera necesario eliminar objetos históricos de GitHub, seguir el procedimiento específico de eliminación de datos sensibles.
7. Las demás ramas públicas revisadas corresponden a trabajo histórico del proyecto Biblia; no se observaron archivos adicionales de credenciales ni datasets personales en sus diferencias actuales respecto de `main`.
8. No se detectaron credenciales de GitHub, Google, Vercel, AWS, Slack, GitLab o claves privadas mediante los patrones de alta señal revisados en el árbol público actual.

Esta auditoría reduce el riesgo conocido, pero no convierte un secreto previamente expuesto en seguro. Ante cualquier hallazgo futuro, se aplica la sección 4 sin excepciones.

## 14. Publicación, licencias y datos

- Que el repositorio sea público no autoriza redistribuir RVR60 ni encabezados editoriales protegidos.
- Antes de incorporar corpus definitivo, confirmar procedencia y permisos de distribución.
- El contenido de desarrollo seguirá siendo ficticio o legalmente utilizable hasta contar con fuente autorizada.
- Los datos personales reales del usuario nunca forman parte del repositorio público.

## 15. Cambios de seguridad

Una medida de seguridad no debe eliminarse solo para simplificar desarrollo. Si una protección bloquea una función, identificar la causa y diseñar una solución segura antes de desactivarla.

Las reglas de esta sección son requisitos del proyecto, no sugerencias opcionales.
