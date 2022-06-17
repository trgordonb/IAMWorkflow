const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecipientFeeShareSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'FeeRecipient',
        index: true
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
    },
    total: {
        type: Number,
        index: true
    },
    details: [{
        custodianAccount: {
            type: Schema.Types.ObjectId,
            ref: 'AccountPolicy',
            index: true
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        },
        amount: {
            type: Number
        },
        type: {
            type: String,
            enum: ['ManagementFee','RetrocessionFee'],
            index: true
        },
    }]
})

RecipientFeeShareSchema.pre('save', async function() {
    let total = 0
    this.details.forEach(detail => {
        total = total + detail.amount
    })
    this.total = Math.round(100 * total, 2)/100
})

const RecipientFeeShare = mongoose.model('RecipientFeeShare', RecipientFeeShareSchema, 'RecipientFeeShares')

module.exports = RecipientFeeShare
