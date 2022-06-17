const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountPolicySchema = new Schema({
    accountNumber: {
        type: String,
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        index: true
    },
    custodian: {
        type: Schema.Types.ObjectId,
        ref: 'Custodian',
        index: true
    },
    status: {
        type: String,
        index: true,
        enum: ['Active','Closed']
    },
    accountStartDate: {
        type: Date,
        index: true
    },
    accountCloseDate: {
        type: Date,
        index: true
    },
    feeCode: {
        type: Schema.Types.ObjectId,
        ref: 'FeeCode',
        index: true
    },
    feeSharing: [{
        feeType: {
            type: String,
            enum: ['ManagementFee','RetrocessionFee']
        },
        feeSharingScheme: {
            type: Schema.Types.ObjectId,
            ref: 'FeeSharingScheme'
        }
    }]
})

const AccountPolicy = mongoose.model('AccountPolicy', AccountPolicySchema, 'AccountPolicies' )

module.exports = AccountPolicy