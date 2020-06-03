const AlertRepository = require('../../../src/persistence/repositories/AlertRepository')

const Database = require('../../../src/persistence/Database')
jest.mock('../../../src/persistence/Database')

describe('AlertRepository', () => {
  let database

  /**
   * @var {AlertRepository}
   */
  let alertRepository

  beforeAll(() => {
    database = new Database()
    database.select.mockResolvedValue([])
  })

  beforeEach(() => {
    alertRepository = new AlertRepository(database, 'test_alerts')

    database.delete.mockClear()
    database.insert.mockClear()
    database.select.mockClear()
    database.update.mockClear()
  })

  describe('.create()', () => {
    it('should call Database.insert()', async () => {
      const alertDate = new Date()
      const expiresDate = new Date()
      await alertRepository.create('Some title', 'A keyword', 'Lorem ipsum', alertDate, 'The location', 'status string', 'category string', 'contact info', expiresDate)
      expect(database.insert).toHaveBeenCalledTimes(1)
      expect(database.insert).toHaveBeenCalledWith(
        'test_alerts',
        { title: 'Some title', keyword: 'A keyword', description: 'Lorem ipsum', time: alertDate, location: 'The location', status: 'status string', category: 'category string', contact: 'contact info', expires: expiresDate }
      )
    })

    it('should return the ID returned from Database.insert()', async () => {
      database.insert.mockResolvedValueOnce(622)
      const id = await alertRepository.create('', '', '', new Date(), '', '', '', '', new Date())
      expect(id).toBe(622)
    })
  })

  describe('.deleteOne()', () => {
    it('should call Database.delete()', async () => {
      await alertRepository.deleteOne(289)
      expect(database.delete).toHaveBeenCalledTimes(1)
      expect(database.delete).toHaveBeenCalledWith('test_alerts', { id: 289 }, 1
      )
    })

    it('should return the ID if deletion was successful', async () => {
      database.delete.mockResolvedValueOnce(1)
      const id = await alertRepository.deleteOne(89465)
      expect(id).toBe(89465)
    })

    it('should return null if nothing was deleted', async () => {
      database.delete.mockResolvedValueOnce(0)
      const id = await alertRepository.deleteOne(2352)
      expect(id).toBeNull()
    })
  })

  describe('.getAll()', () => {
    it('should call Database.select()', async () => {
      await alertRepository.getAll()
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_alerts')
    })

    it('should transform result rows', async () => {
      const date1 = new Date()
      const date2 = new Date()
      const date3 = new Date()
      const date4 = new Date()
      const date5 = new Date()
      const result = [
        { id: 2938, title: 'wfwvf', keyword: 'rtaei', description: 'ulyir', time: date1, location: 'iqkgw', status: 'hevdc', category: 'cikat', contact: 'cylzl', expires: date2, updated: date3 },
        { id: 3475, title: '', keyword: '', description: '', time: date4, location: '', status: '', category: '', contact: '', expires: null, updated: date5 }
      ]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const alerts = await alertRepository.getAll()
      expect(alerts).toBeInstanceOf(Array)
      expect(alerts).toHaveLength(2)
      expect(alerts[0]).toEqual({ id: 2938, title: 'wfwvf', keyword: 'rtaei', description: 'ulyir', time: date1, location: 'iqkgw', status: 'hevdc', category: 'cikat', contact: 'cylzl', expires: date2, updatedAt: date3 })
      expect(alerts[1]).toEqual({ id: 3475, title: '', keyword: '', description: '', time: date4, location: '', status: '', category: '', contact: '', expires: null, updatedAt: date5 })
    })
  })

  describe('.getOne()', () => {
    it('should call Database.select()', async () => {
      await alertRepository.getOne(8461)
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_alerts', '*', { id: 8461 }, {}, 1)
    })

    it('should transform result rows', async () => {
      const date1 = new Date()
      const date2 = new Date()
      const result = [{ id: 23478, title: 'zikmm', keyword: 'gtdxs', description: 'zxxul', time: date1, location: 'xijnm', status: 'ztdxi', category: 'posvs', contact: 'vdjad', expires: null, updated: date2 }]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const alert = await alertRepository.getOne(23478)
      expect(alert).toEqual({ id: 23478, title: 'zikmm', keyword: 'gtdxs', description: 'zxxul', time: date1, location: 'xijnm', status: 'ztdxi', category: 'posvs', contact: 'vdjad', expires: null, updatedAt: date2 })
    })

    it('should return null when requesting an Alert with an unknown ID', async () => {
      const alert = await alertRepository.getOne(0)
      expect(alert).toBeNull()
    })
  })
})
