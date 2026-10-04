import { useEffect, useMemo, useRef, useState } from 'react'
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
  saveSermonTitle,
  setSermonArchived,
  splitSermonBlock,
  type SermonBlockRecord,
  type SermonBlockType,
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
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [activePoint, setActivePoint] = useState<{
    section: SermonSection
    blockId?: string
    offset?: number
    selectionStart?: number
    selectionEnd?: number
  }>({ section: 'outline' })
  const [toolMenu, setToolMenu] = useState<'text' | 'list' | 'insert'>()
  const [typingMarkOverrides, setTypingMarkOverrides] = useState<
    Partial<Record<SermonInlineMarkType, boolean>>
  >({})
  const pendingFocusRef = useRef<{ blockId: string; offset: number } | undefined>(undefined)
  const [sermon, setSermon] = useState<SermonRecord>()
  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState<SermonBlockRecord[]>([])
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

  function sectionText(section: SermonSection) {
    return blocks
      .filter((block) => block.section === section)
      .sort((a, b) => a.order - b.order)
      .filter((block) => block.type !== 'image')
      .map((block) => block.text)
      .join('\n')
  }


  async function reloadBlocks() {
    const next = await getSermonBlocks(sermonId)
    setBlocks(next)
    return next
  }

  useEffect(() => {
    let cancelled = false

    void Promise.all([getSermon(sermonId), getSermonBlocks(sermonId)]).then(
      ([record, storedBlocks]) => {
        if (cancelled || !record) return
        setSermon(record)
        setTitle(record.title)
        setBlocks(storedBlocks)
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
        return a.start - b.start || a.end - b.end
      })

    const normalized: SermonInlineMark[] = []
    for (const mark of sorted) {
      const previous = normalized.at(-1)
      if (
        previous &&
        previous.type === mark.type &&
        previous.href === mark.href &&
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

  function markBlockDirty(blockId: string, value: string) {
    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block

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
        }

        return {
          ...block,
          text: value,
          marks: normalizeMarks(nextMarks),
        }
      }),
    )
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
    await reloadBlocks()
    setSavedAt(merged.block.updatedAt)
    setDirty(dirtyTitleRef.current || dirtyBlockIdsRef.current.size > 0)
  }

  function getActiveTextBlock() {
    if (!activePoint.blockId) return undefined
    const block = blocks.find((item) => item.id === activePoint.blockId)
    return block?.type === 'image' ? undefined : block
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
    const saved = await saveSermonBlockFormatting(blockId, changes)
    if (!saved) return

    setBlocks((current) =>
      current.map((block) => (block.id === blockId ? saved : block)),
    )
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
    setToolMenu(undefined)
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
        <header className="sermon-block-section-header">
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
                  <span className="sermon-block-prefix" aria-hidden="true">•</span>
                ) : null}
                {block.type === 'numbered' ? (
                  <span className="sermon-block-prefix" aria-hidden="true">
                    {sectionBlocks.slice(0, index + 1).filter((item) => item.type === 'numbered').length}.
                  </span>
                ) : null}
                {block.type === 'task' ? (
                  <input
                    className="sermon-task-checkbox"
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

        <div className="sermon-compose-dock">
          {toolMenu ? (
            <div className="sermon-tool-panel" role="dialog" aria-label="Herramientas de formato">
              {toolMenu === 'text' ? (
                <>
                  <button
                    type="button"
                    className={isActiveBlockType('heading', 1) ? 'active' : ''}
                    aria-pressed={isActiveBlockType('heading', 1)}
                    onClick={() => void setActiveBlockType('heading', 1)}
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('heading', 2) ? 'active' : ''}
                    aria-pressed={isActiveBlockType('heading', 2)}
                    onClick={() => void setActiveBlockType('heading', 2)}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('quote') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('quote')}
                    onClick={() => void setActiveBlockType('quote')}
                  >
                    Cita
                  </button>
                  <button type="button" onClick={() => void changeActiveIndent(-1)}>← Sangría</button>
                  <button type="button" onClick={() => void changeActiveIndent(1)}>Sangría →</button>
                </>
              ) : null}

              {toolMenu === 'list' ? (
                <>
                  <button
                    type="button"
                    className={isActiveBlockType('bullet') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('bullet')}
                    onClick={() => void setActiveBlockType('bullet')}
                  >
                    • Viñetas
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('numbered') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('numbered')}
                    onClick={() => void setActiveBlockType('numbered')}
                  >
                    1. Numerada
                  </button>
                  <button
                    type="button"
                    className={isActiveBlockType('task') ? 'active' : ''}
                    aria-pressed={isActiveBlockType('task')}
                    onClick={() => void setActiveBlockType('task')}
                  >
                    ☑ Verificación
                  </button>
                </>
              ) : null}

              {toolMenu === 'insert' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setToolMenu(undefined)
                      imageInputRef.current?.click()
                    }}
                  >
                    ▧ Galería
                  </button>
                </>
              ) : null}
            </div>
          ) : null}

          <div className="sermon-compose-toolbar" aria-label="Herramientas de la prédica">
            <button
              type="button"
              className={toolMenu === 'text' ? 'active' : ''}
              aria-pressed={toolMenu === 'text'}
              onClick={() => setToolMenu((current) => current === 'text' ? undefined : 'text')}
              title="Encabezados, cita y sangría"
            >
              Aa
            </button>
            <button
              type="button"
              className={\`sermon-toolbar-text\${isActiveBlockType('paragraph') ? ' active' : ''}\`}
              aria-pressed={isActiveBlockType('paragraph')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void setActiveBlockType('paragraph')}
              title="Texto normal"
            >
              Texto
            </button>
            <button
              type="button"
              className={isInlineMarkActive('bold') ? 'active' : ''}
              aria-pressed={isInlineMarkActive('bold')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void toggleInlineMark('bold')}
              title="Negrita"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className={isInlineMarkActive('italic') ? 'active' : ''}
              aria-pressed={isInlineMarkActive('italic')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void toggleInlineMark('italic')}
              title="Cursiva"
            >
              <span className="sermon-toolbar-italic">I</span>
            </button>
            <button
              type="button"
              className={isInlineMarkActive('underline') ? 'active' : ''}
              aria-pressed={isInlineMarkActive('underline')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void toggleInlineMark('underline')}
              title="Subrayado"
            >
              <u>U</u>
            </button>
            <button
              type="button"
              className={isInlineMarkActive('strike') ? 'active' : ''}
              aria-pressed={isInlineMarkActive('strike')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void toggleInlineMark('strike')}
              title="Tachado"
            >
              <s>S</s>
            </button>
            <button
              type="button"
              className={\`\${toolMenu === 'list' ? 'active' : ''}\${['bullet', 'numbered', 'task'].includes(getActiveTextBlock()?.type ?? '') ? ' active' : ''}\`.trim()}
              aria-pressed={
                toolMenu === 'list' ||
                ['bullet', 'numbered', 'task'].includes(getActiveTextBlock()?.type ?? '')
              }
              onClick={() => setToolMenu((current) => current === 'list' ? undefined : 'list')}
              title="Listas"
            >
              ☷
            </button>
            <button
              type="button"
              className={toolMenu === 'insert' ? 'active' : ''}
              aria-pressed={toolMenu === 'insert'}
              onClick={() => setToolMenu((current) => current === 'insert' ? undefined : 'insert')}
              title="Insertar"
            >
              ＋
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
        </div>
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
