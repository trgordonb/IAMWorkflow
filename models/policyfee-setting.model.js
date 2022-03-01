const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PolicyFeeSettingSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    accountnumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    custodian: {
        type: Schema.Types.ObjectId,
        ref: 'Custodian'
    },
    accountopendate: Date,
    accountenddate: Date,
    accountstatus: {
        type: String,
        enum : ['Active','Suspended','Closed'],
        default: 'Active'
    },
    discretionarymanage: Boolean,
    advisorfee: {
        type: Schema.Types.ObjectId,
        ref: 'FeeCode'
    },
    retrocession: {
        type: Schema.Types.ObjectId,
        ref: 'FeeCode'
    }
})

const PolicyFeeSetting = mongoose.model('PolicyFeeSetting', PolicyFeeSettingSchema, 'PolicyFeeSettings')

module.exports = PolicyFeeSetting