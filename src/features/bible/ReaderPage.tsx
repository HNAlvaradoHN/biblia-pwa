import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import { getLastReading, saveLastReading } from '../../data/db'

export function ReaderPage() {
  const { bookId = '', chapter: chapterParam = '1' } = useParams()
  const book = bibleProvider.getBook(bookId)
  const requestedChapter = Number(chapterParam)
  const saveTimer = useRef<number | undefined>(undefined)

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

    void getLastReading().then((lastReading) => {
      if (cancelled) return

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
  }, [book, chapters, requestedChapter])

  if (!book || chapters.length === 0) {
    return (
      <div className="page empty-state full">
        <strong>Lectura no encontrada.</strong>
        <Link className="button primary" to="/biblia">Volver a Biblia</Link>
      </div>
    )
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
                    return (
                      <p
                        id={anchorId}
                        key={verse.number}
                        className="verse"
                        data-reading-anchor="true"
                        data-chapter={chapter.number}
                      >
                        <sup>{verse.number}</sup>
                        {verse.text}
                      </p>
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
