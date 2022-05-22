const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurrencySchema = new Schema({
    name: {
        type: String,
        index: true
    }
})

const Currency = mongoose.model('Currency', CurrencySchema, 'Currencies')

module.exports = Currency