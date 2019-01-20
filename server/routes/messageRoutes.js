const express = require('express')
const router = express.Router()
const Room = require('../models/room')
const { generateRoomId } = require('../factory')

router.get('/:userName/:roomName', (req, res, next) => {
    const { userName, roomName } = req.params
    if (roomName != 'community') {
        const payload = { from: userName, to: roomName }
        generateRoomId(payload, roomName => {
            sendMessages(roomName, res)
        })
    }
    else sendMessages(roomName, res)    
})


sendMessages = (roomName, res) => {
    Room.findOne({ roomName })
    .select('messages')
    .populate({
        path: 'messages',
        populate: {
            path: 'user',
            select: 'username'
        }
    })
    .exec()
    .then(room => {
        return res.status(200).json({ "messages": room.messages })
    }).catch(err => res.status(500).json({ "error": err.message }))
}

module.exports = router