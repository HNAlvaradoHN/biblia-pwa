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
      <h1 className="sr-only">Inicio</h1>

      <section className="section-block home-continue">
        <p className="eyebrow">Continuar leyendo</p>

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

      <section className="section-block daily-card home-daily-card">
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
    </div>
  )
}
