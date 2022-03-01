const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurrencyHistorySchema = new Schema({
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
    },
    date: Date,
    rate: Number
})

const CurrencyHistory = mongoose.model('CurrencyHistory', CurrencyHistorySchema, 'CurrencyHistories')

module.exports = CurrencyHistory