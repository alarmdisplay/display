const DisplayRepository = require('../../src/persistence/repositories/DisplayRepository')
const DisplayService = require('../../src/services/DisplayService')

jest.mock('../../src/persistence/repositories/DisplayRepository')

describe('DisplayService', () => {
  let displayRepository
  let displayService

  beforeAll(() => {
    displayRepository = new DisplayRepository()
  })

  beforeEach(() => {
    displayService = new DisplayService(displayRepository, undefined, undefined, undefined)
    DisplayRepository.mock.instances[0].createDisplay.mockClear()
  })

  describe('Creating a Display', () => {
    it('should correctly call DisplayRepository.createDisplay()', () => {
      const mockResponse = { id: 1231, name: 'A name', active: true, clientId: 'AB823KF2', description: 'Describing...', location: 'Some location' }
      DisplayRepository.mock.instances[0].createDisplay.mockResolvedValueOnce(mockResponse)
      return displayService.createDisplay('A name', true, 'AB823KF2', 'Describing...', 'Some location')
        .then(display => {
          expect(display).toEqual(mockResponse)
        })
        .then(() => {
          expect(DisplayRepository.mock.instances[0].createDisplay.mock.calls).toHaveLength(1)
          expect(DisplayRepository.mock.instances[0].createDisplay.mock.calls[0]).toEqual(['A name', true, 'AB823KF2', 'Describing...', 'Some location'])
        })
    })
  })
})
