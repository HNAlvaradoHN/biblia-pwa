import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  getFavorites,
  getNotes,
  removeBibleNote,
  removeFavorite,
  type BibleNoteRecord,
  type FavoriteRecord,
} from '../../data/db'
import { resolveBibleLocation } from './resolveSaved'
import './saved.css'

type ResolvedFavorite = {
  record: FavoriteRecord
  reference: string
  text: string
  href: string
}

type ResolvedNote = {
  record: BibleNoteRecord
  reference: string
  verseText: string
  href: string
}

function resolveFavorites(records: FavoriteRecord[]): ResolvedFavorite[] {
  return records.flatMap((record) => {
    const resolved = resolveBibleLocation(record)
    if (!resolved) return []

    return [{
      record,
      reference: resolved.reference,
      text: resolved.verse.text,
      href: resolved.href,
    }]
  })
}

function resolveNotes(records: BibleNoteRecord[]): ResolvedNote[] {
  return records.flatMap((record) => {
    const resolved = resolveBibleLocation(record)
    if (!resolved) return []

    return [{
      record,
      reference: resolved.reference,
      verseText: resolved.verse.text,
      href: resolved.href,
    }]
  })
}

function SavedHeader({ eyebrow, title, count }: { eyebrow: string; title: string; count: number }) {
  return (
    <header className="saved-page-header">
      <Link className="saved-back-link" to="/">← Inicio</Link>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <span>{count === 1 ? '1 elemento guardado' : `${count} elementos guardados`}</span>
      </div>
    </header>
  )
}

export function FavoritesPage() {
  const [records, setRecords] = useState<FavoriteRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getFavorites().then((items) => {
      setRecords(items)
      setLoading(false)
    })
  }, [])

  const items = useMemo(() => resolveFavorites(records), [records])

  async function handleRemove(id: string) {
    await removeFavorite(id)
    setRecords((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="page saved-page">
      <SavedHeader eyebrow="Biblioteca personal" title="Mis favoritos" count={items.length} />

      {loading ? (
        <div className="saved-empty glass-panel">Cargando favoritos…</div>
      ) : items.length === 0 ? (
        <div className="saved-empty glass-panel">
          <span className="saved-empty-icon" aria-hidden="true">☆</span>
          <strong>Todavía no tenés favoritos</strong>
          <p>Tocá un versículo en el lector y elegí <b>Favorito</b>. Aparecerá aquí automáticamente.</p>
          <Link className="button primary" to="/biblia">Ir a la Biblia</Link>
        </div>
      ) : (
        <div className="saved-list">
          {items.map((item) => (
            <article className="saved-list-card glass-panel" key={item.record.id}>
              <Link className="saved-list-main" to={item.href}>
                <span className="saved-list-type">Favorito</span>
                <strong>{item.reference}</strong>
                <p>{item.text}</p>
              </Link>
              <button
                className="saved-remove-button"
                type="button"
                onClick={() => void handleRemove(item.record.id)}
                aria-label={`Quitar ${item.reference} de favoritos`}
              >
                Quitar
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export function NotesPage() {
  const [records, setRecords] = useState<BibleNoteRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void getNotes().then((items) => {
      setRecords(items)
      setLoading(false)
    })
  }, [])

  const items = useMemo(() => resolveNotes(records), [records])

  async function handleRemove(id: string) {
    await removeBibleNote(id)
    setRecords((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="page saved-page">
      <SavedHeader eyebrow="Biblioteca personal" title="Mis notas" count={items.length} />

      {loading ? (
        <div className="saved-empty glass-panel">Cargando notas…</div>
      ) : items.length === 0 ? (
        <div className="saved-empty glass-panel">
          <span className="saved-empty-icon" aria-hidden="true">✎</span>
          <strong>Todavía no tenés notas bíblicas</strong>
          <p>Tocá un versículo en el lector, elegí <b>Nota</b> y escribí lo que quieras recordar.</p>
          <Link className="button primary" to="/biblia">Ir a la Biblia</Link>
        </div>
      ) : (
        <div className="saved-list">
          {items.map((item) => (
            <article className="saved-list-card saved-note-card glass-panel" key={item.record.id}>
              <Link className="saved-list-main" to={item.href}>
                <span className="saved-list-type">Nota</span>
                <strong>{item.reference}</strong>
                <p className="saved-note-text">{item.record.text}</p>
                <span className="saved-verse-context">“{item.verseText}”</span>
              </Link>
              <button
                className="saved-remove-button"
                type="button"
                onClick={() => void handleRemove(item.record.id)}
                aria-label={`Eliminar nota de ${item.reference}`}
              >
                Eliminar
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
