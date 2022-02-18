const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PayeeSchema = new Schema({
    name: String
})

const Payee = mongoose.model('Payee', PayeeSchema, 'Payees')

module.exports = Payee