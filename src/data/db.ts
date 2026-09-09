import Dexie, { type Table } from 'dexie'

export interface ReadingProgress {
  id: 'last-reading'
  bookId: string
  chapter: number
  anchorId?: string
  updatedAt: number
}

class BibliaDatabase extends Dexie {
  readingProgress!: Table<ReadingProgress, string>

  constructor() {
    super('biblia-pwa')
    this.version(1).stores({
      readingProgress: 'id,bookId,chapter,updatedAt',
    })
  }
}

export const db = new BibliaDatabase()

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
