const AnnouncementRepository = require('../../../src/persistence/repositories/AnnouncementRepository')

const Database = require('../../../src/persistence/Database')
jest.mock('../../../src/persistence/Database')

describe('AnnouncementRepository', () => {
  const databaseTable = 'test_announcements'
  let database

  /**
   * @var {AnnouncementRepository}
   */
  let announcementRepository

  beforeAll(() => {
    database = new Database()
    database.select.mockResolvedValue([])
  })

  beforeEach(() => {
    announcementRepository = new AnnouncementRepository(database, databaseTable)

    database.delete.mockClear()
    database.insert.mockClear()
    database.select.mockClear()
    database.update.mockClear()
  })

  describe('.create()', () => {
    it('should call Database.insert()', async () => {
      const validFrom = new Date()
      const validTo = new Date()
      await announcementRepository.create('Some title', 'The text', true, validFrom, validTo)
      expect(database.insert).toHaveBeenCalledTimes(1)
      expect(database.insert).toHaveBeenCalledWith(
        databaseTable,
        { title: 'Some title', body: 'The text', important: 1, valid_from: validFrom, valid_to: validTo }
      )
    })

    it('should convert Boolean value to Number', async () => {
      await announcementRepository.create('', '', false, new Date(), new Date())
      expect(database.insert.mock.calls[0][1].important).toBe(0)
    })

    it('should return the ID returned from Database.insert()', async () => {
      database.insert.mockResolvedValueOnce(54)
      const id = await announcementRepository.create('', '', true, new Date(), new Date())
      expect(id).toBe(54)
    })
  })

  describe('.deleteOne()', () => {
    it('should call Database.delete()', async () => {
      await announcementRepository.deleteOne(8645)
      expect(database.delete).toHaveBeenCalledTimes(1)
      expect(database.delete).toHaveBeenCalledWith(databaseTable, { id: 8645 }, 1
      )
    })

    it('should return the ID if deletion was successful', async () => {
      database.delete.mockResolvedValueOnce(1)
      const id = await announcementRepository.deleteOne(124124)
      expect(id).toBe(124124)
    })

    it('should return null if nothing was deleted', async () => {
      database.delete.mockResolvedValueOnce(0)
      const id = await announcementRepository.deleteOne(123)
      expect(id).toBeNull()
    })
  })

  describe('.getAll()', () => {
    it('should call Database.select()', async () => {
      await announcementRepository.getAll()
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith(databaseTable)
    })

    it('should transform result rows', async () => {
      const date1 = new Date()
      const date2 = new Date()
      const date3 = new Date()
      const date4 = new Date()
      const result = [
        { id: 51, title: 'lrlno', body: 'vqlyl', important: 1, valid_from: date1, valid_to: date2, created: date3, updated: date4 },
        { id: 846, title: 'fdvrr', body: '', important: 0, valid_from: date2, valid_to: null, created: date4, updated: date3 },
        { id: 467, title: '', body: 'exlao', important: 0, valid_from: null, valid_to: date3, created: date1, updated: date2 }
      ]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const announcements = await announcementRepository.getAll()
      expect(announcements).toBeInstanceOf(Array)
      expect(announcements).toHaveLength(3)
      expect(announcements[0]).toEqual({ id: 51, title: 'lrlno', text: 'vqlyl', important: true, validFrom: date1, validTo: date2, createdAt: date3, updatedAt: date4 })
      expect(announcements[1]).toEqual({ id: 846, title: 'fdvrr', text: '', important: false, validFrom: date2, validTo: null, createdAt: date4, updatedAt: date3 })
      expect(announcements[2]).toEqual({ id: 467, title: '', text: 'exlao', important: false, validFrom: null, validTo: date3, createdAt: date1, updatedAt: date2 })
    })
  })

  describe('.getOne()', () => {
    it('should call Database.select()', async () => {
      await announcementRepository.getOne(24)
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith(databaseTable, '*', { id: 24 }, {}, 1)
    })

    it('should transform result rows', async () => {
      const date1 = new Date()
      const date2 = new Date()
      const date3 = new Date()
      const date4 = new Date()
      const result = [{ id: 14, title: 'mhyuy', body: 'urgch', important: 1, valid_from: date1, valid_to: date2, created: date3, updated: date4 }]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const announcement = await announcementRepository.getOne(14)
      expect(announcement).toEqual({ id: 14, title: 'mhyuy', text: 'urgch', important: true, validFrom: date1, validTo: date2, createdAt: date3, updatedAt: date4 })
    })

    it('should return null when requesting an Announcement with an unknown ID', async () => {
      const announcement = await announcementRepository.getOne(0)
      expect(announcement).toBeNull()
    })
  })

  describe('.updateOne()', () => {
    it('should call Database.update()', async () => {
      const date1 = new Date()
      const date2 = new Date()
      await announcementRepository.updateOne(5214, 'New title', 'New Text', false, date1, date2)
      expect(database.update).toHaveBeenCalledTimes(1)
      expect(database.update).toHaveBeenCalledWith(
        databaseTable,
        { title: 'New title', body: 'New Text', important: 0, valid_from: date1, valid_to: date2 },
        { id: 5214 }
      )
    })

    it('should convert Boolean value to Number', async () => {
      await announcementRepository.updateOne(6845, '', '', true, new Date(), new Date())
      expect(database.update.mock.calls[0][1].important).toBe(1)
    })

    it('should return the ID on success', async () => {
      database.update.mockResolvedValueOnce(1)
      const id = await announcementRepository.updateOne(51, '', '', false, new Date(), new Date())
      expect(id).toBe(51)
    })

    it('should return null when nothing changed', async () => {
      database.update.mockResolvedValueOnce(0)
      const id = await announcementRepository.updateOne(231, '', '', false, new Date(), new Date())
      expect(id).toBeNull()
    })
  })
})
