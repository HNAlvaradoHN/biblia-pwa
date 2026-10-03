import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  createSermon,
  duplicateSermon,
  getSermon,
  getSermons,
  saveSermon,
  setSermonArchived,
  type SermonRecord,
  type SermonStatus,
} from '../../data/db'
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
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}


type OutlineFormat = 'h1' | 'h2' | 'h3' | 'bold' | 'italic' | 'numbered' | 'bullets' | 'quote' | 'indent' | 'divider'

const outlineTools: Array<{ format: OutlineFormat; label: string; title: string }> = [
  { format: 'h1', label: 'H1', title: 'Título principal' },
  { format: 'h2', label: 'H2', title: 'Título secundario' },
  { format: 'h3', label: 'H3', title: 'Título menor' },
  { format: 'bold', label: 'B', title: 'Negrita' },
  { format: 'italic', label: 'I', title: 'Cursiva' },
  { format: 'numbered', label: '1.', title: 'Lista numerada' },
  { format: 'bullets', label: '•', title: 'Lista con viñetas' },
  { format: 'quote', label: '❝', title: 'Cita' },
  { format: 'indent', label: '→', title: 'Sangría' },
  { format: 'divider', label: '—', title: 'Separador' },
]

function transformOutlineSelection(value: string, start: number, end: number, format: OutlineFormat) {
  const selected = value.slice(start, end)
  const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const nextLineBreak = value.indexOf('\n', end)
  const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak
  const lineFormats: OutlineFormat[] = ['h1', 'h2', 'h3', 'numbered', 'bullets', 'quote', 'indent']
  const blockStart = lineFormats.includes(format) ? lineStart : start
  const blockEnd = lineFormats.includes(format) ? lineEnd : end
  const block = value.slice(blockStart, blockEnd)

  let replacement = block
  if (format === 'bold') replacement = '**' + (selected || 'texto') + '**'
  if (format === 'italic') replacement = '*' + (selected || 'texto') + '*'
  if (format === 'divider') replacement = selected + (selected && !selected.endsWith('\n') ? '\n' : '') + '---\n'
  if (format === 'h1') replacement = block.replace(/^#{1,3}\s*/, '# ')
  if (format === 'h2') replacement = block.replace(/^#{1,3}\s*/, '## ')
  if (format === 'h3') replacement = block.replace(/^#{1,3}\s*/, '### ')
  if (format === 'quote') replacement = block.split('\n').map((line) => '> ' + line.replace(/^>\s?/, '')).join('\n')
  if (format === 'indent') replacement = block.split('\n').map((line) => '   ' + line).join('\n')
  if (format === 'bullets') replacement = block.split('\n').map((line) => '- ' + line.replace(/^(?:[-*]\s+|\d+\.\s+)/, '')).join('\n')
  if (format === 'numbered') replacement = block.split('\n').map((line, index) => (index + 1) + '. ' + line.replace(/^(?:[-*]\s+|\d+\.\s+)/, '')).join('\n')

  const nextValue = value.slice(0, blockStart) + replacement + value.slice(blockEnd)
  return { value: nextValue, selectionStart: blockStart, selectionEnd: blockStart + replacement.length }
}

function OutlineToolbar({ textareaRef, value, onChange }: {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (value: string) => void
}) {
  function applyFormat(format: OutlineFormat) {
    const textarea = textareaRef.current
    if (!textarea) return
    const result = transformOutlineSelection(value, textarea.selectionStart, textarea.selectionEnd, format)
    onChange(result.value)
    window.requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd)
    })
  }

  return (
    <div className="sermon-format-toolbar" role="toolbar" aria-label="Formato del bosquejo">
      {outlineTools.map((tool) => (
        <button
          key={tool.format}
          type="button"
          title={tool.title}
          aria-label={tool.title}
          className={tool.format === 'bold' ? 'format-bold' : tool.format === 'italic' ? 'format-italic' : ''}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyFormat(tool.format)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  )
}

export function SermonEditorPage() {
  const { sermonId = '' } = useParams()
  const navigate = useNavigate()
  const [sermon, setSermon] = useState<SermonRecord>()
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [outline, setOutline] = useState('')
  const [conclusion, setConclusion] = useState('')
  const [savedAt, setSavedAt] = useState<number>()
  const [dirty, setDirty] = useState(false)
  const outlineRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let cancelled = false

    void getSermon(sermonId).then((record) => {
      if (cancelled || !record) return
      setSermon(record)
      setTitle(record.title)
      setIntroduction(record.introduction)
      setOutline(record.outline)
      setConclusion(record.conclusion)
      setSavedAt(record.updatedAt)
    })

    return () => {
      cancelled = true
    }
  }, [sermonId])

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
      void saveSermon(sermonId, {
        title,
        introduction,
        outline,
        conclusion,
      }).then((saved) => {
        if (!saved) return
        setSermon(saved)
        setTitle(saved.title)
        setSavedAt(saved.updatedAt)
        setDirty(false)
      })
    }, 900)

    return () => window.clearTimeout(timer)
  }, [conclusion, dirty, introduction, outline, sermon, sermonId, title])

  function markDirty(setter: (value: string) => void, value: string) {
    setter(value)
    setDirty(true)
  }

  async function handleSave() {
    const saved = await saveSermon(sermonId, {
      title,
      introduction,
      outline,
      conclusion,
    })
    if (!saved) return
    setSermon(saved)
    setTitle(saved.title)
    setSavedAt(saved.updatedAt)
    setDirty(false)
  }

  if (!sermon) {
    return (
      <section className="sermon-editor-page">
        <div className="sermons-empty glass-panel">
          <strong>Prédica no encontrada.</strong>
          <Link className="button primary" to="/predicas">Volver a Mis prédicas</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="sermon-editor-page">
      <header className="sermon-editor-toolbar glass-panel">
        <button className="button secondary" type="button" onClick={() => navigate('/predicas')}>
          ← Mis prédicas
        </button>
        <div className="sermon-save-state">
          <span>{dirty ? 'Guardando...' : 'Guardado'}</span>
          {savedAt ? <small>{formatUpdatedAt(savedAt)}</small> : null}
        </div>
        <button className="button primary" type="button" onClick={() => void handleSave()}>
          Guardar
        </button>
      </header>

      <form className="sermon-editor-sheet" onSubmit={(event) => event.preventDefault()}>
        <label className="sermon-field sermon-title-field">
          <span>Título</span>
          <input
            value={title}
            onChange={(event) => markDirty(setTitle, event.target.value)}
            placeholder="Título de la prédica"
          />
        </label>

        <label className="sermon-field">
          <span>Introducción</span>
          <textarea
            value={introduction}
            onChange={(event) => markDirty(setIntroduction, event.target.value)}
            placeholder="Idea de apertura, contexto o propósito..."
            rows={5}
          />
        </label>

        <label className="sermon-field sermon-outline-field">
          <span>Bosquejo y puntos</span>
          <OutlineToolbar
            textareaRef={outlineRef}
            value={outline}
            onChange={(value) => markDirty(setOutline, value)}
          />
          <textarea
            ref={outlineRef}
            value={outline}
            onChange={(event) => markDirty(setOutline, event.target.value)}
            placeholder={"1. Punto principal\n   - Subpunto\n   - Aplicación\n\n2. Siguiente punto..."}
            rows={14}
          />
          <small className="sermon-format-hint">
            Seleccioná texto o colocá el cursor y usá la barra para títulos, listas, citas y énfasis.
          </small>
        </label>

        <label className="sermon-field">
          <span>Conclusión</span>
          <textarea
            value={conclusion}
            onChange={(event) => markDirty(setConclusion, event.target.value)}
            placeholder="Cierre, llamado o idea final..."
            rows={6}
          />
        </label>

        <aside className="sermon-editor-note">
          <strong>Formato rápido del bosquejo</strong>
          <p>
            El bosquejo se guarda automáticamente en este dispositivo. Las referencias
            bíblicas inteligentes y la vista rápida se incorporarán en la siguiente fase
            para no mezclar responsabilidades.
          </p>
        </aside>
      </form>
    </section>
  )
}
