const supertest = require('supertest')
const DisplayService = require('../../../src/services/DisplayService')
const NotFoundError = require('../../../src/errors/NotFoundError')

jest.mock('../../../src/services/DisplayService')

const baseUrl = '/api/v1/displays'

describe(baseUrl, () => {
  const app = require('../../../src/app')
  let displayService
  let request

  beforeAll(() => {
    displayService = new DisplayService(undefined, undefined, undefined, undefined)
    const theApp = app(displayService, undefined, undefined)
    request = supertest(theApp)
  })

  beforeEach(() => {
    DisplayService.mock.instances[0].getAllDisplays.mockClear()
    DisplayService.mock.instances[0].createDisplay.mockClear()
    DisplayService.mock.instances[0].getDisplayById.mockClear()
    DisplayService.mock.instances[0].updateDisplay.mockClear()
    DisplayService.mock.instances[0].deleteDisplay.mockClear()
    DisplayService.mock.instances[0].getViewsForDisplay.mockClear()
  })

  describe('GET /', () => {
    it('should correctly call DisplayService.getAllDisplays()', () => {
      return request.get(`${baseUrl}/`)
        .expect(() => {
          expect(DisplayService.mock.instances[0].getAllDisplays.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].getAllDisplays.mock.calls[0]).toEqual([])
        })
    })

    it('should return a JSON array', () => {
      DisplayService.mock.instances[0].getAllDisplays.mockResolvedValueOnce([])
      return request.get(`${baseUrl}/`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect([])
    })

    it('should return the stored Displays', () => {
      const displays = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
      DisplayService.mock.instances[0].getAllDisplays.mockResolvedValueOnce(displays)
      return request.get(`${baseUrl}/`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(displays)
    })

    it('should return 500 on internal error', () => {
      DisplayService.mock.instances[0].getAllDisplays.mockRejectedValueOnce(new Error('Error during GET /'))
      return request.get(`${baseUrl}/`)
        .expect('Content-Type', /json/)
        .expect(500)
        .expect({ error: { message: 'Error during GET /' } })
    })
  })

  describe('POST /', () => {
    it('should correctly call DisplayService.getDisplayById()', () => {
      const display = { name: 'Some name', active: true, clientId: 'X29GH', description: 'Just testing', location: 'Somewhere' }
      return request.post(`${baseUrl}/`)
        .send(display)
        .expect(() => {
          expect(DisplayService.mock.instances[0].createDisplay.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].createDisplay.mock.calls[0]).toEqual(['Some name', true, 'X29GH', 'Just testing', 'Somewhere'])
        })
    })

    it('should return the newly created Display with status 201', () => {
      const display = { id: 42, name: 'Another name', active: false, clientId: 'KJFLH2', description: 'Just testing...', location: 'Somewhere else' }
      DisplayService.mock.instances[0].createDisplay.mockResolvedValueOnce(display)
      return request.post(`${baseUrl}/`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(201)
        .expect('Location', `${baseUrl}/42`)
        .expect(display)
    })

    it('should allow to only submit the name', () => {
      return request.post(`${baseUrl}/`)
        .send({ name: 'The name' })
        .expect(() => {
          expect(DisplayService.mock.instances[0].createDisplay.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].createDisplay.mock.calls[0]).toEqual(['The name', false, '', '', ''])
        })
    })

    it('should return 500 on internal error', () => {
      DisplayService.mock.instances[0].createDisplay.mockRejectedValueOnce(new Error('Error during POST /'))
      return request.post(`${baseUrl}/`)
        .expect('Content-Type', /json/)
        .expect(500)
        .expect({ error: { message: 'Error during POST /' } })
    })
  })

  describe('GET /{id}', () => {
    it('should correctly call DisplayService.getDisplayById()', () => {
      return request.get(`${baseUrl}/165`)
        .expect(() => {
          expect(DisplayService.mock.instances[0].getDisplayById.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].getDisplayById.mock.calls[0]).toEqual([165])
          expect(Number.isInteger(DisplayService.mock.instances[0].getDisplayById.mock.calls[0][0])).toBeTruthy()
        })
    })

    it('should return the Display if it exists', () => {
      const display = { id: 623, name: 'Name', active: false, clientId: 'KJFLH2', description: 'Just testing...', location: 'Somewhere else' }
      DisplayService.mock.instances[0].getDisplayById.mockResolvedValueOnce(display)
      return request.get(`${baseUrl}/623`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(display)
    })

    it('should return 404 if the Display does not exist', () => {
      DisplayService.mock.instances[0].getDisplayById.mockRejectedValueOnce(new NotFoundError())
      return request.get(`${baseUrl}/14`)
        .expect(404)
    })

    it('should return 500 on internal error', () => {
      DisplayService.mock.instances[0].getDisplayById.mockRejectedValueOnce(new Error('Error during GET /{id}'))
      return request.get(`${baseUrl}/5`)
        .expect('Content-Type', /json/)
        .expect(500)
        .expect({ error: { message: 'Error during GET /{id}' } })
    })
  })

  describe('PUT /{id}', () => {
    it('should correctly call DisplayService.getDisplayById()', () => {
      return request.put(`${baseUrl}/6233`)
        .expect(() => {
          expect(DisplayService.mock.instances[0].getDisplayById.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].getDisplayById.mock.calls[0]).toEqual([6233])
        })
    })

    it('should correctly call DisplayService.updateDisplay()', () => {
      DisplayService.mock.instances[0].getDisplayById.mockResolvedValueOnce()
      return request.put(`${baseUrl}/56`)
        .send({
          id: 56,
          name: 'Another name',
          active: false,
          clientId: 'KJFLH2',
          description: 'Just testing...',
          location: 'Somewhere else'
        })
        .expect(() => {
          expect(DisplayService.mock.instances[0].updateDisplay.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].updateDisplay.mock.calls[0]).toEqual([56, 'Another name', false, 'KJFLH2', 'Just testing...', 'Somewhere else'])
        })
    })

    it('should return the updated Display', () => {
      const display = { id: 253, name: 'Hello', active: true, clientId: 'JLA73G', description: 'None', location: 'Also none' }
      DisplayService.mock.instances[0].getDisplayById.mockResolvedValueOnce()
      DisplayService.mock.instances[0].updateDisplay.mockResolvedValueOnce(display)
      return request.put(`${baseUrl}/253`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(display)
    })

    it('should return 404 when Display does not exist', () => {
      DisplayService.mock.instances[0].getDisplayById.mockRejectedValueOnce(new NotFoundError())
      return request.put(`${baseUrl}/12`)
        .expect(404)
    })

    it('should return 500 on internal error in DisplayService.getDisplayById()', () => {
      DisplayService.mock.instances[0].getDisplayById.mockRejectedValueOnce(new Error('Error during PUT /{id}'))
      return request.put(`${baseUrl}/5`)
        .expect(500)
        .expect({ error: { message: 'Error during PUT /{id}' } })
    })

    it('should return 500 on internal error in DisplayService.updateDisplay()', () => {
      DisplayService.mock.instances[0].getDisplayById.mockResolvedValueOnce()
      DisplayService.mock.instances[0].updateDisplay.mockRejectedValueOnce(new Error('Error during PUT /{id}'))
      return request.put(`${baseUrl}/5`)
        .expect('Content-Type', /json/)
        .expect(500)
        .expect({ error: { message: 'Error during PUT /{id}' } })
    })
  })

  describe('DELETE /{id}', () => {
    it('should correctly call DisplayService.deleteDisplay()', () => {
      return request.delete(`${baseUrl}/1238`)
        .expect(() => {
          expect(DisplayService.mock.instances[0].deleteDisplay.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].deleteDisplay.mock.calls[0]).toEqual([1238])
        })
    })

    it('should return 500 on internal error', () => {
      DisplayService.mock.instances[0].deleteDisplay.mockRejectedValueOnce(new Error('Error during DELETE /{id}'))
      return request.delete(`${baseUrl}/5`)
        .expect('Content-Type', /json/)
        .expect(500)
        .expect({ error: { message: 'Error during DELETE /{id}' } })
    })
  })

  describe('GET /{id}/views', () => {
    it('should correctly call DisplayService.getDisplayById()', () => {
      return request.get(`${baseUrl}/272/views`)
        .expect(() => {
          expect(DisplayService.mock.instances[0].getDisplayById.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].getDisplayById.mock.calls[0]).toEqual([272])
        })
    })

    it('should correctly call DisplayService.getViewsForDisplay()', () => {
      DisplayService.mock.instances[0].getDisplayById.mockResolvedValueOnce({ id: 312 })
      return request.get(`${baseUrl}/272/views`)
        .expect(() => {
          expect(DisplayService.mock.instances[0].getViewsForDisplay.mock.calls).toHaveLength(1)
          expect(DisplayService.mock.instances[0].getViewsForDisplay.mock.calls[0]).toEqual([312])
        })
    })

    it('should return a list of Views', () => {
      const views = []
      DisplayService.mock.instances[0].getDisplayById.mockResolvedValueOnce({ id: 1268 })
      DisplayService.mock.instances[0].getViewsForDisplay.mockResolvedValueOnce(views)
      return request.get(`${baseUrl}/1268/views`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(views)
    })
  })
})
