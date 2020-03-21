const mongoose = require('mongoose')
const Schema = mongoose.Schema

const screenConfigSchema = new Schema({
  layout: {
    columns: { type: Number, min: 1, default: 4 },
    components: [
      {
        name: { type: String, required: true },
        bounds: {
          colStart: { type: Number, min: 1, default: 1 },
          rowStart: { type: Number, min: 1, default: 1 },
          colEnd: { type: Number, min: 2, default: 2 },
          rowEnd: { type: Number, min: 2, default: 2 }
        }
      }
    ],
    rows: { type: Number, min: 1, default: 4 }
  }
})

const displaySchema = new Schema({
  _id: { type: String },
  active: { type: Boolean, default: false },
  description: { type: String, default: '' },
  lastSeen: { type: Date, default: null },
  location: { type: String, default: '' },
  screenConfigs: {
    idleScreen: { type: screenConfigSchema, default: {} }
  }
}, { timestamps: true })

module.exports = mongoose.model('Display', displaySchema)
