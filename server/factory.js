const User = require('./models/user')
const Room = require('./models/room')
const Message = require('./models/message')
const mongoose = require('mongoose')
const moment = require('moment')

let userSockets = {}

module.exports.generateTempMessage = (payload, cb) => {
    const {username, text, room} = payload
    const created_at = moment().format('MMMM Do YYYY, h:mm:ss A')
    return cb({text, "user":{"username": username}, created_at, room})
}

module.exports.setSocket = (socket, username) => {
    socket.username = username
    userSockets[`${username}`] = socket
}

module.exports.removeSocket = username => {
    delete userSockets[`${username}`]
}

module.exports.findAndJoinRoom = (username, roomName) => {
    const userSocket = userSockets[`${username}`]
    if(userSocket) userSocket.join(roomName)
}

module.exports.generateRoomId = (payload, cb) => {
    const { from, to } = payload
    if (to == 'community') return cb('community')
    var str = `${from}${to}`
    var arr = str.split('')
    var sorted = arr.sort()
    return cb(sorted.join(''))
}

module.exports.createRoom = (roomName, cb) => {
    Room.findOne({ roomName }).exec()
        .then(room => {
            if (!room) {
                new Room({
                    _id: mongoose.Types.ObjectId(),
                    roomName
                }).save().then(
                    room => { if(cb) return cb(room.roomName) }
                ).catch(err => console.log(err))
            }
        })
}

module.exports.updateRoomUserId = (roomName, userId) => {
    Room.updateOne({ roomName }, {
        $addToSet: {
            users: userId
        }
    }).exec().then().catch(err => console.log(err))
}

module.exports.getUserId = (username, cb) => {
    User.findOne({ username }).exec()
        .then(user => {
            return cb(user._id)
        }).catch()
}

module.exports.updateOnlineStatus = payload => {
    const { usersChanged } = require('./SocketManager')
    const { username, status } = payload
    User.updateOne({ username }, {
        $set: {
            is_active: status
        }
    }).exec().then(user => usersChanged()).catch(err => console.log(err.message))
}

module.exports.createMessage = (text, room, user, cb) => {
    const created_at = moment().format('MMMM Do YYYY, h:mm:ss A')
    new Message({ text, room, user, created_at }).save().then(msg => {
        cb(msg)
    })
}

module.exports.updateRoomById = (_id, msgId) => {
    Room.findByIdAndUpdate({ _id }, {
        $push: { messages: msgId }
    }).exec().then().catch(err => console.log(err.message))
}

module.exports.getRoomId = (roomName, cb) => {
    Room.findOne({ roomName }).exec()
        .then(room => {
            return cb(room._id)
        }).catch(err => err.message)
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
