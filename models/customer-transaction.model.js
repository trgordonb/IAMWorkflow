const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerTransactionSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    date: Date,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    nominalValue: {
        type: Number,
        default: 0
    },
    remark: String,
    isReconciled: {
        type: Boolean,
        default: false
    },
    recordEnteredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const CustomerTransaction = mongoose.model('CustomerTransaction', CustomerTransactionSchema, 'CustomerTransactions')

module.exports = CustomerTransaction