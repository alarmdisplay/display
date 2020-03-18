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
        SomeScreen: {
          layout: {
            columns: 3,
            components: [
              { name: 'aComponent', bounds: { colStart: 1, rowStart: 1, colEnd: 3, rowEnd: 4 } },
              { name: 'anotherComponent', bounds: { colStart: 3, rowStart: 2, colEnd: 4, rowEnd: 3 } }
            ],
            rows: 5
          }
        },
        AnotherScreen: {
          layout: {
            columns: 2,
            components: [
              { name: 'singleComponent', bounds: { colStart: 2, rowStart: 2, colEnd: 3, rowEnd: 3 } }
            ],
            rows: 2
          }
        }
      }
    })
    const savedDisplay = await display.save()
    expect(savedDisplay._id).toBe('ABC123')
    expect(savedDisplay.active).toBeTruthy()
    expect(savedDisplay.description).toBe('A description text')
    expect(savedDisplay.screenConfigs).toBeInstanceOf(Map)
    expect(savedDisplay.screenConfigs.size).toBe(2)
    const someScreen = savedDisplay.screenConfigs.get('SomeScreen')
    expect(someScreen.layout.columns).toBe(3)
    expect(someScreen.layout.components).toBeInstanceOf(Array)
    expect(someScreen.layout.components.length).toBe(2)
    expect(someScreen.layout.components[0]._id).toBeDefined()
    expect(someScreen.layout.components[0].name).toBe('aComponent')
    expect(someScreen.layout.components[0].bounds.colStart).toBe(1)
    expect(someScreen.layout.components[0].bounds.rowStart).toBe(1)
    expect(someScreen.layout.components[0].bounds.colEnd).toBe(3)
    expect(someScreen.layout.components[0].bounds.rowEnd).toBe(4)
    expect(someScreen.layout.components[1]._id).toBeDefined()
    expect(someScreen.layout.components[1].name).toBe('anotherComponent')
    expect(someScreen.layout.components[1].bounds.colStart).toBe(3)
    expect(someScreen.layout.components[1].bounds.rowStart).toBe(2)
    expect(someScreen.layout.components[1].bounds.colEnd).toBe(4)
    expect(someScreen.layout.components[1].bounds.rowEnd).toBe(3)
    expect(someScreen.layout.rows).toBe(5)
    const anotherScreen = savedDisplay.screenConfigs.get('AnotherScreen')
    expect(anotherScreen.layout.columns).toBe(2)
    expect(anotherScreen.layout.components).toBeInstanceOf(Array)
    expect(anotherScreen.layout.components.length).toBe(1)
    expect(anotherScreen.layout.components[0]._id).toBeDefined()
    expect(anotherScreen.layout.components[0].name).toBe('singleComponent')
    expect(anotherScreen.layout.components[0].bounds.colStart).toBe(2)
    expect(anotherScreen.layout.components[0].bounds.rowStart).toBe(2)
    expect(anotherScreen.layout.components[0].bounds.colEnd).toBe(3)
    expect(anotherScreen.layout.components[0].bounds.rowEnd).toBe(3)
    expect(anotherScreen.layout.rows).toBe(2)
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
    expect(savedDisplay.screenConfigs).toBeInstanceOf(Map)
    expect(savedDisplay.screenConfigs.size).toBe(0)
    expect(savedDisplay.location).toBe('')
  })

  it('should default the layout to null', async () => {
    const display = new Display({ _id: 'DEF', screenConfigs: { ScreenWithNoLayout: {} } })
    const savedDisplay = await display.save()
    expect(savedDisplay.screenConfigs).toBeInstanceOf(Map)
    expect(savedDisplay.screenConfigs.size).toBe(1)
    const screen = savedDisplay.screenConfigs.get('ScreenWithNoLayout')
    expect(screen.layout).toBeNull()
  })

  it('should ignore unknown properties', async () => {
    const display = new Display({ _id: '123', madeUpProp: 'hello' })
    const savedDisplay = await display.save()
    expect(savedDisplay._id).toBe('123')
    expect(savedDisplay.madeUpProp).not.toBeDefined()
  })
})
