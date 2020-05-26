const DisplayRepository = require('../../src/persistence/repositories/DisplayRepository')
const NotFoundError = require('../../src/errors/NotFoundError')

describe('The DisplayRepository', () => {
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

  it('should get all Displays', async () => {
    const result = [
      { id: 4, name: 'A', active: 1, client_id: 'A1B2', description: 'R', location: 'X' },
      { id: 25, name: 'B', active: 0, client_id: 'C3D4', description: 'S', location: 'Y' },
      { id: 62, name: 'C', active: 0, client_id: 'E5F6', description: 'T', location: 'Z' }
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
    expect(displays[2]).toEqual({ id: 62, name: 'C', active: false, clientId: 'E5F6', description: 'T', location: 'Z' })
  })

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

  it('should delete a Display', async () => {
    connection.query.mockResolvedValueOnce({ affectedRows: 1 })
    const displayId = await displayRepository.deleteDisplay(52)
    expect(connection.query).toHaveBeenCalledTimes(1)
    expect(connection.query).toHaveBeenCalledWith('DELETE FROM test_displays WHERE id = ? LIMIT 1', 52)
    expect(connection.release).toHaveBeenCalledTimes(1)
    expect(displayId).toBe(52)
  })

  it('should delete a non-existing Display without error', async () => {
    connection.query.mockResolvedValueOnce({ affectedRows: 0 })
    const displayId = await displayRepository.deleteDisplay(123)
    expect(displayId).toBeNull()
  })

  describe('Update', () => {
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
  })
})
