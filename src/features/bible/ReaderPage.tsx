import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { bibleProvider } from '../../data/bible/provider'
import {
  getActiveVerse,
  getBibleNote,
  getHighlight,
  getHighlights,
  getLastReading,
  isFavorite,
  makeBibleLocationId,
  removeBibleNote,
  removeHighlight,
  saveActiveVerse,
  saveBibleNote,
  saveLastReading,
  setHighlight,
  toggleFavorite,
  type HighlightColor,
} from '../../data/db'
import './reader-actions.css'

type ActiveVerse = {
  chapter: number
  verse: number
  anchorId: string
}

type ShareTarget = 'single' | 'multi'
type ShareTheme = 'paper' | 'forest' | 'night' | 'sand' | 'custom-color' | 'custom-image'

type ShareItem = {
  reference: string
  text: string
}

const highlightPalette: Array<{
  id: HighlightColor
  label: string
  value: string
}> = [
  { id: 'amber', label: 'Ámbar', value: '#d9a441' },
  { id: 'sage', label: 'Salvia', value: '#6fa37d' },
  { id: 'sky', label: 'Cielo', value: '#6aa6d9' },
  { id: 'rose', label: 'Rosa', value: '#d78091' },
  { id: 'lavender', label: 'Lavanda', value: '#9483cc' },
  { id: 'peach', label: 'Durazno', value: '#d99a72' },
]

