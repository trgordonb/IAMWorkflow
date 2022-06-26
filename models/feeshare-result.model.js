const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeeShareResultSchema = new Schema({
    statementItem : {
        type: Schema.Types.ObjectId,
        ref: 'StatementItem',
    },
    custodianAccount: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy',
        index: true
    },
    amount: {
        type: Number,
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        index: true
    },
    type: {
        type: String,
        enum: ['ManagementFee','RetrocessionFee'],
        index: true
    },
    feeShares: [{
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'Party'
        },
        share: {
            type: Number
        },
        amount: {
            type: Number
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        },
        scheme: {
            type: Schema.Types.ObjectId,
            ref: 'FeeSharingScheme'
        }
    }]
})

const FeeShareResult = mongoose.model('FeeShareResult', FeeShareResultSchema, 'FeeShareResults')

module.exports = FeeShareResult
