import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RoleSchema = new Schema({
    name: String
})

const Role = mongoose.model('Role', RoleSchema, 'Roles')

export default Role