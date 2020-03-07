const log4js = require('log4js');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let displaySchema = new Schema({
    _id: { type: String },
    active: { type: Boolean, default: false },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    lastSeen: { type: Date, default: null },
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
        this.logger = log4js.getLogger('Controller');
    }

    start(mongoDbUri) {
        this.logger.debug('Connecting to database...');
        return mongoose.connect(mongoDbUri, {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            this.logger.info('Connected to database');
        }).catch((reason) => {
            throw new Error(`Could not connect to database: ${reason}`)
        });
    }

    createDisplay(identifier, active, description, location) {
        let display = new Display({
            _id: identifier,
            active: active,
            description: description,
            location: location,
        });
        return display.save();
    }

    deleteDisplay(identifier) {
        return Display.deleteOne({ _id: identifier });
    }

    findDisplay(identifier) {
        return Display.findOne({ _id: identifier });
    }

    findDisplays() {
        return Display.find();
    }

    updateDisplay(identifier, data) {
        let update = {
            active: data.active,
            description: data.description,
            location: data.location,
        };
        return Display.findByIdAndUpdate(identifier, update, { omitUndefined: true, new: true });
    }
};
