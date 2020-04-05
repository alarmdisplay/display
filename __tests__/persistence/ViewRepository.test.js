const ViewRepository = require('../../src/persistence/ViewRepository')

describe('The ViewRepository', () => {
  it('should store a new object', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView(123, 'Some cool name', 6, 4, 42, 1, 'IdleScreen')
      .then(view => {
        expect(view.id).toBe(123)
        expect(view.name).toBe('Some cool name')
        expect(view.columns).toBe(6)
        expect(view.rows).toBe(4)
        expect(view.displayId).toBe(42)
        expect(view.order).toBe(1)
        expect(view.screenType).toBe('IdleScreen')
      })
  })

  it('should reject to store two Views with the same ID', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView(22, 'Some name', 6, 4, 42, 1, 'IdleScreen')
      .then((view) => {
        expect(viewRepository.createView(22, 'Some name', 6, 4, 42, 1, 'IdleScreen')).rejects.toBeInstanceOf(Error)
      })
  })

  it('should get all views', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView(77, 'A', 1, 2, 3, 4, '1')
      .then(() => viewRepository.createView(78, 'B', 5, 6, 7, 8, '2'))
      .then(() => viewRepository.createView(79, 'C', 9, 10, 11, 12, '3'))
      .then(() => viewRepository.getAllViews())
      .then(views => {
        expect(views).toBeInstanceOf(Array)
        expect(views).toHaveLength(3)
        expect(views).toStrictEqual([
          { id: 77, name: 'A', columns: 1, rows: 2, displayId: 3, order: 4, screenType: '1' },
          { id: 78, name: 'B', columns: 5, rows: 6, displayId: 7, order: 8, screenType: '2' },
          { id: 79, name: 'C', columns: 9, rows: 10, displayId: 11, order: 12, screenType: '3' }
        ])
      })
  })

  it('should get a view by its ID', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView(237, 'Irrelevant name', 2, 1, 66, 8, 'IdleScreen')
      .then(() => {
        return viewRepository.getViewById(237)
      }).then(view => {
        expect(view.id).toBe(237)
        expect(view.name).toBe('Irrelevant name')
        expect(view.columns).toBe(2)
        expect(view.rows).toBe(1)
        expect(view.displayId).toBe(66)
        expect(view.order).toBe(8)
        expect(view.screenType).toBe('IdleScreen')
      })
  })

  it('should reject when requesting a View with an unknown ID', () => {
    const viewRepository = new ViewRepository()
    return expect(viewRepository.getViewById(555)).rejects.toBeInstanceOf(Error)
  })

  it('should get views by a Display ID', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView(174, '', 3, 4, 11, 1, '')
      .then(() => viewRepository.createView(234, '', 3, 4, 41, 1, ''))
      .then(() => viewRepository.createView(823, '', 3, 4, 11, 1, ''))
      .then(() => viewRepository.getViewsByDisplayId(11))
      .then(views => {
        expect(views).toBeInstanceOf(Array)
        expect(views).toHaveLength(2)
        const ids = views.map(view => view.id)
        expect(ids).toStrictEqual([174, 823])
      })
  })

  it('should delete a View', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView(3825, 'Irrelevant name', 5, 5, 8623, 4, 'IdleScreen')
      .then(() => viewRepository.deleteView(3825))
  })

  it('should delete a non-existing View without error', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.deleteView(123)
  })

  it('should update a view', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView(5262, 'Irrelevant name', 2, 1, 66, 8, 'IdleScreen')
      .then(() => {
        return viewRepository.updateView(5262, 'New name', 99, 135, 999, 12, 'something')
      }).then((view) => {
        expect(view.id).toBe(5262)
        expect(view.name).toBe('New name')
        expect(view.columns).toBe(99)
        expect(view.rows).toBe(135)
        expect(view.displayId).toBe(999)
        expect(view.order).toBe(12)
        expect(view.screenType).toBe('something')
      })
  })

  it('should reject when updating a View with an unknown ID', () => {
    const viewRepository = new ViewRepository()
    return expect(viewRepository.updateView(82457, '', 1, 1, 1, 1, '')).rejects.toBeInstanceOf(Error)
  })
})
