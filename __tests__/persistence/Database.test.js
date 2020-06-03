const Database = require('../../src/persistence/Database')
const DuplicateEntryError = require('../../src/errors/DuplicateEntryError')

require('mariadb')
jest.mock('mariadb')

describe('Database', () => {
  let connectionPool, connection, database

  beforeAll(() => {
    connection = {
      escapeId: jest.fn(x => `ESCAPED_${x}`),
      query: jest.fn(),
      release: jest.fn()
    }
    connectionPool = {
      getConnection: jest.fn()
    }
    connectionPool.getConnection.mockResolvedValue(connection)
    database = new Database()
    database.connectionPool = connectionPool
  })

  beforeEach(() => {
    connectionPool.getConnection.mockClear()
    connection.escapeId.mockClear()
    connection.query.mockClear()
    connection.release.mockClear()
  })

  describe('.delete()', () => {
    it('should execute a DELETE statement and return the number of affected rows', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 9 })
      const affected = await database.delete('test_some_table', { column: 57 }, 12)
      expect(connectionPool.getConnection).toHaveBeenCalledTimes(1)
      expect(connection.escapeId).toHaveBeenCalledTimes(2)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith(
        'DELETE FROM ESCAPED_test_some_table WHERE ESCAPED_column = ? LIMIT ?',
        [57, 12]
      )
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(affected).toBe(9)
    })

    it('should throw an Error containing only the code when the query fails', async () => {
      const error = new Error()
      error.errno = 42
      error.code = 'some code'
      connection.query.mockRejectedValueOnce(error)
      await expect(database.delete('table', { a: 9 })).rejects.toThrowError(new Error('some code'))
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection.mockRejectedValueOnce(new Error())
      await expect(database.delete('table', { g: 2 })).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.insert()', () => {
    it('should execute an INSERT statement and return the ID', async () => {
      connection.query.mockResolvedValueOnce({ insertId: 83 })
      const id = await database.insert('test_some_table', { value_one: 'some string', column2: 47 })
      expect(connectionPool.getConnection).toHaveBeenCalledTimes(1)
      expect(connection.escapeId).toHaveBeenCalledTimes(3)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith(
        'INSERT INTO ESCAPED_test_some_table (ESCAPED_value_one,ESCAPED_column2) VALUES (?,?)',
        ['some string', 47]
      )
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(id).toBe(83)
    })

    it('should throw a DuplicateEntryError when a unique index is violated', async () => {
      const error = new Error()
      error.errno = 1062
      error.code = 'error code'
      connection.query.mockRejectedValueOnce(error)
      await expect(database.insert('table', { a: 1 })).rejects.toThrowError(new DuplicateEntryError('error code'))
    })

    it('should throw a standard Error for other errors', async () => {
      const error = new Error()
      error.errno = 42
      error.code = 'some code'
      connection.query.mockRejectedValueOnce(error)
      await expect(database.insert('table', { b: 2 })).rejects.toThrowError(new Error('some code'))
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection.mockRejectedValueOnce(new Error())
      await expect(database.insert('table', { c: 3 })).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.select()', () => {
    it('should execute a SELECT statement and return the rows', async () => {
      const rows = [{ a: 1, b: '2' }, { a: 3, b: '7' }]
      connection.query.mockResolvedValueOnce(rows)
      const result = await database.select('test_some_table')
      expect(connectionPool.getConnection).toHaveBeenCalledTimes(1)
      expect(connection.escapeId).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM ESCAPED_test_some_table', [])
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(result).toEqual(rows)
    })

    it('should support a WHERE IN statement', async () => {
      connection.query.mockResolvedValueOnce([])
      await database.select('test_with_array', '*', { col: [1, 6, 2] })
      expect(connection.query).toHaveBeenCalledWith('SELECT * FROM ESCAPED_test_with_array WHERE ESCAPED_col IN ?', [[1, 6, 2]])
    })

    it('should throw an Error containing only the code when the query fails', async () => {
      const error = new Error()
      error.errno = 42
      error.code = 'some code'
      connection.query.mockRejectedValueOnce(error)
      await expect(database.select('table')).rejects.toThrowError(new Error('some code'))
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection.mockRejectedValueOnce(new Error())
      await expect(database.select('table')).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })

  describe('.update()', () => {
    it('should execute an UPDATE statement and return the number of affected rows', async () => {
      connection.query.mockResolvedValueOnce({ affectedRows: 12 })
      const affected = await database.update('test_some_table', { column1: 42, column_two: 'sand' }, { abc: '123' })
      expect(connectionPool.getConnection).toHaveBeenCalledTimes(1)
      expect(connection.escapeId).toHaveBeenCalledTimes(4)
      expect(connection.query).toHaveBeenCalledTimes(1)
      expect(connection.query).toHaveBeenCalledWith(
        'UPDATE ESCAPED_test_some_table SET ESCAPED_column1 = ?,ESCAPED_column_two = ? WHERE ESCAPED_abc = ?',
        [42, 'sand', '123']
      )
      expect(connection.release).toHaveBeenCalledTimes(1)
      expect(affected).toBe(12)
    })

    it('should throw an Error containing only the code when the query fails', async () => {
      const error = new Error()
      error.errno = 387
      error.code = 'some error code'
      connection.query.mockRejectedValueOnce(error)
      await expect(database.update('table', { k: 7 })).rejects.toThrowError(new Error('some error code'))
    })

    it('should not release the connection if it could not be acquired', async () => {
      connectionPool.getConnection.mockRejectedValueOnce(new Error())
      await expect(database.update('table', { f: 1 })).rejects.toThrowError()
      expect(connection.query).toHaveBeenCalledTimes(0)
      expect(connection.release).toHaveBeenCalledTimes(0)
    })
  })
})
