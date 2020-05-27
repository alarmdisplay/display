const DuplicateEntryError = require('../../../src/errors/DuplicateEntryError')
const ViewRepository = require('../../../src/persistence/repositories/ViewRepository')

describe('The ViewRepository', () => {
  let connection, connectionPool

  /**
   * @var {ViewRepository}
   */
  let viewRepository

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
    viewRepository = new ViewRepository(connectionPool, 'test_')
  })

  describe('.create()', () => {
    it('should execute an INSERT statement and return the ID', async () => {
      connection.query.mockResolvedValueOnce({ insertId: 41 })
      const viewId = await viewRepository.create(12, 2, 'idle', 3, 4)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith(
        'INSERT INTO test_views (`display_id`, `view_order`, `screen_type`, `columns`, `rows`) VALUES (?,?,?,?,?)',
        [12, 2, 'idle', 3, 4]
      )
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(viewId).toBe(41)
    })

    it('should throw a DuplicateEntryError when a unique index is violated', async () => {
      const error = new Error()
      error.errno = 1062
      error.code = 'error code'
      connection.query.mockRejectedValueOnce(error)
      await expect(viewRepository.create(1, 2, 'idle', 3, 4)).rejects.toThrowError(new DuplicateEntryError('error code'))
    })

    it('should throw a standard Error for other errors', async () => {
      const error = new Error()
      error.errno = 42
      error.code = 'some code'
      connection.query.mockRejectedValueOnce(error)
      await expect(viewRepository.create(1, 2, 'idle', 3, 4)).rejects.toThrowError(new Error('some code'))
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(viewRepository.create(1, 2, 'idle', 3, 4)).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.deleteOne()', () => {
    it('should execute a DELETE statement', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 1 })
      await viewRepository.deleteOne(512)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('DELETE FROM test_views WHERE id = ? LIMIT 1', 512)
      expect(connection.release).toHaveBeenCalledTimes(1)
    })

    it('should return the ID if deletion was successful', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 1 })
      const viewId = await viewRepository.deleteOne(512)
      expect(viewId).toBe(512)
    })

    it('should return null if nothing was deleted', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 0 })
      const viewId = await viewRepository.deleteOne(456)
      expect(viewId).toBeNull()
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(viewRepository.deleteOne(1)).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('getViewsByDisplayId()', () => {
    it('should execute a SELECT statement', async () => {
      connection.query.mockResolvedValueOnce([])
      await viewRepository.getViewsByDisplayId(31)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_views WHERE display_id = ? ORDER BY view_order', 31)
      expect(connection.release).toHaveBeenCalledTimes(1)
    })

    it('should return an Array of View object', async () => {
      const result = [
        { id: 30, display_id: 5, view_order: 1, screen_type: 'idle', columns: 6, rows: 4 },
        { id: 37, display_id: 5, view_order: 2, screen_type: 'idle', columns: 3, rows: 5 }
      ]
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsByDisplayId(5)
      expect(views).toBeInstanceOf(Array)
      expect(views.length).toBe(2)
      expect(views[0]).toEqual({ id: 30, displayId: 5, order: 1, screenType: 'idle', columns: 6, rows: 4 })
      expect(views[1]).toEqual({ id: 37, displayId: 5, order: 2, screenType: 'idle', columns: 3, rows: 5 })
    })

    it('should return an empty Array if no Views can be found', async () => {
      const result = []
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsByDisplayId(11)
      expect(views).toBeInstanceOf(Array)
      expect(views.length).toBe(0)
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(viewRepository.getViewsByDisplayId(123)).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('getViewsByDisplayIdAndScreenType()', () => {
    it('should execute a SELECT statement', async () => {
      connection.query.mockResolvedValueOnce([])
      await viewRepository.getViewsByDisplayIdAndScreenType(5, 'news')
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_views WHERE display_id = ? AND screen_type = ? ORDER BY view_order', [5, 'news'])
      expect(connection.release).toHaveBeenCalledTimes(1)
    })

    it('should return an Array of Views', async () => {
      const result = [
        { id: 52, display_id: 5, view_order: 1, screen_type: 'radio', columns: 6, rows: 4 },
        { id: 61, display_id: 5, view_order: 2, screen_type: 'radio', columns: 3, rows: 5 }
      ]
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsByDisplayIdAndScreenType(5, 'radio')
      expect(views).toBeInstanceOf(Array)
      expect(views).toHaveLength(2)
      expect(views[0]).toEqual({ id: 52, displayId: 5, order: 1, screenType: 'radio', columns: 6, rows: 4 })
      expect(views[1]).toEqual({ id: 61, displayId: 5, order: 2, screenType: 'radio', columns: 3, rows: 5 })
    })

    it('should return an empty Array if no View matches', async () => {
      const result = []
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsByDisplayIdAndScreenType(9, 'darkness')
      expect(views).toBeInstanceOf(Array)
      expect(views).toHaveLength(0)
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(viewRepository.getViewsByDisplayIdAndScreenType(6, 'speaker')).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('getViewById()', () => {
    it('should execute a SELECT statement', async () => {
      connection.query.mockResolvedValueOnce([])
      await viewRepository.getViewById(37)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_views WHERE id = ? LIMIT 1', 37)
      expect(connection.release).toHaveBeenCalledTimes(1)
    })

    it('should return a View object', async () => {
      const result = [{ id: 37, display_id: 5, view_order: 2, screen_type: 'idle', columns: 6, rows: 4 }]
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const view = await viewRepository.getViewById(37)
      expect(view).toEqual({ id: 37, displayId: 5, order: 2, screenType: 'idle', columns: 6, rows: 4 })
    })

    it('should return null if View cannot be found', async () => {
      const result = []
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const view = await viewRepository.getViewById(37)
      expect(view).toBeNull()
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(viewRepository.getViewById(123)).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('getViewsById()', () => {
    it('should execute a SELECT statement', async () => {
      connection.query.mockResolvedValueOnce([])
      await viewRepository.getViewsById([47, 4, 513])
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM test_views WHERE id IN ?', [[47, 4, 513]])
      expect(connection.release).toHaveBeenCalledTimes(1)
    })

    it('should return an Array of Views', async () => {
      const result = [
        { id: 130, display_id: 5, view_order: 1, screen_type: 'idle', columns: 6, rows: 4 },
        { id: 137, display_id: 5, view_order: 2, screen_type: 'idle', columns: 3, rows: 5 }
      ]
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsById([4, 130, 62, 137])
      expect(views).toBeInstanceOf(Array)
      expect(views).toHaveLength(2)
      expect(views[0]).toEqual({ id: 130, displayId: 5, order: 1, screenType: 'idle', columns: 6, rows: 4 })
      expect(views[1]).toEqual({ id: 137, displayId: 5, order: 2, screenType: 'idle', columns: 3, rows: 5 })
    })

    it('should return an empty Array if no View matches', async () => {
      const result = []
      result.meta = {}
      connection.query.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsById([4, 33, 62, 98])
      expect(views).toBeInstanceOf(Array)
      expect(views).toHaveLength(0)
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(viewRepository.getViewsById([1, 2])).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('update()', () => {
    it('should execute an UPDATE statement and return the ID', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 1 })
      const viewId = await viewRepository.update(72, 8, 2, 'abc', 9, 1)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith(
        'UPDATE test_views SET `display_id` = ?, `view_order` = ?, `screen_type` = ?, `columns` = ?, `rows` = ? WHERE `id` = ?',
        [8, 2, 'abc', 9, 1, 72]
      )
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(viewId).toBe(72)
    })

    it('should return null when nothing changed', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 0 })
      const viewId = await viewRepository.update(929, 1, 2, 'a', 5, 7)
      expect(viewId).toBeNull()
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection = jest.fn().mockRejectedValueOnce(new Error())
      await expect(viewRepository.update(1, 2, 3, '', 4, 5)).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })
})
