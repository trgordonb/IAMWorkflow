const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EntitySchema = new Schema({
    name: {
        type: String,
        index: true
    },
})

const Entity = mongoose.model('Entity', EntitySchema, 'Entities')

module.exports = Entity