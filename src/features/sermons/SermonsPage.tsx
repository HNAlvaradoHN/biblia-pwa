import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import {
  appendSermonBlock,
  createSermon,
  deleteSermon,
  duplicateSermon,
  getSermon,
  getSermonBlocks,
  getSermons,
  mergeSermonBlockWithPrevious,
  saveSermon,
  saveSermonBlockDraft,
  saveSermonTitle,
  setSermonArchived,
  splitSermonBlock,
  type SermonBlockRecord,
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

export function SermonEditorPage() {
  const { sermonId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const blockRefs = useRef(new Map<string, SermonRichTextFieldHandle>())
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
      .map((block) => block.text)
      .join('\n')
  }

  function findBlockAtFieldOffset(section: SermonSection, fieldOffset: number) {
    const sectionBlocks = blocks
      .filter((block) => block.section === section)
      .sort((a, b) => a.order - b.order)
    let offset = Math.max(0, fieldOffset)

    for (const block of sectionBlocks) {
      if (offset <= block.text.length) {
        return { blockId: block.id, offset }
      }
      offset -= block.text.length + 1
    }

    const last = sectionBlocks.at(-1)
    return last ? { blockId: last.id, offset: last.text.length } : undefined
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
          const savedBlock = await saveSermonBlockDraft(blockId, block.text)
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

  function markBlockDirty(blockId: string, value: string) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, text: value } : block,
      ),
    )
    dirtyBlockIdsRef.current.add(blockId)
    editVersionRef.current += 1
    setDirty(true)
  }

  async function flushDirtyBlocks() {
    const ids = [...dirtyBlockIdsRef.current]
    for (const blockId of ids) {
      const block = blocks.find((item) => item.id === blockId)
      if (block) await saveSermonBlockDraft(blockId, block.text)
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
    if (dirtyBlockIdsRef.current.has(previous.id)) {
      await saveSermonBlockDraft(previous.id, previous.text)
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

  async function handleAppend(section: SermonSection) {
    const block = await appendSermonBlock(sermonId, section)
    if (!block) return
    pendingFocusRef.current = { blockId: block.id, offset: 0 }
    await reloadBlocks()
    setSavedAt(block.updatedAt)
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
      <section className="sermon-block-section">
        <header className="sermon-block-section-header">
          <span>{label}</span>
          <button type="button" onClick={() => void handleAppend(section)}>
            + Bloque
          </button>
        </header>

        <div className="sermon-block-list">
          {sectionBlocks.map((block, index) => (
            <div
              className="sermon-block-row"
              data-sermon-block-id={block.id}
              key={block.id}
            >
              <span className="sermon-block-handle" aria-hidden="true">
                {index + 1}
              </span>
              <SermonRichTextField
                ref={(handle) => {
                  if (handle) blockRefs.current.set(block.id, handle)
                  else blockRefs.current.delete(block.id)
                }}
                className="sermon-block-editor"
                value={block.text}
                references={detectedReferences.filter(
                  (reference) => reference.blockId === block.id,
                )}
                onChange={(value) => markBlockDirty(block.id, value)}
                onReferenceOpen={setReferencePreview}
                onSplit={(offset) => void handleSplit(block, offset)}
                onMergeBackward={() => void handleMerge(block)}
                placeholder={index === 0 ? placeholder : 'Continuá escribiendo...'}
                ariaLabel={`${label}, bloque ${index + 1}`}
              />
            </div>
          ))}
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

        <aside className="sermon-editor-note">
          <strong>Editor por bloques activo</strong>
          <p>
            Cada párrafo es independiente y se guarda por separado. Enter crea
            un bloque nuevo; borrar al inicio de un bloque lo une con el
            anterior. Las referencias bíblicas siguen siendo consultables.
          </p>
        </aside>
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
