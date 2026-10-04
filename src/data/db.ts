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

export interface ActiveVerseRecord extends BibleLocation {
  id: 'active-verse'
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

export type HighlightColor = 'amber' | 'sage' | 'sky' | 'rose' | 'lavender' | 'peach'

export interface HighlightRecord extends BibleLocation {
  id: string
  color?: HighlightColor
  createdAt: number
  updatedAt: number
}

export type SermonStatus = 'active' | 'archived'
export type SermonSection = 'introduction' | 'outline' | 'conclusion'
export type SermonBlockType =
  | 'paragraph'
  | 'heading'
  | 'bullet'
  | 'numbered'
  | 'task'
  | 'quote'

export type SermonInlineMarkType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'link'

export interface SermonInlineMark {
  type: SermonInlineMarkType
  start: number
  end: number
  href?: string
}

export interface SermonReferenceRecord {
  id: string
  field: SermonSection
  sourceText: string
  bookId: string
  bookName: string
  chapter: number
  verseStart: number
  verseEnd: number
  startIndex: number
  endIndex: number
}

export interface SermonRecord {
  id: string
  title: string
  introduction: string
  outline: string
  conclusion: string
  references: SermonReferenceRecord[]
  status: SermonStatus
  createdAt: number
  updatedAt: number
}

export interface SermonBlockRecord {
  id: string
  sermonId: string
  section: SermonSection
  order: number
  type: SermonBlockType
  text: string
  marks: SermonInlineMark[]
  indent: number
  checked?: boolean
  headingLevel?: 1 | 2
  revision: number
  createdAt: number
  updatedAt: number
}

const SERMON_SECTIONS: SermonSection[] = [
  'introduction',
  'outline',
  'conclusion',
]

function makeLegacySermonBlockId(sermonId: string, section: SermonSection) {
  return `${sermonId}:legacy:${section}`
}

function makeLegacySermonBlocks(sermon: SermonRecord): SermonBlockRecord[] {
  return SERMON_SECTIONS.map((section) => ({
    id: makeLegacySermonBlockId(sermon.id, section),
    sermonId: sermon.id,
    section,
    order: 0,
    type: 'paragraph',
    text: sermon[section],
    marks: [],
    indent: 0,
    revision: 1,
    createdAt: sermon.createdAt,
    updatedAt: sermon.updatedAt,
  }))
}

class BibliaDatabase extends Dexie {
  readingProgress!: Table<ReadingProgress, string>
  activeVerse!: Table<ActiveVerseRecord, string>
  favorites!: Table<FavoriteRecord, string>
  notes!: Table<BibleNoteRecord, string>
  highlights!: Table<HighlightRecord, string>
  sermons!: Table<SermonRecord, string>
  sermonBlocks!: Table<SermonBlockRecord, string>

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

    this.version(3).stores({
      readingProgress: 'id,bookId,chapter,updatedAt',
      activeVerse: 'id,bookId,chapter,verse,updatedAt',
      favorites: 'id,bookId,chapter,verse,updatedAt',
      notes: 'id,bookId,chapter,verse,updatedAt',
      highlights: 'id,bookId,chapter,verse,updatedAt',
    })

    this.version(4).stores({
      readingProgress: 'id,bookId,chapter,updatedAt',
      activeVerse: 'id,bookId,chapter,verse,updatedAt',
      favorites: 'id,bookId,chapter,verse,updatedAt',
      notes: 'id,bookId,chapter,verse,updatedAt',
      highlights: 'id,bookId,chapter,verse,updatedAt',
      sermons: 'id,status,updatedAt,title',
    })

    this.version(5)
      .stores({
        readingProgress: 'id,bookId,chapter,updatedAt',
        activeVerse: 'id,bookId,chapter,verse,updatedAt',
        favorites: 'id,bookId,chapter,verse,updatedAt',
        notes: 'id,bookId,chapter,verse,updatedAt',
        highlights: 'id,bookId,chapter,verse,updatedAt',
        sermons: 'id,status,updatedAt,title',
      })
      .upgrade(async (transaction) => {
        await transaction
          .table<SermonRecord, string>('sermons')
          .toCollection()
          .modify((sermon) => {
            if (!Array.isArray(sermon.references)) {
              sermon.references = []
            }
          })
      })

