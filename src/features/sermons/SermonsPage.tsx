import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent as ReactClipboardEvent,
  type FormEvent as ReactFormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import {
  appendSermonBlock,
  createSermon,
  deleteSermon,
  duplicateSermon,
  getSermon,
  getSermonAttachment,
  getSermonBlocks,
  getSermons,
  insertSermonImageBlock,
  mergeSermonBlockWithPrevious,
  removeSermonImageBlock,
  saveSermon,
  saveSermonBlockDraft,
  saveSermonBlockFormatting,
  saveSermonBlockState,
  saveSermonTitle,
  setSermonArchived,
  splitSermonBlock,
  type SermonBlockRecord,
  type SermonBlockType,
  type SermonInlineColor,
  type SermonInlineMark,
  type SermonInlineMarkType,
  type SermonRecord,
  type SermonSection,
  type SermonStatus,
} from '../../data/db'
import {
  detectSermonBlockReferences,
  getReferencePassage,
  toPersistedSermonReferences,
  type SermonBibleReference,
  type SermonFieldName,
} from './sermonReferences'
import { SermonRichTextField, type SermonRichTextFieldHandle } from './SermonRichTextField'
import './sermons.css'

function formatUpdatedAt(value: number) {
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value)
}

type SermonToolSide = 'left' | 'right'

type SermonToolPlacement = {
  side: SermonToolSide
  topRatio: number
}

type SermonBlockEditableState = Pick<
  SermonBlockRecord,
  'type' | 'text' | 'marks' | 'indent' | 'checked' | 'headingLevel'
>

type SermonHistoryEntry = {
  blockId: string
  before: SermonBlockEditableState
  after: SermonBlockEditableState
  kind: 'typing' | 'format'
  at: number
}

const SERMON_TEXT_COLORS: SermonInlineColor[] = [
  'accent',
  'red',
  'blue',
  'green',
]

const SERMON_HIGHLIGHT_COLORS: SermonInlineColor[] = [
  'amber',
  'sage',
  'sky',
  'rose',
  'lavender',
]

function editableBlockState(block: SermonBlockRecord): SermonBlockEditableState {
  return {
    type: block.type,
    text: block.text,
    marks: block.marks.map((mark) => ({ ...mark })),
    indent: block.indent,
    checked: block.checked,
    headingLevel: block.headingLevel,
  }
}

function sameEditableBlockState(
  left: SermonBlockEditableState,
  right: SermonBlockEditableState,
) {
  return JSON.stringify(left) === JSON.stringify(right)
}

const SERMON_TOOL_PLACEMENT_KEY = 'biblia-sermon-tool-placement-v1'

function loadSermonToolPlacement(): SermonToolPlacement {
  if (typeof window === 'undefined') {
    return { side: 'right', topRatio: 0.56 }
  }

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(SERMON_TOOL_PLACEMENT_KEY) ?? '',
    ) as Partial<SermonToolPlacement>
    if (
      (stored.side === 'left' || stored.side === 'right') &&
      typeof stored.topRatio === 'number'
    ) {
      return {
        side: stored.side,
        topRatio: Math.max(0.12, Math.min(0.88, stored.topRatio)),
      }
    }
  } catch {
    // Use the default placement when local preference is unavailable.
  }

  return { side: 'right', topRatio: 0.56 }
}

