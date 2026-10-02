import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import {
  getActiveVerse,
  getBibleNote,
  getHighlights,
  getLastReading,
  isFavorite,
  isHighlighted,
  makeBibleLocationId,
  removeBibleNote,
  saveActiveVerse,
  saveBibleNote,
  saveLastReading,
  toggleFavorite,
  toggleHighlight,
} from '../../data/db'
import './reader-actions.css'

type ActiveVerse = {
  chapter: number
  verse: number
  anchorId: string
}

export function ReaderPage() {
  const { bookId = '', chapter: chapterParam = '1' } = useParams()
  const routerLocation = useLocation()
  const book = bibleProvider.getBook(bookId)
  const requestedChapter = Number(chapterParam)
  const saveTimer = useRef<number | undefined>(undefined)
  const actionPanelRef = useRef<HTMLDivElement | null>(null)
  const [activeVerse, setActiveVerse] = useState<ActiveVerse | undefined>()
  const [actionPanelOpen, setActionPanelOpen] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedVerseIds, setSelectedVerseIds] = useState<Set<string>>(() => new Set())
  const [favoriteActive, setFavoriteActive] = useState(false)
  const [highlightActive, setHighlightActive] = useState(false)
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(() => new Set())
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

    let cancelled = false
    const visibleChapterNumbers = new Set(chapters.map((item) => item.number))

    void Promise.all([getActiveVerse(), getHighlights()]).then(([storedActiveVerse, highlights]) => {
      if (cancelled) return

      setHighlightedIds(new Set(highlights.map((item) => makeBibleLocationId(item))))

      if (
        storedActiveVerse?.bookId === book.id &&
        visibleChapterNumbers.has(storedActiveVerse.chapter)
      ) {
        const chapter = book.chapters.find((item) => item.number === storedActiveVerse.chapter)
        const verseExists = chapter?.sections.some((section) =>
          section.verses.some((verse) => verse.number === storedActiveVerse.verse),
        )

        if (verseExists) {
          setActiveVerse({
            chapter: storedActiveVerse.chapter,
            verse: storedActiveVerse.verse,
            anchorId: `verse-${book.id}-${storedActiveVerse.chapter}-${storedActiveVerse.verse}`,
          })
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [book, chapters])

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
    if (!book || !activeVerse) {
      setFavoriteActive(false)
      setHighlightActive(false)
      setNoteDraft('')
      setNoteSaved(false)
      setNoteOpen(false)
      setActionMessage('')
      return
    }

    let cancelled = false
    const location = {
      bookId: book.id,
      chapter: activeVerse.chapter,
      verse: activeVerse.verse,
    }

    void Promise.all([
      isFavorite(location),
      getBibleNote(location),
      isHighlighted(location),
    ]).then(([favorite, note, highlighted]) => {
      if (cancelled) return
      setFavoriteActive(favorite)
      setHighlightActive(highlighted)
      setNoteDraft(note?.text ?? '')
      setNoteSaved(Boolean(note))
      setNoteOpen(Boolean(note))
      setActionMessage('')
    })

    return () => {
      cancelled = true
    }
  }, [book, activeVerse])

  useEffect(() => {
    if (!actionPanelOpen) return

    function closeOnOutsidePress(event: PointerEvent) {
      if (actionPanelRef.current?.contains(event.target as Node)) return
      setActionPanelOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [actionPanelOpen])

  const activeVerseText = useMemo(() => {
    if (!book || !activeVerse) return undefined
    const chapter = book.chapters.find((item) => item.number === activeVerse.chapter)
    return chapter?.sections
      .flatMap((section) => section.verses)
      .find((verse) => verse.number === activeVerse.verse)?.text
  }, [book, activeVerse])

  if (!book || chapters.length === 0) {
    return (
      <div className="page empty-state full">
        <strong>Lectura no encontrada.</strong>
        <Link className="button primary" to="/biblia">Volver a Biblia</Link>
      </div>
    )
  }

  const activeBook = book

  function getActiveLocation() {
    if (!activeVerse) return undefined
    return {
      bookId: activeBook.id,
      chapter: activeVerse.chapter,
      verse: activeVerse.verse,
    }
  }

  function getShareText() {
    if (!activeVerse || !activeVerseText) return undefined
    const reference = `${activeBook.name} ${activeVerse.chapter}:${activeVerse.verse}`
    return {
      reference,
      text: `${reference}\n${activeVerseText}`,
    }
  }

  function getSelectedVerses() {
    return chapters.flatMap((chapter) =>
      chapter.sections.flatMap((section) =>
        section.verses
          .map((verse) => {
            const location = {
              bookId: activeBook.id,
              chapter: chapter.number,
              verse: verse.number,
            }
            const id = makeBibleLocationId(location)
            if (!selectedVerseIds.has(id)) return undefined
            return {
              id,
              location,
              reference: `${activeBook.name} ${chapter.number}:${verse.number}`,
              text: verse.text,
            }
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      ),
    )
  }

  function getSelectedShareText() {
    const selected = getSelectedVerses()
    if (selected.length === 0) return undefined
    return {
      reference:
        selected.length === 1
          ? selected[0].reference
          : `${activeBook.name} · ${selected.length} versículos`,
      text: selected.map((item) => `${item.reference}\n${item.text}`).join('\n\n'),
    }
  }

  function startMultiSelect() {
    const location = getActiveLocation()
    if (!location) return
    setSelectedVerseIds(new Set([makeBibleLocationId(location)]))
    setSelectionMode(true)
    setActionPanelOpen(false)
    setActionMessage('')
  }

  function stopMultiSelect() {
    setSelectionMode(false)
    setSelectedVerseIds(new Set())
    setActionMessage('')
  }

  function toggleSelectedVerse(locationId: string) {
    setSelectedVerseIds((current) => {
      const next = new Set(current)
      if (next.has(locationId)) next.delete(locationId)
      else next.add(locationId)
      return next
    })
  }

  async function handleFavorite() {
    const location = getActiveLocation()
    if (!location) return

    const active = await toggleFavorite(location)
    setFavoriteActive(active)
    setActionMessage(active ? 'Añadido a favoritos' : 'Quitado de favoritos')
  }

  async function handleHighlight() {
    const location = getActiveLocation()
    if (!location) return

    const active = await toggleHighlight(location)
    const id = makeBibleLocationId(location)

    setHighlightActive(active)
    setHighlightedIds((current) => {
      const next = new Set(current)
      if (active) next.add(id)
      else next.delete(id)
      return next
    })
    setActionMessage(active ? 'Versículo resaltado' : 'Resaltado eliminado')
  }

  async function handleCopy() {
    const share = getShareText()
    if (!share) return

    try {
      await navigator.clipboard.writeText(share.text)
      setActionMessage('Copiado al portapapeles')
    } catch {
      setActionMessage('No se pudo copiar en este dispositivo')
    }
  }

  async function handleShare() {
    const share = getShareText()
    if (!share) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: share.reference,
          text: share.text,
        })
        setActionMessage('Compartido')
        return
      }

      await navigator.clipboard.writeText(share.text)
      setActionMessage('Compartir no está disponible; se copió el versículo')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setActionMessage('No se pudo compartir en este dispositivo')
    }
  }

  async function handleBulkFavorite() {
    const selected = getSelectedVerses()
    if (selected.length === 0) return

    await Promise.all(
      selected.map(async ({ location }) => {
        if (!(await isFavorite(location))) await toggleFavorite(location)
      }),
    )
    setActionMessage(
      `${selected.length} versículo${selected.length === 1 ? '' : 's'} añadido${selected.length === 1 ? '' : 's'} a favoritos`,
    )
  }

  async function handleBulkHighlight() {
    const selected = getSelectedVerses()
    if (selected.length === 0) return

    const newlyHighlighted = await Promise.all(
      selected.map(async ({ id, location }) => {
        if (!(await isHighlighted(location))) await toggleHighlight(location)
        return id
      }),
    )

    setHighlightedIds((current) => {
      const next = new Set(current)
      newlyHighlighted.forEach((id) => next.add(id))
      return next
    })
    setActionMessage(
      `${selected.length} versículo${selected.length === 1 ? '' : 's'} resaltado${selected.length === 1 ? '' : 's'}`,
    )
  }

  async function handleBulkCopy() {
    const share = getSelectedShareText()
    if (!share) return

    try {
      await navigator.clipboard.writeText(share.text)
      setActionMessage('Selección copiada al portapapeles')
    } catch {
      setActionMessage('No se pudo copiar en este dispositivo')
    }
  }

  async function handleBulkShare() {
    const share = getSelectedShareText()
    if (!share) return

    try {
      if (navigator.share) {
        await navigator.share({ title: share.reference, text: share.text })
        setActionMessage('Selección compartida como texto')
        return
      }

      await navigator.clipboard.writeText(share.text)
      setActionMessage('Compartir no está disponible; se copió la selección')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setActionMessage('No se pudo compartir en este dispositivo')
    }
  }

  async function handleSaveNote() {
    const location = getActiveLocation()
    if (!location || !noteDraft.trim()) return

    const saved = await saveBibleNote(location, noteDraft)
    setNoteDraft(saved?.text ?? '')
    setNoteSaved(Boolean(saved))
    setActionMessage('Nota guardada')
  }

  async function handleDeleteNote() {
    const location = getActiveLocation()
    if (!location) return

    await removeBibleNote(makeBibleLocationId(location))
    setNoteDraft('')
    setNoteSaved(false)
    setNoteOpen(false)
    setActionMessage('Nota eliminada')
  }

  function activateVerse(chapter: number, verse: number, anchorId: string) {
    const location = {
      bookId: activeBook.id,
      chapter,
      verse,
    }

    setActiveVerse({ chapter, verse, anchorId })
    setActionPanelOpen(false)
    void saveActiveVerse(location)
    void saveLastReading({
      bookId: activeBook.id,
      chapter,
      anchorId,
    })
  }

  return (
    <div className="reader-page">
      <div className="reader-toolbar">
        <Link to={`/biblia/${activeBook.id}`}>← {activeBook.name}</Link>
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
              <p>{activeBook.name}</p>
              <h1>Capítulo {chapter.number}</h1>
            </header>

            {chapter.sections.map((section) => (
              <section className="bible-section" key={section.id}>
                {section.heading ? <h2>{section.heading}</h2> : null}
                <div className="verse-flow">
                  {section.verses.map((verse) => {
                    const anchorId = `verse-${activeBook.id}-${chapter.number}-${verse.number}`
                    const locationId = makeBibleLocationId({
                      bookId: activeBook.id,
                      chapter: chapter.number,
                      verse: verse.number,
                    })
                    const isActive = activeVerse?.anchorId === anchorId
                    const isHighlighted = highlightedIds.has(locationId)
                    const isSelected = selectedVerseIds.has(locationId)
                    const panelVisible = isActive && actionPanelOpen && !selectionMode
                    const reference = `${activeBook.name} ${chapter.number}:${verse.number}`

                    return (
                      <div
                        className={[
                          'verse-item',
                          isActive ? 'active' : '',
                          isHighlighted ? 'highlighted' : '',
                          isSelected ? 'selected' : '',
                        ].filter(Boolean).join(' ')}
                        key={verse.number}
                      >
                        <button
                          id={anchorId}
                          className="verse verse-button"
                          type="button"
                          data-reading-anchor="true"
                          data-chapter={chapter.number}
                          aria-current={isActive ? 'true' : undefined}
                          aria-expanded={panelVisible}
                          aria-pressed={selectionMode ? isSelected : undefined}
                          aria-label={
                            selectionMode
                              ? `${reference}. ${isSelected ? 'Seleccionado' : 'No seleccionado'}`
                              : `${reference}. Tocar para marcar como versículo activo`
                          }
                          onClick={() => {
                            if (selectionMode) {
                              toggleSelectedVerse(locationId)
                              return
                            }
                            activateVerse(chapter.number, verse.number, anchorId)
                          }}
                        >
                          <sup>{verse.number}</sup>
                          {verse.text}
                        </button>

                        {isActive && !selectionMode ? (
                          <button
                            className="verse-menu-trigger"
                            type="button"
                            aria-label={`Abrir opciones para ${reference}`}
                            aria-expanded={panelVisible}
                            onClick={(event) => {
                              event.stopPropagation()
                              setActionPanelOpen((current) => !current)
                            }}
                          >
                            ⋯
                          </button>
                        ) : null}

                        {panelVisible ? (
                          <div
                            ref={actionPanelRef}
                            className="verse-action-panel glass-panel"
                            aria-label={`Opciones para ${reference}`}
                          >
                            <div className="verse-action-header">
                              <strong>{reference}</strong>
                              <button
                                type="button"
                                onClick={() => setActionPanelOpen(false)}
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
                                className={`verse-action-button${highlightActive ? ' active' : ''}`}
                                type="button"
                                aria-pressed={highlightActive}
                                onClick={() => void handleHighlight()}
                              >
                                <span aria-hidden="true">▰</span>
                                {highlightActive ? 'Resaltado' : 'Resaltar'}
                              </button>

                              <button
                                className="verse-action-button"
                                type="button"
                                onClick={() => void handleCopy()}
                              >
                                <span aria-hidden="true">⧉</span>
                                Copiar
                              </button>

                              <button
                                className="verse-action-button"
                                type="button"
                                onClick={() => void handleShare()}
                              >
                                <span aria-hidden="true">↗</span>
                                Compartir
                              </button>

                              <button
                                className="verse-action-button"
                                type="button"
                                onClick={startMultiSelect}
                              >
                                <span aria-hidden="true">☑</span>
                                Seleccionar varios
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

      {selectionMode ? (
        <div className="verse-selection-bar glass-panel" aria-label="Acciones para selección múltiple">
          <div className="verse-selection-header">
            <strong>{selectedVerseIds.size} seleccionado{selectedVerseIds.size === 1 ? '' : 's'}</strong>
            <button type="button" onClick={stopMultiSelect} aria-label="Cerrar selección múltiple">×</button>
          </div>
          <div className="verse-action-buttons">
            <button
              className="verse-action-button"
              type="button"
              disabled={selectedVerseIds.size === 0}
              onClick={() => void handleBulkFavorite()}
            >
              <span aria-hidden="true">☆</span>
              Favoritos
            </button>
            <button
              className="verse-action-button"
              type="button"
              disabled={selectedVerseIds.size === 0}
              onClick={() => void handleBulkHighlight()}
            >
              <span aria-hidden="true">▰</span>
              Resaltar
            </button>
            <button
              className="verse-action-button"
              type="button"
              disabled={selectedVerseIds.size === 0}
              onClick={() => void handleBulkCopy()}
            >
              <span aria-hidden="true">⧉</span>
              Copiar
            </button>
            <button
              className="verse-action-button"
              type="button"
              disabled={selectedVerseIds.size === 0}
              onClick={() => void handleBulkShare()}
            >
              <span aria-hidden="true">↗</span>
              Compartir texto
            </button>
          </div>
          {actionMessage ? <p className="verse-action-message" role="status">{actionMessage}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
