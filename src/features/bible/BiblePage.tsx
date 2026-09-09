import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import { getLastReading, type ReadingProgress } from '../../data/db'

export function BiblePage() {
  const [query, setQuery] = useState('')
  const [lastReading, setLastReading] = useState<ReadingProgress | undefined>()
  const books = bibleProvider.listBooks()

  useEffect(() => {
    void getLastReading().then(setLastReading)
  }, [])

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es')
    if (!normalized) return books
    return books.filter((book) => book.name.toLocaleLowerCase('es').includes(normalized))
  }, [books, query])

  const lastBook = lastReading ? bibleProvider.getBook(lastReading.bookId) : undefined

  return (
    <div className="page">
      <section className="page-intro">
        <p className="eyebrow">Biblia</p>
        <h1>Elegí dónde leer</h1>
        <p className="muted">Buscá un libro por nombre o retomá tu última lectura.</p>
      </section>

      {lastReading && lastBook ? (
        <Link className="continue-card" to={`/biblia/${lastReading.bookId}/${lastReading.chapter}`}>
          <div>
            <span className="card-kicker">Continuar leyendo</span>
            <strong>{lastBook.name} {lastReading.chapter}</strong>
          </div>
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}

      <section className="section-block">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Escribí un libro, por ejemplo Juan"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </label>

        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Libros disponibles</p>
            <h2>Contenido de prueba</h2>
          </div>
          <span className="demo-chip">3 libros</span>
        </div>

        <div className="book-list">
          {filteredBooks.map((book) => (
            <Link className="book-row" key={book.id} to={`/biblia/${book.id}`}>
              <div>
                <span className="card-kicker">{book.testament === 'OT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}</span>
                <strong>{book.name}</strong>
                <small>{book.chapters.length} {book.chapters.length === 1 ? 'capítulo de prueba' : 'capítulos de prueba'}</small>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <strong>No encontré ese libro en la muestra.</strong>
            <span>La versión de prueba solo contiene Génesis, Juan y Romanos.</span>
          </div>
        ) : null}
      </section>

      <aside className="content-notice">
        <strong>Contenido temporal</strong>
        <p>{bibleProvider.translation.notice}</p>
      </aside>
    </div>
  )
}
