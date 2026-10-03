import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import type { SermonBibleReference } from './sermonReferences'

export type SermonRichTextFieldHandle = {
  focusAt: (offset: number) => void
}

type SermonRichTextFieldProps = {
  value: string
  references: SermonBibleReference[]
  placeholder: string
  ariaLabel: string
  className?: string
  onChange: (value: string) => void
  onReferenceOpen: (reference: SermonBibleReference) => void
}

function getCaretOffset(root: HTMLElement) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return root.textContent?.length ?? 0

  const range = selection.getRangeAt(0)
  if (!root.contains(range.startContainer)) return root.textContent?.length ?? 0

  const prefix = document.createRange()
  prefix.selectNodeContents(root)
  prefix.setEnd(range.startContainer, range.startOffset)
  return prefix.toString().length
}

function setCaretOffset(root: HTMLElement, requestedOffset: number) {
  const targetOffset = Math.max(0, Math.min(requestedOffset, root.textContent?.length ?? 0))
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

export const SermonRichTextField = forwardRef<
  SermonRichTextFieldHandle,
  SermonRichTextFieldProps
>(function SermonRichTextField(
  {
    value,
    references,
    placeholder,
    ariaLabel,
    className = '',
    onChange,
    onReferenceOpen,
  },
  forwardedRef,
) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const pendingCaretRef = useRef<number | null>(null)

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

    const hadFocus = document.activeElement === editor || editor.contains(document.activeElement)
    const caretOffset = pendingCaretRef.current
    editor.replaceChildren()

    let cursor = 0
    const sortedReferences = [...references].sort((a, b) => a.startIndex - b.startIndex)

    for (const reference of sortedReferences) {
      if (reference.startIndex < cursor || reference.endIndex > value.length) continue

      if (reference.startIndex > cursor) {
        editor.append(document.createTextNode(value.slice(cursor, reference.startIndex)))
      }

      const mark = document.createElement('span')
      mark.className = 'sermon-inline-reference'
      mark.dataset.sermonReferenceId = reference.id
      mark.setAttribute('role', 'button')
      mark.setAttribute('tabindex', '0')
      mark.setAttribute('contenteditable', 'false')
      mark.setAttribute('aria-label', `Abrir ${reference.sourceText}`)
      mark.textContent = reference.sourceText
      editor.append(mark)
      cursor = reference.endIndex
    }

    if (cursor < value.length) {
      editor.append(document.createTextNode(value.slice(cursor)))
    }

    if (hadFocus && caretOffset !== null) {
      editor.focus()
      setCaretOffset(editor, caretOffset)
    }

    pendingCaretRef.current = null
  }, [references, value])

  function handleInput() {
    const editor = editorRef.current
    if (!editor) return
    pendingCaretRef.current = getCaretOffset(editor)
    onChange(editor.textContent ?? '')
  }

  function openReferenceFromTarget(target: EventTarget | null) {
    const element = target instanceof Element ? target.closest<HTMLElement>('[data-sermon-reference-id]') : null
    if (!element) return false
    const reference = references.find((item) => item.id === element.dataset.sermonReferenceId)
    if (!reference) return false
    onReferenceOpen(reference)
    return true
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!openReferenceFromTarget(event.target)) return
    event.preventDefault()
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
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
    />
  )
})
