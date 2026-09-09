export type Testament = 'OT' | 'NT'

export interface BibleVerse {
  number: number
  text: string
}

export interface BibleSection {
  id: string
  heading?: string
  verses: BibleVerse[]
}

export interface BibleChapter {
  number: number
  sections: BibleSection[]
}

export interface BibleBook {
  id: string
  name: string
  testament: Testament
  chapters: BibleChapter[]
}

export interface BibleTranslation {
  id: string
  label: string
  notice: string
  books: BibleBook[]
}

export interface BibleProvider {
  translation: BibleTranslation
  listBooks(): BibleBook[]
  getBook(bookId: string): BibleBook | undefined
  getChapter(bookId: string, chapter: number): BibleChapter | undefined
}
