import mongoose from 'mongoose'
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

export default CurrencyHistory