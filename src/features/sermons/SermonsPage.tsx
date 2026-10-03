import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
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
import {
  detectAllSermonReferences,
  getReferencePassage,
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

export function SermonEditorPage() {
  const { sermonId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const introductionRef = useRef<SermonRichTextFieldHandle | null>(null)
  const outlineRef = useRef<SermonRichTextFieldHandle | null>(null)
  const conclusionRef = useRef<SermonRichTextFieldHandle | null>(null)
  const [sermon, setSermon] = useState<SermonRecord>()
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [outline, setOutline] = useState('')
  const [conclusion, setConclusion] = useState('')
  const [savedAt, setSavedAt] = useState<number>()
  const [dirty, setDirty] = useState(false)
  const [referencePreview, setReferencePreview] = useState<SermonBibleReference>()

  const detectedReferences = useMemo(
    () =>
      detectAllSermonReferences({
        introduction,
        outline,
        conclusion,
      }),
    [conclusion, introduction, outline],
  )

  const previewPassage = useMemo(
    () => (referencePreview ? getReferencePassage(referencePreview) : []),
    [referencePreview],
  )

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

      const params = new URLSearchParams(location.search)
      const returnField = params.get('returnField') as SermonFieldName | null
      const returnAt = Number(params.get('returnAt'))
      if (returnField && Number.isFinite(returnAt)) {
        window.requestAnimationFrame(() => {
          const target =
            returnField === 'introduction'
              ? introductionRef.current
              : returnField === 'outline'
                ? outlineRef.current
                : conclusionRef.current
          if (!target) return
          target.focusAt(returnAt)
          navigate(`/predicas/${sermonId}`, { replace: true })
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [location.search, navigate, sermonId])

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
        references: detectedReferences,
      }).then((saved) => {
        if (!saved) return
        setSermon(saved)
        setTitle(saved.title)
        setSavedAt(saved.updatedAt)
        setDirty(false)
      })
    }, 900)

    return () => window.clearTimeout(timer)
  }, [conclusion, detectedReferences, dirty, introduction, outline, sermon, sermonId, title])

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
      references: detectedReferences,
    })
    if (!saved) return
    setSermon(saved)
    setTitle(saved.title)
    setSavedAt(saved.updatedAt)
    setDirty(false)
    return saved
  }

  async function startPresentation() {
    const saved = await handleSave()
    if (!saved) return
    navigate(`/predicas/${sermonId}/presentar`)
  }

  async function openReferenceInBible(reference: SermonBibleReference) {
    await saveSermon(sermonId, {
      title,
      introduction,
      outline,
      conclusion,
      references: detectedReferences,
    })

    window.sessionStorage.setItem(
      'biblia-sermon-return-v1',
      JSON.stringify({
        sermonId,
        field: reference.field,
        startIndex: reference.startIndex,
      }),
    )

    const anchor = `verse-${reference.bookId}-${reference.chapter}-${reference.verseStart}`
    navigate(
      `/biblia/${reference.bookId}/${reference.chapter}?fromSermon=1#${anchor}`,
    )
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
        <div className="sermon-toolbar-actions">
          <button className="button secondary" type="button" onClick={() => void startPresentation()}>
            Predicar
          </button>
          <button className="button primary" type="button" onClick={() => void handleSave()}>
            Guardar
          </button>
        </div>
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

        <div className="sermon-field">
          <span>Introducción</span>
          <SermonRichTextField
            ref={introductionRef}
            value={introduction}
            references={detectedReferences.filter((reference) => reference.field === 'introduction')}
            onChange={(value) => markDirty(setIntroduction, value)}
            onReferenceOpen={setReferencePreview}
            placeholder="Idea de apertura, contexto o propósito..."
            ariaLabel="Introducción"
          />
        </div>

        <div className="sermon-field">
          <span>Bosquejo y puntos</span>
          <SermonRichTextField
            ref={outlineRef}
            className="sermon-rich-editor-outline"
            value={outline}
            references={detectedReferences.filter((reference) => reference.field === 'outline')}
            onChange={(value) => markDirty(setOutline, value)}
            onReferenceOpen={setReferencePreview}
            placeholder={"1. Punto principal\n   - Subpunto\n   - Aplicación\n\n2. Siguiente punto..."}
            ariaLabel="Bosquejo y puntos"
          />
        </div>

        <div className="sermon-field">
          <span>Conclusión</span>
          <SermonRichTextField
            ref={conclusionRef}
            value={conclusion}
            references={detectedReferences.filter((reference) => reference.field === 'conclusion')}
            onChange={(value) => markDirty(setConclusion, value)}
            onReferenceOpen={setReferencePreview}
            placeholder="Cierre, llamado o idea final..."
            ariaLabel="Conclusión"
          />
        </div>

        <aside className="sermon-editor-note">
          <strong>Referencias inteligentes activas</strong>
          <p>
            Escribí referencias disponibles en el corpus, por ejemplo Juan 1:1 o
            Génesis 1:1-3. Quedarán remarcadas dentro del mismo texto. Tocá una referencia
            para ver el pasaje y, si querés, leer el capítulo completo.
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
                <strong id="sermon-reference-title">{referencePreview.sourceText}</strong>
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
