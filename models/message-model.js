const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    text: {
        type: String,
        index: true
    },
    link: {
        type: String,
        index: true
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        index: true,
        default: Date.now
    },
    hasRead: {
        type: Boolean,
        default: false,
        index: true
    }
})

const Message = mongoose.model('Message', MessageSchema, 'Messages')

module.exports = Message