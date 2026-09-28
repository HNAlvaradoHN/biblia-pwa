import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import {
  db,
  getBibleNote,
  getHighlight,
  getLastReading,
  isFavorite,
  makeBibleLocationId,
  removeBibleNote,
  removeHighlight,
  saveBibleNote,
  saveLastReading,
  setHighlight,
  toggleFavorite,
  type HighlightColor,
} from '../../data/db'
import './reader-actions.css'

type VerseTarget = {
  chapter: number
  verse: number
  anchorId: string
  text: string
  reference: string
}

const highlightChoices: Array<{ color: HighlightColor; label: string }> = [
  { color: 'yellow', label: 'Amarillo' },
  { color: 'green', label: 'Verde' },
  { color: 'blue', label: 'Azul' },
  { color: 'pink', label: 'Rosado' },
]

export function ReaderPage() {
  const { bookId = '', chapter: chapterParam = '1' } = useParams()
  const routerLocation = useLocation()
  const book = bibleProvider.getBook(bookId)
  const requestedChapter = Number(chapterParam)
  const saveTimer = useRef<number | undefined>(undefined)
  const longPressTimer = useRef<number | undefined>(undefined)
  const longPressTriggered = useRef(false)
  const [selectedVerse, setSelectedVerse] = useState<VerseTarget | undefined>()
  const [optionsVerse, setOptionsVerse] = useState<VerseTarget | undefined>()
  const [favoriteActive, setFavoriteActive] = useState(false)
  const [highlighted, setHighlighted] = useState(false)
  const [highlightColor, setHighlightColor] = useState<HighlightColor>('yellow')
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false)
  const [highlightedVerses, setHighlightedVerses] = useState<Set<number>>(() => new Set())
  const [highlightColors, setHighlightColors] = useState<Map<number, HighlightColor>>(
    () => new Map(),
  )
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
    if (!book || !Number.isFinite(requestedChapter)) {
      setHighlightedVerses(new Set())
      return
    }

    let cancelled = false

    void db.highlights
      .where('chapter')
      .equals(requestedChapter)
      .toArray()
      .then((records) => {
        if (cancelled) return
        const bookHighlights = records.filter((record) => record.bookId === book.id)
        setHighlightedVerses(new Set(bookHighlights.map((record) => record.verse)))
        setHighlightColors(
          new Map(
            bookHighlights.map((record) => [
              record.verse,
              record.color ?? 'yellow',
            ]),
          ),
        )
      })

    return () => {
      cancelled = true
    }
  }, [book, requestedChapter])

  useEffect(() => {
    if (!book || !optionsVerse) {
      setFavoriteActive(false)
      setHighlighted(false)
      setHighlightColor('yellow')
      setHighlightPickerOpen(false)
      setNoteDraft('')
      setNoteSaved(false)
      setNoteOpen(false)
      setActionMessage('')
      return
    }

    let cancelled = false
    const location = {
      bookId: book.id,
      chapter: optionsVerse.chapter,
      verse: optionsVerse.verse,
    }

    void Promise.all([
      isFavorite(location),
      getHighlight(location),
      getBibleNote(location),
    ]).then(([favorite, highlight, note]) => {
      if (cancelled) return
      setFavoriteActive(favorite)
      setHighlighted(Boolean(highlight))
      setHighlightColor(highlight?.color ?? 'yellow')
      setHighlightPickerOpen(false)
      setNoteDraft(note?.text ?? '')
      setNoteSaved(Boolean(note))
      setNoteOpen(Boolean(note))
      setActionMessage('')
    })

    return () => {
      cancelled = true
    }
  }, [book, optionsVerse])

  if (!book || chapters.length === 0) {
    return (
      <div className="page empty-state full">
        <strong>Lectura no encontrada.</strong>
        <Link className="button primary" to="/biblia">Volver a Biblia</Link>
      </div>
    )
  }

  function clearLongPressTimer() {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = undefined
    }
  }

  function startLongPress(target: VerseTarget) {
    clearLongPressTimer()
    longPressTriggered.current = false
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true
      setOptionsVerse(target)
    }, 500)
  }

  function handleVerseTap(target: VerseTarget) {
    clearLongPressTimer()
    if (longPressTriggered.current) {
      longPressTriggered.current = false
      return
    }

    setOptionsVerse(undefined)
    setSelectedVerse((current) =>
      current?.anchorId === target.anchorId ? undefined : target,
    )
  }

  async function handleFavorite() {
    if (!book || !optionsVerse) return

    const active = await toggleFavorite({
      bookId: book.id,
      chapter: optionsVerse.chapter,
      verse: optionsVerse.verse,
    })
    setFavoriteActive(active)
    setActionMessage(active ? 'Añadido a favoritos' : 'Quitado de favoritos')
  }

  async function handleHighlightColor(color: HighlightColor) {
    if (!book || !optionsVerse) return

    const location = {
      bookId: book.id,
      chapter: optionsVerse.chapter,
      verse: optionsVerse.verse,
    }

    await setHighlight(location, color)
    setHighlighted(true)
    setHighlightColor(color)
    setHighlightPickerOpen(false)

    if (optionsVerse.chapter === requestedChapter) {
      setHighlightedVerses((current) => new Set(current).add(optionsVerse.verse))
      setHighlightColors((current) => {
        const next = new Map(current)
        next.set(optionsVerse.verse, color)
        return next
      })
    }

    setActionMessage('Versículo resaltado')
  }

  async function handleRemoveHighlight() {
    if (!book || !optionsVerse) return

    const location = {
      bookId: book.id,
      chapter: optionsVerse.chapter,
      verse: optionsVerse.verse,
    }

    await removeHighlight(location)
    setHighlighted(false)
    setHighlightPickerOpen(false)

    if (optionsVerse.chapter === requestedChapter) {
      setHighlightedVerses((current) => {
        const next = new Set(current)
        next.delete(optionsVerse.verse)
        return next
      })
      setHighlightColors((current) => {
        const next = new Map(current)
        next.delete(optionsVerse.verse)
        return next
      })
    }

    setActionMessage('Resaltado quitado')
  }

  async function copyVerseText() {
    if (!optionsVerse) return

    const text = `${optionsVerse.text}\n${optionsVerse.reference}`

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.append(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }

    setActionMessage('Versículo copiado')
  }

  async function shareVerse() {
    if (!optionsVerse) return

    const text = `${optionsVerse.text}\n${optionsVerse.reference}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: optionsVerse.reference,
          text,
        })
        setActionMessage('Versículo compartido')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    await copyVerseText()
    setActionMessage('Compartir no está disponible; se copió el versículo')
  }

  async function handleSaveNote() {
    if (!book || !optionsVerse || !noteDraft.trim()) return

    const saved = await saveBibleNote(
      {
        bookId: book.id,
        chapter: optionsVerse.chapter,
        verse: optionsVerse.verse,
      },
      noteDraft,
    )

    setNoteDraft(saved?.text ?? '')
    setNoteSaved(Boolean(saved))
    setActionMessage('Nota guardada')
  }

  async function handleDeleteNote() {
    if (!book || !optionsVerse) return

    await removeBibleNote(makeBibleLocationId({
      bookId: book.id,
      chapter: optionsVerse.chapter,
      verse: optionsVerse.verse,
    }))
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
                    const reference = `${book.name} ${chapter.number}:${verse.number}`
                    const target: VerseTarget = {
                      chapter: chapter.number,
                      verse: verse.number,
                      anchorId,
                      text: verse.text,
                      reference,
                    }
                    const isSelected = selectedVerse?.anchorId === anchorId
                    const isOptionsOpen = optionsVerse?.anchorId === anchorId
                    const isPersistentlyHighlighted =
                      chapter.number === requestedChapter && highlightedVerses.has(verse.number)
                    const persistentHighlightColor =
                      highlightColors.get(verse.number) ?? 'yellow'
                    const highlightClass = isPersistentlyHighlighted
                      ? ` highlighted highlight-${persistentHighlightColor}`
                      : ''

                    return (
                      <div
                        className={`verse-item${isSelected ? ' selected' : ''}`}
                        key={verse.number}
                      >
                        <button
                          id={anchorId}
                          className={`verse verse-button${highlightClass}`}
                          type="button"
                          data-reading-anchor="true"
                          data-chapter={chapter.number}
                          aria-pressed={isSelected}
                          aria-expanded={isOptionsOpen}
                          aria-label={`${reference}. Tocar para activar; mantener presionado para opciones`}
                          onPointerDown={() => startLongPress(target)}
                          onPointerUp={clearLongPressTimer}
                          onPointerCancel={clearLongPressTimer}
                          onPointerLeave={clearLongPressTimer}
                          onContextMenu={(event) => event.preventDefault()}
                          onClick={() => handleVerseTap(target)}
                        >
                          <sup>{verse.number}</sup>
                          {verse.text}
                        </button>

                        {isOptionsOpen ? (
                          <div
                            className="verse-action-panel glass-panel"
                            aria-label={`Opciones para ${reference}`}
                          >
                            <div className="verse-action-header">
                              <strong>{reference}</strong>
                              <button
                                type="button"
                                onClick={() => setOptionsVerse(undefined)}
                                aria-label="Cerrar opciones"
                              >
                                ×
                              </button>
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

                              <button
                                className={`verse-action-button${highlighted ? ' active' : ''}`}
                                type="button"
                                aria-expanded={highlightPickerOpen}
                                onClick={() => setHighlightPickerOpen((current) => !current)}
                              >
                                <span aria-hidden="true">▰</span>
                                {highlighted ? 'Resaltado' : 'Resaltar'}
                              </button>

                              <button
                                className="verse-action-button"
                                type="button"
                                onClick={() => void copyVerseText()}
                              >
                                <span aria-hidden="true">⧉</span>
                                Copiar
                              </button>

                              <button
                                className="verse-action-button"
                                type="button"
                                onClick={() => void shareVerse()}
                              >
                                <span aria-hidden="true">↗</span>
                                Compartir
                              </button>
                            </div>

                            {highlightPickerOpen ? (
                              <div className="highlight-color-picker" aria-label="Color de resaltado">
                                {highlightChoices.map((choice) => (
                                  <button
                                    className={`highlight-color-option highlight-${choice.color}${highlighted && highlightColor === choice.color ? ' active' : ''}`}
                                    type="button"
                                    key={choice.color}
                                    aria-pressed={highlighted && highlightColor === choice.color}
                                    onClick={() => void handleHighlightColor(choice.color)}
                                  >
                                    <span aria-hidden="true" />
                                    {choice.label}
                                  </button>
                                ))}
                                {highlighted ? (
                                  <button
                                    className="highlight-remove"
                                    type="button"
                                    onClick={() => void handleRemoveHighlight()}
                                  >
                                    Quitar resaltado
                                  </button>
                                ) : null}
                              </div>
                            ) : null}

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
                                    <button
                                      className="button secondary"
                                      type="button"
                                      onClick={() => void handleDeleteNote()}
                                    >
                                      Eliminar
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}

                            {actionMessage ? (
                              <p className="verse-action-message" role="status">
                                {actionMessage}
                              </p>
                            ) : null}
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
