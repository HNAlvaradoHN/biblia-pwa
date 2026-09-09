# Biblia PWA

Aplicación bíblica PWA enfocada en lectura, preparación de prédicas y uso ministerial desde teléfono, tablet y computadora.

> **OBLIGATORIO PARA IA/AGENTES:** antes de presentarse, proponer implementación o modificar código, leer `AGENTS.md` y seguir su protocolo completo. `AGENTS.md` indica los demás documentos obligatorios y la identidad secuencial `Ing. 📚 #N`.

## Estado actual

Fase 1 en implementación. La base ejecutable incluye:

- React + TypeScript + Vite;
- navegación de Inicio y Biblia;
- búsqueda rápida de libros;
- selector de capítulos;
- lector vertical continuo;
- títulos/encabezados de sección en el modelo bíblico;
- persistencia local de última lectura y ancla de versículo mediante IndexedDB/Dexie;
- PWA instalable con aviso explícito de actualización;
- versión visible de la aplicación;
- CI con TypeScript, ESLint, build y auditoría de dependencias.

Ver `PROJECT_STATE.md` para el estado real y el siguiente objetivo.

## Contenido bíblico durante desarrollo

La muestra incluida es **contenido ficticio de prueba**. No corresponde a RVR60 ni a otra traducción bíblica.

RVR60 es la traducción deseada, pero no se incorporará ni distribuirá un corpus o títulos editoriales sin verificar primero una fuente y permisos adecuados para una futura distribución pública.

La capa `src/data/bible/` mantiene el contenido detrás de un proveedor reemplazable para poder sustituir la muestra sin romper referencias ni datos personales.

## Desarrollo local

Requisito: Node.js 22.12 o superior.

```bash
npm ci
npm run dev
```

Verificaciones obligatorias:

```bash
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
```

No considerar una versión lista para probar hasta cumplir además `RELEASE_RULES.md`.
