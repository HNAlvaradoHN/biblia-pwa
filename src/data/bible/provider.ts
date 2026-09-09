import { demoBible } from './demoBible'
import type { BibleProvider } from './types'

export const bibleProvider: BibleProvider = {
  translation: demoBible,
  listBooks() {
    return demoBible.books
  },
  getBook(bookId) {
    return demoBible.books.find((book) => book.id === bookId)
  },
  getChapter(bookId, chapter) {
    return this.getBook(bookId)?.chapters.find((item) => item.number === chapter)
  },
}

export function getDemoDailyVerse() {
  const books = bibleProvider.listBooks()
  const verses = books.flatMap((book) =>
    book.chapters.flatMap((chapter) =>
      chapter.sections.flatMap((section) =>
        section.verses.map((verse) => ({
          book,
          chapter,
          verse,
        })),
      ),
    ),
  )

  const today = new Date()
  const dayKey = Math.floor(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86_400_000,
  )

  return verses[dayKey % verses.length]
}
