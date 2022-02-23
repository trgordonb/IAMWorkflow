import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PayeeSchema = new Schema({
    name: String,
})

const Payee = mongoose.model('Payee', PayeeSchema, 'Payees')

export default Payee