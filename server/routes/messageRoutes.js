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
            res.status(200).json(room.messages)
        }).catch(err => console.log(err))
})

module.exports = router