# UI_RULES.md — REGLAS DE DISEÑO, INTERFAZ Y CAMBIOS VISUALES

Este archivo define cómo deben construirse y modificarse temas, botones, pantallas, menús, submenús, transiciones, efectos, posiciones y demás elementos visuales de Biblia PWA.

Su objetivo es permitir cambios frecuentes de diseño sin convertir el código en una mezcla difícil de mantener.

## 1. Principio obligatorio: separar responsabilidades

Todo elemento visual debe tener una ubicación y responsabilidad clara.

No mezclar en un mismo archivo, salvo que sea realmente necesario:

- lógica de negocio;
- almacenamiento de datos;
- navegación;
- estilos globales;
- configuración de tema;
- animaciones/transiciones;
- componentes visuales reutilizables;
- contenido específico de una pantalla.

Un cambio de apariencia no debe alterar accidentalmente datos, sincronización, referencias bíblicas u otra lógica no relacionada.

## 2. Temas y apariencia

Colores, tipografías, tamaños, espacios, bordes, sombras y valores visuales repetidos deben centralizarse mediante variables/tokens de diseño cuando corresponda.

Objetivo: cambiar un tema sin buscar manualmente valores repartidos por toda la aplicación.

No duplicar estilos de tema en múltiples componentes si pueden compartir una fuente común.

Tema claro y oscuro deben reutilizar la misma estructura de componentes; no mantener dos interfaces duplicadas.

## 3. Botones y controles

Los botones reutilizables deben construirse como componentes claros con variantes explícitas cuando tenga sentido.

Ejemplos de variantes posibles:

- principal;
- secundaria;
- peligrosa;
- icono;
- modo predicación.

Cambiar la posición de un botón debe hacerse desde el layout/componente responsable de esa pantalla, no mediante parches repartidos en otros archivos.

No crear copias casi idénticas de un botón solo para cambiar color, posición o tamaño.

## 4. Pantallas, menús y submenús

Cada pantalla debe tener una responsabilidad clara.

La navegación y estructura de menús deben mantenerse separadas del contenido interno de cada pantalla siempre que sea razonable.

Mover una opción entre menú, submenú o barra inferior no debe obligar a duplicar su lógica funcional.

Las acciones deben poder reutilizarse aunque cambie dónde se muestra el botón que las activa.

## 5. Transiciones, animaciones y efectos

Las animaciones deben estar separadas de la lógica funcional.

No hacer que una función dependa de que una animación termine salvo que sea estrictamente necesario.

Toda animación importante debe poder modificarse o eliminarse sin romper navegación ni datos.

Priorizar fluidez y claridad sobre efectos decorativos pesados.

## 6. Reemplazo limpio: lo viejo se elimina

Cuando un diseño, componente o comportamiento visual sea reemplazado definitivamente:

1. implementar el reemplazo;
2. comprobar que funciona;
3. retirar el código anterior que ya no se usa;
4. eliminar imports, estilos, rutas, variables, componentes y dependencias que quedaron huérfanos;
5. comprobar compilación, linter y pruebas disponibles;
6. comprobar visualmente las pantallas afectadas;
7. registrar el cambio relevante en `CHANGELOG.md`.

Está prohibido conservar código anterior ocultándolo con comentarios, `display:none`, banderas permanentes, nombres `old`, `legacy`, `backup`, `v1`, `final2` o mecanismos equivalentes solo por miedo a borrarlo. Git ya conserva el historial.

Una excepción temporal solo se admite durante una migración activa y debe desaparecer antes de considerar terminado el cambio.

## 7. Cambios deben ser acotados

Antes de modificar diseño hay que identificar:

- qué pantalla/componente cambia;
- qué comportamiento debe permanecer igual;
- qué archivos deberían verse afectados;
- qué elementos NO deben cambiar.

Después del cambio hay que revisar específicamente que no se hayan movido o alterado elementos fuera del alcance solicitado.

No aprovechar un cambio visual pequeño para refactorizar media aplicación sin necesidad.

## 8. Diseño configurable sin sobreingeniería

Como el usuario cambia con frecuencia temas, posiciones y organización visual, la arquitectura debe favorecer componentes y estilos fáciles de reorganizar.

Pero no crear sistemas genéricos gigantes por anticipación. Solo abstraer aquello que realmente se repite o cuya variación frecuente ya está confirmada.

## 9. Documentación de cambios visuales

`CHANGELOG.md` debe registrar cambios visuales relevantes ya realizados, por ejemplo:

- cambio de navegación principal;
- cambio de ubicación de controles importantes;
- nuevo sistema de temas;
- reemplazo de una pantalla;
- cambio importante de flujo;
- nueva transición que afecte UX.

No registrar ajustes microscópicos sin valor histórico como mover 2 px un icono.

Las decisiones visuales permanentes o arquitectónicas deben registrarse en `DECISIONS.md`.

`PROJECT_STATE.md` debe indicar qué pantalla/módulo visual está actualmente en trabajo si ese es el objetivo activo.

## 10. Verificación obligatoria después de cambios UI

Antes de considerar finalizado un cambio de interfaz:

- verificar que compila;
- ejecutar linter/pruebas disponibles;
- revisar móvil;
- revisar tablet cuando el cambio pueda afectarla;
- revisar escritorio cuando el cambio pueda afectarlo;
- verificar tema claro/oscuro si existen;
- verificar que botones y navegación siguen funcionando;
- verificar que no haya elementos duplicados o invisibles todavía montados sin necesidad;
- verificar que no queden estilos o componentes muertos;
- comprobar que el cambio no rompió el estado/posición del usuario cuando aplique.

## 11. Regla de profesionalismo

El resultado final debe quedar como si el diseño nuevo hubiera sido el diseño correcto desde el principio: limpio, coherente y sin restos visibles o técnicos de versiones descartadas.

## 12. Dirección visual obligatoria

La aplicación debe sentirse actual desde su primera versión ejecutable. No construir deliberadamente una interfaz vieja, genérica o descuidada con la idea de “arreglarla después”.

La dirección visual obligatoria es:

- moderna y contemporánea, evitando patrones visuales que hagan sentir la aplicación anticuada;
- clara y fácil de entender sin capacitación;
- atractiva y con identidad, pero sin sobrecarga de efectos, adornos o controles;
- responsiva de forma real en teléfono, tablet y computadora;
- cómoda para uso táctil, con objetivos de toque suficientes y controles importantes fáciles de alcanzar;
- legible durante lectura prolongada, con jerarquía visual clara y espacios que ayuden a concentrarse;
- coherente entre tamaños de pantalla, adaptando el layout en lugar de simplemente encoger una vista de escritorio;
- preparada para personalización futura mediante tokens/componentes, sin implementar por anticipado todos los temas o fondos todavía.

Una pantalla puede ser provisional por alcance funcional, pero no debe ser provisional por descuido visual. Incluso las primeras entregas deben respetar esta dirección básica.
