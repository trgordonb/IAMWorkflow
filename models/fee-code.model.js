const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeeCodeSchema = new Schema({
    code: String,
    value: Number,
    comment: String
})

const FeeCode = mongoose.model('FeeCode', FeeCodeSchema, 'FeeCodes' )

module.exports = FeeCode