const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatementItemSchema = new Schema({
    custodianAccount: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy',
    },
    amount: {
        type: Number,
    },
    tag: {
        type: String,
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period'
    },
    type: {
        type: String,
        enum: ['ManagementFee','RetrocessionFee']
    },
    feeCodeApplied: {
        type: Schema.Types.ObjectId,
        ref: 'FeeCode'
    },
    reconcilation: {
        completed: {
            type: Boolean
        },
        netAmount: {
            type: Number,
            default: 0
        },
        bankCharge: {
            type: Number,
            default: 0
        },
        payableInHKD: {
            type: Number,
            default: 0
        }
    }
})

const StatementItem = mongoose.model('StatementItem', StatementItemSchema, 'StatementItems')

module.exports = { 
    StatementItem: StatementItem, 
    StatementItemSchema: StatementItemSchema
}