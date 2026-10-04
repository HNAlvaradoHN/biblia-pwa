import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import type { SermonInlineMark } from '../../data/db'
import type { SermonBibleReference } from './sermonReferences'

export type SermonRichTextFieldHandle = {
  focusAt: (offset: number) => void
}

type SermonRichTextFieldProps = {
  value: string
  marks: SermonInlineMark[]
  references: SermonBibleReference[]
  placeholder: string
  ariaLabel: string
  className?: string
  onChange: (value: string) => void
  onReferenceOpen: (reference: SermonBibleReference) => void
  onFocus?: () => void
  onCaretChange?: (offset: number) => void
  onSelectionChange?: (start: number, end: number) => void
  onSplit?: (offset: number) => void
  onMergeBackward?: () => void
}

function getSelectionOffsets(root: HTMLElement) {
  const selection = window.getSelection()
  const fallback = root.textContent?.length ?? 0
  if (!selection || selection.rangeCount === 0) {
    return { start: fallback, end: fallback }
  }

  const range = selection.getRangeAt(0)
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
    return { start: fallback, end: fallback }
  }

  const startRange = document.createRange()
  startRange.selectNodeContents(root)
  startRange.setEnd(range.startContainer, range.startOffset)

  const endRange = document.createRange()
  endRange.selectNodeContents(root)
  endRange.setEnd(range.endContainer, range.endOffset)

  const start = startRange.toString().length
  const end = endRange.toString().length
  return start <= end ? { start, end } : { start: end, end: start }
}

function getCaretOffset(root: HTMLElement) {
  return getSelectionOffsets(root).end
}

