const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeeShareHistorySchema = new Schema({
    statement : {
        type: Schema.Types.ObjectId,
        ref: 'Statement'
    },
    accountnumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    amount: Number,
    tag: String,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
    },
    recipientRecords: [{
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'Payee'
        },
        share: Number,
        amount: Number,
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    }]
})

const FeeShareHistory = mongoose.model('FeeShareHistory', FeeShareHistorySchema, 'FeeShareHistories')

module.exports = FeeShareHistory
