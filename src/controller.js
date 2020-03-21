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

  createDisplay (identifier, active, description, location, screenConfigs) {
    const display = new Display({
      _id: identifier,
      active: active,
      description: description,
      location: location,
      screenConfigs: screenConfigs
    })
    return display.save()
  }

  deleteDisplay (identifier) {
    return new Promise((resolve, reject) => {
      Display.deleteOne({ _id: identifier }, err => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  findDisplay (identifier) {
    return new Promise((resolve, reject) => {
      Display.findOne({ _id: identifier }, (err, display) => {
        if (err) {
          return reject(err)
        }

        resolve(display)
      })
    })
  }

  findDisplays () {
    return new Promise((resolve, reject) => {
      Display.find((err, displays) => {
        if (err) {
          return reject(err)
        }

        resolve(displays)
      })
    })
  }

  async updateDisplay (identifier, data) {
    return this.findDisplay(identifier).then(display => {
      return new Promise((resolve, reject) => {
        display.active = data.active
        display.description = data.description
        display.location = data.location
        display.screenConfigs = data.screenConfigs

        display.save((err, updatedDisplay) => {
          if (err) {
            reject(err)
          }

          // TODO notify listeners
          resolve(updatedDisplay)
        })
      })
    })
  }
}
