import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import './search.css'

function normalize(value: string) {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function highlightMatch(text: string, query: string) {
  const trimmed = query.trim()
  if (!trimmed) return text

  const normalizedText = normalize(text)
  const normalizedQuery = normalize(trimmed)
  const parts: Array<{ text: string; match: boolean }> = []
  let cursor = 0

  while (cursor < text.length) {
    const matchIndex = normalizedText.indexOf(normalizedQuery, cursor)
    if (matchIndex < 0) {
      parts.push({ text: text.slice(cursor), match: false })
      break
    }

    if (matchIndex > cursor) {
      parts.push({ text: text.slice(cursor, matchIndex), match: false })
    }

    const matchEnd = matchIndex + normalizedQuery.length
    parts.push({ text: text.slice(matchIndex, matchEnd), match: true })
    cursor = matchEnd
  }

  return parts.map((part, index) =>
    part.match ? (
      <mark key={`${part.text}-${index}`}>{part.text}</mark>
    ) : (
      <Fragment key={`${part.text}-${index}`}>{part.text}</Fragment>
    ),
  )
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const trimmedQuery = query.trim()
  const hasQuery = trimmedQuery.length >= 2

  const bookResults = useMemo(() => {
    if (!hasQuery) return []
    const normalizedQuery = normalize(trimmedQuery)
    return bibleProvider
      .listBooks()
      .filter((book) => normalize(book.name).includes(normalizedQuery))
  }, [hasQuery, trimmedQuery])

  const verseResults = useMemo(() => {
    if (!hasQuery) return []
    return bibleProvider.searchVerses(trimmedQuery)
  }, [hasQuery, trimmedQuery])

  const totalResults = bookResults.length + verseResults.length

  return (
    <div className="page search-page">
      <section className="page-intro">
        <p className="eyebrow">Buscar</p>
        <h1>Encontrá libros, palabras o frases</h1>
        <p className="muted">
          Podés escribir el nombre de un libro o buscar palabras dentro de todo el contenido bíblico disponible.
        </p>
      </section>

      <label className="search-box search-page-box">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Ejemplo: Juan, libro, gracia..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          autoFocus
        />
      </label>

      <div className="search-summary" aria-live="polite">
        {hasQuery ? (
          <span>{totalResults} resultado{totalResults === 1 ? '' : 's'}</span>
        ) : (
          <span>Escribí al menos 2 caracteres.</span>
        )}
        <span>{bibleProvider.translation.label}</span>
      </div>

      {hasQuery && bookResults.length > 0 ? (
        <section className="search-group" aria-labelledby="book-results-title">
          <div className="search-group-heading">
            <strong id="book-results-title">Libros</strong>
            <span>{bookResults.length}</span>
          </div>
          <div className="search-results">
            {bookResults.map((book) => (
              <Link className="search-result-card book-result" key={book.id} to={`/biblia/${book.id}`}>
                <div>
                  <strong>{highlightMatch(book.name, trimmedQuery)}</strong>
                  <span>{book.testament === 'OT' ? 'Antiguo Testamento' : 'Nuevo Testamento'} · {book.chapters.length} capítulo{book.chapters.length === 1 ? '' : 's'}</span>
                </div>
                <span className="search-result-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {hasQuery && verseResults.length > 0 ? (
        <section className="search-group" aria-labelledby="verse-results-title">
          <div className="search-group-heading">
            <strong id="verse-results-title">Versículos</strong>
            <span>{verseResults.length}</span>
          </div>
          <div className="search-results">
            {verseResults.map((result) => {
              const anchorId = `verse-${result.bookId}-${result.chapter}-${result.verse}`
              return (
                <Link
                  className="search-result-card"
                  key={`${result.bookId}:${result.chapter}:${result.verse}`}
                  to={`/biblia/${result.bookId}/${result.chapter}#${anchorId}`}
                >
                  <div>
                    <strong>{result.bookName} {result.chapter}:{result.verse}</strong>
                    <span>{highlightMatch(result.text, trimmedQuery)}</span>
                  </div>
                  <span className="search-result-arrow" aria-hidden="true">→</span>
                </Link>
              )
            })}
          </div>
        </section>
      ) : null}

      {hasQuery && totalResults === 0 ? (
        <div className="empty-state">
          <strong>No encontré coincidencias.</strong>
          <span>Probá con el nombre de un libro, otra palabra o una frase más corta.</span>
        </div>
      ) : null}

      <aside className="content-notice">
        <strong>Contenido temporal</strong>
        <p>{bibleProvider.translation.notice}</p>
      </aside>
    </div>
  )
}
