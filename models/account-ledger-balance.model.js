const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountLedgerBalanceSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    accountnumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    accountopendate: Date,
    accountenddate: Date,
    accountstatus: {
        type: String,
        enum : ['Active','Suspended','Closed'],
        default: 'Active'
    },
    discretionarymanage: Boolean,
    aum_USD: Number,
    aum_HKD: Number,
    aum_EUR: Number,
    estimatedfee: Number,
    advisorfee: Number,
    retrocession: Number
})

const AccountLedgerBalance = mongoose.model('AccountLedgerBalance', AccountLedgerBalanceSchema, 'AccountLedgerBalances')

module.exports = AccountLedgerBalance