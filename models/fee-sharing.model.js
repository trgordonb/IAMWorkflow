const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeeSharingSchemeSchema = new Schema({
    code: {
        type: String,
        index: true
    },
    feerecipients: [{
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'FeeRecipient'
        },
        percentage: Number,
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    }]
})

const FeeSharingScheme = mongoose.model('FeeSharingScheme', FeeSharingSchemeSchema, 'FeeSharingSchemes')

module.exports = FeeSharingScheme