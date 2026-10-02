import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import './search.css'

export function SearchPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return []
    return bibleProvider.searchVerses(trimmed)
  }, [query])

  const hasQuery = query.trim().length >= 2

  return (
    <div className="page search-page">
      <section className="page-intro">
        <p className="eyebrow">Buscar</p>
        <h1>Encontrá palabras o frases</h1>
        <p className="muted">
          La búsqueda recorre todo el contenido bíblico disponible en esta versión y abre el versículo exacto.
        </p>
      </section>

      <label className="search-box search-page-box">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Ejemplo: principio, amor, gracia..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          autoFocus
        />
      </label>

      <div className="search-summary" aria-live="polite">
        {hasQuery ? (
          <span>{results.length} resultado{results.length === 1 ? '' : 's'}</span>
        ) : (
          <span>Escribí al menos 2 caracteres.</span>
        )}
        <span>{bibleProvider.translation.label}</span>
      </div>

      {hasQuery && results.length > 0 ? (
        <section className="search-results" aria-label="Resultados de búsqueda">
          {results.map((result) => {
            const anchorId = `verse-${result.bookId}-${result.chapter}-${result.verse}`
            return (
              <Link
                className="search-result-card"
                key={`${result.bookId}:${result.chapter}:${result.verse}`}
                to={`/biblia/${result.bookId}/${result.chapter}#${anchorId}`}
              >
                <div>
                  <strong>{result.bookName} {result.chapter}:{result.verse}</strong>
                  <span>{result.text}</span>
                </div>
                <span className="search-result-arrow" aria-hidden="true">→</span>
              </Link>
            )
          })}
        </section>
      ) : null}

      {hasQuery && results.length === 0 ? (
        <div className="empty-state">
          <strong>No encontré coincidencias.</strong>
          <span>Probá con otra palabra o una frase más corta.</span>
        </div>
      ) : null}

      <aside className="content-notice">
        <strong>Contenido temporal</strong>
        <p>{bibleProvider.translation.notice}</p>
      </aside>
    </div>
  )
}
