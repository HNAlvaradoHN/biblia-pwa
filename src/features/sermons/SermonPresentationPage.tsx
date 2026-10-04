import { Fragment, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { getSermon, type SermonRecord } from '../../data/db'
import {
  detectAllSermonReferences,
  getReferencePassage,
  type SermonBibleReference,
  type SermonFieldName,
} from './sermonReferences'
import './sermons.css'

function PresentationText({
  text,
  field,
  references,
  onReferenceOpen,
}: {
  text: string
  field: SermonFieldName
  references: SermonBibleReference[]
  onReferenceOpen: (reference: SermonBibleReference) => void
}) {
  const fieldReferences = references
    .filter((reference) => reference.field === field)
    .sort((a, b) => a.startIndex - b.startIndex)

  if (!text.trim()) return <p className="sermon-presentation-empty">Sin contenido.</p>

  const parts: Array<{ text: string; reference?: SermonBibleReference }> = []
  let cursor = 0

  for (const reference of fieldReferences) {
    if (reference.startIndex < cursor || reference.endIndex > text.length) continue
    if (reference.startIndex > cursor) {
      parts.push({ text: text.slice(cursor, reference.startIndex) })
    }
    parts.push({ text: text.slice(reference.startIndex, reference.endIndex), reference })
    cursor = reference.endIndex
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor) })

  return (
    <p className="sermon-presentation-text">
      {parts.map((part, index) =>
        part.reference ? (
          <button
            className="sermon-presentation-reference"
            type="button"
            key={part.reference.id}
            onClick={() => onReferenceOpen(part.reference!)}
          >
            {part.text}
          </button>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </p>
  )
}

export function SermonPresentationPage() {
  const { sermonId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [sermon, setSermon] = useState<SermonRecord>()
  const [referencePreview, setReferencePreview] = useState<SermonBibleReference>()

  useEffect(() => {
    let cancelled = false
    void getSermon(sermonId).then((record) => {
      if (!cancelled && record) setSermon(record)
    })
    return () => {
      cancelled = true
    }
  }, [sermonId])

  const references = useMemo(
    () =>
      sermon
        ? detectAllSermonReferences({
            introduction: sermon.introduction,
            outline: sermon.outline,
            conclusion: sermon.conclusion,
          })
        : [],
    [sermon],
  )

  const previewPassage = useMemo(
    () => (referencePreview ? getReferencePassage(referencePreview) : []),
    [referencePreview],
  )

  useEffect(() => {
    if (!referencePreview) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [referencePreview])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const returnScroll = Number(params.get('returnScroll'))
    if (!Number.isFinite(returnScroll)) return

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: Math.max(0, returnScroll), behavior: 'auto' })
      navigate(`/predicas/${sermonId}/presentar`, { replace: true })
    })
  }, [location.search, navigate, sermonId])

  useEffect(() => {
    type WakeLockSentinelLike = {
      released: boolean
      release: () => Promise<void>
    }
    type NavigatorWithWakeLock = Navigator & {
      wakeLock?: {
        request: (type: 'screen') => Promise<WakeLockSentinelLike>
      }
    }

    let cancelled = false
    let sentinel: WakeLockSentinelLike | undefined
    const navigatorWithWakeLock = navigator as NavigatorWithWakeLock

    async function requestWakeLock() {
      if (
        cancelled ||
        document.visibilityState !== 'visible' ||
        !navigatorWithWakeLock.wakeLock ||
        (sentinel && !sentinel.released)
      ) {
        return
      }

      try {
        sentinel = await navigatorWithWakeLock.wakeLock.request('screen')
      } catch {
        sentinel = undefined
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void requestWakeLock()
      }
    }

    void requestWakeLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (sentinel && !sentinel.released) {
        void sentinel.release()
      }
    }
  }, [])

  function openReferenceInBible(reference: SermonBibleReference) {
    window.sessionStorage.setItem(
      'biblia-sermon-return-v1',
      JSON.stringify({
        sermonId,
        field: reference.field,
        startIndex: reference.startIndex,
        mode: 'presentation',
        scrollY: window.scrollY,
      }),
    )

    const anchor = `verse-${reference.bookId}-${reference.chapter}-${reference.verseStart}`
    navigate(
      `/biblia/${reference.bookId}/${reference.chapter}?fromSermon=1#${anchor}`,
    )
  }

  if (!sermon) {
    return (
      <section className="sermon-presentation-page">
        <button
          className="sermon-presentation-exit"
          type="button"
          onClick={() => navigate('/predicas')}
        >
          Volver
        </button>
        <div className="sermon-presentation-card">
          <p>Prédica no encontrada.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="sermon-presentation-page">
      <header className="sermon-presentation-header">
        <div>
          <span>Modo Predicación</span>
          <h1>{sermon.title}</h1>
        </div>
        <button
          className="sermon-presentation-exit"
          type="button"
          onClick={() => navigate(`/predicas/${sermonId}`)}
        >
          Volver a editar
        </button>
      </header>

      <article className="sermon-presentation-card">
        <section>
          <h2>Introducción</h2>
          <PresentationText
            text={sermon.introduction}
            field="introduction"
            references={references}
            onReferenceOpen={setReferencePreview}
          />
        </section>

        <section>
          <h2>Bosquejo y puntos</h2>
          <PresentationText
            text={sermon.outline}
            field="outline"
            references={references}
            onReferenceOpen={setReferencePreview}
          />
        </section>

        <section>
          <h2>Conclusión</h2>
          <PresentationText
            text={sermon.conclusion}
            field="conclusion"
            references={references}
            onReferenceOpen={setReferencePreview}
          />
        </section>
      </article>

      {referencePreview ? (
        <div
          className="sermon-reference-backdrop submenu-backdrop"
          role="presentation"
          onClick={() => setReferencePreview(undefined)}
        >
          <section
            className="sermon-reference-preview submenu-surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sermon-presentation-reference-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>Referencia</span>
                <strong id="sermon-presentation-reference-title">
                  {referencePreview.sourceText}
                </strong>
              </div>
              <button
                type="button"
                aria-label="Cerrar referencia"
                onClick={() => setReferencePreview(undefined)}
              >
                ×
              </button>
            </header>

            <div className="sermon-reference-passage">
              {previewPassage.map((verse) => (
                <p key={verse.number}>
                  <sup>{verse.number}</sup>
                  {verse.text}
                </p>
              ))}
            </div>

            <div className="sermon-reference-actions">
              <button
                className="sermon-reference-action-link"
                type="button"
                onClick={() => setReferencePreview(undefined)}
              >
                Cerrar
              </button>
              <button
                className="sermon-reference-action-link accent"
                type="button"
                onClick={() => openReferenceInBible(referencePreview)}
              >
                Leer capítulo
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  )
}