function setCaretOffset(root: HTMLElement, requestedOffset: number) {
  const targetOffset = Math.max(
    0,
    Math.min(requestedOffset, root.textContent?.length ?? 0),
  )
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let consumed = 0
  let node = walker.nextNode()

  while (node) {
    const length = node.textContent?.length ?? 0
    if (consumed + length >= targetOffset) {
      const range = document.createRange()
      const selection = window.getSelection()
      range.setStart(node, targetOffset - consumed)
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
      return
    }
    consumed += length
    node = walker.nextNode()
  }

  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNodeContents(root)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

function insertPlainText(text: string) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  const range = selection.getRangeAt(0)
  range.deleteContents()
  const node = document.createTextNode(text)
  range.insertNode(node)
  range.setStartAfter(node)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

function markClasses(marks: SermonInlineMark[]) {
  const classes: string[] = []
  for (const mark of marks) {
    if (mark.type === 'bold') classes.push('sermon-inline-bold')
    if (mark.type === 'italic') classes.push('sermon-inline-italic')
    if (mark.type === 'underline') classes.push('sermon-inline-underline')
    if (mark.type === 'strike') classes.push('sermon-inline-strike')
    if (mark.type === 'link') classes.push('sermon-inline-link')
  }
  return classes
}

export const SermonRichTextField = forwardRef<
  SermonRichTextFieldHandle,
  SermonRichTextFieldProps
>(function SermonRichTextField(
  {
    value,
    marks,
    references,
    placeholder,
    ariaLabel,
    className = '',
    onChange,
    onReferenceOpen,
    onFocus,
    onCaretChange,
    onSelectionChange,
    onSplit,
    onMergeBackward,
  },
  forwardedRef,
) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const pendingCaretRef = useRef<number | null>(null)
  const referencesRef = useRef(references)
  const marksRef = useRef(marks)
  referencesRef.current = references
  marksRef.current = marks

  const referenceSignature = references
    .map(
      (reference) =>
        `${reference.id}:${reference.sourceText}:${reference.startIndex}:${reference.endIndex}`,
    )
    .join('|')
  const marksSignature = marks
    .map((mark) => `${mark.type}:${mark.start}:${mark.end}:${mark.href ?? ''}`)
    .join('|')

  useImperativeHandle(
    forwardedRef,
    () => ({
      focusAt(offset: number) {
        const editor = editorRef.current
        if (!editor) return
        editor.focus()
        setCaretOffset(editor, offset)
        editor.scrollIntoView({ block: 'center' })
      },
    }),
    [],
  )

  useLayoutEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const hadFocus =
      document.activeElement === editor || editor.contains(document.activeElement)
    const caretOffset = pendingCaretRef.current
    editor.replaceChildren()

    const boundaries = new Set<number>([0, value.length])
    for (const reference of referencesRef.current) {
      if (reference.startIndex >= 0 && reference.endIndex <= value.length) {
        boundaries.add(reference.startIndex)
        boundaries.add(reference.endIndex)
      }
    }
    for (const mark of marksRef.current) {
      boundaries.add(Math.max(0, Math.min(value.length, mark.start)))
      boundaries.add(Math.max(0, Math.min(value.length, mark.end)))
    }

    const sorted = [...boundaries].sort((a, b) => a - b)
    for (let index = 0; index < sorted.length - 1; index += 1) {
      const start = sorted[index]
      const end = sorted[index + 1]
      if (end <= start) continue

      const segment = value.slice(start, end)
      const reference = referencesRef.current.find(
        (item) => start >= item.startIndex && end <= item.endIndex,
      )
      const activeMarks = marksRef.current.filter(
        (mark) => start >= mark.start && end <= mark.end,
      )

      const element = document.createElement('span')
      const classes = markClasses(activeMarks)
      if (reference) classes.unshift('sermon-inline-reference')
      if (classes.length > 0) element.className = classes.join(' ')

      if (reference) {
        element.dataset.sermonReferenceId = reference.id
        element.setAttribute('role', 'button')
        element.setAttribute('tabindex', '0')
        element.setAttribute('contenteditable', 'false')
        element.setAttribute('aria-label', `Abrir ${reference.sourceText}`)
      }

      const link = activeMarks.find((mark) => mark.type === 'link' && mark.href)
      if (link?.href) {
        element.dataset.sermonHref = link.href
        element.title = link.href
      }

      element.textContent = segment
      editor.append(element)
    }

    if (value.length === 0) editor.append(document.createTextNode(''))

    if ((hadFocus || caretOffset !== null) && caretOffset !== null) {
      editor.focus()
      setCaretOffset(editor, caretOffset)
    }

    pendingCaretRef.current = null
  }, [marksSignature, referenceSignature, value])

  function reportSelection() {
    const editor = editorRef.current
    if (!editor) return
    const selection = getSelectionOffsets(editor)
    onCaretChange?.(selection.end)
    onSelectionChange?.(selection.start, selection.end)
  }

  function handleInput() {
    const editor = editorRef.current
    if (!editor) return
    pendingCaretRef.current = getCaretOffset(editor)
    reportSelection()
    onChange(editor.textContent ?? '')
  }

  function openReferenceFromTarget(target: EventTarget | null) {
    const element =
      target instanceof Element
        ? target.closest<HTMLElement>('[data-sermon-reference-id]')
        : null
    if (!element) return false
    const reference = references.find(
      (item) => item.id === element.dataset.sermonReferenceId,
    )
    if (!reference) return false
    onReferenceOpen(reference)
    return true
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!openReferenceFromTarget(event.target)) return
    event.preventDefault()
    event.stopPropagation()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target
    if (
      target instanceof HTMLElement &&
      target.dataset.sermonReferenceId &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault()
      openReferenceFromTarget(target)
      return
    }

    if (event.key === 'Enter' && onSplit) {
      event.preventDefault()
      const editor = editorRef.current
      if (!editor) return
      onSplit(getCaretOffset(editor))
      return
    }

    if (event.key === 'Backspace' && onMergeBackward) {
      const editor = editorRef.current
      if (!editor) return
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return
      if (getCaretOffset(editor) !== 0) return
      event.preventDefault()
      onMergeBackward()
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      insertPlainText('\n')
      handleInput()
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault()
    insertPlainText(event.clipboardData.getData('text/plain'))
    handleInput()
  }

  return (
    <div
      ref={editorRef}
      className={['sermon-rich-editor', className].filter(Boolean).join(' ')}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={ariaLabel}
      aria-multiline="true"
      data-placeholder={placeholder}
      spellCheck
      onInput={handleInput}
      onFocus={() => {
        onFocus?.()
        reportSelection()
      }}
      onClickCapture={(event) => {
        handleClick(event)
        reportSelection()
      }}
      onKeyDown={handleKeyDown}
      onKeyUp={reportSelection}
      onSelect={reportSelection}
      onPaste={handlePaste}
    />
  )
})
