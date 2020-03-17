const log4js = require('log4js')
const mongoose = require('mongoose')

const Display = require('./models/display')

module.exports = class Controller {
  constructor () {
    this.logger = log4js.getLogger('Controller')
  }

  start (mongoDbUri) {
    this.logger.debug('Connecting to database...')
    return mongoose.connect(mongoDbUri, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      this.logger.info('Connected to database')
    }).catch((reason) => {
      throw new Error(`Could not connect to database: ${reason}`)
    })
  }

  shutDown () {
    this.logger.info('Shutting down...')
    return mongoose.disconnect()
  }

  createDisplay (identifier, active, description, location) {
    const display = new Display({
      _id: identifier,
      active: active,
      description: description,
      location: location
    })
    return display.save()
  }

  deleteDisplay (identifier) {
    return Display.deleteOne({ _id: identifier })
  }

  findDisplay (identifier) {
    return Display.findOne({ _id: identifier })
  }

  findDisplays () {
    return Display.find()
  }

  updateDisplay (identifier, data) {
    const update = {
      active: data.active,
      description: data.description,
      location: data.location
    }
    return Display.findByIdAndUpdate(identifier, update, { omitUndefined: true, new: true })
  }
}
