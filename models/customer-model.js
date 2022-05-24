const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    clientId: {
        type: String,
        index: true
    },
    name: {
        type: String,
        index: true
    },
    address: String,
    mobile: String,
    email: {
        type: String,
        index: true
    },
    bankaccountnumber: String
})

const Customer = mongoose.model('Customer', CustomerSchema, 'Customers')

module.exports = Customer