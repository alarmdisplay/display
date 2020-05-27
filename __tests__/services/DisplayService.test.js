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

  describe('Deleting a Display', () => {
    it('should call DisplayRepository.createDisplay() correctly', async () => {
      await displayService.deleteDisplay(12498)
      expect(DisplayRepository.mock.instances[0].deleteOne.mock.calls).toHaveLength(1)
      expect(DisplayRepository.mock.instances[0].deleteOne.mock.calls[0]).toEqual([12498])
    })

    it('should return the ID when the Display did exist', async () => {
      DisplayRepository.mock.instances[0].deleteOne.mockResolvedValueOnce(245)
      const returnValue = await displayService.deleteDisplay(245)
      expect(returnValue).toBe(245)
    })

    it('should return null when the Display did not exist', async () => {
      DisplayRepository.mock.instances[0].deleteOne.mockResolvedValueOnce(null)
      const returnValue = await displayService.deleteDisplay(247)
      expect(returnValue).toBeNull()
    })

    it('should emit display_deleted when the Display did exist', async () => {
      displayService.emit = jest.fn()
      DisplayRepository.mock.instances[0].deleteOne.mockResolvedValueOnce(2468)
      await displayService.deleteDisplay(2468)
      expect(displayService.emit).toHaveBeenCalledTimes(1)
      expect(displayService.emit).toHaveBeenCalledWith('display_deleted', 2468)
    })

    it('should not emit display_deleted when the Display did not exist', async () => {
      displayService.emit = jest.fn()
      DisplayRepository.mock.instances[0].deleteOne.mockResolvedValueOnce(null)
      await displayService.deleteDisplay(958)
      expect(displayService.emit).toHaveBeenCalledTimes(0)
    })
  })
})
