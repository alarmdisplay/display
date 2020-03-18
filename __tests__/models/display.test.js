const mongoose = require('mongoose')
const Display = require('../../src/models/display')

describe('Display model', () => {
  let connection

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  it('should save correctly', async () => {
    const display = new Display({
      _id: 'ABC123',
      active: true,
      description: 'A description text',
      layout: {
        columns: 3,
        components: [
          { name: 'aComponent', bounds: { colStart: 1, rowStart: 1, colEnd: 3, rowEnd: 4 } },
          { name: 'anotherComponent', bounds: { colStart: 3, rowStart: 2, colEnd: 4, rowEnd: 3 } }
        ],
        rows: 5
      },
      location: 'The Cupboard under the Stairs'
    })
    const savedDisplay = await display.save()
    expect(savedDisplay._id).toBe('ABC123')
    expect(savedDisplay.active).toBeTruthy()
    expect(savedDisplay.description).toBe('A description text')
    expect(savedDisplay.layout).toBeInstanceOf(Object)
    expect(savedDisplay.layout.columns).toBe(3)
    expect(savedDisplay.layout.components).toBeInstanceOf(Array)
    expect(savedDisplay.layout.components.length).toBe(2)
    expect(savedDisplay.layout.components[0]._id).toBeDefined()
    expect(savedDisplay.layout.components[0].name).toBe('aComponent')
    expect(savedDisplay.layout.components[0].bounds.colStart).toBe(1)
    expect(savedDisplay.layout.components[0].bounds.rowStart).toBe(1)
    expect(savedDisplay.layout.components[0].bounds.colEnd).toBe(3)
    expect(savedDisplay.layout.components[0].bounds.rowEnd).toBe(4)
    expect(savedDisplay.layout.components[1]._id).toBeDefined()
    expect(savedDisplay.layout.components[1].name).toBe('anotherComponent')
    expect(savedDisplay.layout.components[1].bounds.colStart).toBe(3)
    expect(savedDisplay.layout.components[1].bounds.rowStart).toBe(2)
    expect(savedDisplay.layout.components[1].bounds.colEnd).toBe(4)
    expect(savedDisplay.layout.components[1].bounds.rowEnd).toBe(3)
    expect(savedDisplay.layout.rows).toBe(5)
    expect(savedDisplay.location).toBe('The Cupboard under the Stairs')
    expect(savedDisplay.createdAt).toBeInstanceOf(Date)
    expect(savedDisplay.updatedAt).toBeInstanceOf(Date)
  })

  it('should define default values', async () => {
    const display = new Display({ _id: 'ABC' })
    const savedDisplay = await display.save()
    expect(savedDisplay._id).toBe('ABC')
    expect(savedDisplay.active).toBeFalsy()
    expect(savedDisplay.description).toBe('')
    expect(savedDisplay.lastSeen).toBeNull()
    expect(savedDisplay.layout).toBeNull()
    expect(savedDisplay.location).toBe('')
  })

  it('should ignore unknown properties', async () => {
    const display = new Display({ _id: '123', madeUpProp: 'hello' })
    const savedDisplay = await display.save()
    expect(savedDisplay._id).toBe('123')
    expect(savedDisplay.madeUpProp).not.toBeDefined()
  })
})
