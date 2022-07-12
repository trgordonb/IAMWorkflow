const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

const PartySchema = new Schema({
    name: {
        type: String,
        index: true
    },
    type: {
        type: String,
        index: true,
        enum: ['Company','Bank','Custodian','Intermediary','Others']
    },
    isFeeRecipient: {
        type: Boolean,
        index: true
    },
    description: {
        type: String,
        index: true
    },
    contactPerson: {
        title: String,
        firstName: String,
        lastName: String,
    },
    address: String,
})

const Party = mongoose.model('Party', PartySchema, 'Parties')

module.exports = Party