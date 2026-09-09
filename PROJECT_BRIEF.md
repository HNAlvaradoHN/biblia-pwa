# PROJECT_BRIEF.md — BIBLIA PWA

## Objetivo

Crear una Biblia PWA para uso personal y ministerial, especialmente cómoda para preparar y presentar prédicas desde teléfono, tablet o computadora.

Principio central de UX: durante una prédica la aplicación debe prácticamente desaparecer. Las acciones importantes deben requerir uno o pocos toques y nunca hacer perder la posición del pastor.

## Plataforma

- PWA primero.
- Debe funcionar instalada y también en navegador.
- Debe priorizar móvil, tablet y escritorio.
- Debe funcionar offline para lectura bíblica y datos personales esenciales.
- Android nativo no es prioridad. Si luego se necesita APK, se evaluará empaquetar la misma app con Capacitor u opción equivalente sin rehacerla.

## Traducción bíblica

- Traducción principal deseada: Reina-Valera 1960 (RVR60).
- No asumir que un dataset encontrado en GitHub puede redistribuirse legalmente.
- Antes de incorporar un corpus completo al repositorio o distribuir la app públicamente, revisar procedencia y permisos/licencia.
- La arquitectura debe permitir cambiar o añadir traducciones sin romper prédicas ni referencias.

## Áreas principales

### Biblia
- Libros, capítulos y versículos.
- Navegación rápida.
- Búsqueda.
- Historial y última lectura.
- Favoritos.
- Resaltados.
- Notas bíblicas.
- Copiar y compartir.
- Preferencias de lectura.

### Prédicas
- Mis prédicas.
- Crear, editar, duplicar, buscar y archivar.
- Una prédica es un documento independiente; no confundirla con una nota bíblica.
- Puede contener título, introducción, puntos, subpuntos, comentarios, conclusión y muchas referencias.

### Referencias bíblicas inteligentes
Las referencias no deben existir únicamente como texto visible. Deben tener estructura interna, por ejemplo libro, capítulo, versículo inicial y final.

Esto permitirá abrir, consultar, proyectar, copiar, compartir y cambiar traducción en el futuro.

La detección automática de texto como `Juan 3:16` puede añadirse después del editor básico si complica el MVP.

### Vista rápida y regreso a prédica
Al tocar una referencia durante una prédica:
- Vista rápida del pasaje sin abandonar la prédica.
- Abrir en Biblia para leer contexto.
- Mostrar en pantalla.
- Copiar/compartir.

Al regresar desde la Biblia, debe volver exactamente al punto previo de la prédica. No depender únicamente del botón Atrás del navegador.

### Modo Predicación
Debe priorizar:
- texto grande;
- alto contraste;
- pocos controles;
- referencias fáciles de tocar;
- evitar edición accidental;
- conservar estado y posición;
- intentar mantener la pantalla activa cuando la plataforma lo permita;
- mostrar discretamente el estado de la pantalla externa.

### Pantalla de congregación
- No duplicar la pantalla privada del pastor.
- La TV/proyector abre una página independiente en navegador.
- Solo muestra contenido público, por ejemplo referencia, texto bíblico y traducción.
- El dispositivo del pastor controla mostrar, cambiar y ocultar.
- Debe intentar funcionar en navegadores modernos de Smart TV sin depender de Samsung, LG, Chromecast u otra marca concreta.

### Vinculación y sincronización personal
Objetivo: que las prédicas, notas, favoritos y otros datos personales puedan estar disponibles en varios dispositivos aunque el dispositivo original esté apagado.

Dirección acordada a nivel de producto:
- funcionamiento local/offline como base;
- sincronización opcional mediante almacenamiento del propio usuario, actualmente Google Drive como opción preferida a investigar/implementar;
- vinculación de un dispositivo nuevo mediante código numérico temporal en lugar de QR;
- una vez vinculado, no debería exigir repetir el código en cada sincronización;
- evitar dependencia obligatoria de Supabase, Firebase, Cloudflare u otra nube de base de datos comercial si no es necesaria;
- proteger los datos personales y minimizar permisos.

La tecnología exacta y el diseño final de conflictos de sincronización deben definirse antes de implementar esa fase.

## Datos personales

Inicialmente deben poder vivir localmente:
- prédicas;
- notas;
- favoritos;
- resaltados;
- historial;
- configuración.

No introducir cuentas obligatorias para el MVP.

Los datos bíblicos y los datos personales deben mantenerse separados para que actualizar el corpus bíblico no ponga en riesgo información del usuario.

## Fases

1. Base bíblica: proyecto, PWA, datos bíblicos, navegación y offline.
2. Lector: búsqueda, favoritos, resaltados, notas, compartir, historial y preferencias.
3. Editor de prédicas.
4. Referencias inteligentes, vista rápida y regreso exacto.
5. Modo Predicación.
6. Pantalla externa y conexión.
7. Sincronización/multidispositivo y mejoras, ajustando el orden si el usuario prioriza sincronización antes.
8. Futuro: APK, múltiples traducciones, herramientas bíblicas avanzadas, etc.

## MVP funcional

Debe demostrar primero:
1. Leer la Biblia cómodamente.
2. Crear una prédica con referencias bíblicas.
3. Abrir referencias y regresar sin perder posición.

Después:
4. Modo Predicación.
5. Pantalla externa.

## Criterio de calidad

Para cada función preguntar: ¿puede un pastor hacer esto mientras está hablando frente a una congregación sin distraerse?

Ejemplo deseado: `Referencia → Mostrar`, no una cadena de múltiples menús.

## Lo que se debe evitar

- Interfaz complicada.
- Perder la posición de lectura o prédica.
- Mostrar notas privadas en TV.
- Depender exclusivamente de duplicación de pantalla o Chromecast.
- Obligar Internet para leer la Biblia.
- Cuentas obligatorias desde el comienzo.
- Sobrediseñar el MVP.
- Mezclar módulos sin necesidad.
- Dependencias de nube innecesarias.
- Rehacer una app Android separada sin una razón fuerte.

## Decisiones técnicas todavía abiertas

- Framework definitivo.
- Base de datos local definitiva.
- Formato/fuente definitiva del corpus bíblico.
- Editor definitivo.
- Diseño técnico definitivo de sincronización con Drive.
- Tecnología definitiva de tiempo real para pantalla de congregación.
- Diseño visual definitivo.

No cerrar estas decisiones solo por costumbre o popularidad; comparar simplicidad, mantenimiento, rendimiento, offline, privacidad y compatibilidad futura.
