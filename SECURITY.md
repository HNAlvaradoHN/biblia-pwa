# SECURITY.md — PRIVACIDAD Y SEGURIDAD

Este proyecto puede manejar prédicas, notas y otra información personal. La privacidad se diseña desde el inicio y el repositorio debe construirse como si pudiera hacerse público en el futuro.

## 1. Regla principal

- El repositorio debe permanecer privado salvo autorización explícita del usuario.
- Ser privado NO justifica guardar secretos ni datos personales en Git.
- Todo contenido versionado debe considerarse potencialmente público desde el momento en que se crea.
- El objetivo es que, si en el futuro se decide hacer público el repositorio, el código pueda revisarse y publicarse sin exponer credenciales ni información privada del usuario.
- No incluir información personal que no sea estrictamente necesaria para el funcionamiento/documentación pública del proyecto.

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

No basta con borrarlo en un commit posterior.

- Considerarlo comprometido.
- Revocarlo o rotarlo inmediatamente.
- Sustituirlo por uno nuevo cuando sea necesario.
- Revisar el historial y los lugares donde pudo haberse copiado.
- Limpiar historial si corresponde, entendiendo que limpiar Git no sustituye la rotación del secreto.
- Registrar el incidente sin copiar el secreto dentro de la documentación.

Nunca afirmar que un secreto vuelve a ser seguro solamente porque ya no aparece en `main`.

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
- no instalar una herramienta de seguridad que exija subir el código o datos privados a un tercero sin evaluar esa implicación.

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
- ante una duda razonable, bloquear el merge hasta resolverla.

## 13. Auditoría obligatoria antes de hacer público el repositorio

Hacer público el repositorio requiere una revisión separada y explícita. No basta con que `main` compile.

Antes de cambiar la visibilidad:

1. Revisar el árbol completo de archivos y nombres.
2. Buscar patrones de credenciales y secretos en el contenido actual.
3. Revisar el historial completo de Git para archivos eliminados y secretos antiguos.
4. Revisar documentación, workflows, logs/versionados y configuraciones.
5. Confirmar que no hay datos personales reales ni archivos personales históricos.
6. Rotar/revocar cualquier secreto que alguna vez haya aparecido en el repositorio.
7. Revisar dependencias y vulnerabilidades conocidas.
8. Confirmar que corpus bíblico, títulos y otros contenidos tienen permisos adecuados para distribución.
9. Confirmar que los servicios externos no dependen de secretos colocados en el frontend.
10. Solo después de una auditoría satisfactoria pedir/recibir autorización explícita del usuario para cambiar la visibilidad.

Hasta completar este proceso, el repositorio permanece privado.

## 14. Cambios de seguridad

Una medida de seguridad no debe eliminarse solo para simplificar desarrollo. Si una protección bloquea una función, identificar la causa y diseñar una solución segura antes de desactivarla.

Las reglas de esta sección son requisitos del proyecto, no sugerencias opcionales.
