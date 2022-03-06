const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    name: String,
    source: {
        name: {
            type: String,
            enum : ['AccountLedgerBalance','EstablishmentFeeShare','DemandNote'],
        },
        field: {
            type: String
        }
    },
    target: {
        name: {
            type: String,
            enum : ['AccountLedgerBalance','EstablishmentFeeShare','DemandNote'],
        },
        field: {
            type: String
        }
    },
    relationship: {
        type: String,
        enum: ['OneOnOne','ManyOnOne','OneOnMany']
    },
    matcheOn: {
        type: String,
        enum: ['accountnumber']
    },
    tag: String,
    lastRunTime: Date,
    lastRunBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lastRunStatus: {
        type: String,
        enum: ['Success', 'Error']
    }
})

const Task = mongoose.model('Task', TaskSchema, 'Tasks')

module.exports = Task