export function SermonsPage() {
  const navigate = useNavigate()
  const [sermons, setSermons] = useState<SermonRecord[]>([])
  const [status, setStatus] = useState<SermonStatus>('active')
  const [query, setQuery] = useState('')

  async function refresh() {
    setSermons(await getSermons())
  }

  useEffect(() => {
    void refresh()
  }, [])

  const visibleSermons = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es')
    return sermons.filter((sermon) => {
      if (sermon.status !== status) return false
      if (!normalized) return true
      const haystack = [
        sermon.title,
        sermon.introduction,
        sermon.outline,
        sermon.conclusion,
      ]
        .join(' ')
        .toLocaleLowerCase('es')
      return haystack.includes(normalized)
    })
  }, [sermons, status, query])

  async function handleCreate() {
    const sermon = await createSermon()
    navigate(`/predicas/${sermon.id}`)
  }

  async function handleDuplicate(id: string) {
    const copy = await duplicateSermon(id)
    if (!copy) return
    await refresh()
    navigate(`/predicas/${copy.id}`)
  }

  async function handleArchive(id: string, archived: boolean) {
    await setSermonArchived(id, archived)
    await refresh()
  }

  async function handleDelete(sermon: SermonRecord) {
    const confirmed = window.confirm(
      `¿Eliminar definitivamente “${sermon.title}”? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    const deleted = await deleteSermon(sermon.id)
    if (!deleted) return
    await refresh()
  }

  return (
    <section className="sermons-page">
      <header className="sermons-hero glass-panel">
        <div>
          <span className="eyebrow">Prédicas</span>
          <h1>Mis prédicas</h1>
          <p>
            Creá y organizá tus bosquejos. Todo se guarda localmente en este
            dispositivo y funciona sin conexión.
          </p>
        </div>
        <button className="button primary sermons-create" type="button" onClick={handleCreate}>
          + Nueva prédica
        </button>
      </header>

      <div className="sermons-tools glass-panel">
        <label className="sermons-search">
          <span>Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Título o contenido de la prédica"
          />
        </label>

        <div className="sermons-tabs" role="tablist" aria-label="Estado de prédicas">
          <button
            type="button"
            role="tab"
            aria-selected={status === 'active'}
            className={status === 'active' ? 'active' : ''}
            onClick={() => setStatus('active')}
          >
            Activas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={status === 'archived'}
            className={status === 'archived' ? 'active' : ''}
            onClick={() => setStatus('archived')}
          >
            Archivadas
          </button>
        </div>
      </div>

      {visibleSermons.length === 0 ? (
        <div className="sermons-empty glass-panel">
          <strong>
            {status === 'active' ? 'No hay prédicas activas.' : 'No hay prédicas archivadas.'}
          </strong>
          <p>
            {query
              ? 'Probá otra búsqueda.'
              : status === 'active'
                ? 'Creá tu primera prédica para comenzar el bosquejo.'
                : 'Las prédicas que archives aparecerán aquí.'}
          </p>
        </div>
      ) : (
        <div className="sermons-list">
          {visibleSermons.map((sermon) => (
            <article className="sermon-card glass-panel" key={sermon.id}>
              <div className="sermon-card-copy">
                <span>{sermon.status === 'active' ? 'Activa' : 'Archivada'}</span>
                <h2>{sermon.title}</h2>
                <p>
                  {sermon.introduction.trim() ||
                    sermon.outline.trim() ||
                    sermon.conclusion.trim() ||
                    'Todavía no tiene contenido.'}
                </p>
                <small>Actualizada {formatUpdatedAt(sermon.updatedAt)}</small>
              </div>

              <div className="sermon-card-actions">
                <Link className="button primary" to={`/predicas/${sermon.id}`}>
                  Abrir
                </Link>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => void handleDuplicate(sermon.id)}
                >
                  Duplicar
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => void handleArchive(sermon.id, sermon.status === 'active')}
                >
                  {sermon.status === 'active' ? 'Archivar' : 'Restaurar'}
                </button>
                <button
                  className="button sermon-delete"
                  type="button"
                  onClick={() => void handleDelete(sermon)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function SermonImageBlock({
  block,
  onActivate,
  onRemove,
}: {
  block: SermonBlockRecord
  onActivate: () => void
  onRemove: () => void
}) {
  const [src, setSrc] = useState<string>()

  useEffect(() => {
    if (!block.attachmentId) return

    let disposed = false
    let objectUrl: string | undefined

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

  return (
    <figure
      className="sermon-inline-image"
      data-sermon-block-id={block.id}
      contentEditable={false}
      onClick={onActivate}
    >
      {src ? (
        <img src={src} alt={block.altText || 'Imagen de la prédica'} />
      ) : (
        <div className="sermon-inline-image-loading">Cargando imagen…</div>
      )}
      <figcaption>
        <span>{block.altText || 'Imagen'}</span>
        <button type="button" onClick={onRemove}>
          Eliminar imagen
        </button>
      </figcaption>
    </figure>
  )
}

export function SermonEditorPage() {
  const { sermonId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const blockRefs = useRef(new Map<string, SermonRichTextFieldHandle>())
  const documentEditorRef = useRef<HTMLDivElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [activePoint, setActivePoint] = useState<{
    section: SermonSection
    blockId?: string
    offset?: number
    selectionStart?: number
    selectionEnd?: number
  }>({ section: 'outline' })
  const [toolPanelOpen, setToolPanelOpen] = useState(false)
  const [toolPlacement, setToolPlacement] =
    useState<SermonToolPlacement>(loadSermonToolPlacement)
  const toolPlacementRef = useRef(toolPlacement)
  const [toolViewport, setToolViewport] = useState(() => ({
    top: 0,
    height:
      typeof window === 'undefined'
        ? 800
        : window.visualViewport?.height ?? window.innerHeight,
  }))
  const toolDragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    moved: boolean
  } | undefined>(undefined)
  const [typingMarkOverrides, setTypingMarkOverrides] = useState<
    Partial<Record<SermonInlineMarkType, boolean>>
  >({})
  const [typingTextColor, setTypingTextColor] = useState<
    SermonInlineColor | null | undefined
  >()
  const [typingHighlight, setTypingHighlight] = useState<
    SermonInlineColor | null | undefined
  >()
  const [typingLinkHref, setTypingLinkHref] = useState<string | null>()
  const pendingFocusRef = useRef<{ blockId: string; offset: number } | undefined>(undefined)
  const [sermon, setSermon] = useState<SermonRecord>()
  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState<SermonBlockRecord[]>([])
  const blocksRef = useRef<SermonBlockRecord[]>([])
  const undoStackRef = useRef<SermonHistoryEntry[]>([])
  const redoStackRef = useRef<SermonHistoryEntry[]>([])
  const [historyVersion, setHistoryVersion] = useState(0)
  const [savedAt, setSavedAt] = useState<number>()
  const [dirty, setDirty] = useState(false)
  const dirtyBlockIdsRef = useRef<Set<string>>(new Set())
  const dirtyTitleRef = useRef(false)
  const editVersionRef = useRef(0)
  const [referencePreview, setReferencePreview] = useState<SermonBibleReference>()

  const detectedReferences = useMemo(
    () => detectSermonBlockReferences(blocks),
    [blocks],
  )

  const previewPassage = useMemo(
    () => (referencePreview ? getReferencePassage(referencePreview) : []),
    [referencePreview],
  )
  const canUndo = useMemo(
    () => undoStackRef.current.length > 0,
    [historyVersion],
  )
  const canRedo = useMemo(
    () => redoStackRef.current.length > 0,
    [historyVersion],
  )

  function sectionText(section: SermonSection) {
    return blocks
      .filter((block) => block.section === section)
      .sort((a, b) => a.order - b.order)
      .filter((block) => block.type !== 'image')
      .map((block) => block.text)
      .join('\n')
  }


  function replaceBlocks(next: SermonBlockRecord[]) {
    blocksRef.current = next
    setBlocks(next)
  }

  async function reloadBlocks() {
    const next = await getSermonBlocks(sermonId)
    replaceBlocks(next)
    return next
  }

  useEffect(() => {
    let cancelled = false

    void Promise.all([getSermon(sermonId), getSermonBlocks(sermonId)]).then(
      ([record, storedBlocks]) => {
        if (cancelled || !record) return
        setSermon(record)
        setTitle(record.title)
        replaceBlocks(storedBlocks)
        setSavedAt(record.updatedAt)

        const params = new URLSearchParams(location.search)
        const returnBlockId = params.get('returnBlock')
        const returnField = params.get('returnField') as SermonFieldName | null
        const returnAt = Number(params.get('returnAt'))

        if (returnBlockId && Number.isFinite(returnAt)) {
          pendingFocusRef.current = {
            blockId: returnBlockId,
            offset: returnAt,
          }
        } else if (returnField && Number.isFinite(returnAt)) {
          let remaining = Math.max(0, returnAt)
          const sectionBlocks = storedBlocks
            .filter((block) => block.section === returnField)
            .sort((a, b) => a.order - b.order)

          for (const block of sectionBlocks) {
            if (remaining <= block.text.length) {
              pendingFocusRef.current = {
                blockId: block.id,
                offset: remaining,
              }
              break
            }
            remaining -= block.text.length + 1
          }
        }

        if (pendingFocusRef.current) {
          navigate(`/predicas/${sermonId}`, { replace: true })
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [location.search, navigate, sermonId])

  useEffect(() => {
    const pending = pendingFocusRef.current
    if (!pending) return

    const frame = window.requestAnimationFrame(() => {
      const target = blockRefs.current.get(pending.blockId)
      if (!target) return
      target.focusAt(pending.offset)
      pendingFocusRef.current = undefined
    })

    return () => window.cancelAnimationFrame(frame)
  }, [blocks])

  useEffect(() => {
    if (!referencePreview) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [referencePreview])

  useEffect(() => {
    const visualViewport = window.visualViewport
    let frame = 0

    function updateToolViewport() {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        setToolViewport({
          top: visualViewport?.offsetTop ?? 0,
          height: visualViewport?.height ?? window.innerHeight,
        })
      })
    }

    updateToolViewport()
    visualViewport?.addEventListener('resize', updateToolViewport)
    visualViewport?.addEventListener('scroll', updateToolViewport)
    window.addEventListener('resize', updateToolViewport)
    window.addEventListener('orientationchange', updateToolViewport)

    return () => {
      window.cancelAnimationFrame(frame)
      visualViewport?.removeEventListener('resize', updateToolViewport)
      visualViewport?.removeEventListener('scroll', updateToolViewport)
      window.removeEventListener('resize', updateToolViewport)
      window.removeEventListener('orientationchange', updateToolViewport)
    }
  }, [])

  useEffect(() => {
    function warnUnsaved(event: BeforeUnloadEvent) {
      if (!dirty) return
      event.preventDefault()
    }

    window.addEventListener('beforeunload', warnUnsaved)
    return () => window.removeEventListener('beforeunload', warnUnsaved)
  }, [dirty])

  useEffect(() => {
    if (!dirty || !sermon) return

    const timer = window.setTimeout(() => {
      const blockIds = [...dirtyBlockIdsRef.current]
      const shouldSaveTitle = dirtyTitleRef.current
      const saveVersion = editVersionRef.current

      void (async () => {
        let latestSavedAt = 0

        if (shouldSaveTitle) {
          const savedTitle = await saveSermonTitle(sermonId, title)
          if (savedTitle) {
            latestSavedAt = Math.max(latestSavedAt, savedTitle.updatedAt)
            if (editVersionRef.current === saveVersion) {
              setTitle(savedTitle.title)
            }
          }
        }

        for (const blockId of blockIds) {
          const block = blocks.find((item) => item.id === blockId)
          if (!block) continue
          const savedBlock = await saveSermonBlockDraft(
            blockId,
            block.text,
            block.marks,
          )
          if (savedBlock) {
            latestSavedAt = Math.max(latestSavedAt, savedBlock.updatedAt)
          }
        }

        if (editVersionRef.current !== saveVersion) return

        dirtyBlockIdsRef.current.clear()
        dirtyTitleRef.current = false
        if (latestSavedAt > 0) setSavedAt(latestSavedAt)
        setDirty(false)
      })()
    }, 900)

    return () => window.clearTimeout(timer)
  }, [blocks, dirty, sermon, sermonId, title])

  function markTitleDirty(value: string) {
    setTitle(value)
    dirtyTitleRef.current = true
    editVersionRef.current += 1
    setDirty(true)
  }

  function getTextChangeRange(previousText: string, nextText: string) {
    let prefix = 0
    while (
      prefix < previousText.length &&
      prefix < nextText.length &&
      previousText[prefix] === nextText[prefix]
    ) {
      prefix += 1
    }

    let suffix = 0
    while (
      suffix < previousText.length - prefix &&
      suffix < nextText.length - prefix &&
      previousText[previousText.length - 1 - suffix] ===
        nextText[nextText.length - 1 - suffix]
    ) {
      suffix += 1
    }

    return {
      start: prefix,
      oldEnd: previousText.length - suffix,
      newEnd: nextText.length - suffix,
    }
  }

  function normalizeMarks(marks: SermonInlineMark[]) {
    const sorted = [...marks]
      .filter((mark) => mark.end > mark.start)
      .sort((a, b) => {
        const typeDifference = a.type.localeCompare(b.type)
        if (typeDifference !== 0) return typeDifference
        const hrefDifference = (a.href ?? '').localeCompare(b.href ?? '')
        if (hrefDifference !== 0) return hrefDifference
        const colorDifference = (a.color ?? '').localeCompare(b.color ?? '')
        if (colorDifference !== 0) return colorDifference
        return a.start - b.start || a.end - b.end
      })

    const normalized: SermonInlineMark[] = []
    for (const mark of sorted) {
      const previous = normalized.at(-1)
      if (
        previous &&
        previous.type === mark.type &&
        previous.href === mark.href &&
        previous.color === mark.color &&
        mark.start <= previous.end
      ) {
        previous.end = Math.max(previous.end, mark.end)
      } else {
        normalized.push({ ...mark })
      }
    }

    return normalized
  }

  function adjustMarksForTextChange(
    previousText: string,
    nextText: string,
    marks: SermonInlineMark[],
  ) {
    if (previousText === nextText || marks.length === 0) return marks

    const change = getTextChangeRange(previousText, nextText)
    const delta = change.newEnd - change.oldEnd

    return marks
      .map((mark) => {
        if (mark.end <= change.start) return mark
        if (mark.start >= change.oldEnd) {
          return {
            ...mark,
            start: Math.max(0, mark.start + delta),
            end: Math.max(0, mark.end + delta),
          }
        }

        return {
          ...mark,
          start: Math.min(mark.start, change.start),
          end: Math.max(change.start, mark.end + delta),
        }
      })
      .map((mark) => ({
        ...mark,
        start: Math.min(nextText.length, mark.start),
        end: Math.min(nextText.length, mark.end),
      }))
      .filter((mark) => mark.end > mark.start)
  }

  function replaceBlockLocal(block: SermonBlockRecord) {
    const next = blocksRef.current.map((item) =>
      item.id === block.id ? block : item,
    )
    blocksRef.current = next
    setBlocks(next)
  }

  function clearHistory() {
    undoStackRef.current = []
    redoStackRef.current = []
    setHistoryVersion((version) => version + 1)
  }

  function recordHistory(
    blockId: string,
    before: SermonBlockEditableState,
    after: SermonBlockEditableState,
    kind: SermonHistoryEntry['kind'],
  ) {
    if (sameEditableBlockState(before, after)) return

    const now = Date.now()
    const previous = undoStackRef.current.at(-1)

    if (
      kind === 'typing' &&
      previous?.kind === 'typing' &&
      previous.blockId === blockId &&
      now - previous.at <= 900
    ) {
      previous.after = after
      previous.at = now
    } else {
      undoStackRef.current.push({
        blockId,
        before,
        after,
        kind,
        at: now,
      })
      if (undoStackRef.current.length > 80) {
        undoStackRef.current.shift()
      }
    }

    redoStackRef.current = []
    setHistoryVersion((version) => version + 1)
  }

  function markBlockDirty(blockId: string, value: string) {
    const block = blocksRef.current.find((item) => item.id === blockId)
    if (!block) return

    const change = getTextChangeRange(block.text, value)
    let nextMarks = adjustMarksForTextChange(
      block.text,
      value,
      block.marks,
    )

    if (change.newEnd > change.start) {
      const inlineTypes: SermonInlineMarkType[] = [
        'bold',
        'italic',
        'underline',
        'strike',
      ]

      for (const type of inlineTypes) {
        const inherited = block.marks.some(
          (mark) =>
            mark.type === type &&
            mark.start <= change.start &&
            mark.end >= change.start,
        )
        const enabled = typingMarkOverrides[type] ?? inherited

        if (enabled) {
          nextMarks.push({
            type,
            start: change.start,
            end: change.newEnd,
          })
        } else {
          nextMarks = nextMarks.flatMap((mark) =>
            mark.type === type
              ? subtractMark(mark, change.start, change.newEnd)
              : [mark],
          )
        }
      }

      const inheritedTextColor = block.marks.find(
        (mark) =>
          mark.type === 'textColor' &&
          mark.start <= change.start &&
          mark.end >= change.start,
      )?.color
      const nextTextColor =
        typingTextColor === undefined
          ? inheritedTextColor
          : typingTextColor

      nextMarks = nextMarks.flatMap((mark) =>
        mark.type === 'textColor'
          ? subtractMark(mark, change.start, change.newEnd)
          : [mark],
      )
      if (nextTextColor) {
        nextMarks.push({
          type: 'textColor',
          color: nextTextColor,
          start: change.start,
          end: change.newEnd,
        })
      }

      const inheritedHighlight = block.marks.find(
        (mark) =>
          mark.type === 'highlight' &&
          mark.start <= change.start &&
          mark.end >= change.start,
      )?.color
      const nextHighlight =
        typingHighlight === undefined
          ? inheritedHighlight
          : typingHighlight

      nextMarks = nextMarks.flatMap((mark) =>
        mark.type === 'highlight'
          ? subtractMark(mark, change.start, change.newEnd)
          : [mark],
      )
      if (nextHighlight) {
        nextMarks.push({
          type: 'highlight',
          color: nextHighlight,
          start: change.start,
          end: change.newEnd,
        })
      }

      const inheritedHref = block.marks.find(
        (mark) =>
          mark.type === 'link' &&
          mark.start <= change.start &&
          mark.end >= change.start,
      )?.href
      const nextHref =
        typingLinkHref === undefined ? inheritedHref : typingLinkHref

      nextMarks = nextMarks.flatMap((mark) =>
        mark.type === 'link'
          ? subtractMark(mark, change.start, change.newEnd)
          : [mark],
      )
      if (nextHref) {
        nextMarks.push({
          type: 'link',
          href: nextHref,
          start: change.start,
          end: change.newEnd,
        })
      }
    }

    const nextBlock: SermonBlockRecord = {
      ...block,
      text: value,
      marks: normalizeMarks(nextMarks),
    }

    recordHistory(
      blockId,
      editableBlockState(block),
      editableBlockState(nextBlock),
      'typing',
    )
    replaceBlockLocal(nextBlock)
    dirtyBlockIdsRef.current.add(blockId)
    editVersionRef.current += 1
    setDirty(true)
  }

  async function flushDirtyBlocks() {
    const ids = [...dirtyBlockIdsRef.current]
    for (const blockId of ids) {
      const block = blocks.find((item) => item.id === blockId)
      if (block) {
        await saveSermonBlockDraft(blockId, block.text, block.marks)
      }
    }
    if (dirtyTitleRef.current) {
      await saveSermonTitle(sermonId, title)
    }
  }

  async function handleSave() {
    await flushDirtyBlocks()

    const saved = await saveSermon(sermonId, {
      title,
      introduction: sectionText('introduction'),
      outline: sectionText('outline'),
      conclusion: sectionText('conclusion'),
      references: toPersistedSermonReferences(detectedReferences),
    })
    if (!saved) return

    setSermon(saved)
    setTitle(saved.title)
    setSavedAt(saved.updatedAt)
    dirtyBlockIdsRef.current.clear()
    dirtyTitleRef.current = false
    editVersionRef.current += 1
    setDirty(false)
    return saved
  }

  async function handleSplit(block: SermonBlockRecord, offset: number) {
    const next = await splitSermonBlock(block.id, block.text, offset)
    if (!next) return
    dirtyBlockIdsRef.current.delete(block.id)
    pendingFocusRef.current = { blockId: next.id, offset: 0 }
    clearHistory()
    await reloadBlocks()
    setSavedAt(next.updatedAt)
    setDirty(dirtyTitleRef.current || dirtyBlockIdsRef.current.size > 0)
  }

  async function handleMerge(block: SermonBlockRecord) {
    const sectionBlocks = blocks
      .filter((item) => item.section === block.section)
      .sort((a, b) => a.order - b.order)
    const index = sectionBlocks.findIndex((item) => item.id === block.id)
    if (index <= 0) return

    const previous = sectionBlocks[index - 1]
    if (previous.type === 'image') return

    if (dirtyBlockIdsRef.current.has(previous.id)) {
      await saveSermonBlockDraft(previous.id, previous.text, previous.marks)
    }

    const merged = await mergeSermonBlockWithPrevious(block.id, block.text)
    if (!merged) return

    dirtyBlockIdsRef.current.delete(block.id)
    dirtyBlockIdsRef.current.delete(previous.id)
    pendingFocusRef.current = {
      blockId: merged.block.id,
      offset: merged.caretOffset,
    }
    clearHistory()
    await reloadBlocks()
    setSavedAt(merged.block.updatedAt)
    setDirty(dirtyTitleRef.current || dirtyBlockIdsRef.current.size > 0)
  }

  function getActiveTextBlock() {
    if (!activePoint.blockId) return undefined
    const block = blocksRef.current.find(
      (item) => item.id === activePoint.blockId,
    )
    return block?.type === 'image' ? undefined : block
  }

  function getActiveSelection(block: SermonBlockRecord) {
    const start = Math.max(
      0,
      Math.min(
        activePoint.selectionStart ?? activePoint.offset ?? 0,
        block.text.length,
      ),
    )
    const end = Math.max(
      start,
      Math.min(
        activePoint.selectionEnd ?? activePoint.offset ?? start,
        block.text.length,
      ),
    )
    return { start, end }
  }

  async function applyBlockFormatting(
    blockId: string,
    changes: Partial<
      Pick<
        SermonBlockRecord,
        'type' | 'marks' | 'indent' | 'checked' | 'headingLevel'
      >
    >,
  ) {
    const beforeBlock = blocksRef.current.find((item) => item.id === blockId)
    if (!beforeBlock) return

    const saved = await saveSermonBlockFormatting(blockId, changes)
    if (!saved) return

    recordHistory(
      blockId,
      editableBlockState(beforeBlock),
      editableBlockState(saved),
      'format',
    )
    replaceBlockLocal(saved)
    setSavedAt(saved.updatedAt)
  }

  function subtractMark(
    mark: SermonInlineMark,
    start: number,
    end: number,
  ): SermonInlineMark[] {
    if (mark.end <= start || mark.start >= end) return [mark]

    const fragments: SermonInlineMark[] = []
    if (mark.start < start) fragments.push({ ...mark, end: start })
    if (mark.end > end) fragments.push({ ...mark, start: end })
    return fragments
  }

  function isInlineMarkActive(type: SermonInlineMarkType) {
    const block = getActiveTextBlock()
    if (!block) return Boolean(typingMarkOverrides[type])

    const start = Math.max(
      0,
      Math.min(
        activePoint.selectionStart ?? activePoint.offset ?? 0,
        block.text.length,
      ),
    )
    const end = Math.max(
      start,
      Math.min(
        activePoint.selectionEnd ?? activePoint.offset ?? start,
        block.text.length,
      ),
    )

    if (end > start) {
      return block.marks.some(
        (mark) => mark.type === type && mark.start <= start && mark.end >= end,
      )
    }

    if (typingMarkOverrides[type] !== undefined) {
      return Boolean(typingMarkOverrides[type])
    }

    return block.marks.some(
      (mark) =>
        mark.type === type &&
        mark.start <= start &&
        mark.end >= start &&
        mark.end > mark.start,
    )
  }

  async function toggleInlineMark(type: SermonInlineMarkType) {
    const block = getActiveTextBlock()
    if (!block) return

    const start = Math.max(
      0,
      Math.min(
        activePoint.selectionStart ?? activePoint.offset ?? 0,
        block.text.length,
      ),
    )
    const end = Math.max(
      start,
      Math.min(
        activePoint.selectionEnd ?? activePoint.offset ?? start,
        block.text.length,
      ),
    )

    if (end <= start) {
      const nextEnabled = !isInlineMarkActive(type)
      setTypingMarkOverrides((current) => ({
        ...current,
        [type]: nextEnabled,
      }))
      pendingFocusRef.current = { blockId: block.id, offset: start }
      return
    }

    const covered = block.marks.some(
      (mark) => mark.type === type && mark.start <= start && mark.end >= end,
    )

    const nextMarks = covered
      ? block.marks.flatMap((mark) =>
          mark.type === type ? subtractMark(mark, start, end) : [mark],
        )
      : [...block.marks, { type, start, end }]

    await applyBlockFormatting(block.id, {
      marks: normalizeMarks(nextMarks),
    })
    setTypingMarkOverrides((current) => ({
      ...current,
      [type]: !covered,
    }))
    pendingFocusRef.current = { blockId: block.id, offset: end }
  }

  function activeColorFor(
    type: 'textColor' | 'highlight',
  ): SermonInlineColor | undefined {
    const block = getActiveTextBlock()
    if (!block) {
      return type === 'textColor'
        ? typingTextColor ?? undefined
        : typingHighlight ?? undefined
    }

    const { start, end } = getActiveSelection(block)
    const typingValue =
      type === 'textColor' ? typingTextColor : typingHighlight

    if (end === start && typingValue !== undefined) {
      return typingValue ?? undefined
    }

    return block.marks.find(
      (mark) =>
        mark.type === type &&
        mark.start <= start &&
        mark.end >= (end > start ? end : start),
    )?.color
  }

  async function applyColorMark(
    type: 'textColor' | 'highlight',
    color: SermonInlineColor | null,
  ) {
    const block = getActiveTextBlock()
    if (!block) return
    const { start, end } = getActiveSelection(block)

    if (type === 'textColor') {
      setTypingTextColor(color)
    } else {
      setTypingHighlight(color)
    }

    if (end <= start) {
      pendingFocusRef.current = { blockId: block.id, offset: start }
      return
    }

    let nextMarks = block.marks.flatMap((mark) =>
      mark.type === type ? subtractMark(mark, start, end) : [mark],
    )
    if (color) {
      nextMarks = [
        ...nextMarks,
        {
          type,
          color,
          start,
          end,
        },
      ]
    }

    await applyBlockFormatting(block.id, {
      marks: normalizeMarks(nextMarks),
    })
    pendingFocusRef.current = { blockId: block.id, offset: end }
  }

  function activeLinkHref() {
    const block = getActiveTextBlock()
    if (!block) return typingLinkHref ?? undefined

    const { start, end } = getActiveSelection(block)
    if (end === start && typingLinkHref !== undefined) {
      return typingLinkHref ?? undefined
    }

    return block.marks.find(
      (mark) =>
        mark.type === 'link' &&
        mark.start <= start &&
        mark.end >= (end > start ? end : start),
    )?.href
  }

  function normalizeLinkHref(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed
    return `https://${trimmed}`
  }

  async function toggleLinkMark() {
    const block = getActiveTextBlock()
    if (!block) return
    const { start, end } = getActiveSelection(block)
    const currentHref = activeLinkHref()

    if (currentHref) {
      setTypingLinkHref(null)
      if (end > start) {
        const nextMarks = block.marks.flatMap((mark) =>
          mark.type === 'link' ? subtractMark(mark, start, end) : [mark],
        )
        await applyBlockFormatting(block.id, {
          marks: normalizeMarks(nextMarks),
        })
      }
      pendingFocusRef.current = {
        blockId: block.id,
        offset: end > start ? end : start,
      }
      return
    }

    const rawHref = window.prompt('Enlace', 'https://')
    if (rawHref === null) return
    const href = normalizeLinkHref(rawHref)
    if (!href) return

    setTypingLinkHref(href)

    if (end > start) {
      const withoutLinks = block.marks.flatMap((mark) =>
        mark.type === 'link' ? subtractMark(mark, start, end) : [mark],
      )
      await applyBlockFormatting(block.id, {
        marks: normalizeMarks([
          ...withoutLinks,
          { type: 'link', href, start, end },
        ]),
      })
    }

    pendingFocusRef.current = {
      blockId: block.id,
      offset: end > start ? end : start,
    }
  }

  async function restoreHistoryEntry(
    entry: SermonHistoryEntry,
    state: SermonBlockEditableState,
  ) {
    const saved = await saveSermonBlockState(entry.blockId, state)
    if (!saved) return false

    replaceBlockLocal(saved)
    dirtyBlockIdsRef.current.delete(entry.blockId)
    setSavedAt(saved.updatedAt)
    setDirty(dirtyTitleRef.current || dirtyBlockIdsRef.current.size > 0)

    const currentOffset =
      activePoint.blockId === entry.blockId
        ? activePoint.offset ?? state.text.length
        : state.text.length
    pendingFocusRef.current = {
      blockId: entry.blockId,
      offset: Math.min(currentOffset, state.text.length),
    }
    return true
  }

  async function undoHistory() {
    const entry = undoStackRef.current.pop()
    if (!entry) return

    const restored = await restoreHistoryEntry(entry, entry.before)
    if (!restored) {
      undoStackRef.current.push(entry)
      return
    }

    redoStackRef.current.push(entry)
    setHistoryVersion((version) => version + 1)
  }

  async function redoHistory() {
    const entry = redoStackRef.current.pop()
    if (!entry) return

    const restored = await restoreHistoryEntry(entry, entry.after)
    if (!restored) {
      redoStackRef.current.push(entry)
      return
    }

    undoStackRef.current.push(entry)
    setHistoryVersion((version) => version + 1)
  }

  function isActiveBlockType(
    type: SermonBlockType,
    headingLevel?: 1 | 2,
  ) {
    const block = getActiveTextBlock()
    if (!block) return false
    if (block.type !== type) return false
    if (type !== 'heading') return true
    return (block.headingLevel ?? 1) === (headingLevel ?? 1)
  }

  async function setActiveBlockType(
    type: SermonBlockType,
    headingLevel?: 1 | 2,
  ) {
    const block = getActiveTextBlock()
    if (!block) return

    const toggleToParagraph =
      type !== 'paragraph' && isActiveBlockType(type, headingLevel)
    const nextType: SermonBlockType = toggleToParagraph ? 'paragraph' : type

    await applyBlockFormatting(block.id, {
      type: nextType,
      headingLevel:
        nextType === 'heading' ? headingLevel ?? 1 : undefined,
      checked:
        nextType === 'task'
          ? block.checked ?? false
          : undefined,
    })
  }

  async function changeActiveIndent(delta: number) {
    const block = getActiveTextBlock()
    if (!block) return
    await applyBlockFormatting(block.id, {
      indent: Math.max(0, Math.min(4, block.indent + delta)),
    })
  }

  async function toggleTaskChecked(block: SermonBlockRecord) {
    await applyBlockFormatting(block.id, { checked: !block.checked })
  }

  function runToolAction(action: () => void | Promise<void>) {
    setToolPanelOpen(false)
    void action()
  }

  function persistToolPlacement(placement: SermonToolPlacement) {
    try {
      window.localStorage.setItem(
        SERMON_TOOL_PLACEMENT_KEY,
        JSON.stringify(placement),
      )
    } catch {
      // The tool tab still works when storage is unavailable.
    }
  }

  function handleToolTabPointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    toolDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    }
  }

  function handleToolTabPointerMove(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    const drag = toolDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const distance = Math.hypot(
      event.clientX - drag.startX,
      event.clientY - drag.startY,
    )
    if (distance > 7) {
      drag.moved = true
      setToolPanelOpen(false)
    }
    if (!drag.moved) return

    const visualViewport = window.visualViewport
    const viewportLeft = visualViewport?.offsetLeft ?? 0
    const viewportTop = visualViewport?.offsetTop ?? 0
    const viewportWidth = visualViewport?.width ?? window.innerWidth
    const viewportHeight = visualViewport?.height ?? window.innerHeight
    const side: SermonToolSide =
      event.clientX < viewportLeft + viewportWidth / 2 ? 'left' : 'right'
    const topRatio = Math.max(
      0.12,
      Math.min(0.88, (event.clientY - viewportTop) / viewportHeight),
    )

    const nextPlacement = { side, topRatio }
    toolPlacementRef.current = nextPlacement
    setToolPlacement(nextPlacement)
  }

  function handleToolTabPointerUp(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    const drag = toolDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (drag.moved) {
      persistToolPlacement(toolPlacementRef.current)
    } else {
      setToolPanelOpen((current) => !current)
    }

    toolDragRef.current = undefined
  }

  async function handleImageSelected(files?: FileList | null) {
    if (!files || files.length === 0) return

    const activeBlock = activePoint.blockId
      ? blocks.find((block) => block.id === activePoint.blockId)
      : undefined
    let insertAfterId = activeBlock?.id
    let paragraphAfterImages: SermonBlockRecord | undefined
    let latestUpdatedAt = 0

    if (activeBlock && activeBlock.type !== 'image') {
      const offset = Math.max(
        0,
        Math.min(activePoint.offset ?? activeBlock.text.length, activeBlock.text.length),
      )
      const split = await splitSermonBlock(activeBlock.id, activeBlock.text, offset)
      if (split) {
        dirtyBlockIdsRef.current.delete(activeBlock.id)
        paragraphAfterImages = split
        insertAfterId = activeBlock.id
        latestUpdatedAt = Math.max(latestUpdatedAt, split.updatedAt)
      }
    }

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const inserted = await insertSermonImageBlock(
        sermonId,
        activePoint.section,
        file,
        insertAfterId,
      )
      if (!inserted) continue
      insertAfterId = inserted.id
      latestUpdatedAt = Math.max(latestUpdatedAt, inserted.updatedAt)
    }

    clearHistory()
    let nextBlocks = await reloadBlocks()

    if (!paragraphAfterImages) {
      const sectionBlocks = nextBlocks
        .filter((block) => block.section === activePoint.section)
        .sort((a, b) => a.order - b.order)
      const imageIndex = insertAfterId
        ? sectionBlocks.findIndex((block) => block.id === insertAfterId)
        : -1
      paragraphAfterImages =
        imageIndex >= 0
          ? sectionBlocks.slice(imageIndex + 1).find((block) => block.type !== 'image')
          : undefined

      if (!paragraphAfterImages) {
        paragraphAfterImages = await appendSermonBlock(
          sermonId,
          activePoint.section,
        )
        if (paragraphAfterImages) {
          latestUpdatedAt = Math.max(
            latestUpdatedAt,
            paragraphAfterImages.updatedAt,
          )
          nextBlocks = await reloadBlocks()
        }
      }
    }

    if (paragraphAfterImages) {
      pendingFocusRef.current = {
        blockId: paragraphAfterImages.id,
        offset: 0,
      }
      setActivePoint({
        section: paragraphAfterImages.section,
        blockId: paragraphAfterImages.id,
        offset: 0,
      })
      setBlocks(nextBlocks)
    }

    if (latestUpdatedAt > 0) setSavedAt(latestUpdatedAt)
    setDirty(dirtyTitleRef.current || dirtyBlockIdsRef.current.size > 0)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  async function handleRemoveImage(block: SermonBlockRecord) {
    const removed = await removeSermonImageBlock(block.id)
    if (!removed) return
    clearHistory()
    await reloadBlocks()
    if (activePoint.blockId === block.id) {
      setActivePoint({ section: block.section })
    }
  }

  async function startPresentation() {
    const saved = await handleSave()
    if (!saved) return
    navigate(`/predicas/${sermonId}/presentar`)
  }

  async function openReferenceInBible(reference: SermonBibleReference) {
    const saved = await handleSave()
    if (!saved) return

    window.sessionStorage.setItem(
      'biblia-sermon-return-v1',
      JSON.stringify({
        sermonId,
        field: reference.field,
        blockId: reference.blockId,
        startIndex: reference.startIndex,
        mode: 'editor',
      }),
    )

    const anchor = `verse-${reference.bookId}-${reference.chapter}-${reference.verseStart}`
    navigate(
      `/biblia/${reference.bookId}/${reference.chapter}?fromSermon=1#${anchor}`,
    )
  }

  function elementFromNode(node: Node | null) {
    if (!node) return null
    return node instanceof Element ? node : node.parentElement
  }

  function textBlockFromNode(node: Node | null) {
    const row = elementFromNode(node)?.closest<HTMLElement>(
      '[data-sermon-block-id]',
    )
    const blockId = row?.dataset.sermonBlockId
    if (!row || !blockId) return undefined

    const block = blocksRef.current.find((item) => item.id === blockId)
    const editor = row.querySelector<HTMLElement>('.sermon-block-editor')
    if (!block || block.type === 'image' || !editor) return undefined

    return { block, editor }
  }

  function offsetInsideEditor(
    editor: HTMLElement,
    container: Node,
    offset: number,
    fallback: number,
  ) {
    if (container !== editor && !editor.contains(container)) return fallback

    try {
      const range = document.createRange()
      range.selectNodeContents(editor)
      range.setEnd(container, offset)
      return Math.max(
        0,
        Math.min(range.toString().length, editor.textContent?.length ?? 0),
      )
    } catch {
      return fallback
    }
  }

  function selectedTextBlocks(range: Range) {
    const root = documentEditorRef.current
    if (!root) return []

    return [...root.querySelectorAll<HTMLElement>('.sermon-block-editor')]
      .filter((editor) => {
        try {
          return range.intersectsNode(editor)
        } catch {
          return false
        }
      })
      .map((editor) => {
        const row = editor.closest<HTMLElement>('[data-sermon-block-id]')
        const blockId = row?.dataset.sermonBlockId
        const block = blockId
          ? blocksRef.current.find((item) => item.id === blockId)
          : undefined
        return block && block.type !== 'image'
          ? { block, editor }
          : undefined
      })
      .filter(
        (
          item,
        ): item is {
          block: SermonBlockRecord
          editor: HTMLElement
        } => Boolean(item),
      )
  }

  function reportDocumentSelection() {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const startInfo = textBlockFromNode(range.startContainer)
    const endInfo = textBlockFromNode(range.endContainer)
    const focusInfo = textBlockFromNode(selection.focusNode)

    if (
      startInfo &&
      endInfo &&
      startInfo.block.id === endInfo.block.id
    ) {
      const start = offsetInsideEditor(
        startInfo.editor,
        range.startContainer,
        range.startOffset,
        0,
      )
      const end = offsetInsideEditor(
        endInfo.editor,
        range.endContainer,
        range.endOffset,
        endInfo.block.text.length,
      )

      setActivePoint({
        section: startInfo.block.section,
        blockId: startInfo.block.id,
        offset: end,
        selectionStart: start,
        selectionEnd: end,
      })
      return
    }

    if (focusInfo && selection.focusNode) {
      const offset = offsetInsideEditor(
        focusInfo.editor,
        selection.focusNode,
        selection.focusOffset,
        focusInfo.block.text.length,
      )
      setActivePoint({
        section: focusInfo.block.section,
        blockId: focusInfo.block.id,
        offset,
        selectionStart: offset,
        selectionEnd: offset,
      })
    }
  }

  function syncDocumentInput() {
    const root = documentEditorRef.current
    if (!root) return

    const changed = [...root.querySelectorAll<HTMLElement>('.sermon-block-editor')]
      .map((editor) => {
        const row = editor.closest<HTMLElement>('[data-sermon-block-id]')
        const blockId = row?.dataset.sermonBlockId
        const block = blockId
          ? blocksRef.current.find((item) => item.id === blockId)
          : undefined
        if (!block || block.type === 'image') return undefined

        const text = editor.textContent ?? ''
        return text !== block.text ? { blockId: block.id, text } : undefined
      })
      .filter(
        (item): item is { blockId: string; text: string } => Boolean(item),
      )

    for (const item of changed) {
      markBlockDirty(item.blockId, item.text)
    }
    reportDocumentSelection()
  }

  async function collapseSelectedRuns(selectedIds: Set<string>) {
    const stored = await getSermonBlocks(sermonId)

    for (const section of ['introduction', 'outline', 'conclusion'] as SermonSection[]) {
      const sectionBlocks = stored
        .filter((block) => block.section === section)
        .sort((a, b) => a.order - b.order)

      let run: SermonBlockRecord[] = []

      async function collapseRun() {
        if (run.length <= 1) {
          run = []
          return
        }

        for (let index = 1; index < run.length; index += 1) {
          const current = run[index]
          await mergeSermonBlockWithPrevious(current.id, current.text)
        }
        run = []
      }

      for (const block of sectionBlocks) {
        if (block.type !== 'image' && selectedIds.has(block.id)) {
          run.push(block)
        } else {
          await collapseRun()
        }
      }
      await collapseRun()
    }
  }

  async function deleteDocumentSelection() {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return undefined
    }

    const range = selection.getRangeAt(0)
    const entries = selectedTextBlocks(range)
    if (entries.length === 0) return undefined

    const selectedIds = new Set(entries.map(({ block }) => block.id))
    const first = entries[0]
    const last = entries.at(-1) ?? first
    let focusOffset = 0
    let latestUpdatedAt = 0

    for (const { block, editor } of entries) {
      const start =
        block.id === first.block.id
          ? offsetInsideEditor(
              editor,
              range.startContainer,
              range.startOffset,
              0,
            )
          : 0
      const end =
        block.id === last.block.id
          ? offsetInsideEditor(
              editor,
              range.endContainer,
              range.endOffset,
              block.text.length,
            )
          : block.text.length
      const safeStart = Math.max(0, Math.min(start, block.text.length))
      const safeEnd = Math.max(
        safeStart,
        Math.min(end, block.text.length),
      )
      const nextText =
        block.text.slice(0, safeStart) + block.text.slice(safeEnd)
      const nextMarks = adjustMarksForTextChange(
        block.text,
        nextText,
        block.marks,
      )
      const saved = await saveSermonBlockDraft(
        block.id,
        nextText,
        nextMarks,
      )
      if (saved) {
        latestUpdatedAt = Math.max(latestUpdatedAt, saved.updatedAt)
      }

      if (block.id === first.block.id) {
        focusOffset = safeStart
      }
      dirtyBlockIdsRef.current.delete(block.id)
    }

    clearHistory()
    await collapseSelectedRuns(selectedIds)
    const nextBlocks = await reloadBlocks()
    const focusBlock =
      nextBlocks.find((block) => block.id === first.block.id) ??
      nextBlocks.find(
        (block) =>
          block.section === first.block.section && block.type !== 'image',
      )

    if (focusBlock) {
      const offset = Math.min(focusOffset, focusBlock.text.length)
      setActivePoint({
        section: focusBlock.section,
        blockId: focusBlock.id,
        offset,
        selectionStart: offset,
        selectionEnd: offset,
      })
      pendingFocusRef.current = {
        blockId: focusBlock.id,
        offset,
      }
    }

    if (latestUpdatedAt > 0) setSavedAt(latestUpdatedAt)
    setDirty(dirtyTitleRef.current || dirtyBlockIdsRef.current.size > 0)

    return focusBlock
      ? {
          blockId: focusBlock.id,
          offset: Math.min(focusOffset, focusBlock.text.length),
        }
      : undefined
  }

  function handleDocumentInput(_event: ReactFormEvent<HTMLDivElement>) {
    syncDocumentInput()
  }

  function handleDocumentBeforeInput(
    event: ReactFormEvent<HTMLDivElement>,
  ) {
    const nativeEvent = event.nativeEvent as InputEvent
    const inputType = nativeEvent.inputType
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const entries = selectedTextBlocks(range)
    const startInfo = textBlockFromNode(range.startContainer)
    const endInfo = textBlockFromNode(range.endContainer)
    const spansStructuredContent =
      entries.length > 1 ||
      !startInfo ||
      !endInfo ||
      startInfo.block.id !== endInfo.block.id

    if (
      !selection.isCollapsed &&
      spansStructuredContent &&
      (inputType.startsWith('delete') || inputType === 'historyUndo')
    ) {
      event.preventDefault()
      void deleteDocumentSelection()
      return
    }

    if (
      selection.isCollapsed &&
      (inputType === 'insertParagraph' || inputType === 'insertLineBreak')
    ) {
      const info = textBlockFromNode(selection.focusNode)
      if (!info || !selection.focusNode) return

      const offset = offsetInsideEditor(
        info.editor,
        selection.focusNode,
        selection.focusOffset,
        info.block.text.length,
      )
      event.preventDefault()
      void handleSplit(info.block, offset)
    }
  }

  function handleDocumentKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.defaultPrevented) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const modifier = event.ctrlKey || event.metaKey
    if (modifier && event.key.toLowerCase() === 'z') {
      event.preventDefault()
      if (event.shiftKey) {
        void redoHistory()
      } else {
        void undoHistory()
      }
      return
    }

    if (modifier && event.key.toLowerCase() === 'y') {
      event.preventDefault()
      void redoHistory()
      return
    }

    const range = selection.getRangeAt(0)
    const entries = selectedTextBlocks(range)

    if (
      !selection.isCollapsed &&
      entries.length > 1 &&
      (event.key === 'Backspace' || event.key === 'Delete')
    ) {
      event.preventDefault()
      void deleteDocumentSelection()
      return
    }

    const info = textBlockFromNode(selection.focusNode)
    if (!info || !selection.focusNode) return

    const offset = offsetInsideEditor(
      info.editor,
      selection.focusNode,
      selection.focusOffset,
      info.block.text.length,
    )

    if (event.key === 'Enter' && selection.isCollapsed) {
      event.preventDefault()
      void handleSplit(info.block, offset)
      return
    }

    if (
      event.key === 'Backspace' &&
      selection.isCollapsed &&
      offset === 0
    ) {
      event.preventDefault()
      void handleMerge(info.block)
    }
  }

  function handleDocumentPaste(
    event: ReactClipboardEvent<HTMLDivElement>,
  ) {
    const text = event.clipboardData.getData('text/plain')
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const entries = selectedTextBlocks(range)
    if (entries.length === 0) return

    event.preventDefault()

    void (async () => {
      let block = entries[0].block
      let start = offsetInsideEditor(
        entries[0].editor,
        range.startContainer,
        range.startOffset,
        0,
      )
      let end =
        entries.length === 1
          ? offsetInsideEditor(
              entries[0].editor,
              range.endContainer,
              range.endOffset,
              block.text.length,
            )
          : start

      if (entries.length > 1) {
        const target = await deleteDocumentSelection()
        if (!target) return
        const updated = blocksRef.current.find(
          (item) => item.id === target.blockId,
        )
        if (!updated || updated.type === 'image') return
        block = updated
        start = target.offset
        end = target.offset
      }

      const safeStart = Math.max(0, Math.min(start, block.text.length))
      const safeEnd = Math.max(
        safeStart,
        Math.min(end, block.text.length),
      )
      const nextText =
        block.text.slice(0, safeStart) +
        text +
        block.text.slice(safeEnd)

      markBlockDirty(block.id, nextText)
      const nextOffset = safeStart + text.length
      setActivePoint({
        section: block.section,
        blockId: block.id,
        offset: nextOffset,
        selectionStart: nextOffset,
        selectionEnd: nextOffset,
      })
      pendingFocusRef.current = {
        blockId: block.id,
        offset: nextOffset,
      }
    })()
  }

  function renderSection(
    section: SermonSection,
    label: string,
    placeholder: string,
  ) {
    const sectionBlocks = blocks
      .filter((block) => block.section === section)
      .sort((a, b) => a.order - b.order)

    return (
      <section
        className="sermon-block-section"
        aria-labelledby={`sermon-section-${section}`}
      >
        <header
          className="sermon-block-section-header"
          contentEditable={false}
        >
          <h2 id={`sermon-section-${section}`}>{label}</h2>
        </header>

        <div className="sermon-block-list">
          {sectionBlocks.map((block, index) =>
            block.type === 'image' ? (
              <SermonImageBlock
                key={block.id}
                block={block}
                onActivate={() =>
                  setActivePoint({
                    section: block.section,
                    blockId: block.id,
                  })
                }
                onRemove={() => void handleRemoveImage(block)}
              />
            ) : (
              <div
                className="sermon-block-row"
                data-sermon-block-id={block.id}
                key={block.id}
                style={{
                  paddingInlineStart: block.indent > 0 ? `${block.indent * 1.1}rem` : undefined,
                }}
              >
                {block.type === 'bullet' ? (
                  <span
                    className="sermon-block-prefix"
                    contentEditable={false}
                    aria-hidden="true"
                  >
                    •
                  </span>
                ) : null}
                {block.type === 'numbered' ? (
                  <span
                    className="sermon-block-prefix"
                    contentEditable={false}
                    aria-hidden="true"
                  >
                    {sectionBlocks.slice(0, index + 1).filter((item) => item.type === 'numbered').length}.
                  </span>
                ) : null}
                {block.type === 'task' ? (
                  <input
                    className="sermon-task-checkbox"
                    contentEditable={false}
                    type="checkbox"
                    checked={Boolean(block.checked)}
                    aria-label={`Marcar tarea ${index + 1}`}
                    onChange={() => void toggleTaskChecked(block)}
                  />
                ) : null}
                <SermonRichTextField
                  ref={(handle) => {
                    if (handle) blockRefs.current.set(block.id, handle)
                    else blockRefs.current.delete(block.id)
                  }}
                  className={`sermon-block-editor sermon-block-editor-${block.type}${block.type === 'heading' ? ` heading-${block.headingLevel ?? 1}` : ''}`}
                  value={block.text}
                  marks={block.marks}
                  references={detectedReferences.filter(
                    (reference) => reference.blockId === block.id,
                  )}
                  onChange={(value) => markBlockDirty(block.id, value)}
                  onReferenceOpen={setReferencePreview}
                  onFocus={() =>
                    setActivePoint((current) => ({
                      section: block.section,
                      blockId: block.id,
                      offset:
                        current.blockId === block.id
                          ? current.offset
                          : block.text.length,
                    }))
                  }
                  onCaretChange={(offset) =>
                    setActivePoint((current) => ({
                      ...current,
                      section: block.section,
                      blockId: block.id,
                      offset,
                    }))
                  }
                  onSelectionChange={(start, end) =>
                    setActivePoint((current) => ({
                      ...current,
                      section: block.section,
                      blockId: block.id,
                      offset: end,
                      selectionStart: start,
                      selectionEnd: end,
                    }))
                  }
                  onSplit={(offset) => void handleSplit(block, offset)}
                  onMergeBackward={() => void handleMerge(block)}
                  placeholder={index === 0 ? placeholder : ''}
                  ariaLabel={`${label}, párrafo ${index + 1}`}
                />
              </div>
            ),
          )}
        </div>
      </section>
    )
  }

  if (!sermon) {
    return (
      <section className="sermon-editor-page">
        <div className="sermons-empty glass-panel">
          <strong>Prédica no encontrada.</strong>
          <Link className="button primary" to="/predicas">
            Volver a Mis prédicas
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="sermon-editor-page">
      <header className="sermon-editor-toolbar glass-panel">
        <button
          className="button secondary"
          type="button"
          onClick={() => navigate('/predicas')}
        >
          ← Mis prédicas
        </button>
        <div className="sermon-save-state">
          <span>{dirty ? 'Guardando...' : 'Guardado'}</span>
          {savedAt ? <small>{formatUpdatedAt(savedAt)}</small> : null}
        </div>
        <div className="sermon-toolbar-actions">
          <button
            className="button secondary"
            type="button"
            onClick={() => void startPresentation()}
          >
            Predicar
          </button>
          <button
            className="button primary"
            type="button"
            onClick={() => void handleSave()}
          >
            Guardar
          </button>
        </div>
      </header>

      <form
        className="sermon-editor-sheet"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="sermon-field sermon-title-field">
          <span>Título</span>
          <input
            value={title}
            onChange={(event) => markTitleDirty(event.target.value)}
            placeholder="Título de la prédica"
          />
        </label>

        <div
          ref={documentEditorRef}
          className="sermon-document-editor"
          data-sermon-document-editor
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Contenido de la prédica"
          aria-multiline="true"
          spellCheck
          onBeforeInput={handleDocumentBeforeInput}
          onInput={handleDocumentInput}
          onKeyDown={handleDocumentKeyDown}
          onKeyUp={reportDocumentSelection}
          onPointerUp={reportDocumentSelection}
          onSelect={reportDocumentSelection}
          onPaste={handleDocumentPaste}
        >
          {renderSection(
            'introduction',
            'Introducción',
            'Idea de apertura, contexto o propósito...',
          )}

          {renderSection(
            'outline',
            'Bosquejo y puntos',
            'Punto principal, desarrollo o aplicación...',
          )}

          {renderSection(
            'conclusion',
            'Conclusión',
            'Cierre, llamado o idea final...',
          )}
        </div>

        {toolPanelOpen ? (
          <button
            className="sermon-side-tool-backdrop"
            type="button"
            aria-label="Cerrar herramientas"
            onClick={() => setToolPanelOpen(false)}
          />
        ) : null}

        <div
          className={`sermon-side-tools sermon-side-tools-${toolPlacement.side}`}
          style={{
            top: Math.max(
              toolViewport.top + 66,
              Math.min(
                toolViewport.top + toolViewport.height - 66,
                toolViewport.top + toolViewport.height * toolPlacement.topRatio,
              ),
            ),
          }}
        >
          {toolPanelOpen ? (
            <div
              className="sermon-side-tool-panel"
              role="dialog"
              aria-label="Herramientas de edición"
            >
              <div className="sermon-side-tool-group">
                <span>Historial</span>
                <div>
                  <button
                    type="button"
                    disabled={!canUndo}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => runToolAction(undoHistory)}
                  >
                    ↶ Deshacer
                  </button>
                  <button
                    type="button"
                    disabled={!canRedo}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => runToolAction(redoHistory)}
                  >
                    ↷ Rehacer
                  </button>
                </div>
              </div>

              <div className="sermon-side-tool-group">
                <span>Texto</span>
                <div>
                  <button
                    type="button"
                    className={isActiveBlockType('paragraph') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('paragraph')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => setActiveBlockType('paragraph'))
                    }
                  >
                    Texto
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('heading', 1) ? 'active' : ''}
                    aria-pressed={isActiveBlockType('heading', 1)}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => setActiveBlockType('heading', 1))
                    }
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('heading', 2) ? 'active' : ''}
                    aria-pressed={isActiveBlockType('heading', 2)}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => setActiveBlockType('heading', 2))
                    }
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('quote') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('quote')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => setActiveBlockType('quote'))
                    }
                  >
                    Cita
                  </button>
                </div>
              </div>

              <div className="sermon-side-tool-group">
                <span>Formato</span>
                <div>
                  <button
                    type="button"
                    className={isInlineMarkActive('bold') ? 'active' : ''}
                    aria-pressed={isInlineMarkActive('bold')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => toggleInlineMark('bold'))
                    }
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    className={isInlineMarkActive('italic') ? 'active' : ''}
                    aria-pressed={isInlineMarkActive('italic')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => toggleInlineMark('italic'))
                    }
                  >
                    <span className="sermon-toolbar-italic">I</span>
                  </button>
                  <button
                    type="button"
                    className={isInlineMarkActive('underline') ? 'active' : ''}
                    aria-pressed={isInlineMarkActive('underline')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => toggleInlineMark('underline'))
                    }
                  >
                    <u>U</u>
                  </button>
                  <button
                    type="button"
                    className={isInlineMarkActive('strike') ? 'active' : ''}
                    aria-pressed={isInlineMarkActive('strike')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => toggleInlineMark('strike'))
                    }
                  >
                    <s>S</s>
                  </button>
                  <button
                    type="button"
                    className={activeLinkHref() ? 'active' : ''}
                    aria-pressed={Boolean(activeLinkHref())}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => runToolAction(toggleLinkMark)}
                  >
                    Enlace
                  </button>
                </div>
              </div>

              <div className="sermon-side-tool-group">
                <span>Color de texto</span>
                <div className="sermon-color-options">
                  <button
                    type="button"
                    className={!activeColorFor('textColor') ? 'active' : ''}
                    aria-pressed={!activeColorFor('textColor')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => applyColorMark('textColor', null))
                    }
                  >
                    Normal
                  </button>
                  {SERMON_TEXT_COLORS.map((color) => (
                    <button
                      type="button"
                      className={
                        activeColorFor('textColor') === color ? 'active' : ''
                      }
                      aria-label={`Color de texto ${color}`}
                      aria-pressed={activeColorFor('textColor') === color}
                      key={`text-${color}`}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() =>
                        runToolAction(() =>
                          applyColorMark('textColor', color),
                        )
                      }
                    >
                      <span
                        className={`sermon-color-swatch sermon-color-swatch-${color}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="sermon-side-tool-group">
                <span>Resaltado</span>
                <div className="sermon-color-options">
                  <button
                    type="button"
                    className={!activeColorFor('highlight') ? 'active' : ''}
                    aria-pressed={!activeColorFor('highlight')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => applyColorMark('highlight', null))
                    }
                  >
                    Sin
                  </button>
                  {SERMON_HIGHLIGHT_COLORS.map((color) => (
                    <button
                      type="button"
                      className={
                        activeColorFor('highlight') === color ? 'active' : ''
                      }
                      aria-label={`Resaltado ${color}`}
                      aria-pressed={activeColorFor('highlight') === color}
                      key={`highlight-${color}`}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() =>
                        runToolAction(() =>
                          applyColorMark('highlight', color),
                        )
                      }
                    >
                      <span
                        className={`sermon-highlight-swatch sermon-highlight-swatch-${color}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="sermon-side-tool-group">
                <span>Listas y sangría</span>
                <div>
                  <button
                    type="button"
                    className={isActiveBlockType('bullet') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('bullet')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => setActiveBlockType('bullet'))
                    }
                  >
                    •
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('numbered') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('numbered')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => setActiveBlockType('numbered'))
                    }
                  >
                    1.
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('task') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('task')}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => setActiveBlockType('task'))
                    }
                  >
                    ☑
                  </button>
                  <button
                    type="button"
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => changeActiveIndent(-1))
                    }
                    aria-label="Reducir sangría"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() =>
                      runToolAction(() => changeActiveIndent(1))
                    }
                    aria-label="Aumentar sangría"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="sermon-side-tool-group">
                <span>Insertar</span>
                <div>
                  <button
                    type="button"
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setToolPanelOpen(false)
                      imageInputRef.current?.click()
                    }}
                  >
                    Galería
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <button
            className="sermon-side-tool-tab"
            type="button"
            aria-label={
              toolPanelOpen
                ? 'Cerrar herramientas'
                : 'Abrir herramientas; arrastrar para mover de lado'
            }
            aria-expanded={toolPanelOpen}
            onPointerDown={handleToolTabPointerDown}
            onPointerMove={handleToolTabPointerMove}
            onPointerUp={handleToolTabPointerUp}
            onPointerCancel={() => {
              toolDragRef.current = undefined
            }}
          >
            Aa
          </button>
        </div>

        <input
          ref={imageInputRef}
          className="sermon-image-input"
          type="file"
          accept="image/*"
          aria-label="Seleccionar imágenes de la galería"
          multiple
          onChange={(event) =>
            void handleImageSelected(event.target.files)
          }
        />
      </form>

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
            aria-labelledby="sermon-reference-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>Vista rápida</span>
                <strong id="sermon-reference-title">
                  {referencePreview.sourceText}
                </strong>
              </div>
              <button
                type="button"
                aria-label="Cerrar vista rápida"
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
                Seguir escribiendo
              </button>
              <button
                className="sermon-reference-action-link accent"
                type="button"
                onClick={() => void openReferenceInBible(referencePreview)}
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
