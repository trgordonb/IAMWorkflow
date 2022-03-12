const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Statement = require('./statement.model')

const BankStatementItemSchema = new Schema({
    bank: {
        type: Schema.Types.ObjectId,
        ref: 'Bank'
    },
    bankstatementId: String,
    statement: {
        type: Schema.Types.ObjectId,
        ref: 'Statement'
    },
    date: Date,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    party: {
        type: Schema.Types.ObjectId,
        ref: 'Payee'
    },
    counterparty: {
        type: Schema.Types.ObjectId,
        ref: 'CounterParty'
    },
    grossamount: Number,
    netamount: Number,
    bankcharges: Number,
    isLocked: {
        type: Boolean,
        default: false
    }
})

BankStatementItemSchema.pre('save', async function() {
    this.netamount = this.grossamount - this.bankcharges
})

BankStatementItemSchema.pre('findOneAndUpdate', async function() {
    this._update.$set.netamount = this._update.$set.grossamount - this._update.$set.bankcharges
})


const BankStatementItem = mongoose.model('BankStatementItem', BankStatementItemSchema, 'BankStatementItems')

module.exports = BankStatementItem