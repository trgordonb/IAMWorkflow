const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BankStatementItemSchema = new Schema({
    bank: {
        type: Schema.Types.ObjectId,
        ref: 'Party',
        index: true
    },
    bankStatementRef: {
        type: String,
        index: true
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        index: true
    },
    statementDate: {
        type: Date,
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    },
    companyAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Party'
    },
    counterParty: {
        type: Schema.Types.ObjectId,
        ref: 'Party'
    },
    matchedStatement: {
        type: Schema.Types.ObjectId,
        ref: 'StatementSummary',
        index: true
    },
    grossAmount: {
        type: Number,
    },
    itemCharge: {
        type: Number
    },
    status: {
        type: String,
        index: true,
        enum: ['pending','approved']
    },
    remark: {
        type: String
    },
    isLocked: {
        type: Boolean,
        default: false
    }
})

const BankStatementItem = mongoose.model('BankStatementItem', BankStatementItemSchema, 'BankStatementItems')

module.exports = BankStatementItem