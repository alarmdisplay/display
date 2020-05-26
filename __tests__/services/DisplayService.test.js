const DisplayRepository = require('../../src/persistence/repositories/DisplayRepository')
const DisplayService = require('../../src/services/DisplayService')

jest.mock('../../src/persistence/repositories/DisplayRepository')

describe('DisplayService', () => {
  let displayRepository
  let displayService

  beforeAll(() => {
    displayRepository = new DisplayRepository(undefined, '')
  })

  beforeEach(() => {
    displayService = new DisplayService(displayRepository, undefined, undefined, undefined)
    DisplayRepository.mock.instances[0].createDisplay.mockClear()
  })

  describe('Creating a Display', () => {
    it('should correctly call DisplayRepository.createDisplay() and return the newly created Display', async () => {
      DisplayRepository.mock.instances[0].createDisplay.mockResolvedValueOnce(1231)
      const mockResponse = {
        id: 1231,
        name: 'A name',
        active: true,
        clientId: 'AB823KF2',
        description: 'Describing...',
        location: 'Some location'
      }
      DisplayRepository.mock.instances[0].getDisplayById.mockResolvedValueOnce(mockResponse)
      const display = await displayService.createDisplay('A name', true, 'AB823KF2', 'Describing...', 'Some location')
      expect(DisplayRepository.mock.instances[0].createDisplay.mock.calls).toHaveLength(1)
      expect(DisplayRepository.mock.instances[0].createDisplay.mock.calls[0]).toEqual(['A name', true, 'AB823KF2', 'Describing...', 'Some location'])
      expect(DisplayRepository.mock.instances[0].getDisplayById.mock.calls).toHaveLength(1)
      expect(DisplayRepository.mock.instances[0].getDisplayById.mock.calls[0]).toEqual([1231])
      expect(display).toEqual(mockResponse)
    })
  })
})
