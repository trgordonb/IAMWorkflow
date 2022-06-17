const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeeRecipientSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    isCompany: {
        type: Boolean,
        index: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'CompanyAccount'
    },
    entity: {
        type: Schema.Types.ObjectId,
        ref: 'Entity'
    }
})

const FeeRecipient = mongoose.model('FeeRecipient', FeeRecipientSchema, 'FeeRecipients')

module.exports = FeeRecipient