export function ReaderPage() {
  const { bookId = '', chapter: chapterParam = '1' } = useParams()
  const routerLocation = useLocation()
  const navigate = useNavigate()
  const book = bibleProvider.getBook(bookId)
  const requestedChapter = Number(chapterParam)
  const saveTimer = useRef<number | undefined>(undefined)
  const actionPanelRef = useRef<HTMLDivElement | null>(null)
  const actionTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [activeVerse, setActiveVerse] = useState<ActiveVerse | undefined>()
  const [actionPanelOpen, setActionPanelOpen] = useState(false)
  const [actionPanelPosition, setActionPanelPosition] = useState<CSSProperties>({})
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedVerseIds, setSelectedVerseIds] = useState<Set<string>>(() => new Set())
  const [favoriteActive, setFavoriteActive] = useState(false)
  const [highlightActive, setHighlightActive] = useState(false)
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(() => new Set())
  const [highlightColors, setHighlightColors] = useState<Map<string, HighlightColor>>(
    () => new Map(),
  )
  const [highlightPickerTarget, setHighlightPickerTarget] = useState<'single' | 'multi' | undefined>()
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [shareTarget, setShareTarget] = useState<ShareTarget | undefined>()
  const [shareTheme, setShareTheme] = useState<ShareTheme>('paper')
  const [shareCustomColor, setShareCustomColor] = useState('#173a2a')
  const [shareCustomImage, setShareCustomImage] = useState<string | undefined>()
  const [readingModeOpen, setReadingModeOpen] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  const chapters = useMemo(() => {
    if (!book) return []
    const startIndex = book.chapters.findIndex((item) => item.number === requestedChapter)
    if (startIndex < 0) return []
    return book.chapters.slice(startIndex)
  }, [book, requestedChapter])

  useEffect(() => {
    if (!book || chapters.length === 0) return

    let cancelled = false
    const visibleChapterNumbers = new Set(chapters.map((item) => item.number))

    void Promise.all([getActiveVerse(), getHighlights()]).then(([storedActiveVerse, highlights]) => {
      if (cancelled) return

      setHighlightedIds(new Set(highlights.map((item) => makeBibleLocationId(item))))
      setHighlightColors(
        new Map(
          highlights.map((item) => [
            makeBibleLocationId(item),
            item.color ?? 'amber',
          ]),
        ),
      )

      if (
        storedActiveVerse?.bookId === book.id &&
        visibleChapterNumbers.has(storedActiveVerse.chapter)
      ) {
        const chapter = book.chapters.find((item) => item.number === storedActiveVerse.chapter)
        const verseExists = chapter?.sections.some((section) =>
          section.verses.some((verse) => verse.number === storedActiveVerse.verse),
        )

        if (verseExists) {
          setActiveVerse({
            chapter: storedActiveVerse.chapter,
            verse: storedActiveVerse.verse,
            anchorId: `verse-${book.id}-${storedActiveVerse.chapter}-${storedActiveVerse.verse}`,
          })
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [book, chapters])

  useEffect(() => {
    if (!book || chapters.length === 0) return

    const activeBook = book
    let cancelled = false
    const firstChapter = chapters[0]
    const firstVerse = firstChapter.sections.flatMap((section) => section.verses)[0]
    const firstAnchorId = firstVerse
      ? `verse-${activeBook.id}-${firstChapter.number}-${firstVerse.number}`
      : undefined
    const hashAnchorId = routerLocation.hash
      ? decodeURIComponent(routerLocation.hash.slice(1))
      : ''

    void getLastReading().then((lastReading) => {
      if (cancelled) return

      if (hashAnchorId) {
        window.requestAnimationFrame(() => {
          const target = document.getElementById(hashAnchorId)
          if (!target) return

          target.scrollIntoView({ block: 'center' })
          if (new URLSearchParams(routerLocation.search).get('returnFromFocus') === '1') {
            target.classList.add('return-focus')
            window.setTimeout(() => target.classList.remove('return-focus'), 2000)
          }
          const targetChapter = Number(target.dataset.chapter)
          if (Number.isFinite(targetChapter)) {
            void saveLastReading({
              bookId: activeBook.id,
              chapter: targetChapter,
              anchorId: hashAnchorId,
            })
          }
        })
        return
      }

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
  }, [book, chapters, requestedChapter, routerLocation.hash, routerLocation.search])

  useEffect(() => {
    if (!book || !activeVerse) {
      setFavoriteActive(false)
      setHighlightActive(false)
      setNoteDraft('')
      setNoteSaved(false)
      setNoteOpen(false)
      setActionMessage('')
      return
    }

    let cancelled = false
    const location = {
      bookId: book.id,
      chapter: activeVerse.chapter,
      verse: activeVerse.verse,
    }

    void Promise.all([
      isFavorite(location),
      getBibleNote(location),
      getHighlight(location),
    ]).then(([favorite, note, highlight]) => {
      if (cancelled) return
      setFavoriteActive(favorite)
      setHighlightActive(Boolean(highlight))
      setNoteDraft(note?.text ?? '')
      setNoteSaved(Boolean(note))
      setNoteOpen(Boolean(note))
      setActionMessage('')
    })

    return () => {
      cancelled = true
    }
  }, [book, activeVerse])

  useEffect(() => {
    if (!actionPanelOpen) return

    function updateActionPanelPosition() {
      const trigger = actionTriggerRef.current
      if (!trigger) return

      const rect = trigger.getBoundingClientRect()
      const panelHeight = actionPanelRef.current?.getBoundingClientRect().height ?? 330
      const viewportPadding = 12
      const bottomNavigationReserve = 92
      const maxWidth = Math.min(360, window.innerWidth - viewportPadding * 2)
      const availableBelow =
        window.innerHeight - rect.bottom - bottomNavigationReserve - viewportPadding
      const availableAbove = rect.top - viewportPadding
      const placeAbove = availableBelow < Math.min(panelHeight, 280) && availableAbove > availableBelow
      const left = Math.min(
        Math.max(viewportPadding, rect.right - maxWidth),
        window.innerWidth - maxWidth - viewportPadding,
      )

      setActionPanelPosition({
        position: 'fixed',
        width: maxWidth,
        left,
        top: placeAbove ? undefined : rect.bottom + 8,
        bottom: placeAbove ? window.innerHeight - rect.top + 8 : undefined,
        maxHeight: Math.max(
          180,
          Math.min(
            panelHeight,
            placeAbove ? availableAbove - 8 : availableBelow - 8,
          ),
        ),
      })
    }

    function closeOnOutsidePress(event: PointerEvent) {
      const target = event.target as Node
      if (actionPanelRef.current?.contains(target)) return
      if (target instanceof Element && target.closest('.verse-menu-trigger')) return
      setActionPanelOpen(false)
    }

    const frame = window.requestAnimationFrame(updateActionPanelPosition)
    document.addEventListener('pointerdown', closeOnOutsidePress)
    window.addEventListener('resize', updateActionPanelPosition)
    window.addEventListener('scroll', updateActionPanelPosition, true)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      window.removeEventListener('resize', updateActionPanelPosition)
      window.removeEventListener('scroll', updateActionPanelPosition, true)
    }
  }, [actionPanelOpen, noteOpen, highlightPickerTarget])

  const activeVerseText = useMemo(() => {
    if (!book || !activeVerse) return undefined
    const chapter = book.chapters.find((item) => item.number === activeVerse.chapter)
    return chapter?.sections
      .flatMap((section) => section.verses)
      .find((verse) => verse.number === activeVerse.verse)?.text
  }, [book, activeVerse])

  if (!book || chapters.length === 0) {
    return (
      <div className="page empty-state full">
        <strong>Lectura no encontrada.</strong>
        <Link className="button primary" to="/biblia">Volver a Biblia</Link>
      </div>
    )
  }

  const activeBook = book

  function getActiveLocation() {
    if (!activeVerse) return undefined
    return {
      bookId: activeBook.id,
      chapter: activeVerse.chapter,
      verse: activeVerse.verse,
    }
  }

  function getShareText() {
    if (!activeVerse || !activeVerseText) return undefined
    const reference = `${activeBook.name} ${activeVerse.chapter}:${activeVerse.verse}`
    return {
      reference,
      text: `${reference}\n${activeVerseText}`,
    }
  }

  function getSelectedVerses() {
    return chapters.flatMap((chapter) =>
      chapter.sections.flatMap((section) =>
        section.verses
          .map((verse) => {
            const location = {
              bookId: activeBook.id,
              chapter: chapter.number,
              verse: verse.number,
            }
            const id = makeBibleLocationId(location)
            if (!selectedVerseIds.has(id)) return undefined
            return {
              id,
              location,
              reference: `${activeBook.name} ${chapter.number}:${verse.number}`,
              text: verse.text,
            }
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      ),
    )
  }

  function getSelectedShareItems(): ShareItem[] {
    return getSelectedVerses().map(({ reference, text }) => ({ reference, text }))
  }

  function getSingleShareItems(): ShareItem[] {
    const share = getShareText()
    if (!share || !activeVerseText) return []
    return [{ reference: share.reference, text: activeVerseText }]
  }

  function getSelectedShareText() {
    const selected = getSelectedVerses()
    if (selected.length === 0) return undefined
    return {
      reference:
        selected.length === 1
          ? selected[0].reference
          : `${activeBook.name} · ${selected.length} versículos`,
      text: selected.map((item) => `${item.reference}\n${item.text}`).join('\n\n'),
    }
  }

  function openShareChooser(target: ShareTarget) {
    setShareTarget(target)
    setActionMessage('')
  }

  function closeShareChooser() {
    setShareTarget(undefined)
  }

  function getSharePayload(target: ShareTarget) {
    return target === 'multi' ? getSelectedShareText() : getShareText()
  }

  function getShareItems(target: ShareTarget) {
    return target === 'multi' ? getSelectedShareItems() : getSingleShareItems()
  }

  function wrapCanvasText(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ) {
    const words = text.split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let line = ''

    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (context.measureText(test).width <= maxWidth) {
        line = test
        continue
      }
      if (line) lines.push(line)
      line = word
    }

    if (line) lines.push(line)
    return lines
  }

  async function loadShareBackground(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = src
    })
  }

  async function createShareImage(items: ShareItem[]) {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1350
    const context = canvas.getContext('2d')
    if (!context) return undefined

    const themes = {
      paper: { background: '#f7f1e6', title: '#173a2a', reference: '#b88845', text: '#202821' },
      forest: { background: '#173a2a', title: '#f9f5ea', reference: '#e7be7d', text: '#fffdf8' },
      night: { background: '#15202b', title: '#f6f2e8', reference: '#d6b16f', text: '#f8f9fb' },
      sand: { background: '#d9bea0', title: '#3f2f23', reference: '#704f2b', text: '#2a211b' },
    } as const

    const palette =
      shareTheme === 'custom-color'
        ? { background: shareCustomColor, title: '#ffffff', reference: '#f3d39a', text: '#ffffff' }
        : shareTheme === 'custom-image'
          ? { background: '#24342c', title: '#ffffff', reference: '#f3d39a', text: '#ffffff' }
          : themes[shareTheme]

    context.fillStyle = palette.background
    context.fillRect(0, 0, canvas.width, canvas.height)

    if (shareTheme === 'custom-image' && shareCustomImage) {
      try {
        const image = await loadShareBackground(shareCustomImage)
        const scale = Math.max(canvas.width / image.width, canvas.height / image.height)
        const width = image.width * scale
        const height = image.height * scale
        context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
        context.fillStyle = 'rgba(10, 20, 16, 0.48)'
        context.fillRect(0, 0, canvas.width, canvas.height)
      } catch {
        setActionMessage('No se pudo usar esa imagen como fondo')
        return undefined
      }
    }

    const padding = 92
    const maxWidth = canvas.width - padding * 2
    const bottomLimit = canvas.height - 120
    let y = 130

    context.fillStyle = palette.title
    context.font = '700 34px system-ui, sans-serif'
    context.fillText('Biblia', padding, y)
    y += 76

    for (const item of items) {
      context.fillStyle = palette.reference
      context.font = '700 30px system-ui, sans-serif'
      const referenceLines = wrapCanvasText(context, item.reference, maxWidth)

      for (const line of referenceLines) {
        if (y + 44 > bottomLimit) return undefined
        context.fillText(line, padding, y)
        y += 44
      }

      y += 12
      context.fillStyle = palette.text
      context.font = '44px Georgia, serif'
      const verseLines = wrapCanvasText(context, item.text, maxWidth)

      for (const line of verseLines) {
        if (y + 62 > bottomLimit) return undefined
        context.fillText(line, padding, y)
        y += 62
      }

      y += 48
    }

    return new Promise<Blob | undefined>((resolve) => {
      canvas.toBlob((blob) => resolve(blob ?? undefined), 'image/png', 0.95)
    })
  }

  async function shareAsText(target: ShareTarget) {
    const share = getSharePayload(target)
    if (!share) return

    try {
      if (navigator.share) {
        await navigator.share({ title: share.reference, text: share.text })
        setActionMessage(target === 'multi' ? 'Selección compartida como texto' : 'Compartido como texto')
      } else {
        await navigator.clipboard.writeText(share.text)
        setActionMessage('Compartir no está disponible; se copió el texto')
      }
      closeShareChooser()
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setActionMessage('No se pudo compartir en este dispositivo')
    }
  }

  async function shareAsImage(target: ShareTarget) {
    const items = getShareItems(target)
    if (items.length === 0) return

    const blob = await createShareImage(items)
    if (!blob) {
      setActionMessage(
        'La selección no cabe de forma legible en una imagen. Reducí los versículos seleccionados.',
      )
      return
    }

    const file = new File([blob], 'versiculos.png', { type: 'image/png' })

    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: items.length === 1 ? items[0].reference : 'Versículos seleccionados',
          files: [file],
        })
        setActionMessage('Imagen compartida')
        closeShareChooser()
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setActionMessage('Imagen creada y descargada')
      closeShareChooser()
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setActionMessage('No se pudo compartir la imagen en este dispositivo')
    }
  }

  function handleCustomBackground(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setActionMessage('Elegí un archivo de imagen válido')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setShareCustomImage(reader.result)
      setShareTheme('custom-image')
      setActionMessage('')
    }
    reader.readAsDataURL(file)
  }

  function startMultiSelect() {
    const location = getActiveLocation()
    if (!location) return
    setSelectedVerseIds(new Set([makeBibleLocationId(location)]))
    setSelectionMode(true)
    setActionPanelOpen(false)
    setActionMessage('')
  }

  function stopMultiSelect() {
    setSelectionMode(false)
    setSelectedVerseIds(new Set())
    setActionMessage('')
  }

  function toggleSelectedVerse(locationId: string) {
    setSelectedVerseIds((current) => {
      const next = new Set(current)
      if (next.has(locationId)) next.delete(locationId)
      else next.add(locationId)
      return next
    })
  }

  async function handleFavorite() {
    const location = getActiveLocation()
    if (!location) return

    const active = await toggleFavorite(location)
    setFavoriteActive(active)
    setActionMessage(active ? 'Añadido a favoritos' : 'Quitado de favoritos')
  }

  async function applySingleHighlight(color: HighlightColor) {
    const location = getActiveLocation()
    if (!location) return
    const id = makeBibleLocationId(location)
    await setHighlight(location, color)

    setHighlightActive(true)
    setHighlightedIds((current) => new Set(current).add(id))
    setHighlightColors((current) => {
      const next = new Map(current)
      next.set(id, color)
      return next
    })
    setHighlightPickerTarget(undefined)
    setActionMessage('Color de resaltado aplicado')
  }

  async function removeSingleHighlight() {
    const location = getActiveLocation()
    if (!location) return
    const id = makeBibleLocationId(location)
    await removeHighlight(location)

    setHighlightActive(false)
    setHighlightedIds((current) => {
      const next = new Set(current)
      next.delete(id)
      return next
    })
    setHighlightColors((current) => {
      const next = new Map(current)
      next.delete(id)
      return next
    })
    setHighlightPickerTarget(undefined)
    setActionMessage('Resaltado eliminado')
  }

  async function handleCopy() {
    const share = getShareText()
    if (!share) return

    try {
      await navigator.clipboard.writeText(share.text)
      setActionMessage('Copiado al portapapeles')
    } catch {
      setActionMessage('No se pudo copiar en este dispositivo')
    }
  }

  async function handleBulkFavorite() {
    const selected = getSelectedVerses()
    if (selected.length === 0) return

    await Promise.all(
      selected.map(async ({ location }) => {
        if (!(await isFavorite(location))) await toggleFavorite(location)
      }),
    )
    setActionMessage(
      `${selected.length} versículo${selected.length === 1 ? '' : 's'} añadido${selected.length === 1 ? '' : 's'} a favoritos`,
    )
  }

  function getCommonSelectedHighlightColor() {
    const selected = getSelectedVerses()
    if (selected.length === 0) return undefined

    const colors = selected.map(({ id }) => highlightColors.get(id))
    if (colors.some((color) => !color)) return undefined
    const first = colors[0]
    return colors.every((color) => color === first) ? first : undefined
  }

  async function applyBulkHighlight(color: HighlightColor) {
    const selected = getSelectedVerses()
    if (selected.length === 0) return

    await Promise.all(selected.map(({ location }) => setHighlight(location, color)))

    setHighlightedIds((current) => {
      const next = new Set(current)
      selected.forEach(({ id }) => next.add(id))
      return next
    })
    setHighlightColors((current) => {
      const next = new Map(current)
      selected.forEach(({ id }) => next.set(id, color))
      return next
    })
    setHighlightPickerTarget(undefined)
    setActionMessage(
      `${selected.length} versículo${selected.length === 1 ? '' : 's'} resaltado${selected.length === 1 ? '' : 's'}`,
    )
  }

  async function removeCommonBulkHighlight() {
    const selected = getSelectedVerses()
    if (selected.length === 0 || !getCommonSelectedHighlightColor()) return

    await Promise.all(selected.map(({ location }) => removeHighlight(location)))

    setHighlightedIds((current) => {
      const next = new Set(current)
      selected.forEach(({ id }) => next.delete(id))
      return next
    })
    setHighlightColors((current) => {
      const next = new Map(current)
      selected.forEach(({ id }) => next.delete(id))
      return next
    })
    setHighlightPickerTarget(undefined)
    setActionMessage('Resaltado común eliminado de la selección')
  }

  async function handleBulkCopy() {
    const share = getSelectedShareText()
    if (!share) return

    try {
      await navigator.clipboard.writeText(share.text)
      setActionMessage('Selección copiada al portapapeles')
    } catch {
      setActionMessage('No se pudo copiar en este dispositivo')
    }
  }

  async function handleSaveNote() {
    const location = getActiveLocation()
    if (!location || !noteDraft.trim()) return

    const saved = await saveBibleNote(location, noteDraft)
    setNoteDraft(saved?.text ?? '')
    setNoteSaved(Boolean(saved))
    setActionMessage('Nota guardada')
  }

  async function handleDeleteNote() {
    const location = getActiveLocation()
    if (!location) return

    await removeBibleNote(makeBibleLocationId(location))
    setNoteDraft('')
    setNoteSaved(false)
    setNoteOpen(false)
    setActionMessage('Nota eliminada')
  }

  function getNearestReadingPoint() {
    if (activeVerse) {
      return {
        chapter: activeVerse.chapter,
        anchorId: activeVerse.anchorId,
      }
    }

    const anchors = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reading-anchor="true"]'),
    )

    if (anchors.length === 0) {
      return {
        chapter: requestedChapter,
        anchorId: '',
      }
    }

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

    const chapter = Number(nearest.dataset.chapter)
    return {
      chapter: Number.isFinite(chapter) ? chapter : requestedChapter,
      anchorId: nearest.id,
    }
  }

  function openFocusedMode(mode: 'chapter' | 'verse') {
    const point = getNearestReadingPoint()
    setReadingModeOpen(false)
    navigate(
      `/biblia/${activeBook.id}/${point.chapter}/foco?mode=${mode}&returnChapter=${point.chapter}&returnAnchor=${encodeURIComponent(point.anchorId)}`,
    )
  }

  function activateVerse(chapter: number, verse: number, anchorId: string) {
    const location = {
      bookId: activeBook.id,
      chapter,
      verse,
    }

    setActiveVerse({ chapter, verse, anchorId })
    setSelectedVerseIds(new Set())
    setSelectionMode(false)
    setShareTarget(undefined)
    setActionPanelOpen(false)
    void saveActiveVerse(location)
    void saveLastReading({
      bookId: activeBook.id,
      chapter,
      anchorId,
    })
  }

  return (
    <div className="reader-page">
      <div className="reader-toolbar">
        <Link to={`/biblia/${activeBook.id}`}>← {activeBook.name}</Link>
        <div className="reader-toolbar-actions">
          <button
            className="reader-focus-link"
            type="button"
            onClick={() => setReadingModeOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={readingModeOpen}
          >
            Modo de lectura
          </button>
          <span>{bibleProvider.translation.label}</span>
        </div>
      </div>

      <aside className="reader-demo-notice">
        <strong>Contenido ficticio de prueba</strong>
        <span>No es RVR60. Estamos validando estructura, navegación y modo offline.</span>
      </aside>

      <article className="reading-sheet">
        {chapters.map((chapter) => (
          <section className="chapter-section" key={chapter.number} data-chapter-section={chapter.number}>
            <header className="chapter-heading">
              <p>{activeBook.name}</p>
              <h1>Capítulo {chapter.number}</h1>
            </header>

            {chapter.sections.map((section) => (
              <section className="bible-section" key={section.id}>
                {section.heading ? <h2>{section.heading}</h2> : null}
                <div className="verse-flow">
                  {section.verses.map((verse) => {
                    const anchorId = `verse-${activeBook.id}-${chapter.number}-${verse.number}`
                    const locationId = makeBibleLocationId({
                      bookId: activeBook.id,
                      chapter: chapter.number,
                      verse: verse.number,
                    })
                    const isActive = activeVerse?.anchorId === anchorId
                    const isHighlighted = highlightedIds.has(locationId)
                    const highlightColor = highlightColors.get(locationId)
                    const highlightValue = highlightPalette.find(
                      (item) => item.id === highlightColor,
                    )?.value
                    const isSelected = selectedVerseIds.has(locationId)
                    const panelVisible = isActive && actionPanelOpen && !selectionMode
                    const reference = `${activeBook.name} ${chapter.number}:${verse.number}`

                    return (
                      <div
                        className={[
                          'verse-item',
                          isActive ? 'active' : '',
                          isHighlighted ? 'highlighted' : '',
                          isSelected ? 'selected' : '',
                        ].filter(Boolean).join(' ')}
                        key={verse.number}
                        style={
                          highlightValue
                            ? ({ '--highlight-color': highlightValue } as CSSProperties)
                            : undefined
                        }
                      >
                        <button
                          id={anchorId}
                          className="verse verse-button"
                          type="button"
                          data-reading-anchor="true"
                          data-chapter={chapter.number}
                          aria-current={isActive ? 'true' : undefined}
                          aria-expanded={panelVisible}
                          aria-pressed={selectionMode ? isSelected : undefined}
                          aria-label={
                            selectionMode
                              ? `${reference}. ${isSelected ? 'Seleccionado' : 'No seleccionado'}`
                              : `${reference}. Tocar para marcar como versículo activo`
                          }
                          onClick={() => {
                            if (selectionMode) {
                              toggleSelectedVerse(locationId)
                              return
                            }
                            activateVerse(chapter.number, verse.number, anchorId)
                          }}
                        >
                          <sup>{verse.number}</sup>
                          {verse.text}
                        </button>

                        {isActive && !selectionMode ? (
                          <button
                            ref={actionTriggerRef}
                            className="verse-menu-trigger"
                            type="button"
                            aria-label={`Abrir opciones para ${reference}`}
                            aria-expanded={panelVisible}
                            onClick={(event) => {
                              event.stopPropagation()
                              setActionPanelOpen((current) => !current)
                            }}
                          >
                            ⋯
                          </button>
                        ) : null}

                        {panelVisible ? (
                          <div
                            ref={actionPanelRef}
                            className="verse-action-panel verse-action-floating glass-panel"
                            style={actionPanelPosition}
                            aria-label={`Opciones para ${reference}`}
                          >
                            <div className="verse-action-header">
                              <strong>{reference}</strong>
                              <button
                                type="button"
                                onClick={() => setActionPanelOpen(false)}
                                aria-label="Cerrar opciones"
                              >
                                ×
                              </button>
                            </div>

                            <div className="verse-action-buttons">
                              <button
                                className={`verse-action-button${favoriteActive ? ' active' : ''}`}
                                type="button"
                                aria-pressed={favoriteActive}
                                onClick={() => void handleFavorite()}
                              >
                                <span aria-hidden="true">{favoriteActive ? '★' : '☆'}</span>
                                {favoriteActive ? 'En favoritos' : 'Favorito'}
                              </button>

                              <button
                                className={`verse-action-button${noteOpen || noteSaved ? ' active' : ''}`}
                                type="button"
                                aria-expanded={noteOpen}
                                onClick={() => setNoteOpen((current) => !current)}
                              >
                                <span aria-hidden="true">✎</span>
                                {noteSaved ? 'Nota guardada' : 'Nota'}
                              </button>

                              <button
                                className={`verse-action-button${highlightActive ? ' active' : ''}`}
                                type="button"
                                aria-pressed={highlightActive}
                                aria-expanded={highlightPickerTarget === 'single'}
                                onClick={() =>
                                  setHighlightPickerTarget((current) =>
                                    current === 'single' ? undefined : 'single',
                                  )
                                }
                              >
                                <span aria-hidden="true">▰</span>
                                {highlightActive ? 'Cambiar resaltado' : 'Resaltar'}
                              </button>

                              <button
                                className="verse-action-button"
                                type="button"
                                onClick={() => void handleCopy()}
                              >
                                <span aria-hidden="true">⧉</span>
                                Copiar
                              </button>

                              <button
                                className="verse-action-button"
                                type="button"
                                onClick={() => openShareChooser('single')}
                              >
                                <span aria-hidden="true">↗</span>
                                Compartir
                              </button>

                              <button
                                className="verse-action-button"
                                type="button"
                                onClick={startMultiSelect}
                              >
                                <span aria-hidden="true">☑</span>
                                Seleccionar varios
                              </button>
                            </div>

                            {highlightPickerTarget === 'single' ? (
                              <div className="highlight-picker" aria-label="Color de resaltado">
                                <div className="highlight-palette">
                                  {highlightPalette.map((color) => (
                                    <button
                                      key={color.id}
                                      className="highlight-color-button"
                                      type="button"
                                      style={{ '--swatch-color': color.value } as CSSProperties}
                                      aria-label={`Resaltar en ${color.label}`}
                                      onClick={() => void applySingleHighlight(color.id)}
                                    >
                                      <span aria-hidden="true" />
                                      {color.label}
                                    </button>
                                  ))}
                                </div>
                                {highlightActive ? (
                                  <button
                                    className="button secondary"
                                    type="button"
                                    onClick={() => void removeSingleHighlight()}
                                  >
                                    Quitar resaltado
                                  </button>
                                ) : null}
                              </div>
                            ) : null}

                            {noteOpen ? (
                              <div className="verse-note-editor">
                                <label htmlFor={`note-${anchorId}`}>Tu nota</label>
                                <textarea
                                  id={`note-${anchorId}`}
                                  rows={3}
                                  maxLength={3000}
                                  value={noteDraft}
                                  placeholder="Escribí aquí lo que querés recordar…"
                                  onChange={(event) => setNoteDraft(event.target.value)}
                                />
                                <div className="verse-note-actions">
                                  <button
                                    className="button primary"
                                    type="button"
                                    disabled={!noteDraft.trim()}
                                    onClick={() => void handleSaveNote()}
                                  >
                                    Guardar nota
                                  </button>
                                  {noteSaved ? (
                                    <button
                                      className="button secondary"
                                      type="button"
                                      onClick={() => void handleDeleteNote()}
                                    >
                                      Eliminar
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}

                            {actionMessage ? (
                              <p className="verse-action-message" role="status">
                                {actionMessage}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </section>
        ))}
      </article>

      {selectionMode ? (
        <div className="verse-selection-bar glass-panel" aria-label="Acciones para selección múltiple">
          <div className="verse-selection-header">
            <strong>{selectedVerseIds.size} seleccionado{selectedVerseIds.size === 1 ? '' : 's'}</strong>
            <button type="button" onClick={stopMultiSelect} aria-label="Cerrar selección múltiple">×</button>
          </div>
          <div className="verse-action-buttons">
            <button
              className="verse-action-button"
              type="button"
              disabled={selectedVerseIds.size === 0}
              onClick={() => void handleBulkFavorite()}
            >
              <span aria-hidden="true">☆</span>
              Favoritos
            </button>
            <button
              className="verse-action-button"
              type="button"
              disabled={selectedVerseIds.size === 0}
              aria-expanded={highlightPickerTarget === 'multi'}
              onClick={() =>
                setHighlightPickerTarget((current) =>
                  current === 'multi' ? undefined : 'multi',
                )
              }
            >
              <span aria-hidden="true">▰</span>
              Resaltar
            </button>
            <button
              className="verse-action-button"
              type="button"
              disabled={selectedVerseIds.size === 0}
              onClick={() => void handleBulkCopy()}
            >
              <span aria-hidden="true">⧉</span>
              Copiar
            </button>
            <button
              className="verse-action-button"
              type="button"
              disabled={selectedVerseIds.size === 0}
              onClick={() => openShareChooser('multi')}
            >
              <span aria-hidden="true">↗</span>
              Compartir
            </button>
          </div>
          {highlightPickerTarget === 'multi' ? (
            <div className="highlight-picker" aria-label="Color para la selección">
              <div className="highlight-palette">
                {highlightPalette.map((color) => (
                  <button
                    key={color.id}
                    className="highlight-color-button"
                    type="button"
                    style={{ '--swatch-color': color.value } as CSSProperties}
                    aria-label={`Resaltar selección en ${color.label}`}
                    onClick={() => void applyBulkHighlight(color.id)}
                  >
                    <span aria-hidden="true" />
                    {color.label}
                  </button>
                ))}
              </div>
              {getCommonSelectedHighlightColor() ? (
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => void removeCommonBulkHighlight()}
                >
                  Quitar resaltado común
                </button>
              ) : null}
            </div>
          ) : null}
          {actionMessage ? <p className="verse-action-message" role="status">{actionMessage}</p> : null}
        </div>
      ) : null}

      {readingModeOpen ? (
        <div
          className="share-choice-backdrop"
          role="presentation"
          onClick={() => setReadingModeOpen(false)}
        >
          <section
            className="reading-mode-card glass-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reading-mode-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="verse-action-header">
              <strong id="reading-mode-title">Modo de lectura</strong>
              <button type="button" onClick={() => setReadingModeOpen(false)} aria-label="Cerrar">×</button>
            </div>
            <p>Elegí cómo querés leer sin perder tu posición en el lector normal.</p>
            <div className="reading-mode-options">
              <button
                className="reading-mode-option active"
                type="button"
                onClick={() => setReadingModeOpen(false)}
              >
                <strong>Continuo</strong>
                <span>Lista vertical como la vista actual.</span>
              </button>
              <button
                className="reading-mode-option"
                type="button"
                onClick={() => openFocusedMode('chapter')}
              >
                <strong>Capítulo por capítulo</strong>
                <span>Un capítulo completo con anterior, siguiente y gesto horizontal.</span>
              </button>
              <button
                className="reading-mode-option"
                type="button"
                onClick={() => openFocusedMode('verse')}
              >
                <strong>Versículo por versículo</strong>
                <span>Una sola referencia a la vez para lectura más pausada.</span>
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {shareTarget ? (
        <div className="share-choice-backdrop" role="presentation" onClick={closeShareChooser}>
          <section
            className="share-choice-card glass-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-choice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="verse-action-header">
              <strong id="share-choice-title">¿Cómo querés compartir?</strong>
              <button type="button" onClick={closeShareChooser} aria-label="Cerrar">×</button>
            </div>
            <p>Elegí texto o imagen. Para imagen podés usar un fondo predeterminado, un color propio o una foto personal.</p>
            <div className="share-background-options" aria-label="Fondo para compartir como imagen">
              {([
                ['paper', 'Claro'],
                ['forest', 'Bosque'],
                ['night', 'Noche'],
                ['sand', 'Arena'],
              ] as const).map(([theme, label]) => (
                <button
                  key={theme}
                  className={`share-background-swatch ${shareTheme === theme ? 'active' : ''} theme-${theme}`}
                  type="button"
                  aria-pressed={shareTheme === theme}
                  onClick={() => setShareTheme(theme)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="share-custom-backgrounds">
              <label>
                <span>Color personal</span>
                <input
                  type="color"
                  value={shareCustomColor}
                  onChange={(event) => {
                    setShareCustomColor(event.target.value)
                    setShareTheme('custom-color')
                  }}
                />
              </label>
              <label className={`share-file-label ${shareTheme === 'custom-image' ? 'active' : ''}`}>
                <span>Imagen personal</span>
                <input type="file" accept="image/*" onChange={handleCustomBackground} />
              </label>
            </div>
            <div className="share-choice-actions">
              <button className="button secondary" type="button" onClick={() => void shareAsText(shareTarget)}>
                Compartir como texto
              </button>
              <button className="button primary" type="button" onClick={() => void shareAsImage(shareTarget)}>
                Compartir como imagen
              </button>
            </div>
            {actionMessage ? <p className="verse-action-message" role="status">{actionMessage}</p> : null}
          </section>
        </div>
      ) : null}
    </div>
  )
}
