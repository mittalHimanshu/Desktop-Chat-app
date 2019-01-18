const User = require('./models/user')
const Room = require('./models/room')
const Message = require('./models/message')
const mongoose = require('mongoose')
const moment = require('moment')

module.exports.createRoom = (roomName, cb) => {
    Room.findOne({ roomName }).exec()
        .then(room => {
            if (!room) {
                new Room({
                    _id: mongoose.Types.ObjectId(),
                    roomName
                }).save().then(room => cb(room.roomName))
            }
        })
}

module.exports.createMessage = (text, room, user, cb) => {
    const created_at = moment().format('MMMM Do YYYY, h:mm:ss A')
    new Message({ text, room, user, created_at }).save().then(msg => {
        cb(msg._id)
    })
}

module.exports.updateRoomById = (_id, msgId) => {
    Room.findByIdAndUpdate({ _id }, {
        $push: { messages: msgId }
    }).exec().then().catch(err => console.log(err.message))
}


module.exports.updateRoom = (roomName, payload) => {
    Room.updateOne({ roomName }, {
        $addToSet: {
            users: payload
        }
    }).exec().then().catch(err => console.log(err))
}

module.exports.getRoomId = (roomName, cb) => {
    Room.findOne({ roomName }).exec()
        .then(room => {
            return cb(room._id)
        }).catch(err => err.message)
}

module.exports.getUserId = (username, cb) => {
    User.findOne({ username }).exec()
        .then(user => {
            return cb(user._id)
        }).catch()
}

module.exports.getUsers = () => {
    User.find().exec().
        then(users => {
            return users
        }).catch()
}

module.exports.updateTypingStatus = payload => {
    const { usersChanged } = require('./SocketManager')
    const { username, status } = payload
    User.updateOne({ username }, {
        $set: {
            is_typing: status
        }
    }).exec().then(res => usersChanged()).catch(err => console.log(err.message))
}

module.exports.updateOnlineStatus = payload => {
    const { usersChanged } = require('./SocketManager')
    const { username, status } = payload
    User.updateOne({ username }, {
        $set: {
            is_active: status
        }
    }).exec().then(res => usersChanged()).catch(err => console.log(err.message))
}

module.exports.generateRoomId = (payload, cb) => {
    const { from, to } = payload
    var str = `${from}${to}`
    var arr = str.split('')
    var sorted = arr.sort()
    return cb(sorted.join(''))
}