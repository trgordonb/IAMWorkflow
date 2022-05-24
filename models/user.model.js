const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userId: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        index: true,
    },
    encryptedPassword: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'reader'],
        index: true,
    }
})

const User = mongoose.model('User', UserSchema, 'Users')

module.exports = User