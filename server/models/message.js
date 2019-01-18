const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    text: String,
    room: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Room'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    created_at: String
})

module.exports = mongoose.model('Message', MessageSchema, 'Message')