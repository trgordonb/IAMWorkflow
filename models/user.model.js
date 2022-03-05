const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userId: String,
    encryptedPassword: String,
    role: {
        type: String,
        enum: ['admin', 'user']
    }
})

const User = mongoose.model('User', UserSchema, 'Users')

module.exports = User