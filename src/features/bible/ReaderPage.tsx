import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import {
  getBibleNote,
  getLastReading,
  isFavorite,
  removeBibleNote,
  saveBibleNote,
  saveLastReading,
  toggleFavorite,
} from '../../data/db'
import './reader-actions.css'

type SelectedVerse = {
  chapter: number
  verse: number
  text: string
  anchorId: string
}

export function ReaderPage() {
  const { bookId = '', chapter: chapterParam = '1' } = useParams()
  const routerLocation = useLocation()
  const book = bibleProvider.getBook(bookId)
  const requestedChapter = Number(chapterParam)
  const saveTimer = useRef<number | undefined>(undefined)
  const [selectedVerse, setSelectedVerse] = useState<SelectedVerse | undefined>()
  const [favoriteActive, setFavoriteActive] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  const chapters = useMemo(() => {
    if (!book) return []
    const startIndex = book.chapters.findIndex((item) => item.number === requestedChapter)
    if (startIndex < 0) return []
    return book.chapters.slice(startIndex)
  }, [book, requestedChapter])

  useEffect(() => {
    if (!book || chapters.length === 0) return

    const activeBook = book
    let cancelled = false
    const firstChapter = chapters[0]
    const firstVerse = firstChapter.sections.flatMap((section) => section.verses)[0]
    const firstAnchorId = firstVerse
      ? `verse-${activeBook.id}-${firstChapter.number}-${firstVerse.number}`
      : undefined
    const hashAnchorId = routerLocation.hash
      ? decodeURIComponent(routerLocation.hash.slice(1))
      : ''

    void getLastReading().then((lastReading) => {
      if (cancelled) return

      if (hashAnchorId) {
        window.requestAnimationFrame(() => {
          const target = document.getElementById(hashAnchorId)
          if (!target) return

          target.scrollIntoView({ block: 'center' })
          const targetChapter = Number(target.dataset.chapter)
          if (Number.isFinite(targetChapter)) {
            void saveLastReading({
              bookId: activeBook.id,
              chapter: targetChapter,
              anchorId: hashAnchorId,
            })
          }
        })
        return
      }

      if (
        lastReading?.bookId === activeBook.id &&
        lastReading.chapter === requestedChapter &&
        lastReading.anchorId
      ) {
        window.requestAnimationFrame(() => {
          document.getElementById(lastReading.anchorId ?? '')?.scrollIntoView({
            block: 'center',
          })
        })
        return
      }

      void saveLastReading({
        bookId: activeBook.id,
        chapter: firstChapter.number,
        anchorId: firstAnchorId,
      })
    })

    function saveNearestReadingAnchor() {
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>('[data-reading-anchor="true"]'),
      )

      if (anchors.length === 0) return

      const targetY = 150
      let nearest = anchors[0]
      let nearestDistance = Number.POSITIVE_INFINITY

      for (const anchor of anchors) {
        const distance = Math.abs(anchor.getBoundingClientRect().top - targetY)
        if (distance < nearestDistance) {
          nearest = anchor
          nearestDistance = distance
        }
      }

      const visibleChapter = Number(nearest.dataset.chapter)
      if (!Number.isFinite(visibleChapter)) return

      void saveLastReading({
        bookId: activeBook.id,
        chapter: visibleChapter,
        anchorId: nearest.id,
      })
    }

    function onScroll() {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current)
      }
      saveTimer.current = window.setTimeout(saveNearestReadingAnchor, 220)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current)
      }
      saveNearestReadingAnchor()
    }
  }, [book, chapters, requestedChapter, routerLocation.hash])

  useEffect(() => {
    if (!book || !selectedVerse) {
      setFavoriteActive(false)
      setNoteDraft('')
      setNoteSaved(false)
      setNoteOpen(false)
      setActionMessage('')
      return
    }

    let cancelled = false
    const location = {
      bookId: book.id,
      chapter: selectedVerse.chapter,
      verse: selectedVerse.verse,
    }

    void Promise.all([isFavorite(location), getBibleNote(location)]).then(([favorite, note]) => {
      if (cancelled) return
      setFavoriteActive(favorite)
      setNoteDraft(note?.text ?? '')
      setNoteSaved(Boolean(note))
      setNoteOpen(Boolean(note))
      setActionMessage('')
    })

    return () => {
      cancelled = true
    }
  }, [book, selectedVerse])

  if (!book || chapters.length === 0) {
    return (
      <div className="page empty-state full">
        <strong>Lectura no encontrada.</strong>
        <Link className="button primary" to="/biblia">Volver a Biblia</Link>
      </div>
    )
  }

  async function handleFavorite() {
    if (!selectedVerse) return

    const active = await toggleFavorite({
      bookId: book.id,
      chapter: selectedVerse.chapter,
      verse: selectedVerse.verse,
    })
    setFavoriteActive(active)
    setActionMessage(active ? 'Añadido a favoritos' : 'Quitado de favoritos')
  }

  async function handleSaveNote() {
    if (!selectedVerse || !noteDraft.trim()) return

    const saved = await saveBibleNote(
      {
        bookId: book.id,
        chapter: selectedVerse.chapter,
        verse: selectedVerse.verse,
      },
      noteDraft,
    )

    setNoteDraft(saved?.text ?? '')
    setNoteSaved(Boolean(saved))
    setActionMessage('Nota guardada')
  }

  async function handleDeleteNote() {
    if (!selectedVerse) return

    await removeBibleNote(`${book.id}:${selectedVerse.chapter}:${selectedVerse.verse}`)
    setNoteDraft('')
    setNoteSaved(false)
    setNoteOpen(false)
    setActionMessage('Nota eliminada')
  }

  return (
    <div className="reader-page">
      <div className="reader-toolbar">
        <Link to={`/biblia/${book.id}`}>← {book.name}</Link>
        <span>{bibleProvider.translation.label}</span>
      </div>

      <aside className="reader-demo-notice">
        <strong>Contenido ficticio de prueba</strong>
        <span>No es RVR60. Estamos validando estructura, navegación y modo offline.</span>
      </aside>

      <article className="reading-sheet">
        {chapters.map((chapter) => (
          <section className="chapter-section" key={chapter.number} data-chapter-section={chapter.number}>
            <header className="chapter-heading">
              <p>{book.name}</p>
              <h1>Capítulo {chapter.number}</h1>
            </header>

            {chapter.sections.map((section) => (
              <section className="bible-section" key={section.id}>
                {section.heading ? <h2>{section.heading}</h2> : null}
                <div className="verse-flow">
                  {section.verses.map((verse) => {
                    const anchorId = `verse-${book.id}-${chapter.number}-${verse.number}`
                    const isSelected = selectedVerse?.anchorId === anchorId
                    const reference = `${book.name} ${chapter.number}:${verse.number}`

                    return (
                      <div className={`verse-item${isSelected ? ' selected' : ''}`} key={verse.number}>
                        <button
                          id={anchorId}
                          className="verse verse-button"
                          type="button"
                          data-reading-anchor="true"
                          data-chapter={chapter.number}
                          aria-expanded={isSelected}
                          aria-label={`${reference}. Tocar para opciones`}
                          onClick={() => {
                            setSelectedVerse((current) =>
                              current?.anchorId === anchorId
                                ? undefined
                                : {
                                    chapter: chapter.number,
                                    verse: verse.number,
                                    text: verse.text,
                                    anchorId,
                                  },
                            )
                          }}
                        >
                          <sup>{verse.number}</sup>
                          {verse.text}
                        </button>

                        {isSelected ? (
                          <div className="verse-action-panel glass-panel" aria-label={`Opciones para ${reference}`}>
                            <div className="verse-action-header">
                              <strong>{reference}</strong>
                              <button type="button" onClick={() => setSelectedVerse(undefined)} aria-label="Cerrar opciones">×</button>
                            </div>

                            <div className="verse-action-buttons">
                              <button
                                className={`verse-action-button${favoriteActive ? ' active' : ''}`}
                                type="button"
                                aria-pressed={favoriteActive}
                                onClick={() => void handleFavorite()}
                              >
                                <span aria-hidden="true">{favoriteActive ? '★' : '☆'}</span>
                                {favoriteActive ? 'En favoritos' : 'Favorito'}
                              </button>
                              <button
                                className={`verse-action-button${noteOpen || noteSaved ? ' active' : ''}`}
                                type="button"
                                aria-expanded={noteOpen}
                                onClick={() => setNoteOpen((current) => !current)}
                              >
                                <span aria-hidden="true">✎</span>
                                {noteSaved ? 'Nota guardada' : 'Nota'}
                              </button>
                            </div>

                            {noteOpen ? (
                              <div className="verse-note-editor">
                                <label htmlFor={`note-${anchorId}`}>Tu nota</label>
                                <textarea
                                  id={`note-${anchorId}`}
                                  rows={3}
                                  maxLength={3000}
                                  value={noteDraft}
                                  placeholder="Escribí aquí lo que querés recordar…"
                                  onChange={(event) => setNoteDraft(event.target.value)}
                                />
                                <div className="verse-note-actions">
                                  <button
                                    className="button primary"
                                    type="button"
                                    disabled={!noteDraft.trim()}
                                    onClick={() => void handleSaveNote()}
                                  >
                                    Guardar nota
                                  </button>
                                  {noteSaved ? (
                                    <button className="button secondary" type="button" onClick={() => void handleDeleteNote()}>
                                      Eliminar
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}

                            {actionMessage ? <p className="verse-action-message" role="status">{actionMessage}</p> : null}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}
