import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    clientId: String,
    name: String,
    address: String,
    mobile: String,
    email: String,
    bankaccountnumber: String
})

const Customer = mongoose.model('Customer', CustomerSchema, 'Customers')

export default Customer