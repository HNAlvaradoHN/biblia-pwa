import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { bibleProvider, getDemoDailyVerse } from '../../data/bible/provider'
import {
  getLastReading,
  getRecentFavorites,
  getRecentNotes,
  type BibleNoteRecord,
  type FavoriteRecord,
  type ReadingProgress,
} from '../../data/db'
import { resolveBibleLocation } from '../saved/resolveSaved'
import './home.css'

function formatToday() {
  const label = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function HomePage() {
  const daily = getDemoDailyVerse()
  const [lastReading, setLastReading] = useState<ReadingProgress | undefined>()
  const [recentFavorite, setRecentFavorite] = useState<FavoriteRecord | undefined>()
  const [recentNote, setRecentNote] = useState<BibleNoteRecord | undefined>()
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    void Promise.all([
      getLastReading(),
      getRecentFavorites(1),
      getRecentNotes(1),
    ]).then(([reading, favorites, notes]) => {
      setLastReading(reading)
      setRecentFavorite(favorites[0])
      setRecentNote(notes[0])
    })
  }, [])

  const favoriteLocation = recentFavorite ? resolveBibleLocation(recentFavorite) : undefined
  const noteLocation = recentNote ? resolveBibleLocation(recentNote) : undefined
  const dailyReference = `${daily.book.name} ${daily.chapter.number}:${daily.verse.number}`
  const dailyText = `${daily.verse.text} — ${dailyReference}`

  async function shareDailyVerse() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: dailyReference,
          text: dailyText,
        })
        return
      }

      await navigator.clipboard.writeText(dailyText)
      setShareMessage('Copiado al portapapeles')
      window.setTimeout(() => setShareMessage(''), 2000)
    } catch {
      setShareMessage('No se pudo compartir en este dispositivo')
      window.setTimeout(() => setShareMessage(''), 2500)
    }
  }

  return (
    <div className="page home-page">
      <h1 className="sr-only">Inicio</h1>

      <section className="home-welcome glass-panel" aria-label="Hoy">
        <div>
          <span className="home-today">Hoy</span>
          <strong>{formatToday()}</strong>
          <small>Tu espacio de lectura</small>
        </div>
        <span className="home-orbit" aria-hidden="true">
          <span>✦</span>
        </span>
      </section>

      <section className="section-block home-continue">
        {lastReading ? (
          <Link className="continue-card home-glass-card" to={`/biblia/${lastReading.bookId}/${lastReading.chapter}`}>
            <span className="continue-symbol" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v16a3 3 0 0 0-3-3H4V5.5Z" />
                <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v18a3 3 0 0 1 3-3h4V5.5Z" />
              </svg>
            </span>
            <div className="continue-copy">
              <span className="card-kicker">Continuar leyendo</span>
              <strong>{lastReading.bookId} · capítulo {lastReading.chapter}</strong>
              <small>Volver a tu última posición</small>
            </div>
            <span className="continue-arrow" aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link className="continue-card home-glass-card" to="/biblia">
            <span className="continue-symbol" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v16a3 3 0 0 0-3-3H4V5.5Z" />
                <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v18a3 3 0 0 1 3-3h4V5.5Z" />
              </svg>
            </span>
            <div className="continue-copy">
              <span className="card-kicker">Continuar leyendo</span>
              <strong>Elegí un libro para comenzar</strong>
              <small>Tu última lectura aparecerá aquí</small>
            </div>
            <span className="continue-arrow" aria-hidden="true">→</span>
          </Link>
        )}
      </section>

      <section className="section-block daily-card home-daily-card glass-panel">
        <span className="daily-quote-mark" aria-hidden="true">“</span>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Lectura del día</p>
            <h2>{dailyReference}</h2>
          </div>
          <span className="demo-chip">Demostración</span>
        </div>
        <blockquote>“{daily.verse.text}”</blockquote>
        <div className="action-row">
          <button className="button secondary glass-button" type="button" onClick={() => void shareDailyVerse()}>
            Compartir
          </button>
          <Link className="button primary" to={`/biblia/${daily.book.id}/${daily.chapter.number}`}>
            Leer pasaje completo
          </Link>
        </div>
        {shareMessage ? <p className="inline-message" role="status">{shareMessage}</p> : null}
      </section>

      <section className="home-saved-section" aria-labelledby="saved-title">
        <div className="home-saved-heading">
          <div>
            <p className="eyebrow" id="saved-title">Guardados recientes</p>
            <span>Tus listas, siempre a mano</span>
          </div>
        </div>

        <div className="home-saved-grid">
          <Link className="saved-preview-card glass-panel" to="/favoritos">
            <span className="saved-preview-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m12 3 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 18l.9-5.4-3.9-3.8 5.4-.8L12 3Z" />
              </svg>
            </span>
            <span className="saved-preview-copy">
              <small>Favoritos</small>
              <strong>{favoriteLocation?.reference ?? 'Sin favoritos todavía'}</strong>
              <span>{favoriteLocation?.verse.text ?? 'Tocá un versículo para guardarlo.'}</span>
            </span>
          </Link>

          <Link className="saved-preview-card glass-panel" to="/notas">
            <span className="saved-preview-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                <path d="M8 8h8M8 12h5" />
              </svg>
            </span>
            <span className="saved-preview-copy">
              <small>Notas</small>
              <strong>{noteLocation?.reference ?? 'Sin notas todavía'}</strong>
              <span>{recentNote?.text ?? 'Añadí una nota desde cualquier versículo.'}</span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
