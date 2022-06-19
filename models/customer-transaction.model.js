const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerTransactionSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        index: true
    },
    date: {
        type: Date,
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    },
    nominalValue: {
        type: Number,
        index: true
    },
    remark: {
        type: String,
        index: true
    },
    transactionType: {
        type: String,
        index: true,
        enum: ['deposit','withdraw']
    },
    isSeedMoney: {
        type: Boolean, 
        index: true
    },
    subscribeUnitNumber: {
        type: Number,
        index: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        index: true
    },
    recordEnteredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period'
    }
})

const CustomerTransaction = mongoose.model('CustomerTransaction', CustomerTransactionSchema, 'CustomerTransactions')

module.exports = CustomerTransaction