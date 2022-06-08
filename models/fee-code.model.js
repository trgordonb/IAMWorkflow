const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeeCodeSchema = new Schema({
    code: {
        type: String,
        index: true
    },
    value: {
        type: Number,
        index: true
    },
    comment: {
        type: String,
        index: true
    }
})

const FeeCode = mongoose.model('FeeCode', FeeCodeSchema, 'FeeCodes' )

module.exports = FeeCode