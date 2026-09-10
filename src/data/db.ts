import Dexie, { type Table } from 'dexie'

export interface BibleLocation {
  bookId: string
  chapter: number
  verse: number
}

export interface ReadingProgress {
  id: 'last-reading'
  bookId: string
  chapter: number
  anchorId?: string
  updatedAt: number
}

export interface FavoriteRecord extends BibleLocation {
  id: string
  createdAt: number
  updatedAt: number
}

export interface BibleNoteRecord extends BibleLocation {
  id: string
  text: string
  createdAt: number
  updatedAt: number
}

class BibliaDatabase extends Dexie {
  readingProgress!: Table<ReadingProgress, string>
  favorites!: Table<FavoriteRecord, string>
  notes!: Table<BibleNoteRecord, string>

  constructor() {
    super('biblia-pwa')

    this.version(1).stores({
      readingProgress: 'id,bookId,chapter,updatedAt',
    })

    this.version(2).stores({
      readingProgress: 'id,bookId,chapter,updatedAt',
      favorites: 'id,bookId,chapter,verse,updatedAt',
      notes: 'id,bookId,chapter,verse,updatedAt',
    })
  }
}

export const db = new BibliaDatabase()

export function makeBibleLocationId(location: BibleLocation) {
  return `${location.bookId}:${location.chapter}:${location.verse}`
}

export async function getLastReading() {
  return db.readingProgress.get('last-reading')
}

export async function saveLastReading(
  reading: Omit<ReadingProgress, 'id' | 'updatedAt'>,
) {
  await db.readingProgress.put({
    id: 'last-reading',
    ...reading,
    updatedAt: Date.now(),
  })
}

export async function getFavorites() {
  return db.favorites.orderBy('updatedAt').reverse().toArray()
}

export async function getRecentFavorites(limit = 1) {
  return db.favorites.orderBy('updatedAt').reverse().limit(limit).toArray()
}

export async function isFavorite(location: BibleLocation) {
  const record = await db.favorites.get(makeBibleLocationId(location))
  return Boolean(record)
}

export async function toggleFavorite(location: BibleLocation) {
  const id = makeBibleLocationId(location)
  const existing = await db.favorites.get(id)

  if (existing) {
    await db.favorites.delete(id)
    return false
  }

  const now = Date.now()
  await db.favorites.put({
    id,
    ...location,
    createdAt: now,
    updatedAt: now,
  })
  return true
}

export async function removeFavorite(id: string) {
  await db.favorites.delete(id)
}

export async function getBibleNote(location: BibleLocation) {
  return db.notes.get(makeBibleLocationId(location))
}

export async function getNotes() {
  return db.notes.orderBy('updatedAt').reverse().toArray()
}

export async function getRecentNotes(limit = 1) {
  return db.notes.orderBy('updatedAt').reverse().limit(limit).toArray()
}

export async function saveBibleNote(location: BibleLocation, text: string) {
  const trimmedText = text.trim()
  const id = makeBibleLocationId(location)

  if (!trimmedText) {
    await db.notes.delete(id)
    return undefined
  }

  const existing = await db.notes.get(id)
  const now = Date.now()
  const record: BibleNoteRecord = {
    id,
    ...location,
    text: trimmedText,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  await db.notes.put(record)
  return record
}

export async function removeBibleNote(id: string) {
  await db.notes.delete(id)
}
