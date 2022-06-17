const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BankSchema = new Schema({
    name: {
        type: String,
        index: true
    }
})


const Bank = mongoose.model('Bank', BankSchema, 'Banks')

module.exports = Bank