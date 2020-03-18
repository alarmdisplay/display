const mongoose = require('mongoose')
const Schema = mongoose.Schema

const componentSchema = new Schema({
  name: String,
  bounds: {
    colStart: { type: Number, min: 1 },
    rowStart: { type: Number, min: 1 },
    colEnd: { type: Number, min: 2 },
    rowEnd: { type: Number, min: 2 }
  }
})

const layoutSchema = new Schema({
  columns: Number,
  components: [componentSchema],
  rows: Number
})

const displaySchema = new Schema({
  _id: { type: String },
  active: { type: Boolean, default: false },
  description: { type: String, default: '' },
  lastSeen: { type: Date, default: null },
  layout: { type: layoutSchema, default: null },
  location: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('Display', displaySchema)
