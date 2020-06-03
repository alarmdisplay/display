const ContentSlotRepository = require('../../../src/persistence/repositories/ContentSlotRepository')

const Database = require('../../../src/persistence/Database')
jest.mock('../../../src/persistence/Database')

describe('ContentSlotRepository', () => {
  const databaseTable = 'test_contentslots'
  const optionsTable = 'test_contentslot_options'
  let database

  /**
   * @var {ContentSlotRepository}
   */
  let contentSlotRepository

  beforeAll(() => {
    database = new Database()
  })

  beforeEach(() => {
    contentSlotRepository = new ContentSlotRepository(database, databaseTable, optionsTable)

    database.delete.mockReset()
    database.insert.mockReset()
    database.select.mockReset()
    database.select.mockResolvedValue([])
    database.update.mockReset()
  })

  describe('.create()', () => {
    it('should call Database.insert()', async () => {
      contentSlotRepository.setOptionsForContentSlot = jest.fn().mockResolvedValueOnce(true) // Mock this internal method, it is tested separately
      await contentSlotRepository.createContentSlot('A', 2, 4, 8, 5, 1, {})
      expect(database.insert).toHaveBeenCalledTimes(1)
      expect(database.insert).toHaveBeenCalledWith(
        databaseTable,
        { component_type: 'A', view_id: 2, column_start: 4, row_start: 8, column_end: 5, row_end: 1 }
      )
    })

    it('should return the ID returned from Database.insert()', async () => {
      database.insert.mockResolvedValueOnce(65)
      contentSlotRepository.setOptionsForContentSlot = jest.fn().mockResolvedValueOnce(true) // Mock this internal method, it is tested separately
      const id = await contentSlotRepository.createContentSlot('', 0, 0, 0, 0, 0, {})
      expect(id).toBe(65)
    })

    it('should set the options', async () => {
      database.insert.mockResolvedValueOnce(84)
      contentSlotRepository.setOptionsForContentSlot = jest.fn().mockResolvedValueOnce(true) // Mock this internal method, it is tested separately
      await contentSlotRepository.createContentSlot('A', 2, 4, 8, 5, 1, { a: 2, b: '9' })
      expect(contentSlotRepository.setOptionsForContentSlot).toHaveBeenCalledTimes(1)
      expect(contentSlotRepository.setOptionsForContentSlot).toHaveBeenCalledWith(84, { a: 2, b: '9' })
    })
  })

  describe('.deleteOne()', () => {
    it('should call Database.delete()', async () => {
      await contentSlotRepository.deleteOne(234)
      expect(database.delete).toHaveBeenCalledTimes(1)
      expect(database.delete).toHaveBeenCalledWith(databaseTable, { id: 234 }, 1
      )
    })

    it('should return the ID if deletion was successful', async () => {
      database.delete.mockResolvedValueOnce(1)
      const id = await contentSlotRepository.deleteOne(24541)
      expect(id).toBe(24541)
    })

    it('should return null if nothing was deleted', async () => {
      database.delete.mockResolvedValueOnce(0)
      const id = await contentSlotRepository.deleteOne(1423)
      expect(id).toBeNull()
    })
  })

  describe('.getContentSlotsByViewId()', () => {
    it('should call Database.select()', async () => {
      await contentSlotRepository.getContentSlotsByViewId(45)
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith(databaseTable, '*', { view_id: 45 })
    })

    it('should return an Array of Content Slot objects', async () => {
      // Query response for the content slots
      database.select.mockResolvedValueOnce([
        { id: 131, component_type: 'A', view_id: 12, column_start: 4, row_start: 8, column_end: 5, row_end: 1 },
        { id: 132, component_type: 'B', view_id: 12, column_start: 1, row_start: 1, column_end: 4, row_end: 5 },
        { id: 133, component_type: 'C', view_id: 12, column_start: 0, row_start: 0, column_end: 4, row_end: 5 }
      ])
      // Query response for the options of all content slots
      database.select.mockResolvedValueOnce([
        { id: 6, contentslot_id: 131, name: 'r', value: '9' },
        { id: 7, contentslot_id: 131, name: 's', value: '8' },
        { id: 8, contentslot_id: 131, name: 't', value: '7' },
        { id: 11, contentslot_id: 132, name: 'x', value: '1' }
      ])
      const contentSlots = await contentSlotRepository.getContentSlotsByViewId(12)
      expect(contentSlots).toBeInstanceOf(Array)
      expect(contentSlots).toHaveLength(3)
      expect(contentSlots[0]).toEqual({ id: 131, componentType: 'A', viewId: 12, columnStart: 4, rowStart: 8, columnEnd: 5, rowEnd: 1, options: { r: '9', s: '8', t: '7' } })
      expect(contentSlots[1]).toEqual({ id: 132, componentType: 'B', viewId: 12, columnStart: 1, rowStart: 1, columnEnd: 4, rowEnd: 5, options: { x: '1' } })
      expect(contentSlots[2]).toEqual({ id: 133, componentType: 'C', viewId: 12, columnStart: 0, rowStart: 0, columnEnd: 4, rowEnd: 5, options: {} })
    })

    it('should return an empty Array if no Content Slot matched', async () => {
      const contentSlots = await contentSlotRepository.getContentSlotsByViewId(0)
      expect(contentSlots).toBeInstanceOf(Array)
      expect(contentSlots).toHaveLength(0)
    })
  })

  describe('.getContentSlotsByComponentType()', () => {
    it('should call Database.select()', async () => {
      await contentSlotRepository.getContentSlotsByComponentType('abc')
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith(databaseTable, '*', { component_type: 'abc' })
    })

    it('should return an Array of Content Slot objects with empty options', async () => {
      // Query response for the content slots
      database.select.mockResolvedValueOnce([
        { id: 22, component_type: 'xyz', view_id: 1, column_start: 1, row_start: 2, column_end: 3, row_end: 4 },
        { id: 44, component_type: 'xyz', view_id: 2, column_start: 8, row_start: 7, column_end: 6, row_end: 5 }
      ])
      // Query response in case someone asks for options
      database.select.mockResolvedValueOnce([
        { id: 6, contentslot_id: 22, name: 'r', value: '9' },
        { id: 7, contentslot_id: 22, name: 's', value: '8' },
        { id: 8, contentslot_id: 44, name: 't', value: '7' }
      ])
      const contentSlots = await contentSlotRepository.getContentSlotsByComponentType('xyz')
      expect(contentSlots).toBeInstanceOf(Array)
      expect(contentSlots).toHaveLength(2)
      expect(contentSlots[0]).toEqual({ id: 22, componentType: 'xyz', viewId: 1, columnStart: 1, rowStart: 2, columnEnd: 3, rowEnd: 4, options: {} })
      expect(contentSlots[1]).toEqual({ id: 44, componentType: 'xyz', viewId: 2, columnStart: 8, rowStart: 7, columnEnd: 6, rowEnd: 5, options: {} })
    })

    it('should return an empty Array if no Content Slot matched', async () => {
      const rows = await contentSlotRepository.getContentSlotsByComponentType('def')
      expect(rows).toBeInstanceOf(Array)
      expect(rows).toHaveLength(0)
    })
  })

  describe('.updateContentSlot()', () => {
    it('should call Database.update()', async () => {
      await contentSlotRepository.updateContentSlot(234, 'udkib', 41, 5, 6, 2, 6, {})
      expect(database.update).toHaveBeenCalledTimes(1)
      expect(database.update).toHaveBeenCalledWith(databaseTable, { component_type: 'udkib', view_id: 41, column_start: 5, row_start: 6, column_end: 2, row_end: 6 }, { id: 234 })
    })

    it('should update the options', async () => {
      database.select.mockImplementationOnce(async (table, columns, where) => {
        // Mock the response for getting the existing options
        if (table === optionsTable && where.contentslot_id === 651) {
          return [
            { id: 3, contentslot_id: 651, name: 'a', value: '1' },
            { id: 45, contentslot_id: 651, name: 'b', value: '2' }
          ]
        }

        return []
      })
      await contentSlotRepository.updateContentSlot(651, '', 1, 2, 3, 3, 4, { a: '7', f: 'ABC' })
      expect(database.delete).toHaveBeenCalledTimes(1)
      expect(database.delete).toHaveBeenCalledWith(optionsTable, { contentslot_id: 651, name: 'b' })
      expect(database.insert).toHaveBeenCalledTimes(1)
      expect(database.insert).toHaveBeenCalledWith(optionsTable, { contentslot_id: 651, name: 'f', value: 'ABC' })
      expect(database.update).toHaveBeenCalledTimes(2)
      expect(database.update).toHaveBeenNthCalledWith(2, optionsTable, { value: '7' }, { contentslot_id: 651, name: 'a' })
    })

    it('should return the ID if the Content Slot was updated', async () => {
      database.update.mockResolvedValueOnce(1)
      const id = await contentSlotRepository.updateContentSlot(3, '', 1, 2, 3, 3, 4, {})
      expect(id).toBe(3)
    })

    it('should return the ID if the options were updated', async () => {
      database.update.mockResolvedValueOnce(0)
      database.update.mockResolvedValueOnce(1)
      database.select.mockResolvedValueOnce([{ id: 1, contentslot_id: 3, name: 'a', value: '4' }])
      const id = await contentSlotRepository.updateContentSlot(3, '', 1, 2, 3, 3, 4, { a: '3' })
      expect(id).toBe(3)
    })

    it('should return null if neither the Content Slot nor the options were updated', async () => {
      database.update.mockResolvedValueOnce(0)
      database.update.mockResolvedValueOnce(0)
      database.select.mockResolvedValueOnce([{ id: 1, contentslot_id: 3, name: 'a', value: '4' }])
      const id = await contentSlotRepository.updateContentSlot(3, '', 1, 2, 3, 3, 4, { a: '4' })
      expect(database.delete).toHaveBeenCalledTimes(0)
      expect(database.insert).toHaveBeenCalledTimes(0)
      expect(database.update).toHaveBeenCalledTimes(2)
      expect(id).toBeNull()
    })
  })
})
