const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let displaySchema = new Schema({
    _id: { type: String },
    active: { type: Boolean, default: false },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    lastSeen: { type: Date, default: null },
    groups: [{ type: Schema.Types.ObjectId, ref: 'DisplayGroup' }]
}, { timestamps: true });

module.exports = mongoose.model('Display', displaySchema);
