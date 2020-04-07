const ViewRepository = require('../../src/persistence/ViewRepository')

describe('The ViewRepository', () => {
  it('should store a new object', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView('Some cool name', 6, 4, 42, 1, 'IdleScreen')
      .then(view => {
        expect(view.id).toBeGreaterThan(0)
        expect(view.name).toBe('Some cool name')
        expect(view.columns).toBe(6)
        expect(view.rows).toBe(4)
        expect(view.displayId).toBe(42)
        expect(view.order).toBe(1)
        expect(view.screenType).toBe('IdleScreen')
      })
  })

  it('should get all views', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView('A', 1, 2, 3, 4, '1')
      .then(() => viewRepository.createView('B', 5, 6, 7, 8, '2'))
      .then(() => viewRepository.createView('C', 9, 10, 11, 12, '3'))
      .then(() => viewRepository.getAllViews())
      .then(views => {
        expect(views).toBeInstanceOf(Array)
        expect(views).toHaveLength(3)
        expect(views[0].id).toBeGreaterThan(0)
        expect(views[0].name).toBe('A')
        expect(views[0].columns).toBe(1)
        expect(views[0].rows).toBe(2)
        expect(views[0].displayId).toBe(3)
        expect(views[0].order).toBe(4)
        expect(views[0].screenType).toBe('1')
        expect(views[0].id).toBeGreaterThan(0)
        expect(views[1].name).toBe('B')
        expect(views[1].columns).toBe(5)
        expect(views[1].rows).toBe(6)
        expect(views[1].displayId).toBe(7)
        expect(views[1].order).toBe(8)
        expect(views[1].screenType).toBe('2')
        expect(views[2].id).toBeGreaterThan(0)
        expect(views[2].name).toBe('C')
        expect(views[2].columns).toBe(9)
        expect(views[2].rows).toBe(10)
        expect(views[2].displayId).toBe(11)
        expect(views[2].order).toBe(12)
        expect(views[2].screenType).toBe('3')
      })
  })

  it('should get a view by its ID', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView('Irrelevant name', 2, 1, 66, 8, 'IdleScreen')
      .then(view => {
        return viewRepository.getViewById(view.id)
      }).then(view => {
        expect(view.id).toBeGreaterThan(0)
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

  it('should get views by a Display ID and sort them by order property', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView('', 3, 4, 11, 2, '')
      .then(() => viewRepository.createView('', 3, 4, 41, 1, ''))
      .then(() => viewRepository.createView('', 3, 4, 11, 3, ''))
      .then(() => viewRepository.createView('', 3, 4, 11, 1, ''))
      .then(() => viewRepository.getViewsByDisplayId(11))
      .then(views => {
        expect(views).toBeInstanceOf(Array)
        expect(views).toHaveLength(3)
        const orderProps = views.map(view => view.order)
        expect(orderProps).toStrictEqual([1, 2, 3])
      })
  })

  it('should delete a View', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView('Irrelevant name', 5, 5, 8623, 4, 'IdleScreen')
      .then(view => viewRepository.getViewById(view.id))
      .then(view => viewRepository.deleteView(view.id))
      .then(viewId => {
        expect(viewId).toBeGreaterThan(0)
        return viewId
      })
      .then(viewId => expect(viewRepository.getViewById(viewId)).rejects.toBeInstanceOf(Error))
  })

  it('should delete a non-existing View without error', () => {
    const viewRepository = new ViewRepository()
    return expect(viewRepository.deleteView(123)).resolves.toBeUndefined()
  })

  it('should update a view', () => {
    const viewRepository = new ViewRepository()
    return viewRepository.createView('Irrelevant name', 2, 1, 66, 8, 'IdleScreen')
      .then(view => {
        return viewRepository.updateView(view.id, 'New name', 99, 135, 999, 12, 'something')
      }).then((view) => {
        expect(view.id).toBeGreaterThan(0)
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
