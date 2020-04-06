const DisplayRepository = require('../../src/persistence/DisplayRepository')

describe('The DisplayRepository', () => {
  it('should store a new Display', () => {
    const displayRepository = new DisplayRepository()
    return displayRepository.createDisplay('Some name', true, 'ABC', 'The description', 'The location')
      .then(display => {
        expect(display.id).toBeGreaterThan(0)
        expect(display.name).toBe('Some name')
        expect(display.active).toBe(true)
        expect(display.clientId).toBe('ABC')
        expect(display.description).toBe('The description')
        expect(display.location).toBe('The location')
      })
  })

  it('should get all Displays', () => {
    const displayRepository = new DisplayRepository()
    return displayRepository.createDisplay('A', true, 'A1B2', 'R', 'X')
      .then(() => displayRepository.createDisplay('B', false, 'C3D4', 'S', 'Y'))
      .then(() => displayRepository.createDisplay('C', false, 'E5F6', 'T', 'Z'))
      .then(() => displayRepository.getAllDisplays())
      .then(displays => {
        expect(displays).toBeInstanceOf(Array)
        expect(displays).toHaveLength(3)
        expect(displays[0].id).toBeGreaterThan(0)
        expect(displays[0].name).toBe('A')
        expect(displays[0].active).toBe(true)
        expect(displays[0].clientId).toBe('A1B2')
        expect(displays[0].description).toBe('R')
        expect(displays[0].location).toBe('X')
        expect(displays[1].id).toBeGreaterThan(0)
        expect(displays[1].name).toBe('B')
        expect(displays[1].active).toBe(false)
        expect(displays[1].clientId).toBe('C3D4')
        expect(displays[1].description).toBe('S')
        expect(displays[1].location).toBe('Y')
        expect(displays[2].id).toBeGreaterThan(0)
        expect(displays[2].name).toBe('C')
        expect(displays[2].active).toBe(false)
        expect(displays[2].clientId).toBe('E5F6')
        expect(displays[2].description).toBe('T')
        expect(displays[2].location).toBe('Z')
      })
  })

  it('should get a Display by its ID', () => {
    const displayRepository = new DisplayRepository()
    return displayRepository.createDisplay('A name', false, '29fn8', 'Hello', '... it\'s me')
      .then((display) => {
        return displayRepository.getDisplayById(display.id)
      }).then(display => {
        expect(display.id).toBeGreaterThan(0)
        expect(display.name).toBe('A name')
        expect(display.active).toBe(false)
        expect(display.clientId).toBe('29fn8')
        expect(display.description).toBe('Hello')
        expect(display.location).toBe('... it\'s me')
      })
  })

  it('should reject when requesting a Display with an unknown ID', () => {
    const displayRepository = new DisplayRepository()
    return expect(displayRepository.getDisplayById(555)).rejects.toBeInstanceOf(Error)
  })

  it('should delete a Display', () => {
    const displayRepository = new DisplayRepository()
    return displayRepository.createDisplay('Irrelevant name', true, 'abc', '', '')
      .then(display => displayRepository.getDisplayById(display.id))
      .then(display => displayRepository.deleteDisplay(display.id))
      .then(displayId => expect(displayRepository.getDisplayById(displayId)).rejects.toBeInstanceOf(Error))
  })

  it('should delete a non-existing Display without error', () => {
    const displayRepository = new DisplayRepository()
    return expect(displayRepository.deleteDisplay(123)).resolves.toBeUndefined()
  })

  it('should update a Display', () => {
    const displayRepository = new DisplayRepository()
    return displayRepository.createDisplay('Irrelevant name', false, 'ABC')
      .then(display => displayRepository.updateDisplay(display.id, 'New name', true, 'XYZ', 'A new description', 'Another location'))
      .then((display) => {
        expect(display.id).toBeGreaterThan(0)
        expect(display.name).toBe('New name')
        expect(display.active).toBe(true)
        expect(display.clientId).toBe('XYZ')
        expect(display.description).toBe('A new description')
        expect(display.location).toBe('Another location')
      })
  })

  it('should reject when updating a Display with an unknown ID', () => {
    const displayRepository = new DisplayRepository()
    return expect(displayRepository.updateDisplay(245798, '', false, '', '', '')).rejects.toBeInstanceOf(Error)
  })
})
