const DisplayRepository = require('../../../src/persistence/repositories/DisplayRepository')
const DuplicateEntryError = require('../../../src/errors/DuplicateEntryError')

describe('DisplayRepository', () => {
  let connection, connectionPool

  /**
   * @var {DisplayRepository}
   */
  let displayRepository

  beforeEach(() => {
    connection = {
      query: jest.fn(),
      release: jest.fn()
    }
    connectionPool = {
      getConnection: jest.fn(() => {
        return connection
      })
    }
    displayRepository = new DisplayRepository(connectionPool, 'test_')
  })

  describe('.createDisplay()', () => {
    it('should store a new Display and return the ID', async () => {
      connection.query.mockResolvedValueOnce({ insertId: 83 })
      const displayId = await displayRepository.createDisplay('Some name', true, 'ABC', 'The description', 'The location')
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith(
        'INSERT INTO test_displays (name, active, client_id, description, location) VALUES (?,?,?,?,?)',
        ['Some name', true, 'ABC', 'The description', 'The location']
      )
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(displayId).toBe(83)
    })

    it('should throw a DuplicateEntryError when a unique index is violated', async () => {
      const error = new Error()
      error.errno = 1062
      error.code = 'error code'
      connection.query.mockRejectedValueOnce(error)
      await expect(displayRepository.createDisplay('', true, 'ABC', '', '')).rejects.toThrowError(new DuplicateEntryError('error code'))
    })

    it('should throw a standard Error for other errors', async () => {
      const error = new Error()
      error.errno = 42
      error.code = 'some code'
      connection.query.mockRejectedValueOnce(error)
      await expect(displayRepository.createDisplay('', true, 'ABC', '', '')).rejects.toThrowError(new Error('some code'))
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(displayRepository.createDisplay('', true, '', '', '')).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.deleteDisplay()', () => {
    it('should execute a DELETE statement', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 1 })
      await displayRepository.deleteDisplay(52)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('DELETE FROM test_displays WHERE id = ? LIMIT 1', 52)
      expect(connection.release).toHaveBeenCalledTimes(1)
    })

    it('should return the ID if deletion was successful', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 1 })
      const displayId = await displayRepository.deleteDisplay(52)
      expect(displayId).toBe(52)
    })

    it('should return null if nothing was deleted', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 0 })
      const displayId = await displayRepository.deleteDisplay(123)
      expect(displayId).toBeNull()
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(displayRepository.deleteDisplay(1)).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.getAllDisplays()', () => {
    it('should get all Displays', async () => {
      const result = [
        { id: 4, name: 'A', active: 1, client_id: 'A1B2', description: 'R', location: 'X' },
        { id: 25, name: 'B', active: 0, client_id: 'C3D4', description: 'S', location: 'Y' },
        { id: 62, name: 'C', active: 0, client_id: null, description: 'T', location: 'Z' }
      ]
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const displays = await displayRepository.getAllDisplays()
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_displays')
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(displays).toBeInstanceOf(Array)
      expect(displays).toHaveLength(3)
      expect(displays[0]).toEqual({ id: 4, name: 'A', active: true, clientId: 'A1B2', description: 'R', location: 'X' })
      expect(displays[1]).toEqual({ id: 25, name: 'B', active: false, clientId: 'C3D4', description: 'S', location: 'Y' })
      expect(displays[2]).toEqual({ id: 62, name: 'C', active: false, clientId: '', description: 'T', location: 'Z' })
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(displayRepository.getAllDisplays()).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.getDisplayByClientId()', () => {
    it('should execute a SELECT statement', async () => {
      connection.query.mockResolvedValueOnce([])
      await displayRepository.getDisplayByClientId('ABC123')
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_displays WHERE client_id = ? LIMIT 1', 'ABC123')
      expect(connection.release).toHaveBeenCalledTimes(1)
    })

    it('should return a Display object if found', async () => {
      const result = [{ id: 412, name: 'ASDF', active: 1, client_id: 'DEF873', description: 'xyz', location: 'qwert' }]
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const display = await displayRepository.getDisplayByClientId('DEF873')
      expect(display).toEqual({ id: 412, name: 'ASDF', active: true, clientId: 'DEF873', description: 'xyz', location: 'qwert' })
    })

    it('should return null if no such Display exists', async () => {
      const result = []
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const display = await displayRepository.getDisplayByClientId('AKHD126')
      expect(display).toBeNull()
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(displayRepository.getDisplayByClientId('ABC')).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.getDisplayById()', () => {
    it('should get a Display by its ID', async () => {
      const result = [{ id: 15, name: 'A name', active: 0, client_id: '29fn8', description: 'Hello', location: '... it\'s me' }]
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const display = await displayRepository.getDisplayById(15)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_displays WHERE id = ? LIMIT 1', 15)
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(display.id).toBe(15)
      expect(display.name).toBe('A name')
      expect(display.active).toBe(false)
      expect(display.clientId).toBe('29fn8')
      expect(display.description).toBe('Hello')
      expect(display.location).toBe('... it\'s me')
    })

    it('should return null when requesting a Display with an unknown ID', async () => {
      const result = []
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const display = await displayRepository.getDisplayById(555)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_displays WHERE id = ? LIMIT 1', 555)
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(display).toBeNull()
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(displayRepository.getDisplayById(123)).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.getDisplaysById()', () => {
    it('should execute a SELECT statement', async () => {
      connection.query.mockResolvedValueOnce([])
      await displayRepository.getDisplaysById([67, 2, 123])
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_displays WHERE id IN ?', [[67, 2, 123]])
      expect(connection.release).toHaveBeenCalledTimes(1)
    })

    it('should return an Array of Displays', async () => {
      const result = [
        { id: 4, name: 'A', active: 1, client_id: 'A1B2', description: 'R', location: 'X' },
        { id: 62, name: 'C', active: 0, client_id: 'E5F6', description: 'T', location: 'Z' }
      ]
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const displays = await displayRepository.getDisplaysById([4, 33, 62, 98])
      expect(displays).toBeInstanceOf(Array)
      expect(displays).toHaveLength(2)
      expect(displays[0]).toEqual({ id: 4, name: 'A', active: true, clientId: 'A1B2', description: 'R', location: 'X' })
      expect(displays[1]).toEqual({ id: 62, name: 'C', active: false, clientId: 'E5F6', description: 'T', location: 'Z' })
    })

    it('should return an empty Array if no Display matches', async () => {
      const result = []
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const displays = await displayRepository.getDisplaysById([4, 33, 62, 98])
      expect(displays).toBeInstanceOf(Array)
      expect(displays).toHaveLength(0)
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(displayRepository.getDisplaysById([1, 2])).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.updateDisplay()', () => {
    it('should return the ID on success', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 1 })
      const displayId = await displayRepository.updateDisplay(293, 'New name', true, 'XYZ', 'A new description', 'Another location')
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith(
        'UPDATE test_displays SET name = ?, active = ?, client_id = ?, description = ?, location = ? WHERE id = ?',
        ['New name', 1, 'XYZ', 'A new description', 'Another location', 293]
      )
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(displayId).toBe(293)
    })

    it('should return null when nothing changed', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 0 })
      const displayId = await displayRepository.updateDisplay(2359, 'A new name', false, 'ABC', 'A description', 'Location')
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith(
        'UPDATE test_displays SET name = ?, active = ?, client_id = ?, description = ?, location = ? WHERE id = ?',
        ['A new name', 0, 'ABC', 'A description', 'Location', 2359]
      )
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(displayId).toBeNull()
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(displayRepository.updateDisplay(5, '', true, '', '', '')).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })
})
