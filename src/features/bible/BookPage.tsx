import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import { getLastReading, type ReadingProgress } from '../../data/db'

export function BookPage() {
  const { bookId = '' } = useParams()
  const book = bibleProvider.getBook(bookId)
  const [lastReading, setLastReading] = useState<ReadingProgress | undefined>()

  useEffect(() => {
    void getLastReading().then(setLastReading)
  }, [])

  if (!book) {
    return (
      <div className="page empty-state full">
        <strong>Libro no encontrado.</strong>
        <Link className="button primary" to="/biblia">Volver a Biblia</Link>
      </div>
    )
  }

  const lastChapter = lastReading?.bookId === book.id ? lastReading.chapter : undefined

  return (
    <div className="page">
      <div className="breadcrumb-row">
        <Link to="/biblia">← Biblia</Link>
      </div>

      <section className="page-intro">
        <p className="eyebrow">{book.testament === 'OT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}</p>
        <h1>{book.name}</h1>
        <p className="muted">Elegí un capítulo. El último leído queda marcado automáticamente.</p>
      </section>

      <div className="chapter-grid" aria-label={`Capítulos de ${book.name}`}>
        {book.chapters.map((chapter) => {
          const isLastRead = chapter.number === lastChapter
          return (
            <Link
              key={chapter.number}
              to={`/biblia/${book.id}/${chapter.number}`}
              className={isLastRead ? 'chapter-tile last-read' : 'chapter-tile'}
              aria-label={`${book.name} capítulo ${chapter.number}${isLastRead ? ', último leído' : ''}`}
            >
              <strong>{chapter.number}</strong>
              {isLastRead ? <small>Último</small> : null}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
