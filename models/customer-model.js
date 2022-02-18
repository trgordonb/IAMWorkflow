const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    clientId: String,
    name: String
})

const Customer = mongoose.model('Customer', CustomerSchema, 'Customers')

module.exports = Customer