import { bibleProvider } from '../../data/bible/provider'
import type { BibleLocation } from '../../data/db'

export function resolveBibleLocation(location: BibleLocation) {
  const book = bibleProvider.getBook(location.bookId)
  const chapter = bibleProvider.getChapter(location.bookId, location.chapter)
  const verse = chapter?.sections
    .flatMap((section) => section.verses)
    .find((item) => item.number === location.verse)

  if (!book || !chapter || !verse) {
    return undefined
  }

  const anchorId = `verse-${book.id}-${chapter.number}-${verse.number}`

  return {
    book,
    chapter,
    verse,
    reference: `${book.name} ${chapter.number}:${verse.number}`,
    href: `/biblia/${book.id}/${chapter.number}#${anchorId}`,
  }
}
