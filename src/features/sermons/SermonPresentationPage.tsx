import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import {
  getSermon,
  getSermonAttachment,
  getSermonBlocks,
  type SermonBlockRecord,
  type SermonInlineMark,
  type SermonRecord,
  type SermonSection,
} from '../../data/db'
import {
  detectSermonBlockReferences,
  getReferencePassage,
  type SermonBibleReference,
} from './sermonReferences'
import './sermons.css'

const SECTION_LABELS: Record<SermonSection, string> = {
  introduction: 'Introducción',
  outline: 'Bosquejo y puntos',
  conclusion: 'Conclusión',
}

function markClassNames(marks: SermonInlineMark[]) {
  const classes: string[] = []

  for (const mark of marks) {
    if (mark.type === 'bold') classes.push('sermon-inline-bold')
    if (mark.type === 'italic') classes.push('sermon-inline-italic')
    if (mark.type === 'underline') classes.push('sermon-inline-underline')
    if (mark.type === 'strike') classes.push('sermon-inline-strike')
    if (mark.type === 'link') classes.push('sermon-inline-link')
    if (mark.type === 'textColor' && mark.color) {
      classes.push(`sermon-text-color-${mark.color}`)
    }
    if (mark.type === 'highlight' && mark.color) {
      classes.push(`sermon-highlight-${mark.color}`)
    }
  }

  return classes.join(' ')
}

