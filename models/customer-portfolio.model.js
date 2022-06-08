const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerPortfolioSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        index: true
    },
    startDate: {
        type: Date,
        index: true
    },
    endDate: {
        type: Date,
        index: true
    },
    status: {
        type: String,
        enum: ['Active', 'Closed'],
        default: 'Active',
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    },
    startUnit: {
        type: Number,
        index: true
    },
    startNAV: {
        type: Number,
        index: true
    },
    accountPolicyNumber: [{
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    }]
})

const CustomerPortfolio = mongoose.model('CustomerPortfolio', CustomerPortfolioSchema, 'CustomerPortfolios')

module.exports = CustomerPortfolio