# SECURITY.md — PRIVACIDAD Y SEGURIDAD

Este proyecto puede manejar prédicas, notas y otra información personal. La privacidad se diseña desde el inicio.

## 1. Repositorio

- El repositorio debe permanecer privado salvo autorización explícita del usuario.
- Ser privado NO justifica guardar secretos en Git.
- Trabajar como si el historial pudiera quedar expuesto algún día.

## 2. Prohibido subir a Git

Nunca guardar en commits:

- contraseñas;
- tokens de acceso o actualización;
- claves privadas;
- secretos OAuth;
- credenciales de servicios;
- cookies o sesiones autenticadas;
- archivos `.env` con valores reales;
- respaldos personales de la aplicación;
- prédicas reales del usuario usadas como dataset de prueba;
- notas bíblicas personales reales;
- datos exportados desde Google Drive u otra nube;
- bases de datos locales reales del usuario.

Los ejemplos y fixtures deben usar información ficticia.

## 3. Si un secreto entra en Git por accidente

No basta con borrarlo en un commit posterior.

- Considerarlo comprometido.
- Revocarlo o rotarlo inmediatamente.
- Sustituirlo por uno nuevo.
- Revisar si hace falta limpiar historial.
- Registrar el incidente sin copiar el secreto dentro de la documentación.

## 4. Configuración y secretos

- Separar configuración pública de secretos.
- Usar variables de entorno o mecanismos de secretos del servicio de despliegue cuando corresponda.
- Añadir reglas de `.gitignore` antes de crear archivos locales sensibles.
- No imprimir secretos en logs ni mensajes de error.

## 5. Datos personales en la aplicación

- Biblia/corpus y datos personales deben mantenerse separados.
- Recoger solo los datos necesarios.
- No crear cuentas obligatorias para funciones que pueden ser locales.
- La sincronización futura debe pedir permisos mínimos.
- Diseñar exportación y recuperación sin exponer información innecesaria.

## 6. Vinculación de dispositivos

El código numérico de vinculación deberá diseñarse como:

- temporal;
- de corta duración;
- limitado en intentos;
- de un solo uso o invalidado al completar el vínculo;
- insuficiente por sí solo como credencial permanente.

Después del vínculo, utilizar credenciales/identificadores seguros generados para los dispositivos. No almacenar el código temporal como contraseña.

## 7. Google Drive / sincronización

Estado actual: planeado, no implementado.

Cuando se implemente:

- solicitar el menor alcance de Drive que permita la función;
- no guardar credenciales de usuario en GitHub;
- estudiar cifrado de los datos personales antes de subirlos cuando sea viable;
- manejar conflictos sin destruir silenciosamente una versión más reciente;
- permitir funcionar localmente aunque Drive no esté disponible;
- no depender de que otro dispositivo esté encendido.

## 8. Pantalla de congregación

- Nunca enviar notas privadas o contenido completo de la prédica a la vista pública si no es necesario.
- La pantalla pública debe recibir únicamente el contenido destinado a mostrar.
- Los códigos de conexión de pantalla también deberán expirar y limitar intentos.
- No confiar en datos enviados por clientes sin validación.

## 9. Dependencias

Antes de añadir una dependencia:

- confirmar que realmente hace falta;
- preferir proyectos mantenidos y ampliamente usados cuando la seguridad sea relevante;
- evitar paquetes desconocidos para tareas triviales;
- mantener versiones controladas mediante lockfile;
- revisar alertas de vulnerabilidades y actualizar cuando corresponda.

## 10. Código y entradas externas

- Validar datos provenientes de red, archivos importados, parámetros de URL y almacenamiento externo.
- No ejecutar contenido importado como código.
- Escapar/sanitizar contenido cuando exista riesgo de inyección o XSS.
- Aplicar límites razonables a entradas para evitar abuso.

## 11. Cambios de seguridad

Una medida de seguridad no debe eliminarse solo para simplificar desarrollo. Si una protección bloquea una función, identificar la causa y diseñar una solución segura antes de desactivarla.
