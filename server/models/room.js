const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        default: 'community'
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId], ref: 'User'
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId], ref: 'Message'
    }
})

module.exports = mongoose.model('Room', RoomSchema)