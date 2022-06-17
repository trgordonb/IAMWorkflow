const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema({
    name: {
        type: String,
        index: true
    }
})

const Role = mongoose.model('Role', RoleSchema, 'Roles')

module.exports = Role