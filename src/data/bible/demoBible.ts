import type { BibleTranslation } from './types'

export const demoBible: BibleTranslation = {
  id: 'demo-es',
  label: 'Contenido de prueba',
  notice:
    'Texto ficticio para validar la aplicación. No corresponde a RVR60 ni a otra traducción bíblica.',
  books: [
    {
      id: 'GEN',
      name: 'Génesis',
      testament: 'OT',
      chapters: [
        {
          number: 1,
          sections: [
            {
              id: 'gen-1-a',
              heading: 'Inicio de la demostración',
              verses: [
                { number: 1, text: 'Texto de demostración para comprobar la lectura y la numeración de versículos.' },
                { number: 2, text: 'Este contenido es ficticio y puede sustituirse por una fuente bíblica autorizada.' },
                { number: 3, text: 'La estructura conserva libro, capítulo, sección y versículo de forma independiente.' },
              ],
            },
            {
              id: 'gen-1-b',
              heading: 'Segunda sección de prueba',
              verses: [
                { number: 4, text: 'Los encabezados se muestran separados del texto para validar la experiencia de una Biblia normal.' },
                { number: 5, text: 'La aplicación guardará la posición de lectura localmente en este dispositivo.' },
              ],
            },
          ],
        },
        {
          number: 2,
          sections: [
            {
              id: 'gen-2-a',
              heading: 'Continuidad entre capítulos',
              verses: [
                { number: 1, text: 'Este capítulo permite probar el desplazamiento continuo desde el capítulo anterior.' },
                { number: 2, text: 'La fuente definitiva podrá reemplazarse sin mezclar el corpus con los datos personales.' },
                { number: 3, text: 'La posición exacta se identifica mediante un ancla estable dentro del contenido.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'JHN',
      name: 'Juan',
      testament: 'NT',
      chapters: [
        {
          number: 1,
          sections: [
            {
              id: 'jhn-1-a',
              heading: 'Ejemplo del Nuevo Testamento',
              verses: [
                { number: 1, text: 'Este texto ficticio sirve únicamente para probar navegación, estilos y búsqueda de libros.' },
                { number: 2, text: 'La versión pública no usará contenido protegido sin autorización verificable.' },
                { number: 3, text: 'Las referencias internas permanecerán estables aunque cambie la traducción mostrada.' },
              ],
            },
          ],
        },
        {
          number: 2,
          sections: [
            {
              id: 'jhn-2-a',
              heading: 'Otro capítulo de prueba',
              verses: [
                { number: 1, text: 'La cuadrícula de capítulos permite llegar rápidamente a cualquier capítulo disponible.' },
                { number: 2, text: 'Más adelante el lector podrá incorporar las personalizaciones aprobadas sin alterar estos identificadores.' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'ROM',
      name: 'Romanos',
      testament: 'NT',
      chapters: [
        {
          number: 1,
          sections: [
            {
              id: 'rom-1-a',
              heading: 'Tercera muestra',
              verses: [
                { number: 1, text: 'Esta tercera muestra ayuda a validar la búsqueda rápida por nombre de libro.' },
                { number: 2, text: 'Los datos son deliberadamente simples porque todavía estamos construyendo la base de Fase 1.' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
