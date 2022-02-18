const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatementParticularSchema = new Schema({
    name: String
})

const StatementParticular = mongoose.model('StatementParticular', StatementParticularSchema, 'StatementParticulars')

module.exports = StatementParticular