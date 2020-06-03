const DisplayRepository = require('../../../src/persistence/repositories/DisplayRepository')

const Database = require('../../../src/persistence/Database')
jest.mock('../../../src/persistence/Database')

describe('DisplayRepository', () => {
  let database

  /**
   * @var {DisplayRepository}
   */
  let displayRepository

  beforeAll(() => {
    database = new Database()
    database.select.mockResolvedValue([])
  })

  beforeEach(() => {
    displayRepository = new DisplayRepository(database, 'test_')

    database.delete.mockClear()
    database.insert.mockClear()
    database.select.mockClear()
    database.update.mockClear()
  })

  describe('.createDisplay()', () => {
    it('should call Database.insert()', async () => {
      await displayRepository.createDisplay('Some name', true, 'ABC', 'The description', 'The location')
      expect(database.insert).toHaveBeenCalledTimes(1)
      expect(database.insert).toHaveBeenCalledWith(
        'test_displays',
        { name: 'Some name', active: 1, client_id: 'ABC', description: 'The description', location: 'The location' }
      )
    })

    it('should return the ID returned from Database.insert()', async () => {
      database.insert.mockResolvedValueOnce(5876)
      const displayId = await displayRepository.createDisplay('Some name', true, 'ABC', 'The description', 'The location')
      expect(displayId).toBe(5876)
    })

    it('should prepare values for insertion', async () => {
      await displayRepository.createDisplay('Some name', false, 'ABC', 'The description', 'The location')
      expect(database.insert).toHaveBeenCalledTimes(1)
      expect(database.insert).toHaveBeenCalledWith(
        'test_displays',
        { name: 'Some name', active: 0, client_id: 'ABC', description: 'The description', location: 'The location' }
      )
    })
  })

  describe('.deleteOne()', () => {
    it('should call Database.delete()', async () => {
      await displayRepository.deleteOne(52)
      expect(database.delete).toHaveBeenCalledTimes(1)
      expect(database.delete).toHaveBeenCalledWith('test_displays', { id: 52 }, 1
      )
    })

    it('should return the ID if deletion was successful', async () => {
      database.delete.mockResolvedValueOnce(1)
      const displayId = await displayRepository.deleteOne(52)
      expect(displayId).toBe(52)
    })

    it('should return null if nothing was deleted', async () => {
      database.delete.mockResolvedValueOnce(0)
      const displayId = await displayRepository.deleteOne(123)
      expect(displayId).toBeNull()
    })
  })

  describe('.getAll()', () => {
    it('should call Database.select()', async () => {
      await displayRepository.getAll()
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_displays')
    })

    it('should transform result rows', async () => {
      const result = [
        { id: 4, name: 'A', active: 1, client_id: 'A1B2', description: 'R', location: 'X' },
        { id: 25, name: 'B', active: 0, client_id: 'C3D4', description: 'S', location: 'Y' },
        { id: 62, name: 'C', active: 0, client_id: null, description: 'T', location: 'Z' }
      ]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const displays = await displayRepository.getAll()
      expect(displays).toBeInstanceOf(Array)
      expect(displays).toHaveLength(3)
      expect(displays[0]).toEqual({ id: 4, name: 'A', active: true, clientId: 'A1B2', description: 'R', location: 'X' })
      expect(displays[1]).toEqual({ id: 25, name: 'B', active: false, clientId: 'C3D4', description: 'S', location: 'Y' })
      expect(displays[2]).toEqual({ id: 62, name: 'C', active: false, clientId: '', description: 'T', location: 'Z' })
    })
  })

  describe('.getDisplayByClientId()', () => {
    it('should call Database.select()', async () => {
      await displayRepository.getDisplayByClientId('ABC123')
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_displays', '*', { client_id: 'ABC123' }, {}, 1)
    })

    it('should transform the result row', async () => {
      const result = [{ id: 412, name: 'ASDF', active: 1, client_id: 'DEF873', description: 'xyz', location: 'qwert' }]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const display = await displayRepository.getDisplayByClientId('DEF873')
      expect(display).toEqual({ id: 412, name: 'ASDF', active: true, clientId: 'DEF873', description: 'xyz', location: 'qwert' })
    })

    it('should return null if no such Display exists', async () => {
      const display = await displayRepository.getDisplayByClientId('AKHD126')
      expect(display).toBeNull()
    })
  })

  describe('.getDisplayById()', () => {
    it('should call Database.select()', async () => {
      await displayRepository.getDisplayById(381)
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_displays', '*', { id: 381 }, {}, 1)
    })

    it('should transform result rows', async () => {
      const result = [{ id: 15, name: 'A name', active: 0, client_id: '29fn8', description: 'Hello', location: '... it\'s me' }]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const display = await displayRepository.getDisplayById(15)
      expect(display).toEqual({ id: 15, name: 'A name', active: false, clientId: '29fn8', description: 'Hello', location: '... it\'s me' })
    })

    it('should return null when requesting a Display with an unknown ID', async () => {
      const display = await displayRepository.getDisplayById(555)
      expect(display).toBeNull()
    })
  })

  describe('.getDisplaysById()', () => {
    it('should call Database.select()', async () => {
      await displayRepository.getDisplaysById([67, 2, 123])
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_displays', '*', { id: [67, 2, 123] })
    })

    it('should transform result rows', async () => {
      const result = [
        { id: 4, name: 'A', active: 1, client_id: 'A1B2', description: 'R', location: 'X' },
        { id: 62, name: 'C', active: 0, client_id: 'E5F6', description: 'T', location: 'Z' }
      ]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const displays = await displayRepository.getDisplaysById([4, 33, 62, 98])
      expect(displays).toBeInstanceOf(Array)
      expect(displays).toHaveLength(2)
      expect(displays[0]).toEqual({ id: 4, name: 'A', active: true, clientId: 'A1B2', description: 'R', location: 'X' })
      expect(displays[1]).toEqual({ id: 62, name: 'C', active: false, clientId: 'E5F6', description: 'T', location: 'Z' })
    })

    it('should return an empty Array if no Display matches', async () => {
      const displays = await displayRepository.getDisplaysById([4, 33, 62, 98])
      expect(displays).toBeInstanceOf(Array)
      expect(displays).toHaveLength(0)
    })
  })

  describe('.updateDisplay()', () => {
    it('should call Database.update()', async () => {
      await displayRepository.updateDisplay(293, 'New name', true, 'XYZ', 'A new description', 'Another location')
      expect(database.update).toHaveBeenCalledTimes(1)
      expect(database.update).toHaveBeenCalledWith(
        'test_displays',
        { name: 'New name', active: 1, client_id: 'XYZ', description: 'A new description', location: 'Another location' },
        { id: 293 }
      )
    })

    it('should return the ID on success', async () => {
      database.update.mockResolvedValueOnce(1)
      const displayId = await displayRepository.updateDisplay(293, 'New name', true, 'XYZ', 'A new description', 'Another location')
      expect(displayId).toBe(293)
    })

    it('should return null when nothing changed', async () => {
      database.update.mockResolvedValueOnce(0)
      const displayId = await displayRepository.updateDisplay(2359, 'A new name', false, 'ABC', 'A description', 'Location')
      expect(displayId).toBeNull()
    })
  })
})
