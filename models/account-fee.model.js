const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountFeeSchema = new Schema({
    accountnumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    statementCode : {
        type: Schema.Types.ObjectId,
        ref: 'StatementParticular'
    },
    startDate: Date,
    endDate: Date,
    feeSharingScheme: {
        type: Schema.Types.ObjectId,
        ref: 'FeeSharingScheme'
    }
})

const AccountFee = mongoose.model('AccountFee', AccountFeeSchema, 'AccountFees')

module.exports = AccountFee