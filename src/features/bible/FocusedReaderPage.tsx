import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import './focused-reader.css'

export function FocusedReaderPage() {
  const { bookId = '', chapter: chapterParam = '1' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const book = bibleProvider.getBook(bookId)
  const requestedChapter = Number(chapterParam)
  const startIndex = Math.max(0, book?.chapters.findIndex((item) => item.number === requestedChapter) ?? 0)
  const [chapterIndex, setChapterIndex] = useState(startIndex)
  const pointerStartX = useRef<number | undefined>(undefined)

  const chapter = book?.chapters[chapterIndex]
  const returnAnchor = searchParams.get('returnAnchor') ?? ''
  const returnChapter = Number(searchParams.get('returnChapter') ?? requestedChapter)

  const canGoPrevious = chapterIndex > 0
  const canGoNext = Boolean(book && chapterIndex < book.chapters.length - 1)

  const closeUrl = useMemo(() => {
    if (!book) return '/biblia'
    const base = `/biblia/${book.id}/${Number.isFinite(returnChapter) ? returnChapter : requestedChapter}?returnFromFocus=1`
    return returnAnchor ? `${base}#${encodeURIComponent(returnAnchor)}` : base
  }, [book, requestedChapter, returnAnchor, returnChapter])

  if (!book || !chapter) {
    return (
      <div className="focus-reader focus-reader-empty">
        <strong>Capítulo no encontrado.</strong>
        <button type="button" className="button primary" onClick={() => navigate('/biblia')}>Volver</button>
      </div>
    )
  }

  function goPrevious() {
    if (canGoPrevious) setChapterIndex((current) => current - 1)
  }

  function goNext() {
    if (canGoNext) setChapterIndex((current) => current + 1)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse') return
    pointerStartX.current = event.clientX
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    const startX = pointerStartX.current
    pointerStartX.current = undefined
    if (startX === undefined) return
    const distance = event.clientX - startX
    if (Math.abs(distance) < 70) return
    if (distance < 0) goNext()
    else goPrevious()
  }

  return (
    <div className="focus-reader">
      <header className="focus-reader-toolbar">
        <div>
          <span>{book.name}</span>
          <strong>Capítulo {chapter.number}</strong>
        </div>
        <button type="button" onClick={() => navigate(closeUrl)} aria-label="Cerrar lector por capítulo">×</button>
      </header>

      <main
        className="focus-reader-sheet"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="focus-reader-heading">
          <p>{bibleProvider.translation.label}</p>
          <h1>{book.name} {chapter.number}</h1>
        </div>

        {chapter.sections.map((section) => (
          <section className="focus-reader-section" key={section.id}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            <div className="focus-reader-verses">
              {section.verses.map((verse) => (
                <p key={verse.number}>
                  <sup>{verse.number}</sup>
                  {verse.text}
                </p>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="focus-reader-controls">
        <button type="button" disabled={!canGoPrevious} onClick={goPrevious}>← Anterior</button>
        <span>{chapterIndex + 1} / {book.chapters.length}</span>
        <button type="button" disabled={!canGoNext} onClick={goNext}>Siguiente →</button>
      </footer>
    </div>
  )
}
