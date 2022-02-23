import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CurrencySchema = new Schema({
    name: String
})

const Currency = mongoose.model('Currency', CurrencySchema, 'Currencies')

export default Currency