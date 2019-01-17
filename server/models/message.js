const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    text: String,
    room: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Room'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true
    },
    created_at: {
        type: Date, default: Date.now
    }
})

module.exports = mongoose.model('Message', MessageSchema)