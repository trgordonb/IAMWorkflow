const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurrencyPairSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    quote: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    },
    base: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    },
    defaultValue: {
        type: Number,
        index: true
    }
})

const CurrencyPair = mongoose.model('CurrencyPair', CurrencyPairSchema, 'CurrencyPairs')

module.exports = CurrencyPair