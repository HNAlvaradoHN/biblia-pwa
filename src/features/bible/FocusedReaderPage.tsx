import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import './focused-reader.css'

type FocusMode = 'chapter' | 'verse'

type FlatVerse = {
  chapter: number
  number: number
  text: string
  heading?: string
}

export function FocusedReaderPage() {
  const { bookId = '', chapter: chapterParam = '1' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const book = bibleProvider.getBook(bookId)
  const requestedChapter = Number(chapterParam)
  const mode: FocusMode = searchParams.get('mode') === 'verse' ? 'verse' : 'chapter'
  const touchStart = useRef<{ x: number; y: number } | undefined>(undefined)
  const [entryPulse, setEntryPulse] = useState(true)

  const returnAnchor = searchParams.get('returnAnchor') ?? ''
  const returnChapter = Number(searchParams.get('returnChapter') ?? requestedChapter)

  const chapterStartIndex = Math.max(
    0,
    book?.chapters.findIndex((item) => item.number === requestedChapter) ?? 0,
  )
  const [chapterIndex, setChapterIndex] = useState(chapterStartIndex)

  const flatVerses = useMemo<FlatVerse[]>(() => {
    if (!book) return []
    return book.chapters.flatMap((chapter) =>
      chapter.sections.flatMap((section) =>
        section.verses.map((verse) => ({
          chapter: chapter.number,
          number: verse.number,
          text: verse.text,
          heading: section.heading,
        })),
      ),
    )
  }, [book])

  const initialVerseIndex = useMemo(() => {
    if (!book || flatVerses.length === 0) return 0
    const anchorMatch = returnAnchor.match(/verse-[^-]+-(\d+)-(\d+)$/)
    const anchorChapter = anchorMatch ? Number(anchorMatch[1]) : requestedChapter
    const anchorVerse = anchorMatch ? Number(anchorMatch[2]) : undefined
    const index = flatVerses.findIndex(
      (item) =>
        item.chapter === anchorChapter &&
        (anchorVerse === undefined || item.number === anchorVerse),
    )
    return index >= 0 ? index : 0
  }, [book, flatVerses, requestedChapter, returnAnchor])

  const [verseIndex, setVerseIndex] = useState(initialVerseIndex)

  useEffect(() => {
    const timer = window.setTimeout(() => setEntryPulse(false), 1500)
    return () => window.clearTimeout(timer)
  }, [])


  const chapter = book?.chapters[chapterIndex]
  const verse = flatVerses[verseIndex]

  const currentChapter =
    mode === 'verse' && verse
      ? book?.chapters.find((item) => item.number === verse.chapter)
      : chapter

  const canGoPrevious =
    mode === 'verse' ? verseIndex > 0 : chapterIndex > 0

  const canGoNext =
    mode === 'verse'
      ? verseIndex < flatVerses.length - 1
      : Boolean(book && chapterIndex < book.chapters.length - 1)

  const closeUrl = useMemo(() => {
    if (!book) return '/biblia'
    const safeReturnChapter = Number.isFinite(returnChapter)
      ? returnChapter
      : requestedChapter
    const base = `/biblia/${book.id}/${safeReturnChapter}?returnFromFocus=1`
    return returnAnchor ? `${base}#${encodeURIComponent(returnAnchor)}` : base
  }, [book, requestedChapter, returnAnchor, returnChapter])

  if (!book || !currentChapter || (mode === 'verse' && !verse)) {
    return (
      <div className="focus-reader focus-reader-empty">
        <strong>Lectura no encontrada.</strong>
        <button
          type="button"
          className="button primary"
          onClick={() => navigate('/biblia')}
        >
          Volver
        </button>
      </div>
    )
  }

  function goPrevious() {
    if (!canGoPrevious) return
    if (mode === 'verse') {
      setVerseIndex((current) => current - 1)
      return
    }
    setChapterIndex((current) => current - 1)
  }

  function goNext() {
    if (!canGoNext) return
    if (mode === 'verse') {
      setVerseIndex((current) => current + 1)
      return
    }
    setChapterIndex((current) => current + 1)
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    const touch = event.touches[0]
    if (!touch) return
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStart.current
    touchStart.current = undefined
    const touch = event.changedTouches[0]
    if (!start || !touch) return

    const distanceX = touch.clientX - start.x
    const distanceY = touch.clientY - start.y

    if (Math.abs(distanceX) < 55) return
    if (Math.abs(distanceX) < Math.abs(distanceY) * 1.25) return

    if (distanceX < 0) goNext()
    else goPrevious()
  }

  const progress =
    mode === 'verse'
      ? `${verseIndex + 1} / ${flatVerses.length}`
      : `${chapterIndex + 1} / ${book.chapters.length}`

  return (
    <div className={`focus-reader focus-mode-${mode}`}>
      <header className="focus-reader-toolbar">
        <div>
          <span>{mode === 'verse' ? 'Versículo por versículo' : 'Capítulo por capítulo'}</span>
          <strong>
            {book.name} {currentChapter.number}
            {mode === 'verse' && verse ? `:${verse.number}` : ''}
          </strong>
        </div>
        <button
          type="button"
          onClick={() => navigate(closeUrl)}
          aria-label="Cerrar modo de lectura"
        >
          ×
        </button>
      </header>

      <main
        className="focus-reader-sheet"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {mode === 'chapter' && chapter ? (
          <>
            <div className="focus-reader-heading">
              <p>{bibleProvider.translation.label}</p>
              <h1>{book.name} {chapter.number}</h1>
            </div>

            {chapter.sections.map((section) => (
              <section className="focus-reader-section" key={section.id}>
                {section.heading ? <h2>{section.heading}</h2> : null}
                <div className="focus-reader-verses">
                  {section.verses.map((item) => (
                    <p key={item.number}>
                      <sup>{item.number}</sup>
                      {item.text}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </>
        ) : verse ? (
          <article className={`focus-verse-card${entryPulse ? ' entry-pulse' : ''}`}>
            <p className="focus-verse-context">
              {verse.heading ?? bibleProvider.translation.label}
            </p>
            <h1>{book.name} {verse.chapter}:{verse.number}</h1>
            <blockquote>{verse.text}</blockquote>
            <p className="focus-verse-hint">Deslizá a izquierda o derecha, o usá Anterior/Siguiente.</p>
          </article>
        ) : null}
      </main>

      <footer className="focus-reader-controls">
        <button type="button" disabled={!canGoPrevious} onClick={goPrevious}>
          ← Anterior
        </button>
        <span>{progress}</span>
        <button type="button" disabled={!canGoNext} onClick={goNext}>
          Siguiente →
        </button>
      </footer>
    </div>
  )
}
