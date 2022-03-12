const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CounterPartySchema = new Schema({
    name: String,
})


const CounterParty = mongoose.model('CounterParty', CounterPartySchema, 'CounterParties')

module.exports = CounterParty