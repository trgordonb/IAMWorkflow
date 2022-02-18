const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustodianSchema = new Schema({
    name: String
})

const Custodian = mongoose.model('Custodian', CustodianSchema, 'Custodians')

module.exports = Custodian