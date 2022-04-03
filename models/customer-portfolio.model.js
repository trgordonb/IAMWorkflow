const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerPortfolioSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    startDate: Date,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    startUnit: Number,
    accountPolicyNumber: [{
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    }]
})

const CustomerPortfolio = mongoose.model('CustomerPortfolio', CustomerPortfolioSchema, 'CustomerPortfolios')

module.exports = CustomerPortfolio