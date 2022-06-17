const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CounterPartySchema = new Schema({
    name: {
        type: String,
        index: true
    }
})


const CounterParty = mongoose.model('CounterParty', CounterPartySchema, 'CounterParties')

module.exports = CounterParty