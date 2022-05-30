const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogSchema = new Schema({
    action: {
        type: String,
        index: true
    },
    resource: {
        type: String,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    recordId: {
        type: String,
        index: true
    },
    recordTitle: {
        type: String,
        index: true
    },
    difference: {
        type: String,
        index: true
    },
    createdAt: {
        type: Date,
        index: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        index: true
    }
})

const Log = mongoose.model('Log', LogSchema, 'Logs')

module.exports = Log