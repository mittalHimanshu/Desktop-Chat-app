const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Room'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    created_at: {
        type: Date, default: Date.now
    }
})

module.exports = mongoose.model('Message', MessageSchema)