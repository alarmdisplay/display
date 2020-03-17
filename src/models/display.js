const mongoose = require('mongoose')
const Schema = mongoose.Schema

const displaySchema = new Schema({
  _id: { type: String },
  active: { type: Boolean, default: false },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  lastSeen: { type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model('Display', displaySchema)
