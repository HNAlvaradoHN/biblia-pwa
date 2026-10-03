# APK_INVENTORY.md — INVENTARIO DE REFERENCIA DE LA APK EXTERNA

Este documento consolida los hallazgos ya verificados durante el análisis previo de la APK/APKS aportada por el usuario. No convierte el paquete externo en fuente oficial del proyecto ni autoriza reutilización de contenido protegido.

Regla base: aplicar D-031 antes de incorporar cualquier elemento.

## Resumen técnico observado

- La aplicación externa está construida con Flutter.
- Incluye datasets bíblicos locales en varios idiomas, entre ellos español, inglés y portugués.
- El dataset español observado contiene 66 libros.
- La estructura local organiza libros, capítulos y versículos con metadatos como identificador, nombre, grupo/testamento, autor y colecciones de capítulos/versículos.
- Algunos versículos pueden incluir un campo de título/encabezado; se verificó como ejemplo que Génesis 1:1 tenía el título `La Creación`.
- Dentro del paquete se observaron valores de configuración, claves/tokens o secretos en texto plano. Esos valores no forman parte de Biblia PWA y no deben copiarse.
- Fuentes, iconos, imágenes, recursos gráficos, librerías y servicios externos encontrados en el paquete requieren revisión separada de licencia/procedencia.

## Clasificación

### REUTILIZABLE VERIFICADO

Actualmente no se ha clasificado ningún corpus, fuente, icono, imagen, encabezado editorial ni recurso binario de la APK como reutilizable verificado.

Esto evita asumir derechos de redistribución que todavía no están demostrados.

### RECONSTRUIBLE

Se pueden reconstruir con código propio, sin copiar implementación ni assets:

- estructura conceptual libro → capítulo → sección/título → versículo;
- navegación rápida entre libros y capítulos;
- encabezados de sección como capacidad del modelo de datos;
- preferencias visuales y de lectura observadas como patrón UX;
- lectura enfocada y controles de navegación;
- ajustes de tema, tipografía y disposición;
- otras interacciones que se aprueben dentro del roadmap de Biblia PWA.

### REQUIERE LICENCIA

No incorporar hasta verificar procedencia y permiso de redistribución:

- corpus RVR60 o cualquier traducción bíblica protegida;
- títulos/encabezados editoriales asociados a una edición protegida;
- fuentes incluidas en la APK;
- iconos, ilustraciones, imágenes y fondos;
- audio u otros recursos multimedia;
- paquetes de datos cuya licencia no esté documentada.

### NO REUTILIZAR

- secretos, tokens, credenciales y claves;
- configuraciones privadas;
- endpoints o servicios externos innecesarios para Biblia PWA;
- datos personales o identificadores de terceros;
- código decompilado/copias directas de la implementación Flutter;
- cualquier recurso cuya procedencia sea dudosa o incompatible con un repositorio público.

## Comparación con Biblia PWA

Ya existe en Biblia PWA:

- navegación por libros/capítulos;
- lector vertical continuo;
- títulos de sección soportados por el modelo;
- lector enfocado capítulo por capítulo;
- lector versículo por versículo;
- búsqueda por libro/palabra/frase;
- favoritos, notas y resaltados locales;
- selección múltiple;
- compartir texto e imagen;
- temas predefinidos y preferencias tipográficas;
- funcionamiento PWA/offline.

Pendientes útiles que encajan con decisiones ya aprobadas:

1. preferencia de disposición de versículos: `separados` o `corridos`;
2. ampliar personalización de lectura sin romper contraste;
3. completar fuente bíblica definitiva legal/autorizada;
4. revisar si hay patrones de navegación/ajustes adicionales de la APK que aporten valor sin copiar recursos;
5. más adelante, avanzar a funciones de prédicas según el roadmap principal.

## Próximo candidato funcional

El siguiente candidato recomendado y ya aprobado es **versículos separados / versículos corridos**.

Razón:

- ya está registrado en las decisiones del proyecto;
- no depende de una licencia externa;
- reutiliza el mismo corpus/modelo actual;
- complementa los modos de lectura ya implementados;
- es un cambio local y reversible de presentación, sin riesgo para datos personales.

Antes de incorporar cualquier otro elemento de la APK, actualizar este inventario con su clasificación.
