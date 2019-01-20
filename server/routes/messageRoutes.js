const express = require('express')
const router = express.Router()
const Room = require('../models/room')

router.get('/:roomName', (req, res, next) => {
    const { roomName } = req.params
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
})

module.exports = router