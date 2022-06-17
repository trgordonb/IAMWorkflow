const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanyAccountSchema = new Schema({
    name: {
        type: String,
        index: true
    }
})

const CompanyAccount = mongoose.model('CompanyAccount', CompanyAccountSchema, 'CompanyAccounts')

module.exports = CompanyAccount