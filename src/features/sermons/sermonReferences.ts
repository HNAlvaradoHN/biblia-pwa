import { bibleProvider } from '../../data/bible/provider'

export type SermonFieldName = 'introduction' | 'outline' | 'conclusion'

export interface SermonBibleReference {
  id: string
  field: SermonFieldName
  blockId?: string
  fieldStartIndex?: number
  sourceText: string
  bookId: string
  bookName: string
  chapter: number
  verseStart: number
  verseEnd: number
  startIndex: number
  endIndex: number
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&')
}

export function detectBibleReferences(
  field: SermonFieldName,
  text: string,
): SermonBibleReference[] {
  const references: SermonBibleReference[] = []

  for (const book of bibleProvider.listBooks()) {
    const bookPattern = escapeRegExp(book.name)
    const expression = new RegExp(
      '\\b(' +
        bookPattern +
        ')\\s+(\\d{1,3})\\s*:\\s*(\\d{1,3})(?:\\s*[-–—]\\s*(\\d{1,3}))?',
      'giu',
    )

    for (const match of text.matchAll(expression)) {
      const chapter = Number(match[2])
      const verseStart = Number(match[3])
      const verseEnd = Number(match[4] ?? match[3])
      const chapterRecord = bibleProvider.getChapter(book.id, chapter)
      if (!chapterRecord || verseEnd < verseStart) continue

      const availableVerses = new Set(
        chapterRecord.sections.flatMap((section) =>
          section.verses.map((verse) => verse.number),
        ),
      )

      if (!availableVerses.has(verseStart) || !availableVerses.has(verseEnd)) {
        continue
      }

      const startIndex = match.index ?? 0
      const sourceText = match[0]
      references.push({
        id: [
          field,
          startIndex,
          book.id,
          chapter,
          verseStart + '-' + verseEnd,
        ].join(':'),
        field,
        sourceText,
        bookId: book.id,
        bookName: book.name,
        chapter,
        verseStart,
        verseEnd,
        startIndex,
        endIndex: startIndex + sourceText.length,
      })
    }
  }

  return references.sort((a, b) => a.startIndex - b.startIndex)
}

export function detectAllSermonReferences(fields: {
  introduction: string
  outline: string
  conclusion: string
}) {
  return (Object.keys(fields) as SermonFieldName[]).flatMap((field) =>
    detectBibleReferences(field, fields[field]),
  )
}

export function getReferencePassage(reference: SermonBibleReference) {
  const chapter = bibleProvider.getChapter(reference.bookId, reference.chapter)
  if (!chapter) return []

  return chapter.sections
    .flatMap((section) => section.verses)
    .filter(
      (verse) =>
        verse.number >= reference.verseStart &&
        verse.number <= reference.verseEnd,
    )
}


export function detectSermonBlockReferences(
  blocks: Array<{
    id: string
    section: SermonFieldName
    order: number
    text: string
    type?: string
  }>,
) {
  const references: SermonBibleReference[] = []

  for (const field of ['introduction', 'outline', 'conclusion'] as SermonFieldName[]) {
    const sectionBlocks = blocks
      .filter((block) => block.section === field)
      .sort((a, b) => a.order - b.order)
    let fieldOffset = 0

    for (const block of sectionBlocks) {
      if (block.type === 'image') continue

      const blockReferences = detectBibleReferences(field, block.text).map(
        (reference): SermonBibleReference => ({
          ...reference,
          id: `${block.id}:${reference.id}`,
          blockId: block.id,
          fieldStartIndex: fieldOffset + reference.startIndex,
        }),
      )
      references.push(...blockReferences)
      fieldOffset += block.text.length + 1
    }
  }

  return references
}

export function toPersistedSermonReferences(
  references: SermonBibleReference[],
) {
  return references.map((reference) => ({
    ...reference,
    startIndex: reference.fieldStartIndex ?? reference.startIndex,
    endIndex:
      (reference.fieldStartIndex ?? reference.startIndex) +
      reference.sourceText.length,
  }))
}
