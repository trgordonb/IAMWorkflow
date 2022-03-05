const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountPolicySchema = new Schema({
    number: String,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }
})

const AccountPolicy = mongoose.model('AccountPolicy', AccountPolicySchema, 'AccountPolicies' )

module.exports = AccountPolicy