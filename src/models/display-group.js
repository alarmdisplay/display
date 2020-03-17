const mongoose = require('mongoose')
const Schema = mongoose.Schema

const displayGroupSchema = new Schema({
  name: String,
  description: String,
  displays: [{ type: Schema.Types.ObjectId, ref: 'Display' }]
}, { timestamps: true })

module.exports = mongoose.model('DisplayGroup', displayGroupSchema)
