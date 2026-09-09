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

### Inicio
- La aplicación abre en una pantalla de Inicio moderna.
- `Continuar leyendo` usa la última lectura del usuario.
- `Lectura del día` muestra un solo versículo destacado.
- El versículo diario permite `Compartir` y `Leer pasaje completo`.
- Debajo aparecen accesos claros a áreas principales como `Biblia`, `Prédicas` y `Buscar`.

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
- Debe contemplar al menos dos modos de visualización: versículos corridos y versículos separados.
- Debe admitir personalizaciones de lectura y apariencia que se definirán en su fase.

### Compartir versículos
- Compartir versículos forma parte de la dirección del producto.
- Se desea permitir diseños con imágenes o fondos visuales.
- El flujo exacto, plantillas, controles y alcance se definirán cuando llegue la fase correspondiente.

### Apariencia y temas
- La app debe ser moderna, clara, responsiva y fácil de usar.
- Día/noche no serán necesariamente los únicos temas.
- Se desea contemplar más temas, fondos o estilos visuales y personalizaciones futuras.
- Los detalles se decidirán de forma gradual para no sobrediseñar el MVP.

### Prédicas
- Mis prédicas.
- Crear, editar, duplicar, buscar y archivar.
- Una prédica es un documento independiente; no confundirla con una nota bíblica.
- Puede contener título, introducción, puntos, subpuntos, comentarios, conclusión y muchas referencias.

### Referencias bíblicas inteligentes
Las referencias no deben existir únicamente como texto visible. Deben tener estructura interna, por ejemplo libro, capítulo, versículo inicial y final.

Esto permitirá abrir, consultar, copiar, compartir y cambiar traducción en el futuro. La proyección a pantalla externa queda como posibilidad futura opcional.

La detección automática de texto como `Juan 3:16` puede añadirse después del editor básico si complica el MVP.

### Vista rápida y regreso a prédica
Al tocar una referencia durante una prédica:
- Vista rápida del pasaje sin abandonar la prédica.
- Abrir en Biblia para leer contexto.
- Copiar/compartir.
- Mostrar en pantalla solo si esa función se aprueba e implementa posteriormente.

Al regresar desde la Biblia, debe volver exactamente al punto previo de la prédica. No depender únicamente del botón Atrás del navegador.

### Modo Predicación
Debe priorizar:
- texto grande;
- alto contraste;
- pocos controles;
- referencias fáciles de tocar;
- evitar edición accidental;
- conservar estado y posición;
- intentar mantener la pantalla activa cuando la plataforma lo permita.

La pantalla externa no es requisito del Modo Predicación.

### Pantalla de congregación — OPCIONAL / FUTURA
Esta función se conserva como idea, pero no forma parte del MVP ni del camino principal actual.

Si el usuario decide implementarla al final:
- no duplicará la pantalla privada del pastor;
- la TV/proyector tendrá una vista independiente;
- solo mostrará contenido público;
- el pastor podrá mostrar, cambiar y ocultar versículos;
- se intentará mantener independencia de marcas concretas de Smart TV.

No invertir tiempo en esta función hasta que el usuario la confirme expresamente más adelante.

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
3. Personalización del lector/compartir: modos de lectura, temas, fondos y opciones visuales, sin adelantar detalles antes de tiempo.
4. Editor de prédicas.
5. Referencias inteligentes, vista rápida y regreso exacto.
6. Modo Predicación.
7. Sincronización/multidispositivo y mejoras de uso, ajustando el orden según prioridad del usuario.
8. Mejoras del editor, incluyendo escritura con lápiz/stylus si el usuario la aprueba.
9. Futuro opcional: pantalla de congregación, APK, múltiples traducciones, herramientas bíblicas avanzadas, etc.

## MVP funcional

Debe demostrar primero:
1. Leer la Biblia cómodamente.
2. Crear una prédica con referencias bíblicas.
3. Abrir referencias y regresar sin perder posición.

Después:
4. Modo Predicación.
5. Sincronización y mejoras del editor según prioridad.

La pantalla externa no forma parte del MVP actual.

## Criterio de calidad

Para cada función preguntar: ¿puede un pastor hacer esto mientras está hablando frente a una congregación sin distraerse?

## Lo que se debe evitar

- Interfaz complicada.
- Perder la posición de lectura o prédica.
- Obligar Internet para leer la Biblia.
- Cuentas obligatorias desde el comienzo.
- Sobrediseñar el MVP.
- Mezclar módulos sin necesidad.
- Dependencias de nube innecesarias.
- Rehacer una app Android separada sin una razón fuerte.
- Construir la pantalla de congregación antes de que el usuario decida que realmente la necesita.
- Adelantar decisiones detalladas de personalización antes de llegar a su fase.

## Decisiones técnicas todavía abiertas

- Framework definitivo.
- Base de datos local definitiva.
- Formato/fuente definitiva del corpus bíblico.
- Editor definitivo.
- Diseño técnico definitivo de sincronización con Drive.
- Soporte definitivo de escritura manual con stylus.
- Si se implementará o no la pantalla de congregación.
- Diseño visual definitivo.
- Implementación técnica de temas, fondos y compartir imágenes.

No cerrar estas decisiones solo por costumbre o popularidad; comparar simplicidad, mantenimiento, rendimiento, offline, privacidad y compatibilidad futura.