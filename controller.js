const log4js = require('log4js');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let displaySchema = new Schema({
    identifier: String,
    active: Boolean,
    description: String,
    location: String,
    lastSeen: Date,
    groups: [{ type: Schema.Types.ObjectId, ref: 'DisplayGroup' }]
}, {timestamps: true});

let displayGroupSchema = new Schema({
    name: String,
    description: String,
    displays: [{ type: Schema.Types.ObjectId, ref: 'Display' }]
}, {timestamps: true});

let Display = mongoose.model('Display', displaySchema);
let DisplayGroup = mongoose.model('DisplayGroup', displayGroupSchema);

module.exports = class Controller {
    constructor() {
        this.logger = log4js.getLogger();
    }

    start(mongoDbUri) {
        this.logger.debug('Connecting to database...');
        return mongoose.connect(mongoDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            this.logger.info('Connected to database');
        }).catch((reason) => {
            throw new Error(`Could not connect to database: ${reason}`)
        });
    }
};
