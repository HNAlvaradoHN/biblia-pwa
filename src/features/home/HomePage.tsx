import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getDemoDailyVerse } from '../../data/bible/provider'
import { getLastReading, type ReadingProgress } from '../../data/db'

export function HomePage() {
  const daily = getDemoDailyVerse()
  const [lastReading, setLastReading] = useState<ReadingProgress | undefined>()
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    void getLastReading().then(setLastReading)
  }, [])

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
      <section className="hero-card">
        <div>
          <p className="eyebrow">Tu espacio de lectura</p>
          <h1>Una Biblia rápida, clara y lista para trabajar offline.</h1>
          <p className="muted">
            Esta primera versión usa contenido ficticio para probar la aplicación sin incorporar una traducción con derechos no verificados.
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Retomar</p>
            <h2>Continuar leyendo</h2>
          </div>
        </div>

        {lastReading ? (
          <Link className="continue-card" to={`/biblia/${lastReading.bookId}/${lastReading.chapter}`}>
            <div>
              <span className="card-kicker">Última posición guardada</span>
              <strong>{lastReading.bookId} · capítulo {lastReading.chapter}</strong>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link className="continue-card" to="/biblia">
            <div>
              <span className="card-kicker">Primera lectura</span>
              <strong>Elegí un libro para comenzar</strong>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </section>

      <section className="section-block daily-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Lectura del día</p>
            <h2>{dailyReference}</h2>
          </div>
          <span className="demo-chip">Demostración</span>
        </div>
        <blockquote>“{daily.verse.text}”</blockquote>
        <div className="action-row">
          <button className="button secondary" type="button" onClick={() => void shareDailyVerse()}>
            Compartir
          </button>
          <Link className="button primary" to={`/biblia/${daily.book.id}/${daily.chapter.number}`}>
            Leer pasaje completo
          </Link>
        </div>
        {shareMessage ? <p className="inline-message" role="status">{shareMessage}</p> : null}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Accesos</p>
            <h2>¿Qué querés hacer?</h2>
          </div>
        </div>
        <div className="quick-grid">
          <Link className="quick-card" to="/biblia">
            <span className="quick-icon" aria-hidden="true">▤</span>
            <strong>Biblia</strong>
            <small>Libros, capítulos y lectura.</small>
          </Link>
          <Link className="quick-card" to="/predicas">
            <span className="quick-icon" aria-hidden="true">✎</span>
            <strong>Prédicas</strong>
            <small>Se habilitará en su fase.</small>
          </Link>
          <Link className="quick-card" to="/buscar">
            <span className="quick-icon" aria-hidden="true">⌕</span>
            <strong>Buscar</strong>
            <small>Búsqueda bíblica en la siguiente etapa.</small>
          </Link>
        </div>
      </section>
    </div>
  )
}
