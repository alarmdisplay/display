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
      location: 'The Cupboard under the Stairs',
      screenConfigs: {
        idleScreen: {
          layout: {
            columns: 3,
            components: [
              { name: 'aComponent', bounds: { columnStart: 1, rowStart: 1, columnEnd: 3, rowEnd: 4 } },
              { name: 'anotherComponent', bounds: { columnStart: 3, rowStart: 2, columnEnd: 4, rowEnd: 3 } }
            ],
            rows: 5
          }
        }
      }
    })
    const savedDisplay = await display.save()
    expect(savedDisplay._id).toBe('ABC123')
    expect(savedDisplay.active).toBeTruthy()
    expect(savedDisplay.description).toBe('A description text')
    const idleScreen = savedDisplay.screenConfigs.idleScreen
    expect(idleScreen._id).toBeDefined()
    expect(idleScreen.layout.columns).toBe(3)
    expect(idleScreen.layout.components).toBeInstanceOf(Array)
    expect(idleScreen.layout.components.length).toBe(2)
    expect(idleScreen.layout.components[0]._id).toBeDefined()
    expect(idleScreen.layout.components[0].name).toBe('aComponent')
    expect(idleScreen.layout.components[0].bounds.columnStart).toBe(1)
    expect(idleScreen.layout.components[0].bounds.rowStart).toBe(1)
    expect(idleScreen.layout.components[0].bounds.columnEnd).toBe(3)
    expect(idleScreen.layout.components[0].bounds.rowEnd).toBe(4)
    expect(idleScreen.layout.components[1]._id).toBeDefined()
    expect(idleScreen.layout.components[1].name).toBe('anotherComponent')
    expect(idleScreen.layout.components[1].bounds.columnStart).toBe(3)
    expect(idleScreen.layout.components[1].bounds.rowStart).toBe(2)
    expect(idleScreen.layout.components[1].bounds.columnEnd).toBe(4)
    expect(idleScreen.layout.components[1].bounds.rowEnd).toBe(3)
    expect(idleScreen.layout.rows).toBe(5)
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
    const idleScreenLayout = savedDisplay.screenConfigs.idleScreen.layout
    expect(idleScreenLayout.columns).toBe(4)
    expect(idleScreenLayout.components).toBeInstanceOf(Array)
    expect(idleScreenLayout.components.length).toBe(0)
    expect(idleScreenLayout.rows).toBe(4)
    expect(savedDisplay.location).toBe('')
  })

  it('should ignore unknown properties', async () => {
    const display = new Display({ _id: '123', madeUpProp: 'hello' })
    const savedDisplay = await display.save()
    expect(savedDisplay._id).toBe('123')
    expect(savedDisplay.madeUpProp).not.toBeDefined()
  })
})
