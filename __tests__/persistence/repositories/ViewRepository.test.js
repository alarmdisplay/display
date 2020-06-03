const ViewRepository = require('../../../src/persistence/repositories/ViewRepository')

const Database = require('../../../src/persistence/Database')
jest.mock('../../../src/persistence/Database')

describe('The ViewRepository', () => {
  let database

  /**
   * @var {ViewRepository}
   */
  let viewRepository

  beforeAll(() => {
    database = new Database()
    database.select.mockResolvedValue([])
  })

  beforeEach(() => {
    viewRepository = new ViewRepository(database, 'test_')

    database.delete.mockClear()
    database.insert.mockClear()
    database.select.mockClear()
    database.update.mockClear()
  })

  describe('.create()', () => {
    it('should call Database.insert()', async () => {
      await viewRepository.create(12, 2, 'idle', 3, 4)
      expect(database.insert).toHaveBeenCalledTimes(1)
      expect(database.insert).toHaveBeenCalledWith(
        'test_views',
        { display_id: 12, view_order: 2, screen_type: 'idle', columns: 3, rows: 4 }
      )
    })

    it('should return the ID returned from Database.insert()', async () => {
      database.insert.mockResolvedValueOnce(2895)
      const id = await viewRepository.create(12, 2, 'idle', 3, 4)
      expect(id).toBe(2895)
    })
  })

  describe('.deleteOne()', () => {
    it('should call Database.delete()', async () => {
      await viewRepository.deleteOne(512)
      expect(database.delete).toHaveBeenCalledTimes(1)
      expect(database.delete).toHaveBeenCalledWith('test_views', { id: 512 }, 1
      )
    })

    it('should return the ID if deletion was successful', async () => {
      database.delete.mockResolvedValueOnce(1)
      const viewId = await viewRepository.deleteOne(512)
      expect(viewId).toBe(512)
    })

    it('should return null if nothing was deleted', async () => {
      database.delete.mockResolvedValueOnce(0)
      const viewId = await viewRepository.deleteOne(456)
      expect(viewId).toBeNull()
    })
  })

  describe('getViewById()', () => {
    it('should call Database.select()', async () => {
      await viewRepository.getViewById(37)
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_views', '*', { id: 37 }, {}, 1)
    })

    it('should return a View object', async () => {
      const result = [{ id: 37, display_id: 5, view_order: 2, screen_type: 'idle', columns: 6, rows: 4 }]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const view = await viewRepository.getViewById(37)
      expect(view).toEqual({ id: 37, displayId: 5, order: 2, screenType: 'idle', columns: 6, rows: 4 })
    })

    it('should return null if View cannot be found', async () => {
      const view = await viewRepository.getViewById(37)
      expect(view).toBeNull()
    })
  })

  describe('getViewsByDisplayId()', () => {
    it('should call Database.select()', async () => {
      await viewRepository.getViewsByDisplayId(31)
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_views', '*', { display_id: 31 }, { view_order: 1 })
    })

    it('should return an Array of View objects', async () => {
      const result = [
        { id: 30, display_id: 5, view_order: 1, screen_type: 'idle', columns: 6, rows: 4 },
        { id: 37, display_id: 5, view_order: 2, screen_type: 'idle', columns: 3, rows: 5 }
      ]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsByDisplayId(5)
      expect(views).toBeInstanceOf(Array)
      expect(views.length).toBe(2)
      expect(views[0]).toEqual({ id: 30, displayId: 5, order: 1, screenType: 'idle', columns: 6, rows: 4 })
      expect(views[1]).toEqual({ id: 37, displayId: 5, order: 2, screenType: 'idle', columns: 3, rows: 5 })
    })

    it('should return an empty Array if no Views can be found', async () => {
      const views = await viewRepository.getViewsByDisplayId(11)
      expect(views).toBeInstanceOf(Array)
      expect(views.length).toBe(0)
    })
  })

  describe('getViewsByDisplayIdAndScreenType()', () => {
    it('should call Database.select()', async () => {
      await viewRepository.getViewsByDisplayIdAndScreenType(5, 'news')
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_views', '*', { display_id: 5, screen_type: 'news' }, { view_order: 1 })
    })

    it('should return an Array of View objects', async () => {
      const result = [
        { id: 52, display_id: 5, view_order: 1, screen_type: 'radio', columns: 6, rows: 4 },
        { id: 61, display_id: 5, view_order: 2, screen_type: 'radio', columns: 3, rows: 5 }
      ]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsByDisplayIdAndScreenType(5, 'radio')
      expect(views).toBeInstanceOf(Array)
      expect(views).toHaveLength(2)
      expect(views[0]).toEqual({ id: 52, displayId: 5, order: 1, screenType: 'radio', columns: 6, rows: 4 })
      expect(views[1]).toEqual({ id: 61, displayId: 5, order: 2, screenType: 'radio', columns: 3, rows: 5 })
    })

    it('should return an empty Array if no View matches', async () => {
      const views = await viewRepository.getViewsByDisplayIdAndScreenType(9, 'darkness')
      expect(views).toBeInstanceOf(Array)
      expect(views).toHaveLength(0)
    })
  })

  describe('getViewsById()', () => {
    it('should execute a SELECT statement', async () => {
      await viewRepository.getViewsById([47, 4, 513])
      expect(database.select).toHaveBeenCalledTimes(1)
      expect(database.select).toHaveBeenCalledWith('test_views', '*', { id: [47, 4, 513] })
    })

    it('should return an Array of Views', async () => {
      const result = [
        { id: 130, display_id: 5, view_order: 1, screen_type: 'idle', columns: 6, rows: 4 },
        { id: 137, display_id: 5, view_order: 2, screen_type: 'idle', columns: 3, rows: 5 }
      ]
      result.meta = {}
      database.select.mockResolvedValueOnce(result)
      const views = await viewRepository.getViewsById([4, 130, 62, 137])
      expect(views).toBeInstanceOf(Array)
      expect(views).toHaveLength(2)
      expect(views[0]).toEqual({ id: 130, displayId: 5, order: 1, screenType: 'idle', columns: 6, rows: 4 })
      expect(views[1]).toEqual({ id: 137, displayId: 5, order: 2, screenType: 'idle', columns: 3, rows: 5 })
    })

    it('should return an empty Array if no View matches', async () => {
      const views = await viewRepository.getViewsById([4, 33, 62, 98])
      expect(views).toBeInstanceOf(Array)
      expect(views).toHaveLength(0)
    })
  })

  describe('update()', () => {
    it('should call Database.update()', async () => {
      database.update.mockResolvedValueOnce(1)
      await viewRepository.update(72, 8, 2, 'abc', 9, 1)
      expect(database.update).toHaveBeenCalledTimes(1)
      expect(database.update).toHaveBeenCalledWith(
        'test_views',
        { display_id: 8, view_order: 2, screen_type: 'abc', columns: 9, rows: 1 },
        { id: 72 }
      )
    })

    it('should return the ID on success', async () => {
      database.update.mockResolvedValueOnce(1)
      const viewId = await viewRepository.update(929, 1, 2, 'a', 5, 7)
      expect(viewId).toBe(929)
    })

    it('should return null when nothing changed', async () => {
      database.update.mockResolvedValueOnce(0)
      const viewId = await viewRepository.update(929, 1, 2, 'a', 5, 7)
      expect(viewId).toBeNull()
    })
  })
})
