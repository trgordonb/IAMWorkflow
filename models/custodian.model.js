const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CustodianSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    }
})

const Custodian = mongoose.model('Custodian', CustodianSchema, 'Custodians')

module.exports = Custodian