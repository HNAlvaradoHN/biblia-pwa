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
  | 'image'

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

export interface SermonAttachmentRecord {
  id: string
  sermonId: string
  mimeType: string
  name: string
  blob: Blob
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
  attachmentId?: string
  altText?: string
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

function makeSermonBlockId(sermonId: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${sermonId}:block:${crypto.randomUUID()}`
  }

  return `${sermonId}:block:${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function makeStructuredMigrationBlockId(
  sermonId: string,
  section: SermonSection,
  index: number,
) {
  return `${sermonId}:block:${section}:${index}`
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
  sermonAttachments!: Table<SermonAttachmentRecord, string>

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

    this.version(7)
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
        const blocksTable =
          transaction.table<SermonBlockRecord, string>('sermonBlocks')
        const legacyBlocks = await blocksTable
          .filter((block) => block.id.includes(':legacy:'))
          .toArray()

        for (const legacy of legacyBlocks) {
          const lines = legacy.text.split('\n')
          const structured = (lines.length > 0 ? lines : ['']).map(
            (text, index): SermonBlockRecord => ({
              ...legacy,
              id: makeStructuredMigrationBlockId(
                legacy.sermonId,
                legacy.section,
                index,
              ),
              order: index,
              text,
            }),
          )

          await blocksTable.delete(legacy.id)
          await blocksTable.bulkPut(structured)
        }
      })

    this.version(8).stores({
      readingProgress: 'id,bookId,chapter,updatedAt',
      activeVerse: 'id,bookId,chapter,verse,updatedAt',
      favorites: 'id,bookId,chapter,verse,updatedAt',
      notes: 'id,bookId,chapter,verse,updatedAt',
      highlights: 'id,bookId,chapter,verse,updatedAt',
      sermons: 'id,status,updatedAt,title',
      sermonBlocks:
        'id,sermonId,[sermonId+section],[sermonId+section+order],section,order,updatedAt,attachmentId',
      sermonAttachments: 'id,sermonId,updatedAt',
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

function makeSermonAttachmentId(sermonId: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${sermonId}:attachment:${crypto.randomUUID()}`
  }

  return `${sermonId}:attachment:${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`
}

function makeSermonId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `sermon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function makeInitialSermonBlocks(record: SermonRecord) {
  return SERMON_SECTIONS.map(
    (section): SermonBlockRecord => ({
      id: makeSermonBlockId(record.id),
      sermonId: record.id,
      section,
      order: 0,
      type: 'paragraph',
      text: record[section],
      marks: [],
      indent: 0,
      revision: 1,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }),
  )
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
  const sectionBlocks = blocks.filter(
    (block) => block.section === section && block.type !== 'image',
  )
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

export async function saveSermonBlockDraft(blockId: string, text: string) {
  const existing = await db.sermonBlocks.get(blockId)
  if (!existing) return undefined

  const block: SermonBlockRecord = {
    ...existing,
    text,
    revision: existing.revision + 1,
    updatedAt: Date.now(),
  }

  await db.sermonBlocks.put(block)
  return block
}

export async function getSermonAttachment(id: string) {
  return db.sermonAttachments.get(id)
}

export async function insertSermonImageBlock(
  sermonId: string,
  section: SermonSection,
  file: File,
  afterBlockId?: string,
) {
  const sermon = await db.sermons.get(sermonId)
  if (!sermon || !file.type.startsWith('image/')) return undefined

  const sectionBlocks = (await loadSermonBlocks(sermonId)).filter(
    (block) => block.section === section,
  )
  const afterIndex = afterBlockId
    ? sectionBlocks.findIndex((block) => block.id === afterBlockId)
    : sectionBlocks.length - 1
  const insertOrder =
    afterIndex >= 0 ? sectionBlocks[afterIndex].order + 1 : sectionBlocks.length
  const now = Date.now()
  const attachment: SermonAttachmentRecord = {
    id: makeSermonAttachmentId(sermonId),
    sermonId,
    mimeType: file.type,
    name: file.name || 'Imagen',
    blob: file,
    createdAt: now,
    updatedAt: now,
  }
  const imageBlock: SermonBlockRecord = {
    id: makeSermonBlockId(sermonId),
    sermonId,
    section,
    order: insertOrder,
    type: 'image',
    text: '',
    marks: [],
    indent: 0,
    attachmentId: attachment.id,
    altText: file.name || 'Imagen',
    revision: 1,
    createdAt: now,
    updatedAt: now,
  }
  const followingBlock: SermonBlockRecord = {
    id: makeSermonBlockId(sermonId),
    sermonId,
    section,
    order: insertOrder + 1,
    type: 'paragraph',
    text: '',
    marks: [],
    indent: 0,
    revision: 1,
    createdAt: now,
    updatedAt: now,
  }

  await db.transaction(
    'rw',
    db.sermonBlocks,
    db.sermonAttachments,
    async () => {
      await db.sermonBlocks
        .where('[sermonId+section]')
        .equals([sermonId, section])
        .filter((item) => item.order >= insertOrder)
        .modify((item) => {
          item.order += 2
        })
      await db.sermonAttachments.add(attachment)
      await db.sermonBlocks.bulkAdd([imageBlock, followingBlock])
    },
  )

  return { imageBlock, followingBlock }
}

export async function removeSermonImageBlock(blockId: string) {
  const block = await db.sermonBlocks.get(blockId)
  if (!block || block.type !== 'image') return false

  await db.transaction(
    'rw',
    db.sermonBlocks,
    db.sermonAttachments,
    async () => {
      await db.sermonBlocks.delete(block.id)
      if (block.attachmentId) {
        await db.sermonAttachments.delete(block.attachmentId)
      }
      await db.sermonBlocks
        .where('[sermonId+section]')
        .equals([block.sermonId, block.section])
        .filter((item) => item.order > block.order)
        .modify((item) => {
          item.order -= 1
        })
    },
  )

  return true
}

export async function appendSermonBlock(
  sermonId: string,
  section: SermonSection,
) {
  const sermon = await db.sermons.get(sermonId)
  if (!sermon) return undefined

  const sectionBlocks = (await loadSermonBlocks(sermonId)).filter(
    (block) => block.section === section,
  )
  const now = Date.now()
  const block: SermonBlockRecord = {
    id: makeSermonBlockId(sermonId),
    sermonId,
    section,
    order:
      sectionBlocks.length === 0
        ? 0
        : Math.max(...sectionBlocks.map((item) => item.order)) + 1,
    type: 'paragraph',
    text: '',
    marks: [],
    indent: 0,
    revision: 1,
    createdAt: now,
    updatedAt: now,
  }

  await db.sermonBlocks.add(block)
  return block
}

export async function splitSermonBlock(
  blockId: string,
  text: string,
  offset: number,
) {
  const existing = await db.sermonBlocks.get(blockId)
  if (!existing) return undefined

  const safeOffset = Math.max(0, Math.min(offset, text.length))
  const now = Date.now()
  const before = text.slice(0, safeOffset)
  const after = text.slice(safeOffset)
  const nextBlock: SermonBlockRecord = {
    ...existing,
    id: makeSermonBlockId(existing.sermonId),
    order: existing.order + 1,
    type: existing.type === 'heading' ? 'paragraph' : existing.type,
    text: after,
    marks: [],
    revision: 1,
    createdAt: now,
    updatedAt: now,
  }

  await db.transaction('rw', db.sermonBlocks, async () => {
    await db.sermonBlocks
      .where('[sermonId+section]')
      .equals([existing.sermonId, existing.section])
      .filter((block) => block.order > existing.order)
      .modify((block) => {
        block.order += 1
      })

    await db.sermonBlocks.put({
      ...existing,
      text: before,
      revision: existing.revision + 1,
      updatedAt: now,
    })
    await db.sermonBlocks.add(nextBlock)
  })

  return nextBlock
}

export async function mergeSermonBlockWithPrevious(
  blockId: string,
  currentText: string,
) {
  const current = await db.sermonBlocks.get(blockId)
  if (!current) return undefined

  const sectionBlocks = (await loadSermonBlocks(current.sermonId)).filter(
    (block) => block.section === current.section,
  )
  const index = sectionBlocks.findIndex((block) => block.id === blockId)
  if (index <= 0) return undefined

  const previous = sectionBlocks[index - 1]
  const now = Date.now()
  const previousLength = previous.text.length
  const merged: SermonBlockRecord = {
    ...previous,
    text: previous.text + currentText,
    revision: previous.revision + 1,
    updatedAt: now,
  }

  await db.transaction('rw', db.sermonBlocks, async () => {
    await db.sermonBlocks.put(merged)
    await db.sermonBlocks.delete(current.id)
    await db.sermonBlocks
      .where('[sermonId+section]')
      .equals([current.sermonId, current.section])
      .filter((block) => block.order > current.order)
      .modify((block) => {
        block.order -= 1
      })
  })

  return { block: merged, caretOffset: previousLength }
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
    await db.sermonBlocks.bulkPut(makeInitialSermonBlocks(record))
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

  await db.sermons.put(record)
  return hydrateSermon(record)
}

export async function duplicateSermon(id: string) {
  const existing = await getSermon(id)
  if (!existing) return undefined

  const sourceBlocks = await loadSermonBlocks(id)
  const sourceAttachments = await db.sermonAttachments
    .where('sermonId')
    .equals(id)
    .toArray()
  const now = Date.now()
  const record: SermonRecord = {
    ...existing,
    id: makeSermonId(),
    title: `${existing.title} — copia`,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }

  const attachmentMap = new Map<string, string>()
  const attachments = sourceAttachments.map(
    (attachment): SermonAttachmentRecord => {
      const nextId = makeSermonAttachmentId(record.id)
      attachmentMap.set(attachment.id, nextId)
      return {
        ...attachment,
        id: nextId,
        sermonId: record.id,
        createdAt: now,
        updatedAt: now,
      }
    },
  )

  const blocks =
    sourceBlocks.length > 0
      ? sourceBlocks.map(
          (block): SermonBlockRecord => ({
            ...block,
            id: makeSermonBlockId(record.id),
            sermonId: record.id,
            attachmentId: block.attachmentId
              ? attachmentMap.get(block.attachmentId)
              : undefined,
            revision: 1,
            createdAt: now,
            updatedAt: now,
          }),
        )
      : makeInitialSermonBlocks(record)

  await db.transaction(
    'rw',
    db.sermons,
    db.sermonBlocks,
    db.sermonAttachments,
    async () => {
      await db.sermons.add(record)
      if (attachments.length > 0) {
        await db.sermonAttachments.bulkAdd(attachments)
      }
      await db.sermonBlocks.bulkPut(blocks)
    },
  )

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

  await db.transaction(
    'rw',
    db.sermons,
    db.sermonBlocks,
    db.sermonAttachments,
    async () => {
      await db.sermons.delete(id)
      await db.sermonBlocks.where('sermonId').equals(id).delete()
      await db.sermonAttachments.where('sermonId').equals(id).delete()
    },
  )

  return true
}