function PresentationImage({ block }: { block: SermonBlockRecord }) {
  const [src, setSrc] = useState<string>()

  useEffect(() => {
    let disposed = false
    let objectUrl: string | undefined

    if (!block.attachmentId) {
      setSrc(undefined)
      return
    }

    void getSermonAttachment(block.attachmentId).then((attachment) => {
      if (disposed || !attachment) return
      objectUrl = URL.createObjectURL(attachment.blob)
      setSrc(objectUrl)
    })

    return () => {
      disposed = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [block.attachmentId])

  if (!src) {
    return (
      <div
        className="sermon-presentation-image-loading"
        data-sermon-block-id={block.id}
      >
        Cargando imagen…
      </div>
    )
  }

  return (
    <figure
      className="sermon-presentation-image"
      data-sermon-block-id={block.id}
    >
      <img src={src} alt={block.altText || 'Imagen de la prédica'} />
      {block.altText ? <figcaption>{block.altText}</figcaption> : null}
    </figure>
  )
}

function PresentationTextBlock({
  block,
  references,
  onReferenceOpen,
}: {
  block: SermonBlockRecord
  references: SermonBibleReference[]
  onReferenceOpen: (reference: SermonBibleReference) => void
}) {
  const blockReferences = references
    .filter((reference) => reference.blockId === block.id)
    .sort((a, b) => a.startIndex - b.startIndex)

  const boundaries = new Set<number>([0, block.text.length])
  for (const reference of blockReferences) {
    boundaries.add(reference.startIndex)
    boundaries.add(reference.endIndex)
  }
  for (const mark of block.marks) {
    boundaries.add(Math.max(0, Math.min(block.text.length, mark.start)))
    boundaries.add(Math.max(0, Math.min(block.text.length, mark.end)))
  }

  const sorted = [...boundaries].sort((a, b) => a - b)
  const content = sorted.slice(0, -1).map((start, index) => {
    const end = sorted[index + 1]
    if (end <= start) return null

    const text = block.text.slice(start, end)
    const reference = blockReferences.find(
      (item) => start >= item.startIndex && end <= item.endIndex,
    )
    const activeMarks = block.marks.filter(
      (mark) => start >= mark.start && end <= mark.end,
    )
    const className = markClassNames(activeMarks)
    const link = activeMarks.find(
      (mark) => mark.type === 'link' && mark.href,
    )

    if (reference) {
      return (
        <button
          className={['sermon-presentation-reference', className]
            .filter(Boolean)
            .join(' ')}
          type="button"
          key={`${block.id}:${start}:${end}`}
          data-sermon-block-id={block.id}
          data-sermon-field={block.section}
          data-sermon-start-index={reference.startIndex}
          onClick={() => onReferenceOpen(reference)}
        >
          {text}
        </button>
      )
    }

    if (link?.href) {
      return (
        <a
          className={className}
          href={link.href}
          key={`${block.id}:${start}:${end}`}
          rel="noreferrer"
          target="_blank"
        >
          {text}
        </a>
      )
    }

    return className ? (
      <span className={className} key={`${block.id}:${start}:${end}`}>
        {text}
      </span>
    ) : (
      <Fragment key={`${block.id}:${start}:${end}`}>{text}</Fragment>
    )
  })

  const style: CSSProperties | undefined =
    block.indent > 0
      ? { paddingInlineStart: `${block.indent * 1.1}rem` }
      : undefined

  const className = [
    'sermon-presentation-block',
    `sermon-presentation-block-${block.type}`,
    block.type === 'heading'
      ? `heading-${block.headingLevel ?? 1}`
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      data-sermon-block-id={block.id}
      style={style}
    >
      {block.type === 'bullet' ? (
        <span className="sermon-presentation-prefix" aria-hidden="true">
          •
        </span>
      ) : null}
      {block.type === 'numbered' ? (
        <span className="sermon-presentation-prefix" aria-hidden="true">
          1.
        </span>
      ) : null}
      {block.type === 'task' ? (
        <span className="sermon-presentation-prefix" aria-hidden="true">
          {block.checked ? '☑' : '☐'}
        </span>
      ) : null}
      <p>{content}</p>
    </div>
  )
}

function PresentationSection({
  section,
  blocks,
  references,
  onReferenceOpen,
}: {
  section: SermonSection
  blocks: SermonBlockRecord[]
  references: SermonBibleReference[]
  onReferenceOpen: (reference: SermonBibleReference) => void
}) {
  const sectionBlocks = blocks
    .filter((block) => block.section === section)
    .sort((a, b) => a.order - b.order)
  const hasContent = sectionBlocks.some(
    (block) => block.type === 'image' || block.text.trim().length > 0,
  )

  return (
    <section>
      <h2>{SECTION_LABELS[section]}</h2>
      {!hasContent ? (
        <p className="sermon-presentation-empty">Sin contenido.</p>
      ) : (
        <div className="sermon-presentation-blocks">
          {sectionBlocks.map((block) =>
            block.type === 'image' ? (
              <PresentationImage block={block} key={block.id} />
            ) : (
              <PresentationTextBlock
                block={block}
                key={block.id}
                references={references}
                onReferenceOpen={onReferenceOpen}
              />
            ),
          )}
        </div>
      )}
    </section>
  )
}

export function SermonPresentationPage() {
  const { sermonId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [sermon, setSermon] = useState<SermonRecord>()
  const [blocks, setBlocks] = useState<SermonBlockRecord[]>([])
  const [referencePreview, setReferencePreview] =
    useState<SermonBibleReference>()

  useEffect(() => {
    let cancelled = false

    void Promise.all([
      getSermon(sermonId),
      getSermonBlocks(sermonId),
    ]).then(([record, storedBlocks]) => {
      if (cancelled || !record) return
      setSermon(record)
      setBlocks(storedBlocks)
    })

    return () => {
      cancelled = true
    }
  }, [sermonId])

  const references = useMemo(
    () => detectSermonBlockReferences(blocks),
    [blocks],
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
    if (!sermon || blocks.length === 0) return

    const params = new URLSearchParams(location.search)
    const returnBlock = params.get('returnBlock')
    const returnField = params.get('returnField')
    const returnAt = Number(params.get('returnAt'))
    const returnScroll = Number(params.get('returnScroll'))

    if (!returnBlock && !returnField && !Number.isFinite(returnScroll)) {
      return
    }

    let highlightTimer: number | undefined
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target =
          returnBlock && Number.isFinite(returnAt)
            ? document.querySelector<HTMLElement>(
                `[data-sermon-block-id="${returnBlock}"][data-sermon-start-index="${returnAt}"]`,
              )
            : returnField && Number.isFinite(returnAt)
              ? document.querySelector<HTMLElement>(
                  `[data-sermon-field="${returnField}"][data-sermon-start-index="${returnAt}"]`,
                )
              : null

        if (target) {
          target.scrollIntoView({ block: 'center', behavior: 'auto' })
          target.classList.add('return-focus')
          highlightTimer = window.setTimeout(
            () => target.classList.remove('return-focus'),
            2000,
          )
        } else if (Number.isFinite(returnScroll)) {
          window.scrollTo({
            top: Math.max(0, returnScroll),
            behavior: 'auto',
          })
        }

        navigate(`/predicas/${sermonId}/presentar`, { replace: true })
      })
    })

    return () => {
      window.cancelAnimationFrame(frame)
      if (highlightTimer) window.clearTimeout(highlightTimer)
    }
  }, [blocks, location.search, navigate, sermon, sermonId])

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
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      )
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
        blockId: reference.blockId,
        startIndex: reference.startIndex,
        mode: 'presentation',
        scrollY: window.scrollY,
      }),
    )

    const anchor =
      `verse-${reference.bookId}-${reference.chapter}-${reference.verseStart}`
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
        {(['introduction', 'outline', 'conclusion'] as SermonSection[]).map(
          (section) => (
            <PresentationSection
              blocks={blocks}
              key={section}
              onReferenceOpen={setReferencePreview}
              references={references}
              section={section}
            />
          ),
        )}
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