    this.version(6)
      .stores({
        readingProgress: 'id,bookId,chapter,updatedAt',
        activeVerse: 'id,bookId,chapter,verse,updatedAt',
        favorites: 'id,bookId,chapter,verse,updatedAt',
        notes: 'id,bookId,chapter,verse,updatedAt',
        highlights: 'id,bookId,chapter,verse,updatedAt',
        sermons: 'id,status,updatedAt,title',
        sermonBlocks:
          'id,sermonId,[sermonId+section],[sermonId+section+order],section,order,updatedAt',
      })
      .upgrade(async (transaction) => {
        const sermons = await transaction
          .table<SermonRecord, string>('sermons')
          .toArray()
        const blocks = sermons.flatMap(makeLegacySermonBlocks)

        if (blocks.length > 0) {
          await transaction
            .table<SermonBlockRecord, string>('sermonBlocks')
            .bulkPut(blocks)
        }
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

export async function getActiveVerse() {
  return db.activeVerse.get('active-verse')
}

export async function saveActiveVerse(location: BibleLocation) {
  await db.activeVerse.put({
    id: 'active-verse',
    ...location,
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

export async function getHighlights() {
  return db.highlights.orderBy('updatedAt').reverse().toArray()
}

export async function getHighlight(location: BibleLocation) {
  return db.highlights.get(makeBibleLocationId(location))
}

export async function isHighlighted(location: BibleLocation) {
  const record = await getHighlight(location)
  return Boolean(record)
}

export async function setHighlight(location: BibleLocation, color: HighlightColor) {
  const id = makeBibleLocationId(location)
  const existing = await db.highlights.get(id)
  const now = Date.now()
  const record: HighlightRecord = {
    id,
    ...location,
    color,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
  await db.highlights.put(record)
  return record
}

export async function removeHighlight(location: BibleLocation) {
  await db.highlights.delete(makeBibleLocationId(location))
}

export async function toggleHighlight(location: BibleLocation) {
  const id = makeBibleLocationId(location)
  const existing = await db.highlights.get(id)

  if (existing) {
    await db.highlights.delete(id)
    return false
  }

  await setHighlight(location, 'amber')
  return true
}

function makeSermonId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `sermon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

async function writeLegacySermonBlocks(record: SermonRecord) {
  const blocks: SermonBlockRecord[] = []

  for (const section of SERMON_SECTIONS) {
    const id = makeLegacySermonBlockId(record.id, section)
    const existing = await db.sermonBlocks.get(id)
    blocks.push({
      id,
      sermonId: record.id,
      section,
      order: 0,
      type: 'paragraph',
      text: record[section],
      marks: [],
      indent: 0,
      revision: (existing?.revision ?? 0) + 1,
      createdAt: existing?.createdAt ?? record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  await db.sermonBlocks.bulkPut(blocks)
}

async function loadSermonBlocks(id: string) {
  const records = await db.sermonBlocks.where('sermonId').equals(id).toArray()
  return records.sort((a, b) => {
    const sectionDifference =
      SERMON_SECTIONS.indexOf(a.section) - SERMON_SECTIONS.indexOf(b.section)
    return sectionDifference || a.order - b.order
  })
}

function composeSermonSection(
  blocks: SermonBlockRecord[],
  section: SermonSection,
  fallback: string,
) {
  const sectionBlocks = blocks.filter((block) => block.section === section)
  return sectionBlocks.length > 0
    ? sectionBlocks.map((block) => block.text).join('\n')
    : fallback
}

async function hydrateSermon(record: SermonRecord) {
  const blocks = await loadSermonBlocks(record.id)
  if (blocks.length === 0) return record

  const blockUpdatedAt = blocks.reduce(
    (latest, block) => Math.max(latest, block.updatedAt),
    record.updatedAt,
  )

  return {
    ...record,
    introduction: composeSermonSection(
      blocks,
      'introduction',
      record.introduction,
    ),
    outline: composeSermonSection(blocks, 'outline', record.outline),
    conclusion: composeSermonSection(
      blocks,
      'conclusion',
      record.conclusion,
    ),
    updatedAt: blockUpdatedAt,
  }
}

export async function getSermons(status?: SermonStatus) {
  const storedRecords = await db.sermons.toArray()
  const records = await Promise.all(storedRecords.map(hydrateSermon))
  const filtered = status
    ? records.filter((record) => record.status === status)
    : records

  return filtered.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function getSermon(id: string) {
  const record = await db.sermons.get(id)
  return record ? hydrateSermon(record) : undefined
}

export async function getSermonBlocks(id: string) {
  return loadSermonBlocks(id)
}

export async function saveSermonSectionDraft(
  id: string,
  section: SermonSection,
  text: string,
) {
  const sermon = await db.sermons.get(id)
  if (!sermon) return undefined

  const blockId = makeLegacySermonBlockId(id, section)
  const existing = await db.sermonBlocks.get(blockId)
  const now = Date.now()
  const block: SermonBlockRecord = {
    id: blockId,
    sermonId: id,
    section,
    order: 0,
    type: 'paragraph',
    text,
    marks: existing?.marks ?? [],
    indent: existing?.indent ?? 0,
    checked: existing?.checked,
    headingLevel: existing?.headingLevel,
    revision: (existing?.revision ?? 0) + 1,
    createdAt: existing?.createdAt ?? sermon.createdAt,
    updatedAt: now,
  }

  await db.sermonBlocks.put(block)
  return block
}

export async function saveSermonTitle(id: string, title: string) {
  const normalizedTitle = title.trim() || 'Sin título'
  const updatedAt = Date.now()
  const updated = await db.sermons.update(id, {
    title: normalizedTitle,
    updatedAt,
  })

  return updated ? { title: normalizedTitle, updatedAt } : undefined
}

export async function createSermon() {
  const now = Date.now()
  const record: SermonRecord = {
    id: makeSermonId(),
    title: 'Nueva prédica',
    introduction: '',
    outline: '',
    conclusion: '',
    references: [],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }

  await db.transaction('rw', db.sermons, db.sermonBlocks, async () => {
    await db.sermons.add(record)
    await writeLegacySermonBlocks(record)
  })

  return record
}

export async function saveSermon(
  id: string,
  content: Pick<
    SermonRecord,
    'title' | 'introduction' | 'outline' | 'conclusion' | 'references'
  >,
) {
  const existing = await db.sermons.get(id)
  if (!existing) return undefined

  const record: SermonRecord = {
    ...existing,
    title: content.title.trim() || 'Sin título',
    introduction: content.introduction,
    outline: content.outline,
    conclusion: content.conclusion,
    references: content.references,
    updatedAt: Date.now(),
  }

  await db.transaction('rw', db.sermons, db.sermonBlocks, async () => {
    await db.sermons.put(record)
    await writeLegacySermonBlocks(record)
  })

  return record
}

export async function duplicateSermon(id: string) {
  const existing = await getSermon(id)
  if (!existing) return undefined

  const now = Date.now()
  const record: SermonRecord = {
    ...existing,
    id: makeSermonId(),
    title: `${existing.title} — copia`,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }

  await db.transaction('rw', db.sermons, db.sermonBlocks, async () => {
    await db.sermons.add(record)
    await writeLegacySermonBlocks(record)
  })

  return record
}

export async function setSermonArchived(id: string, archived: boolean) {
  const existing = await db.sermons.get(id)
  if (!existing) return undefined

  const record: SermonRecord = {
    ...existing,
    status: archived ? 'archived' : 'active',
    updatedAt: Date.now(),
  }

  await db.sermons.put(record)
  return record
}

export async function deleteSermon(id: string) {
  const existing = await db.sermons.get(id)
  if (!existing) return false

  await db.transaction('rw', db.sermons, db.sermonBlocks, async () => {
    await db.sermons.delete(id)
    await db.sermonBlocks.where('sermonId').equals(id).delete()
  })

  return true
}
